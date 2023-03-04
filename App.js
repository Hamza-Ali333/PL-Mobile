import AppLoading from "expo-app-loading";
import { Asset } from "expo-asset";
import * as Font from "expo-font";
import React, { Component } from "react";
import {
  AppState,
  StyleSheet,
  View,
  Dimensions,
  Text,
  LogBox,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-navigation";
import AppNavigator from "./navigation/AppNavigator";
import { ApolloProvider } from "react-apollo";
import client from "./constants/client";
import AppStatusBar from "./components/AppStatusBar";
import { getStatusBarHeight } from "react-native-status-bar-height";
import Socket, { SocketProvider } from "./config/Socket";
import { Host } from "react-native-portalize";
import CustomTabs from "./components/custom_tabs/CustomTabs";
LogBox.ignoreAllLogs(true);

export default class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoadingComplete: false,
      screenWidth: "",
      screenHeight: "",
      statusBarHeight: null,
      appState: AppState.currentState,
    };
    Text.defaultProps = Text.defaultProps || {};
    Text.defaultProps.allowFontScaling = false;
  }

  componentDidMount() {
    //SocketMessages(Socket);
    AppState.addEventListener("change", this._handleAppStateChange);
  }

  componentWillUnmount() {
    AppState.removeEventListener("change", this._handleAppStateChange);
  }

  _handleAppStateChange = (nextAppState) => {
    this.setState({ appState: nextAppState });
    if (nextAppState === "background" || nextAppState === "inactive") {
      Socket.disconnect();
    } else {
      Socket.connect();
    }
  };

  getScreenSize = () => {
    const screenWidth = Math.round(Dimensions.get("window").width);
    const screenHeight = Math.round(Dimensions.get("window").height);
    if (screenWidth > screenHeight) {
      this.setState({ screenWidth: screenHeight, screenHeight: screenWidth });
    } else {
      this.setState({ screenWidth: screenWidth, screenHeight: screenHeight });
    }

    this.setState({ statusBarHeight: getStatusBarHeight() });
  };

  loadResourcesAsync = async () => {
    await Promise.all([
      Asset.loadAsync([
        require("./assets/images/robot-dev.png"),
        require("./assets/images/robot-prod.png"),
      ]),
      Font.loadAsync({
        // This is the font that we are using for our tab bar
        ...Ionicons.font,
        // We include SpaceMono because we use it in HomeScreen.js. Feel free to
        // remove this if you are not using it in your app
        "space-mono": require("./assets/fonts/SpaceMono-Regular.ttf"),
        "Lato-Black": require("./assets/fonts/Lato-Black.ttf"),
        "Lato-Bold": require("./assets/fonts/Lato-Bold.ttf"),
        "Lato-Light": require("./assets/fonts/Lato-Light.ttf"),
        "Lato-Regular": require("./assets/fonts/Lato-Regular.ttf"),
        "Lato-Medium": require("./assets/fonts/Lato-Medium.ttf"),
        "Lato-Thin": require("./assets/fonts/Lato-Thin.ttf"),
        "Rubik-Regular": require("./assets/fonts/Rubik-Regular.ttf"),
        "Rubik-Medium": require("./assets/fonts/Rubik-Medium.ttf"),
      }),
    ]);
  };

  handleLoadingError = (error) => {
    // In this case, you might want to report the error to your error reporting
    // service, for example Sentry
    console.warn(error);
  };

  handleFinishLoading = () => {
    this.getScreenSize();
    this.setState({ isLoadingComplete: true });
  };

  render() {
    if (!this.state.isLoadingComplete && !this.props.skipLoadingScreen) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItem: "center" }}
        >
          <AppLoading
            startAsync={this.loadResourcesAsync}
            onError={this.handleLoadingError}
            onFinish={() => this.handleFinishLoading()}
          />
        </View>
      );
    } else {
      return (
        <ApolloProvider client={client}>
          <AppStatusBar
            height={this.state.statusBarHeight}
            backgroundColor="#FFFFFF"
            barStyle="dark-content"
          />
          <View style={styles.container}>
            <SocketProvider value={Socket}>
              <Host>
                <AppNavigator baseUri="https://procurementleague.com/" />
              </Host>
            </SocketProvider>
          </View>
        </ApolloProvider>
      );
    }
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#fff",
    justifyContent: "center",
  },
});
SafeAreaView.setStatusBarHeight(0);
