import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  ToastAndroid,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { TextInput } from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import link from "../constants/link";

class ResetPasswordScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      PickerValueHolder: "",
      email: "",
      password: "",
      confirm: "",
      token: null,
    };
  }

  componentDidMount() {
    this.setState({ token: this.props.navigation.state.params.data.token });
  }

  sendResetPasswordRequest = () => {
    if (this.state.password !== this.state.confirm) {
      ToastAndroid.showWithGravityAndOffset(
        "password does not match",
        ToastAndroid.LONG,
        ToastAndroid.BOTTOM,
        25,
        50
      );
    }
    this.setState({ loading: true });
    var params = {
      new_password: this.state.password,
      confirm_password: this.state.confirm,
      token: this.state.token,
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
    fetch(link.url + "/api/reset/password", config)
      .then((response) => response.json())
      .then((res) => {
        this.setState({ loading: false });
        ToastAndroid.showWithGravityAndOffset(
          res.message,
          ToastAndroid.LONG,
          ToastAndroid.BOTTOM,
          25,
          50
        );
        if (res.status) {
          this.props.navigation.navigate("SignIn");
        }
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
      <KeyboardAvoidingView
        style={styles.MainContainer}
        behavior="padding"
        enabled
      >
        <ScrollView>
          <Text>Please reset your password</Text>

          <View style={{ flex: 1, marginTop: 10 }}>
            <FontAwesome
              style={styles.InfoEmailInputIcon}
              name="unlock-alt"
              size={22}
            ></FontAwesome>
            <TextInput
              style={styles.InfoEmailInput}
              label="Password"
              value={this.state.password}
              secureTextEntry={true}
              onChangeText={(text) => this.updateTextInput(text, "password")}
            />
          </View>

          <View style={{ flex: 1, marginTop: 10 }}>
            <FontAwesome
              style={styles.InfoEmailInputIcon}
              name="unlock-alt"
              size={22}
            ></FontAwesome>
            <TextInput
              style={styles.InfoEmailInput}
              label="Confirm password"
              value={this.state.confirm}
              secureTextEntry={true}
              onChangeText={(text) => this.updateTextInput(text, "confirm")}
            />
          </View>

          <View style={{ flex: 1, marginTop: 30 }}>
            {!this.state.loading && (
              <TouchableOpacity
                style={styles.SignUpButton}
                onPress={this.sendResetPasswordRequest}
              >
                <Text
                  style={{ textAlign: "center", color: "#fff", fontSize: 16 }}
                >
                  Reset
                </Text>
              </TouchableOpacity>
            )}
            {this.state.loading && (
              <ActivityIndicator size="small" color={color.primaryColor} />
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    );
  }
}

ResetPasswordScreen.navigationOptions = {
  title: "Reset password",
};

const styles = StyleSheet.create({
  MainContainer: {
    flex: 1,
    backgroundColor: "#f7f7f7",
    padding: 15,
  },
  InfoEmailInput: {
    height: 55,
    paddingLeft: 30,
    backgroundColor: "transparent",
    borderBottomWidth: 0.5,
    borderBottomColor: "#e8e8e8",
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 16,
  },
  InfoEmailInputIcon: {
    position: "absolute",
    top: 17,
    left: 5,
    color: "rgba(96,100,109, 1)",
    zIndex: 1,
  },
  SignUpButton: {
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 24,
  },
});

export default ResetPasswordScreen;
