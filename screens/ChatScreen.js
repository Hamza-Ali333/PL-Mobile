import React from "react";
import {
  AppState,
  View,
  Text,
  Platform,
  KeyboardAvoidingView,
  Animated,
  Keyboard,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  SafeAreaView,
  TextInput,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import ActionSheet from "react-native-actionsheet";
import { GiftedChat, Bubble, Send } from "react-native-gifted-chat";
import * as SQLite from "expo-sqlite";
import * as Notifications from "expo-notifications";
import { withSocketHOC } from "../config/Socket";
import { SocketMessage } from "../config/Socket/ServerMessages";
import ProfilePhoto from "../components/ProfilePhoto";
import ChatPhoto from "../components/ChatPhoto";
import ChatAudioPlayer from "../components/ChatAudioPlayer";
import RecordingAnimation from "../components/RecordingAnimation";
import ChatImagePicker from "../components/ChatImagePicker";
import capitalize from "../helper/capitalize";
import {
  MaterialCommunityIcons,
  AntDesign,
  Feather,
  EvilIcons,
} from "@expo/vector-icons";

const db = SQLite.openDatabase("ChatApp", "4.2", "", 1);

class ChatScreen extends React.Component {
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
      minInputToolbarHeight: 0,
    };

    this.keyboardHeight = new Animated.Value(0);
    this.delayTimer, this.delayDb, this.clearInterval;
  }

  _userObject = () => {
    return {
      _id: this.state.me.id,
      _receiver: this.props.navigation.state.params.data.id,
      _socket: this.generateSocketIo(
        this.state.me.id,
        this.props.navigation.state.params.data.id
      ),
      _name: this.state.me.firstname,
      _firstname: this.state.me.firstname,
      _lastname: this.state.me.lastname,
      _image: this.state.me.profile_photo,
    };
  };

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this.chatMessageOnScreen);
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      let id = this.generateSocketIo(
        res.id,
        this.props.navigation.state.params.data.id
      );
      this.setState({
        me: res,
        socket_id: id,
      });

      this.getChatMessages(id);

      this.props.socket.emit(
        "room",
        this.generateSocketIo(
          res.id,
          this.props.navigation.state.params.data.id
        )
      );
    });

    this.props.socket.on("chat_message", (msg) => {
      let id = this.state.socket_id;

      if (id !== msg[0].user._socket) {
        return false;
      }

      this.setState((previousState) => ({
        messages: GiftedChat.append(previousState.messages, msg),
        is_typing: false,
      }));

      this.getLastMessage();
    });

    this.props.socket.on("connect", () => {
      this.props.socket.emit(
        "room",
        this.generateSocketIo(
          this.state.me.id,
          this.props.navigation.state.params.data.id
        )
      );
    });

    this.props.socket.on("typing", (name, id) => {
      if (id !== this.state.me.id) {
        if (id === this.props.navigation.state.params.data.id) {
          this.startTyping(name);
        }
      }
    });

    db.transaction(function (txn) {
      //txn.executeSql('DROP TABLE IF EXISTS messages', []);
      txn.executeSql(
        "CREATE TABLE IF NOT EXISTS messages (id INTEGER PRIMARY KEY AUTOINCREMENT, socket_id VARCHAR(50), chat_id VARCHAR(100), msg TEXT, timestamp DATETIME DEFAULT CURRENT_TIMESTAMP, notification_id INTEGER(20) NULL)",
        []
      );
    });

    AppState.addEventListener("change", this._handleAppStateChange);
    this.props.navigation.setParams({ goToProfile: this.goToProfile });
  }

  goToProfile = () => {
    this.props.navigation.navigate("UserProfile", {
      user_id: this.props.navigation.state.params.data.id,
    });
  };

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

  UNSAFE_componentWillMount() {
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
    let keyboardHeight = event.endCoordinates.height;

    this.setState({
      minInputToolbarHeight: keyboardHeight,
    });
  };

  keyboardWillHide = (event) => {
    this.setState({
      minInputToolbarHeight: 0,
    });
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
    // //image: 'https://facebook.github.io/react/img/logo_og.png',

    /**
     * [send image passing full path]
     * @type {String}
     */
    console.log("messages", messages);
    this.props.socket.emit("chat_message", messages);
  }

  openScreen = (props) => {
    try {
      if (props.currentMessage.extra.type === "Question") {
        this.props.navigation.navigate("NotificationAnswer", {
          id: props.currentMessage.extra.id,
        });
      }

      if (props.currentMessage.extra.type === "Comment") {
        this.props.navigation.navigate("NotificationComment", {
          id: props.currentMessage.extra.answer_id,
          question_id: props.currentMessage.extra.question_id,
        });
      }

      if (props.currentMessage.extra.type === "Answer") {
        this.props.navigation.navigate("NotificationAnswer", {
          id: props.currentMessage.extra.question_id,
          answer_id: props.currentMessage.extra.answer_id,
        });
      }
    } catch (e) {}
  };

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
    if (+a > +b) {
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

  _onLongPressAudio = (data) => {
    this.audioData = data;
    this.ActionSheet.show();
  };

  _onActionSheetAction = (index) => {
    if (index === 0) {
      let audioData = this.audioData;
      let newMessages = this.state.messages.filter(function (item) {
        return item._id !== audioData._id;
      });
      this.setState({ messages: newMessages });
      this.deleteChatMessages(audioData._id);
    }
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

  downloadFile = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  renderBubble = (props) => {
    if (props.currentMessage.audio) {
      return (
        <TouchableOpacity
          style={{ flex: 1 }}
          onLongPress={() => this._onLongPressAudio(props.currentMessage)}
        >
          <ChatAudioPlayer uri={props.currentMessage.audio} />
        </TouchableOpacity>
      );
    }

    if (props.currentMessage.file) {
      return (
        <View
          style={[
            styles.boxShadow,
            {
              marginTop: 13,
              width: 200,
              backgroundColor: color.lightGrayColor,
              borderRadius: 8,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
              height: 40,
              paddingHorizontal: 10,
            },
          ]}
        >
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <MaterialCommunityIcons name="file" size={20} color="#e74c3c" />
            <Text
              style={{
                fontFamily: FontFamily.Regular,
                color: color.grayColor,
                marginLeft: 5,
                fontSize: 15,
              }}
            >
              file
            </Text>
          </View>
          <TouchableOpacity
            onPress={() => this.downloadFile(props.currentMessage.file)}
          >
            <EvilIcons name="arrow-down" size={24} color="black" />
          </TouchableOpacity>
        </View>
      );
    }
    return (
      <Bubble
        {...props}
        //renderCustomView
        wrapperStyle={{
          right: {
            backgroundColor: color.primaryColor,
          },
        }}
      />
    );
  };

  renderAvatar = (props) => {
    if (props.user._id !== props.currentMessage.user._id) {
      return (
        <ChatPhoto
          item={this.props.navigation.state.params.data}
          style={{ backgroundColor: "transparent" }}
        />
      );
    }
    return null;
  };

  renderSend = (props) => {
    return (
      <View style={{ flexDirection: "row", alignItems: "center", height: 60 }}>
        <ChatImagePicker {...this.props} _user={this._userObject} />
        <RecordingAnimation
          {...this.props}
          _onSend={this.onSend}
          _user={this._userObject}
        />
        <Send {...props} containerStyle={styles.submitButton}>
          <Image
            style={{ width: 28, height: 28, resizeMode: "contain" }}
            source={require("../assets/images/send.png")}
          />
        </Send>
      </View>
    );
  };

  renderComposer = (props) => {
    return <TextInput {...props} style={{ backgroundColor: "#666" }} />;
  };

  renderCustomView = (props) => {
    return null;
  };

  renderInputToolbar = (props) => {
    //Add the extra styles via containerStyle
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          activeOpacity={0.6}
          style={{}}
          onPress={props.handleCameraPress}
        >
          <Text>Camera</Text>
        </TouchableOpacity>
      </View>
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

  renderMessageText = (props) => {
    if (props.position === "left") {
      return (
        <TouchableWithoutFeedback onPress={() => this.openScreen(props)}>
          <Text
            style={[
              styles.chatTextLeft,
              props.currentMessage.extra ? styles.navigateText : {},
            ]}
          >
            {props.currentMessage.text}
          </Text>
        </TouchableWithoutFeedback>
      );
    } else {
      return (
        <TouchableWithoutFeedback onPress={() => this.openScreen(props)}>
          <Text
            style={[
              styles.chatTextRight,
              props.currentMessage.extra ? styles.navigateText : {},
            ]}
          >
            {props.currentMessage.text}
          </Text>
        </TouchableWithoutFeedback>
      );
    }
  };

  render() {
    let platformConf =
      Platform.OS === "android"
        ? {
            minInputToolbarHeight: this.state.minInputToolbarHeight,
            bottomOffset: 0,
          }
        : {};

    const aSheet = (
      <ActionSheet
        ref={(o) => (this.ActionSheet = o)}
        title={"Are you sure you want to delete audio?"}
        options={["Delete", "cancel"]}
        cancelButtonIndex={1}
        destructiveButtonIndex={0}
        onPress={this._onActionSheetAction}
      />
    );

    const chat = (
      /*<ChatAudioPlayer
      />*/

      <GiftedChat
        {...platformConf}
        minComposerHeight={40}
        minInputToolbarHeight={60}
        loadEarlier={this.state.loadEarlier}
        isLoadingEarlier={this.state.isLoadingEarlier}
        isTyping={this.state.is_typing}
        messages={this.state.messages}
        onSend={(messages) => this.onSend(messages)}
        user={this._userObject()}
        renderBubble={this.renderBubble}
        renderChatEmpty={this.renderChatEmpty}
        renderChatFooter={this.renderFooter}
        onInputTextChanged={this.onTyping}
        onLoadEarlier={this.onLoadEarlier}
        onLongPress={this.onLongPress}
        renderAvatar={this.renderAvatar}
        renderSend={this.renderSend}
        textInputStyle={styles.composer}
        renderCustomView={this.renderCustomView}
        renderAvatarOnTop={true}
        renderMessageText={this.renderMessageText}
      />
    );
    if (Platform.OS === "android") {
      return (
        <KeyboardAvoidingView style={{ flex: 1 }}>
          {chat}
          {aSheet}
        </KeyboardAvoidingView>
      );
    }

    return (
      <SafeAreaView style={{ flex: 1 }}>
        {chat}
        {aSheet}
      </SafeAreaView>
    );
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
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,

    elevation: 2,
  },
  submitButton: {
    height: 40,
    width: 40,
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
    backgroundColor: color.primaryColor,
    borderRadius: 50,
  },
  composer: {
    borderRadius: 25,
    borderWidth: 0.5,
    borderColor: "#DDDDDD",
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 10,
    paddingTop: 3,
    paddingBottom: 5,
    paddingRight: 10,
    fontSize: 16,
    ...Platform.select({
      ios: {
        minHeight: 40,
        alignItems: "center",
        justifyContent: "center",
        paddingTop: 12,
      },
    }),
  },
  chatTextLeft: {
    margin: 10,
    color: "#000",
  },
  chatTextRight: {
    margin: 10,
    color: "#fff",
  },
  navigateText: {
    fontWeight: "bold",
  },
});

const EnhancedChatScreen = withSocketHOC(ChatScreen);

EnhancedChatScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerTitle: () => (
    // <></>
    <Text style={styles.headerPageTitle}>
      {capitalize(screenProps.navigation.getParam("data").firstname)}
    </Text>
  ),
  headerRight: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("goToProfile")}
      style={{
        flex: 1,
        margin: 5,
        justifyContent: "center",
      }}
    >
      <ProfilePhoto
        size={42}
        item={screenProps.navigation.getParam("data")}
        style={{ backgroundColor: "transparent" }}
      />
    </TouchableOpacity>
  ),
  headerLeft: () => (
    <>
      {Platform.OS === "android" ? (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={() => screenProps.navigation.goBack()}
        >
          <AntDesign name="arrowleft" size={24} color={color.primaryColor} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          style={{ paddingLeft: 10 }}
          onPress={() => screenProps.navigation.goBack()}
        >
          <Feather name="chevron-left" size={32} color={color.primaryColor} />
        </TouchableOpacity>
      )}
    </>
  ),
});

export default EnhancedChatScreen;
