import { FontAwesome } from "@expo/vector-icons";
import { Notifications } from "expo";
import React from "react";
import {
  ActivityIndicator,
  Alert,
  Image,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { Formik } from "formik";
import { forgotPasswordSchema } from "../schemas/index.js";
const initailValues = {
  email: "",
};
import { LinearGradient } from "expo-linear-gradient";
import * as Permissions from "expo-permissions";
import { Headline, TextInput } from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import link from "../constants/link";

class ForgetPasswordScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      PickerValueHolder: "",
      email: "",
      url: "",
      token: null,
    };
  }

  componentDidMount() {
    this.registerForPushNotificationsAsync();
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

    // Promise is resolved
    let token = await Notifications.getExpoPushTokenAsync();
    this.setState({ token: token });
  };

  sendForgetPasswordRequest = ({ email }) => {
    this.setState({ loading: true });
    var params = {
      email: email,
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

    fetch(link.url + "/api/forget/password", config)
      .then((response) => response.json())
      .then((res) => {
        this.setState({ loading: false });
        Alert.alert("Message", res.message, [{ text: "OK" }], {
          cancelable: true,
        });
      })
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };

  render() {
    return (
      <Formik
        initialValues={initailValues}
        validationSchema={forgotPasswordSchema}
        onSubmit={(values, formikActions) => {
          console.log(values);
          this.sendForgetPasswordRequest(values);
          formikActions.setSubmitting(false);
        }}
      >
        {(props) => (
          <KeyboardAvoidingView
            style={styles.MainContainer}
            behavior="padding"
            enabled
          >
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
            <View style={{ flex: 1, justifyContent: "center" }}>
              <View style={{}}>
                <FontAwesome
                  style={styles.InfoEmailInputIcon}
                  name="envelope-o"
                  size={18}
                />
                <TextInput
                  theme={{ colors: { primary: "#FF6600" } }}
                  style={styles.InfoEmailInput}
                  label="E-mail"
                  autoCapitalize="none"
                  value={this.props.email}
                  onChangeText={props.handleChange("email")}
                />
              </View>
              {props.touched.email && props.errors.email ? (
                <Text style={styles.error}>{props.errors.email}</Text>
              ) : null}
            </View>

            <View style={{ flex: 1, justifyContent: "center" }}>
              {!this.state.loading && (
                <TouchableOpacity onPress={props.handleSubmit}>
                  <LinearGradient
                    colors={["#FF8635", "#FF7735", "#FF6635"]}
                    style={{ padding: 15, borderRadius: 10 }}
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
                      Send
                    </Text>
                  </LinearGradient>
                </TouchableOpacity>
              )}
              {this.state.loading && (
                <ActivityIndicator size="small" color={color.primaryColor} />
              )}
            </View>
          </KeyboardAvoidingView>
        )}
      </Formik>
    );
  }
}

ForgetPasswordScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: <Text style={styles.pageTitle}>Reset Password</Text>,
});

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
    paddingLeft: 22,
    backgroundColor: "transparent",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e8e8e8",
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 15,
  },
  InfoEmailInputIcon: {
    position: "absolute",
    top: 17,
    left: 5,
    color: "rgba(96,100,109, 1)",
    zIndex: 1,
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
});

export default ForgetPasswordScreen;
