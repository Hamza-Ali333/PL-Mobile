import AsyncStorage from "@react-native-async-storage/async-storage";
import * as SQLite from "expo-sqlite";
import link from "../../constants/link";
const db = SQLite.openDatabase("ChatApp", "4.1", "", 1);

export const SocketMessages = async (Socket) => {
  const save = await AsyncStorage.getItem("userSession");
  const item = JSON.parse(save);
  const me = await AsyncStorage.getItem("me");
  const me_item = JSON.parse(me);

  var data = new FormData();
  data.append("user_id", me_item.id);

  fetch(link.url + "/api/user/messages", {
    method: "POST",
    headers: {
      Authorization: `Bearer ${item.token}`,
    },
    body: data,
  })
    .then((response) => response.json())
    .then((responseJson) => {
      if (responseJson.length > 0) {
        db.transaction(function (txn) {
          responseJson.map((item, key) => {
            let flag = true;
            txn.executeSql(
              "SELECT id FROM `messages` where `chat_id` = ? ORDER BY id desc LIMIT 1",
              [item.chat_id],
              (tx, results) => {
                if (results.rows.length === 0) {
                  txn.executeSql(
                    "INSERT INTO messages (socket_id, chat_id, msg) VALUES (?, ?, ?)",
                    [item.socket_id, item.chat_id, item.msg]
                  );
                }
              }
            );
          });

          Socket.emit("delete_message", me_item.id, null);
        });
      }
    })
    .catch((error) => {});
};

export const SocketMessage = async (
  Socket,
  socket_id,
  sender_id,
  processActive
) => {
  const save = await AsyncStorage.getItem("userSession");
  const item = JSON.parse(save);
  const me = await AsyncStorage.getItem("me");
  const me_item = JSON.parse(me);

  var data = new FormData();
  data.append("user_id", me_item.id);
  data.append("socket_id", socket_id);

  return new Promise((resolve) => {
    fetch(link.url + "/api/user/messages", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${item.token}`,
      },
      body: data,
    })
      .then((response) => response.json())
      .then((responseJson) => {
        if (responseJson.length > 0) {
          if (processActive) {
            db.transaction(function (txn) {
              responseJson.map((item, key) => {
                let flag = true;
                txn.executeSql(
                  "SELECT id FROM `messages` where `chat_id` = ? ORDER BY id desc LIMIT 1",
                  [item.chat_id],
                  (tx, results) => {
                    if (results.rows.length === 0) {
                      txn.executeSql(
                        "INSERT INTO messages (socket_id, chat_id, msg) VALUES (?, ?, ?)",
                        [item.socket_id, item.chat_id, item.msg],
                        (tx, rs) => {
                          resolve(true);
                        }
                      );
                    }
                  }
                );
              });

              Socket.emit("delete_message", me_item.id, socket_id, sender_id);
            });
          }
        }
      })
      .catch((error) => {
        resolve(true);
      });
  });
};
