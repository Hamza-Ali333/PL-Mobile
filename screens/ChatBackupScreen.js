import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Button,
  TouchableOpacity,
  Picker,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import * as Notifications from "expo-notifications";
import * as Permissions from "expo-permissions";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import getTotalMessage from "../graphql/queries/getTotalMessage";
import { Query } from "react-apollo";
import * as FileSystem from "expo-file-system";
import link from "../constants/link";
import { ProgressBar } from "react-native-paper";
import * as Device from "expo-device";

class ChatBackupScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedValue: 0,
      exists: false,
      size: "",
      uri: "",
      token: "",
      progress: 0,
      me: {},
      loading: false,
      loadingSave: false,
    };
    this.refetch;
    this.setSelectedValue = this.setSelectedValue.bind(this);
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });

    this._setUserSession();
    this.checkChatExist();
    this.setBackupSettings();
  }

  callback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    this.setState({ progress: progress });
  };

  setDownloadResumable = () => {
    let id = this.state.me.id;
    return FileSystem.createDownloadResumable(
      link.url + "/uploads/chatBackup/" + id + "/ChatApp.sqlite3",
      FileSystem.documentDirectory + "/SQLite/ChatApp",
      {},
      this.callback
    );
  };

  handleRestoreBackup = async () => {
    this.setState({ loadingRestore: true });
    try {
      const { uri } = await this.setDownloadResumable().downloadAsync();
      this.props.navigation.setParams({ exists: true });
      await AsyncStorage.setItem("@triggerDone", "true");
      Notifications.scheduleNotificationAsync({
        title: "Restore Successfully",
        body: "Your chat backup successfully restore",
        android: { sound: true, priority: "high" },
        ios: { sound: true, _displayInForeground: true },
      });
    } catch (e) {}
  };

  _setUserSession = async () => {
    const save = await AsyncStorage.getItem("userSession");
    const item = JSON.parse(save);
    this.setState({ token: item.token });
    await AsyncStorage.setItem("@triggerBackup", "true");
    const triggerDone = await AsyncStorage.getItem("@triggerDone");
    if (!triggerDone) {
      this.props.navigation.setParams({ exists: false });
    }
  };

  setSelectedValue = async () => {
    if (Device.isDevice) {
      const { status: existingStatus } =
        await Notifications.getPermissionsAsync();

      let finalStatus = existingStatus;
      if (existingStatus !== "granted") {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }

      if (finalStatus !== "granted") {
        Alert.alert("Failed to get push token for push notification!");
        return;
      }
      this.setState({ loadingSave: true });
      let repeat = "day";
      let selectedValue = parseInt(this.state.selectedValue);

      Notifications.cancelAllScheduledNotificationsAsync();
      const triggerNoti = { option: selectedValue };

      await AsyncStorage.setItem(
        "@triggerNotification",
        JSON.stringify(triggerNoti)
      );

      if (selectedValue === 2 || selectedValue === 3 || selectedValue === 4) {
        if (selectedValue === 3) {
          repeat = "week";
        } else if (selectedValue === 4) {
          repeat = "month";
        }
        Notifications.scheduleNotificationAsync(
          {
            title: "Schedule Backup",
            body: "tap here to backup your chat",
            android: { sound: true, priority: "high" },
            ios: { sound: true, _displayInForeground: true },
            data: { type: "ScheduleBackup" },
          },
          {
            time: new Date().getTime() + 10000,
            repeat: repeat,
          }
        ).then((notificationId) => {
          Notifications.scheduleNotificationAsync({
            title: "Settings Saved",
            body: "Your backup settings schedule for every " + repeat,
            android: { sound: true, priority: "high" },
            ios: { sound: true, _displayInForeground: true },
          });
        });
      } else {
        Notifications.scheduleNotificationAsync({
          title: "Settings Saved",
          body: "Your backup settings never schedule",
          android: { sound: true, priority: "high" },
          ios: { sound: true, _displayInForeground: true },
        });
      }

      this.setState({ loadingSave: false });
    }
  };

  checkChatExist = async () => {
    const fileUri = FileSystem.documentDirectory + "/SQLite/ChatApp";
    const info = await FileSystem.getInfoAsync(fileUri);
    if (info.exists) {
      this.setState({
        uri: fileUri,
        exists: true,
        size: this.readableBytes(info.size),
      });
    }
  };

  readableBytes = (bytes) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
  };

  readableTime = () => {
    var date = new Date();
    var hours = date.getHours();
    var minutes = date.getMinutes();

    // Check whether AM or PM
    var newformat = hours >= 12 ? "PM" : "AM";

    // Find current hour in AM-PM Format
    hours = hours % 12;

    // To display "0" as "12"
    hours = hours ? hours : 12;
    minutes = minutes < 10 ? "0" + minutes : minutes;

    return (
      date.toLocaleDateString() + " " + hours + ":" + minutes + " " + newformat
    );
  };

  createFormData = (photo, body) => {
    const data = new FormData();

    data.append("file", {
      name: "ChatApp",
      type: "SQLITE3/sqllite3",
      uri: photo,
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  handleUploadBackup = async () => {
    await AsyncStorage.setItem("@triggerDone", "true");
    let d = new Date();
    this.setState({ loading: true });
    fetch(link.url + "/api/chat/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.state.token}` || null,
      },
      body: this.createFormData(this.state.uri, {
        time: this.readableTime(),
        size: this.state.size,
      }),
    })
      .then((response) => response.json())
      .then((response) => {
        this.refetch();
        this.setState({ loading: false });
        this.props.navigation.setParams({ exists: true });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  setBackupSettings = async () => {
    let triggervalue = await AsyncStorage.getItem("@triggerNotification");
    triggervalue = JSON.parse(triggervalue);
    if (triggervalue) {
      this.setState({ selectedValue: triggervalue.option.toString() });
    }
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ backgroundColor: "#fff", flex: 1 }}>
        <View
          style={{
            flexDirection: "row",
            borderBottomWidth: 1,
            borderColor: color.lightGrayColor,
            marginBottom: 20,
            paddingBottom: 20,
            padding: 15,
          }}
        >
          <View style={{ width: "20%", alignItems: "center" }}>
            <MaterialIcons name="backup" size={24} color={color.primaryColor} />
          </View>

          <View style={{ width: "80%" }}>
            <Text style={{ color: color.primaryColor }}>Last Backup</Text>
            <Text
              style={{
                color: color.grayColor,
                marginTop: 10,
                paddingRight: 20,
              }}
            >
              Back up your messages and media to procurementleague.com secure
              server. You can restore them when you reinstall app. Your messages
              will also back up to your phone's internal storage.
            </Text>

            <Query query={getTotalMessage}>
              {({ loading, error, data, fetchMore, refetch }) => {
                this.refetch = refetch;
                if (!data) {
                  return null;
                }
                if (data.me && data.me.backup_info) {
                  return (
                    <View>
                      <Text style={{ color: color.blackColor, marginTop: 30 }}>
                        Date: {data.me.backup_info.time}
                      </Text>
                      <Text style={{ color: color.blackColor, marginTop: 10 }}>
                        Size: {data.me.backup_info.size}
                      </Text>
                      {this.state.exists &&
                      this.props.navigation.getParam("exists") ? null : (
                        <View>
                          {!this.state.loadingRestore ? (
                            <View style={{ width: "50%", marginTop: 10 }}>
                              <Button
                                onPress={this.handleRestoreBackup}
                                title="Restore Backup"
                                color={color.primaryColor}
                              />
                            </View>
                          ) : (
                            <ProgressBar
                              style={{ marginTop: 10, marginRight: 5 }}
                              progress={this.state.progress}
                              color={color.primaryColor}
                            />
                          )}
                        </View>
                      )}

                      <View style={{ width: "50%", marginTop: 20 }}>
                        {this.state.loading ? (
                          <ActivityIndicator
                            size="large"
                            color={color.primaryColor}
                          />
                        ) : (
                          <Button
                            onPress={this.handleUploadBackup}
                            disabled={
                              this.state.exists &&
                              this.props.navigation.getParam("exists")
                                ? false
                                : true
                            }
                            title="Take Backup"
                            color={color.primaryColor}
                          />
                        )}
                      </View>
                    </View>
                  );
                } else {
                  return (
                    <View>
                      <Text style={{ color: color.blackColor, marginTop: 30 }}>
                        You don't have backup!
                      </Text>
                      <View style={{ width: "50%", marginTop: 20 }}>
                        {this.state.loading ? (
                          <ActivityIndicator
                            size="large"
                            color={color.primaryColor}
                          />
                        ) : (
                          <Button
                            onPress={this.handleUploadBackup}
                            disabled={this.state.exists ? false : true}
                            title="Take Backup"
                            color={color.primaryColor}
                          />
                        )}
                      </View>
                    </View>
                  );
                }
              }}
            </Query>

            {this.state.exists ? null : (
              <Text style={{ color: color.grayColor }}>
                You don't have chat data right now
              </Text>
            )}
          </View>
        </View>

        <View style={{ flexDirection: "row" }}>
          <View style={{ width: "20%", alignItems: "center" }}>
            <MaterialIcons
              name="settings-backup-restore"
              size={24}
              color={color.primaryColor}
            />
          </View>

          <View style={{ width: "80%" }}>
            <View
              style={{ justifyContent: "space-between", flexDirection: "row" }}
            >
              <Text style={{ color: color.primaryColor }}>Backup Settings</Text>
              {this.state.loadingSave ? (
                <ActivityIndicator color={color.primaryColor} size="small" />
              ) : (
                <TouchableOpacity onPress={this.setSelectedValue}>
                  <Text
                    style={{
                      color: color.primaryColor,
                      marginRight: 20,
                      fontSize: 17,
                    }}
                  >
                    Save
                  </Text>
                </TouchableOpacity>
              )}
            </View>

            <Text
              style={{
                color: color.grayColor,
                marginTop: 10,
                paddingRight: 20,
              }}
            >
              Manage your schedule back up.
            </Text>

            <Text
              style={{
                color: color.blackColor,
                marginTop: 30,
                fontFamily: FontFamily.Regular,
                fontSize: 18,
              }}
            >
              Back up to server
            </Text>
          </View>
        </View>
        <Picker
          selectedValue={this.state.selectedValue}
          onValueChange={(itemValue, itemIndex) =>
            this.setState({ selectedValue: itemValue })
          }
        >
          <Picker.Item label="Never" value="0" />
          <Picker.Item label='Only when i tap "Back up"' value="1" />
          <Picker.Item label="Daily" value="2" />
          <Picker.Item label="Weekly" value="3" />
          <Picker.Item label="Monthly" value="4" />
        </Picker>
      </ScrollView>
    );
  }
}

ChatBackupScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Chat backup</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  msgDayPeriods: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 16,
    marginBottom: 20,
  },
  childmsgDayPeriods: {
    marginTop: 30,
  },
  ListItems: {
    flex: 1,
    flexDirection: "row",
    position: "relative",
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: "#C4C4C4",
  },
  firstListItem: {
    paddingTop: 0,
  },
  msgProfileImage: {
    marginRight: 10,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  onlineShown: {
    backgroundColor: color.primaryColor,
    width: 8,
    height: 8,
    borderRadius: 10,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  msgUserName: {
    fontSize: 15,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
  msgTime: {
    fontSize: 11,
    fontFamily: FontFamily.Regular,
    color: "#424242",
  },
  msgDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 12,
  },
  acceptButton: {
    width: 70,
    height: 25,
    paddingTop: 4,
    borderRadius: 4,
    backgroundColor: color.primaryColor,
  },
  rejectButton: {
    width: 70,
    height: 25,
    paddingTop: 4,
    borderRadius: 4,
    backgroundColor: "#E9F2F8",
    marginLeft: 10,
  },
});

export default ChatBackupScreen;
