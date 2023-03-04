import React from "react";
import * as Notifications from "expo-notifications";
import {
  ToastAndroid,
  Alert,
  ActivityIndicator,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Platform,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { TextInput, Headline } from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import * as Permissions from "expo-permissions";
import { LinearGradient } from "expo-linear-gradient";
import GoogleModal from "../components/google/GoogleService";
import LinkedInModal from "react-native-linkedin";
import * as AppleAuthentication from "expo-apple-authentication";
import { FontAwesome } from "@expo/vector-icons";
import link from "../constants/link";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const LOGIN = gql`
  mutation Login($email: String!, $password: String!, $token: String) {
    login(email: $email, password: $password, device_token: $token) {
      token
    }
  }
`;

class SignInScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      PickerValueHolder: "",
      email: "",
      password: "",
      url: "",
      token: null,
      signInGoogleLoader: false,
      signInLinkedinLoader: false,
      signInAppleLoader: false,
      hidePassword: true,
    };
    this.linkedRef = React.createRef();
    this.googleRef = React.createRef();
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();
  }

  handlePassword = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };

  _pressHandler = async () => {
    //let result = await WebBrowser.openBrowserAsync(this.googleRef.current.getAuthorizationUrl());
    this.googleRef.current.open();
  };

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

    // Promise is resolved
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token: token.data });
  };

  doLogin = async (token) => {
    try {
      await AsyncStorage.setItem(
        "userSession",
        JSON.stringify({ token: token, uri: this.state.url })
      );
      this.props.navigation.navigate("AuthLoading");
    } catch (error) {
      // Error saving data
    }
  };

  saveUrl = async () => {
    AsyncStorage.setItem(
      "userSession",
      JSON.stringify({ uri: this.state.url, token: null })
    );
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };

  sendLinkedinRequest = (token) => {
    this.setState({ signInLinkedinLoader: true });
    var params = {
      access_token: token.access_token,
      device_token: this.state.token,
    };
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    const config = {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
      },
      body: formData,
    };
    fetch(link.url + "/api/linkedin/login", config)
      .then((response) => response.json())
      .then((res) => {
        this.setState({ signInLinkedinLoader: false });
        AsyncStorage.setItem(
          "userSession",
          JSON.stringify({ token: res.token })
        );
        this.props.navigation.navigate("AuthLoading");
      })
      .catch((error) => {});
  };

  sendGoogleRequest = (token) => {
    this.setState({ signInGoogleLoader: true });
    var params = {
      access_token: token.access_token,
      device_token: this.state.token,
    };
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    const config = {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
      },
      body: formData,
    };
    fetch(link.url + "/api/google/login", config)
      .then((response) => response.json())
      .then((res) => {
        this.setState({ signInGoogleLoader: false });
        AsyncStorage.setItem(
          "userSession",
          JSON.stringify({ token: res.token })
        );
        this.props.navigation.navigate("AuthLoading");
      })
      .catch((error) => {});
  };

  sendAppleRequest = (token) => {
    this.setState({ signInAppleLoader: true });
    let first_name, last_name;
    if (token.fullName.givenName) {
      first_name = token.fullName.givenName;
    }
    if (token.fullName.nickname) {
      first_name += " " + token.fullName.nickname;
    }
    if (token.fullName.familyName) {
      last_name = token.fullName.familyName;
    }
    if (token.fullName.middleName) {
      last_name += " " + token.fullName.middleName;
    }

    var params = {
      access_token: token.identityToken,
      device_token: this.state.token,
      first_name: first_name,
      last_name: last_name,
    };
    var formData = new FormData();
    for (var k in params) {
      formData.append(k, params[k]);
    }
    const config = {
      method: "POST",
      headers: {
        Accept: "application/x-www-form-urlencoded",
      },
      body: formData,
    };
    fetch(link.url + "/api/apple/login", config)
      .then((response) => response.json())
      .then((res) => {
        this.setState({ signInAppleLoader: false });
        AsyncStorage.setItem(
          "userSession",
          JSON.stringify({ token: res.token })
        );
        this.props.navigation.navigate("AuthLoading");
      })
      .catch((error) => {
        this.setState({ signInAppleLoader: false });
      });
  };

  _loginWithApple = async () => {
    applePayload = await AppleAuthentication.signInAsync({
      requestedScopes: [
        AppleAuthentication.AppleAuthenticationScope.FULL_NAME,
        AppleAuthentication.AppleAuthenticationScope.EMAIL,
      ],
    });
    this.sendAppleRequest(applePayload);
  };

  render() {
    return (
      <Mutation mutation={LOGIN}>
        {(login, { loading, error, data }) => (
          <View style={styles.MainContainer}>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Headline style={styles.welcomeText}>WELCOME TO</Headline>
                <View>
                  <Image
                    style={{ width: 180, height: 30, resizeMode: "contain" }}
                    source={require("../assets/images/logo-rounded.png")}
                  />
                </View>
              </View>
              {loading && (
                <ActivityIndicator size="small" color={color.primaryColor} />
              )}
              {error && <Text>Error! ${error.message}</Text>}
              <View style={{ flex: 2, justifyContent: "flex-start" }}>
                <KeyboardAwareScrollView enableOnAndroid={true}>
                  <View style={{ marginTop: 10 }}>
                    <TextInput
                      autoCapitalize="none"
                      keyboardType="email-address"
                      theme={{ colors: { primary: "#FF6600" } }}
                      style={styles.InfoEmailInput}
                      label="E-mail"
                      value={this.state.email}
                      onChangeText={(text) =>
                        this.updateTextInput(text, "email")
                      }
                    />
                  </View>
                  <View style={{ marginTop: 10, position: "relative" }}>
                    <TextInput
                      theme={{ colors: { primary: "#FF6600" } }}
                      secureTextEntry={this.state.hidePassword}
                      style={[styles.InfoEmailInput, styles.psswrdInputText]}
                      label="Password"
                      value={this.state.password}
                      onChangeText={(text) =>
                        this.updateTextInput(text, "password")
                      }
                    />
                    <TouchableOpacity
                      style={{
                        position: "absolute",
                        right: 0,
                        zIndex: 11,
                        top: 0,
                        height: 55,
                        justifyContent: "center",
                      }}
                      onPress={() => this.handlePassword()}
                    >
                      <FontAwesome
                        name={this.state.hidePassword ? "eye" : "eye-slash"}
                        size={22}
                        color={color.primaryColor}
                        style={styles.listPanelIcon}
                      />
                    </TouchableOpacity>
                  </View>

                  <TouchableOpacity
                    style={{ alignSelf: "flex-end", marginTop: 10 }}
                    onPress={() =>
                      this.props.navigation.navigate("ForgetPassword")
                    }
                  >
                    <Text
                      style={{
                        textAlign: "right",
                        color: "#007AFF",
                        fontSize: 14,
                        fontFamily: FontFamily.Medium,
                      }}
                    >
                      Forgot Password ?
                    </Text>
                  </TouchableOpacity>

                  <View
                    style={{
                      marginTop: 10,
                      flexDirection: "row",
                      justifyContent: "space-between",
                    }}
                  >
                    <TouchableOpacity
                      style={styles.GoogleButton}
                      onPress={this._pressHandler}
                    >
                      <Image
                        style={{ width: 16, height: 16, resizeMode: "contain" }}
                        source={require("../assets/images/google.png")}
                      />
                      {!this.state.signInGoogleLoader && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: FontFamily.Regular,
                            color: color.blackColor,
                          }}
                        >
                          Sign in with Google
                        </Text>
                      )}
                      {this.state.signInGoogleLoader && (
                        <ActivityIndicator
                          size="small"
                          color={color.primaryColor}
                        />
                      )}
                      <Image
                        style={{ width: 5, height: 9, resizeMode: "contain" }}
                        source={require("../assets/images/Arrow-right.png")}
                      />
                    </TouchableOpacity>

                    <TouchableOpacity
                      style={styles.LinkedinButton}
                      onPress={() => this.linkedRef.current.open()}
                    >
                      <Image
                        style={{ width: 16, height: 16, resizeMode: "contain" }}
                        source={require("../assets/images/linkedin2.png")}
                      />
                      {!this.state.signInLinkedinLoader && (
                        <Text
                          style={{
                            fontSize: 10,
                            fontFamily: FontFamily.Regular,
                            color: color.blackColor,
                          }}
                        >
                          Sign in with Linkedin
                        </Text>
                      )}
                      {this.state.signInLinkedinLoader && (
                        <ActivityIndicator
                          size="small"
                          color={color.primaryColor}
                        />
                      )}
                      <Image
                        style={{ width: 5, height: 9, resizeMode: "contain" }}
                        source={require("../assets/images/Arrow-right.png")}
                      />
                    </TouchableOpacity>
                  </View>
                </KeyboardAwareScrollView>
              </View>
              <View
                style={{
                  flex: 1,
                  justifyContent: "center",
                }}
              >
                {Platform.OS === "ios" && (
                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginBottom: 20,
                    }}
                  >
                    {!this.state.signInAppleLoader && (
                      <AppleAuthentication.AppleAuthenticationButton
                        buttonType={
                          AppleAuthentication.AppleAuthenticationButtonType
                            .SIGN_IN
                        }
                        buttonStyle={
                          AppleAuthentication.AppleAuthenticationButtonStyle
                            .WHITE
                        }
                        cornerRadius={5}
                        style={{
                          width: "100%",
                          height: 40,
                          borderWidth: 1,
                          borderRadius: 20,
                          borderColor: "black",
                        }}
                        onPress={this._loginWithApple}
                      />
                    )}
                    {this.state.signInAppleLoader && (
                      <ActivityIndicator
                        size="small"
                        color={color.primaryColor}
                      />
                    )}
                  </View>
                )}
                <TouchableOpacity
                  onPress={() => {
                    if (this.state.email !== "" && this.state.password !== "") {
                      login({
                        variables: {
                          email: this.state.email,
                          password: this.state.password,
                          token: this.state.token,
                        },
                      })
                        .then((res) => {
                          if (res) {
                            if (res.data.login.token) {
                              this.doLogin(res.data.login.token);
                            } else {
                              if (Platform.OS !== "ios") {
                                ToastAndroid.show(
                                  "Invalid email or Password!",
                                  ToastAndroid.LONG
                                );
                              } else {
                                Alert.alert(
                                  "Error",
                                  "Invalid email or Password!",
                                  [
                                    {
                                      text: "OK",
                                      onPress: () => console.log("OK Pressed"),
                                    },
                                  ],
                                  { cancelable: false }
                                );
                              }
                            }
                          }
                        })
                        .catch((err) => <Text>{err}</Text>);
                    }
                  }}
                >
                  <LinearGradient
                    colors={["#FF8635", "#FF7735", "#FF6635"]}
                    style={styles.SignUpButton}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 1 }}
                  >
                    <Text
                      style={{
                        textAlign: "center",
                        color: "#fff",
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                      }}
                    >
                      Sign In
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
            <LinkedInModal
              ref={this.linkedRef}
              clientID="782cg1r81oi9cu"
              clientSecret="Rh0OKoGH2Zw4H05B"
              redirectUri="https://procurementleague.com/login/linkedin/callback"
              onSuccess={(token) => this.sendLinkedinRequest(token)}
              onError={(error) => console.log(error)}
              linkText=""
            />

            <GoogleModal
              ref={this.googleRef}
              clientID="650839431438-556g2hk3n1hctgq1ae2n8a79al7h52q0.apps.googleusercontent.com"
              clientSecret="5tLYwVMJmSvOr4RPs3ZRfCLG"
              redirectUri="https://procurementleague.com/login/google/callback"
              onSuccess={(token) => this.sendGoogleRequest(token)}
              onError={(error) => console.log(error)}
              linkText=""
            />
          </View>
        )}
      </Mutation>
    );
  }
}

SignInScreen.navigationOptions = {
  title: "Sign In",
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
  },
  welcomeText: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 31,
  },
  InfoEmailInput: {
    height: 55,
    paddingLeft: 0,
    backgroundColor: "transparent",
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 17,
  },
  psswrdInputText: {
    paddingRight: "35%",
  },
  InfoEmailInputIcon: {
    position: "absolute",
    top: 17,
    left: 5,
    color: "rgba(96,100,109, 1)",
    zIndex: 1,
  },
  SignUpButton: {
    padding: 15,
    borderRadius: 10,
  },
  GoogleButton: {
    width: 140,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 4,
    paddingRight: 4,
  },
  LinkedinButton: {
    width: 150,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    paddingTop: 10,
    paddingBottom: 10,
    paddingLeft: 4,
    paddingRight: 4,
  },
});

export default SignInScreen;
