import React from "react";
import {
  AppState,
  View,
  Text,
  Animated,
  Keyboard,
  StyleSheet,
  Image,
} from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { GiftedChat, Bubble } from "react-native-gifted-chat";
import * as SQLite from "expo-sqlite";
import * as Notifications from "expo-notifications";
import { withSocketHOC } from "../config/Socket";
import { SocketMessage } from "../config/Socket/ServerMessages";

const db = SQLite.openDatabase("ChatApp", "4.2", "", 1);

/* https://github.com/z-hao-wang/react-native-rsa */

class ChatScreenBack extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      messages: [],
      imageHeight: 0,
      me: {},
      is_typing: false,
      typing_user: "",
      socket_id: null,
      chat_id: null,
      socket: {},
      isLoadingEarlier: false,
      loadEarlier: true,
      offset: null,
      last_id: null,
    };

    this.keyboardHeight = new Animated.Value(0);
    this.delayTimer, this.delayDb, this.clearInterval;
  }

  componentDidMount() {}

  getChatMessages = (id) => {
    let offset = this.state.offset;
    let sql = "";
    if (offset) {
      sql = "AND id < " + offset;
    }

    let last_id = this.state.last_id;

    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM `messages` where `socket_id` = ? " +
          sql +
          " ORDER BY id desc LIMIT 20",
        [id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            offset = results.rows.item(i).id;
            if (i === 0 && this.state.offset === null) {
              last_id = offset;
            }
            temp.push(JSON.parse(results.rows.item(i).msg)[0]);
          }
          if (results.rows.length === 20) {
            this.setState({
              offset: offset,
              isLoadingEarlier: false,
              loadEarlier: true,
              last_id: last_id,
            });
          } else {
            this.setState({
              offset: offset,
              isLoadingEarlier: false,
              loadEarlier: false,
              last_id: last_id,
            });
          }

          this.setState((previousState) => ({
            messages: GiftedChat.prepend(previousState.messages, temp),
          }));
        }
      );
    });
  };

  getConnectedMessages = () => {
    let socket_id = this.state.socket_id;
    let last_id = this.state.last_id;
    let sql = "";
    if (last_id) {
      sql = "AND id > " + last_id;
    }
    db.transaction((tx) => {
      tx.executeSql(
        "SELECT * FROM `messages` where `socket_id` = ? " +
          sql +
          " ORDER BY id desc",
        [socket_id],
        (tx, results) => {
          var temp = [];
          for (let i = 0; i < results.rows.length; ++i) {
            let offset = results.rows.item(i).id;
            if (i === 0) {
              last_id = offset;
            }
            temp.push(JSON.parse(results.rows.item(i).msg)[0]);
          }

          this.setState({
            last_id: last_id,
          });

          this.setState((previousState) => ({
            messages: GiftedChat.append(previousState.messages, temp),
          }));
        }
      );
    });
  };

  deleteChatMessages = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM `messages` where `chat_id` = ?",
        [id],
        (tx, results) => {}
      );
    });
  };

  getLastMessage = () => {
    let id = this.state.socket_id;
    let last_id = this.state.last_id;
    setTimeout(() => {
      db.transaction((tx) => {
        tx.executeSql(
          "SELECT * FROM `messages` where `socket_id` = ? ORDER BY id desc LIMIT 3",
          [id],
          (tx, results) => {
            for (let i = 0; i < results.rows.length; ++i) {
              let notification_id = results.rows.item(i).notification_id;
              let msg_id = results.rows.item(i).id;
              if (i === 0) {
                last_id = results.rows.item(i).id;
              }

              if (notification_id) {
                try {
                  Notifications.cancelScheduledNotificationAsync(
                    notification_id
                  );
                } catch (e) {}
                this.updateNotification(msg_id);
              }
            }
            this.setState({ last_id: last_id });
          }
        );
      });
    }, 1000);
  };

  updateNotification = (id) => {
    db.transaction((tx) => {
      tx.executeSql(
        "UPDATE `messages` SET `notification_id` = ? where `id` = ?",
        [null, id],
        (tx, results) => {}
      );
    });
  };

  deleteAllChatMessages = () => {
    let id = this.generateSocketIo(
      this.state.me.id,
      this.props.navigation.state.params.data.id
    );
    db.transaction((tx) => {
      tx.executeSql(
        "DELETE FROM `messages` where `socket_id` = ?",
        [id],
        (tx, results) => {}
      );
    });
  };

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
    this.props.socket.off("chat_message");
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  keyboardWillShow = (event) => {
    this.setState({ imageHeight: 90 });
  };

  keyboardWillHide = (event) => {
    this.setState({ imageHeight: 0 });
  };

  _handleAppStateChange = (nextAppState) => {
    if (nextAppState === "background" || nextAppState === "inactive") {
    } else {
      SocketMessage(
        this.props.socket,
        this.state.socket_id,
        this.props.navigation.state.params.data.id,
        true
      ).then((msg) => {
        setTimeout(() => {
          this.getConnectedMessages();
        }, 500);
      });
    }
  };

  onSend(messages = []) {
    // const myCipher = encrypt('mySecretSalt')
    // let encrypted = myCipher(JSON.stringify(messages));
    // const myDecipher = decrypt('mySecretSal')
    // let decryped = myDecipher(encrypted)

    this.props.socket.emit("chat_message", messages);
  }

  onTyping = (str) => {
    if (str.length > 1) {
      this.props.socket.emit(
        "typing",
        this.generateSocketIo(
          this.state.me.id,
          this.props.navigation.state.params.data.id
        ),
        this.state.me.firstname,
        this.state.me.id
      );
    }
  };

  generateSocketIo = (a, b) => {
    if (a > b) {
      return b + "_" + a;
    } else {
      return a + "_" + b;
    }
  };

  renderFooter = () => {
    const { is_typing, typing_user } = this.state;
    if (is_typing) {
      return <Text>{typing_user} is typing...</Text>;
    }
    return null;
  };

  onLoadEarlier = () => {
    this.setState({ isLoadingEarlier: true });
    let id = this.generateSocketIo(
      this.state.me.id,
      this.props.navigation.state.params.data.id
    );

    this.getChatMessages(id);
  };

  onLongPress = (context, message) => {
    const options = ["Delete Message", "Clear all", "Cancel"];
    const cancelButtonIndex = options.length - 1;
    context.actionSheet().showActionSheetWithOptions(
      {
        options,
        cancelButtonIndex,
      },
      (buttonIndex) => {
        switch (buttonIndex) {
          case 0:
            let newMessages = this.state.messages.filter(function (item) {
              return item._id !== message._id;
            });
            this.setState({ messages: newMessages });
            this.deleteChatMessages(message._id);
            break;
          case 1:
            this.setState({ messages: [] });
            this.deleteAllChatMessages();
            break;
          case 2:
            break;
        }
      }
    );
  };

  startTyping = (name) => {
    this.setState({
      is_typing: true,
      typing_user: name,
    });

    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.setState({
        is_typing: false,
        typing_user: "",
      });
    }, 2000);
  };

  chatMessageOnScreen = () => {
    SocketMessage(
      this.props.socket,
      this.state.socket_id,
      this.props.navigation.state.params.data.id,
      true
    ).then((msg) => {
      setTimeout(() => {
        this.getConnectedMessages();
      }, 500);
    });
  };

  renderBubble = (props) => {
    return (
      <Bubble
        {...props}
        wrapperStyle={{
          right: {
            backgroundColor: color.primaryColor,
          },
        }}
      />
    );
  };

  renderChatEmpty = () => {
    return (
      <View style={{ flex: 1, margin: 15 }}>
        <View
          style={{
            flex: 1 / 2,
            justifyContent: "flex-end",
            transform: [{ scaleY: -1 }],
          }}
        >
          <Text style={styles.emptyText}>It's too quiet here :(</Text>
          <Text style={styles.emptyText}>Time to chat!</Text>
          <View
            style={{ alignItems: "center", marginTop: 20, marginBottom: 20 }}
          >
            <Image
              style={{ width: 190, height: 250, resizeMode: "contain" }}
              source={require("../assets/images/chatArrow.png")}
            />
          </View>
        </View>
      </View>
    );
  };

  render() {
    return <View style={{ flex: 1 }}></View>;
  }
}

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 28,
    lineHeight: 40,
    textAlign: "center",
  },
});

const EnhancedChatScreen = withSocketHOC(ChatScreenBack);

export default EnhancedChatScreen;
