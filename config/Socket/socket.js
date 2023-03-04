import AsyncStorage from "@react-native-async-storage/async-storage";
import io from "socket.io-client";
import * as SQLite from "expo-sqlite";
import link from "../../constants/link";
import * as Notifications from "expo-notifications";
const sendNotificationImmediately = async (id, name, text) => {
  return new Promise((resolve) => {
    Notifications.scheduleNotificationAsync(
      {
        title: name,
        body: text,
        android: { sound: true, priority: "high" },
        data: { type: "ChatMessage", user: { id: id } },
      },
      { time: new Date().getTime() + 2000 }
    ).then((notificationId) => {
      resolve(notificationId);
    });
  });
};

const addMessagetoLocal = (msg, id) => {
  db.transaction(function (txn) {
    txn.executeSql(
      "INSERT INTO messages (socket_id, chat_id, msg, notification_id) VALUES (?, ?, ?, ?)",
      [msg[0].user._socket, msg[0]._id, JSON.stringify(msg), id]
    );
  });
};

const db = SQLite.openDatabase("ChatApp", "4.2", "", 1);
// Initialize Socket
const Socket = io("http://" + link.socketLive + ":3000", {
  // transports: ["websocket"],
});

Socket.on("data_message", (msg) => {
  let notification_id = null;
  AsyncStorage.getItem("me").then((result) => {
    let res = JSON.parse(result);
    if (res.id !== msg[0].user._id) {
      sendNotificationImmediately(
        msg[0].user._id,
        msg[0].user._name,
        msg[0].text
      ).then((id) => {
        addMessagetoLocal(msg, id);
      });
    } else {
      addMessagetoLocal(msg, null);
    }
  });
});

Socket.on("groupData_message", (msg) => {
  let notification_id = null;
  AsyncStorage.getItem("me").then((result) => {
    let res = JSON.parse(result);
    if (res.id !== msg[0].user._id) {
      sendNotificationImmediately(
        msg[0].user._id,
        msg[0].user._name,
        msg[0].text
      ).then((id) => {
        addMessagetoLocal(msg, id);
      });
    } else {
      addMessagetoLocal(msg, null);
    }
  });
});
export default Socket;
