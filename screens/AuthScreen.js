import { Constants, Expo } from "expo";
import * as WebBrowser from "expo-web-browser";
import React, { Component } from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Dimensions,
} from "react-native";
import Crousel from "../components/carousel";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { LinearGradient } from "expo-linear-gradient";
import * as Permissions from "expo-permissions";
import * as Notifications from "expo-notifications";

class HomeScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      user: null,
      token: "",
    };
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();
    this._notificationSubscription =
      Notifications.addNotificationReceivedListener(this._handleNotification);
  }

  registerForPushNotificationsAsync = async () => {
    const { status: existingStatus } = await Permissions.getAsync(
      Permissions.NOTIFICATIONS
    );
    let finalStatus = existingStatus;

    // only ask if permissions have not already been determined, because
    // iOS won't necessarily prompt the user a second time.
    if (existingStatus !== "granted") {
      // Android remote notification permissions are granted during the app
      // install, so this will only ask on iOS
      const { status } = await Permissions.askAsync(Permissions.NOTIFICATIONS);
      finalStatus = status;
    }

    // Stop here if the user did not grant permissions
    if (finalStatus !== "granted") {
      return;
    }

    try {
      let token = await Notifications.getExpoPushTokenAsync();
      this.setState({ token: token });
    } catch (error) {}
  };

  getAccessTokenLinkedIn = async () => {
    //let token = await this.linkedRef.current.getAccessToken();
  };

  _handleNotification = (notification) => {
    if (notification.origin === "selected") {
      if (notification.data.hasOwnProperty("type")) {
        if (notification.data.type === "ForgetPassword") {
          this.props.navigation.navigate("ResetPassword", {
            data: notification.data,
          });
        }
      }
    }
  };

  parseJwt = (token) => {
    var base64Url = token.split(".")[1];
    var base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    var jsonPayload = decodeURIComponent(
      atob(base64)
        .split("")
        .map(function (c) {
          return "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2);
        })
        .join("")
    );

    return JSON.parse(jsonPayload);
  };

  render() {
    return (
      <View style={[styles.MainContainer]}>
        <View style={styles.CrouselContainer}>
          <Crousel navigation={this.props.navigation} />
        </View>
        <View style={{ flex: 1, justifyContent: "center" }}>
          <TouchableOpacity
            onPress={() => this.props.navigation.navigate("SignIn")}
          >
            <LinearGradient
              colors={["#FF8635", "#FF7735", "#FF6635"]}
              style={styles.SignInButton}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
            >
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 16,
                  color: color.whiteColor,
                  fontFamily: FontFamily.Regular,
                }}
              >
                Sign-in
              </Text>
            </LinearGradient>
          </TouchableOpacity>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "center",
              marginTop: 20,
            }}
          >
            <Text
              style={{
                fontSize: 15,
                color: "#8E8E93",
                fontFamily: FontFamily.Regular,
              }}
            >
              Don't have an account?
            </Text>
            <TouchableOpacity
              onPress={() => this.props.navigation.navigate("SignUp")}
            >
              <Text
                style={{
                  fontSize: 15,
                  color: "#007AFF",
                  fontFamily: FontFamily.Medium,
                  marginLeft: 4,
                }}
              >
                Create Account
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

HomeScreen.navigationOptions = {
  header: null,
};

function handleTermServicePress() {
  Linking.openURL("https://procurementleague.com/term-of-services");
}

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  CrouselContainer: {
    flex: 4,
  },
  border: { borderRadius: 1, borderWidth: 1, borderColor: "#ffffff" },
  SignInButton: {
    padding: 15,
    borderRadius: 10,
  },
});

export default HomeScreen;
