import { AntDesign, Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import * as SQLite from "expo-sqlite";
import moment from "moment";
import React from "react";
import {
  Animated,
  AppState,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  TouchableWithoutFeedback,
  View,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import { Bubble, GiftedChat, Send } from "react-native-gifted-chat";
import { Avatar } from "react-native-paper";
import ChatAudioPlayer from "../components/ChatAudioPlayer";
import ChatImagePicker from "../components/ChatImagePicker";
import ChatPhoto from "../components/ChatPhoto";
import RecordingAnimation from "../components/RecordingAnimation";
import ChatSkeleton from "../components/Skeleton/ChatSkeleton";
import { withSocketHOC } from "../config/Socket";
import { SocketMessage } from "../config/Socket/ServerMessages";
import client from "../constants/client";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import getGroupMessages from "../graphql/queries/getGroupMessages";
import capitalize from "../helper/capitalize";

const db = SQLite.openDatabase("ChatApp", "4.2", "", 1);

class GroupChatScreen extends React.Component {
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
      loadEarlier: false,
      initialLoading: false,
      offset: null,
      last_id: null,
      minInputToolbarHeight: 0,
      // hasMorePages: false,
      page: 1,
    };

    this.keyboardHeight = new Animated.Value(0);
    this.delayTimer, this.delayDb, this.clearInterval;
  }

  _userObject = () => {
    const data = this.props.navigation.getParam("data");

    return {
      _id: this.state.me.id,
      _receiver: this.props.navigation.state.params.data.id,
      _socket: this.generateSocketIo(),
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
      let id = this.generateSocketIo();
      this.setState({
        me: res,
        socket_id: id,
      });

      this.getChatMessages(this.state.page);

      this.props.socket.emit("room", this.generateSocketIo());
    });

    this.props.socket.on("groupChat_message", (msg) => {
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
      this.props.socket.emit("room", this.generateSocketIo());
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

  getChatMessages = (page) => {
    const gid = this.props.navigation.getParam("data").id;
    let sid = this.generateSocketIo();
    let offset = this.state.offset;
    let sql = "";
    if (offset) {
      sql = "AND id < " + offset;
    }

    this.setState({
      initialLoading: true,
    });

    let last_id = this.state.last_id;
    // data.questions.paginatorInfo.total !== pageInfo.total
    client
      .mutate({
        mutation: getGroupMessages,
        variables: {
          cursor: page,
          group_id: gid,
        },
      })
      .then((results) => {
        this.setState({
          initialLoading: false,
        });

        this.setState({
          loadEarlier:
            results.data.group_messages_list.paginatorInfo.hasMorePages,
        });
        var temp = [];
        for (let i = 0; i < results.data.group_messages_list.data.length; ++i) {
          // offset = results.rows.item(i).id;
          // if (i === 0 && this.state.offset === null) {
          //   last_id = offset;
          // }

          var obj = JSON.parse(
            results.data.group_messages_list.data[i].message
          );

          temp.push({
            _id: results.data.group_messages_list.data[i].id,
            createdAt: results.data.group_messages_list.data[i].updated_at,
            text: obj[0].text,
            user: {
              _firstname:
                results.data.group_messages_list.data[i].user.firstname,
              _id: results.data.group_messages_list.data[i].user.id,
              _image:
                results.data.group_messages_list.data[i].user.profile_photo,
              _lastname: results.data.group_messages_list.data[i].user.lastname,
              _name: results.data.group_messages_list.data[i].user.username,
              _receiver: gid,
              _socket: sid,
            },
          });
        }

        this.setState((previousState) => ({
          messages: GiftedChat.prepend(previousState.messages, temp),
        }));
        this.setState({ isLoadingEarlier: false });
      })
      .catch((error) => {
        this.setState({
          initialLoading: false,
        });
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
    let id = this.generateSocketIo();
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
    this.props.socket.off("groupChat_message");
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

    this.props.socket.emit("groupChat_message", messages);
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
        this.generateSocketIo(),
        this.state.me.firstname,
        this.state.me.id
      );
    }
  };

  generateSocketIo = () => {
    const b = this.props.navigation.getParam("data").id;

    return "group_" + b;
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
    let id = this.generateSocketIo();

    this.setState(
      {
        page: this.state.page + 1,
      },
      () => {
        this.getChatMessages(this.state.page);
      }
    );
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
    let user = {
      ...props.currentMessage.user,
      profile_photo: props.currentMessage.user._image,
    };

    if (props.user._id !== props.currentMessage.user._id) {
      return (
        <ChatPhoto item={user} style={{ backgroundColor: "transparent" }} />
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

  renderTime = (props) => {
    return (
      <View style={{ height: 20, backgroundColor: "red" }}>
        {this.state.messages.map((msg) => (
          <Text>{moment(msg.createdAt).format("hh:mm a")}</Text>
        ))}
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
        // renderBubble={this.renderBubble}
        // renderChatEmpty={this.renderChatEmpty}
        // renderChatFooter={this.renderFooter}
        // onInputTextChanged={this.onTyping}
        // onLoadEarlier={this.onLoadEarlier}
        // onLongPress={this.onLongPress}
        // renderAvatar={this.renderAvatar}
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
          {this.state.initialLoading ? (
            <>
              <ChatSkeleton />
              <ChatSkeleton />
              <ChatSkeleton />
              <ChatSkeleton />
            </>
          ) : (
            <>
              {chat}
              {aSheet}
            </>
          )}
        </KeyboardAvoidingView>
      );
    }
    return (
      <SafeAreaView style={{ flex: 1 }}>
        {this.state.initialLoading ? (
          <>
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
            <ChatSkeleton />
          </>
        ) : (
          <>
            {chat}
            {aSheet}
          </>
        )}
      </SafeAreaView>
    );
  }
}

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 16,
    textAlign: "center",
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 28,
    lineHeight: 40,
    textAlign: "center",
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

const EnhancedChatScreen = withSocketHOC(GroupChatScreen);

EnhancedChatScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    shadowOpacity: 0,
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <TouchableOpacity
      onPress={() =>
        screenProps.navigation.navigate("GroupDetail", {
          data: screenProps.navigation.getParam("data"),
        })
      }
      style={{
        flex: 1,
        alignItems: "center",
        flexDirection: "row",
      }}
    >
      {screenProps.navigation.getParam("data").image_path ? (
        <Avatar.Image
          style={{
            backgroundColor: color.lightGrayColor,
          }}
          size={38}
          source={{
            uri:
              screenProps.navigation.getParam("data").image_path &&
              link.url +
                "/uploads/group_images/" +
                screenProps.navigation.getParam("data").id +
                "/" +
                screenProps.navigation.getParam("data").image_path +
                "?id=" +
                Math.random(),
          }}
        />
      ) : (
        <Avatar.Image
          style={{
            backgroundColor: color.lightGrayColor,
          }}
          size={38}
          source={require("../assets/images/group.png")}
        />
      )}

      <View
        style={{
          alignItems: "flex-start",
          marginLeft: 10,
        }}
      >
        <Text numberOfLines={1} style={styles.headerPageTitle}>
          {screenProps.navigation.getParam("data").name}
        </Text>
        <View style={{ paddingRight: 30 }}>
          <Text numberOfLines={1}>
            {screenProps.navigation.getParam("data").members.map((m, index) => (
              <Text style={{ fontSize: 12 }}>
                {capitalize(m?.user?.firstname)}
                {screenProps.navigation.getParam("data").members.length ===
                index + 1
                  ? ""
                  : ","}{" "}
              </Text>
            ))}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  ),
  headerLeft: () => (
    <View style={{ paddingLeft: 10 }}>
      {Platform.OS === "android" ? (
        <TouchableOpacity
          onPress={() => screenProps.navigation.navigate("Message")}
        >
          <AntDesign name="arrowleft" size={24} color={color.primaryColor} />
        </TouchableOpacity>
      ) : (
        <TouchableOpacity
          onPress={() => screenProps.navigation.navigate("Message")}
        >
          <Feather name="chevron-left" size={32} color={color.primaryColor} />
        </TouchableOpacity>
      )}
    </View>
  ),
});

export default EnhancedChatScreen;
