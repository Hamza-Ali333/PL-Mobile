import React from "react";
import { FontAwesome } from "@expo/vector-icons";
import {
  Alert,
  Linking,
  ActivityIndicator,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Image,
  Dimensions,
} from "react-native";
import { TextInput, Headline, Checkbox } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import gql from "graphql-tag";
import { LinearGradient } from "expo-linear-gradient";
import Alertify from "../components/Alertify";
import { Formik } from "formik";
import { signUpSchema } from "../schemas";

const initailValues = {
  username: "",
  firstname: "",
  lastname: "",
  email: "",
  password: "",
  confirmPassword: "",
};

const CREATE_USER = gql`
  mutation CreateUser(
    $username: String!
    $firstname: String!
    $lastname: String!
    $email: String!
    $password: String!
  ) {
    createUser(
      username: $username
      firstname: $firstname
      lastname: $lastname
      email: $email
      password: $password
    ) {
      id
      username
      email
    }
  }
`;

class SignUpScreen extends React.Component {
  constructor() {
    super();
    this.state = {
      loading: false,
      error: [],
      isAgreeWithTerms: false,
      hidePassword: true,
      hideCPassword: true,
    };
    this.alertifyRef = React.createRef();
  }

  createUser = (values) => {
    this.setState({ loading: true, error: [] });
    client
      .mutate({
        mutation: CREATE_USER,
        variables: values,
      })
      .then((res) => {
        this.setState({ loading: false });
        this.alertifyRef.current.open();
      })
      .catch((e) => {
        this.setState({ error: e });
        this.setState({ loading: false });
        console.log("🚀 ~ file: SignUpScreen.js:87 ~ SignUpScreen ~ e", e);
      });
  };

  updateTextInput = (text, field) => {
    const state = this.state;
    state[field] = text;
    this.setState(state);
  };

  displayError = (error) => {
    let errorMessage = [];
    try {
      if (error) {
        let { graphQLErrors } = error;
        if (graphQLErrors[0].extensions.category === "validation") {
          this.validationErrors = graphQLErrors[0].extensions.validation;
        }
      }

      for (var key in this.validationErrors) {
        var value = this.validationErrors[key];
        errorMessage.push(
          <Text key={key} style={{ color: "#721c24" }}>
            {"\u2022 "}
            {value[0]}
          </Text>
        );
      }
    } catch (e) {}
    return errorMessage;
  };

  _onDismiss = () => {
    this.props.navigation.goBack();
  };

  handlePassword = () => {
    this.setState({ hidePassword: !this.state.hidePassword });
  };
  confirmPassword = () => {
    this.setState({ hide_confirm_pswd: !this.state.hide_confirm_pswd });
  };

  renderErrorText = (text) => <Text style={styles.error}>{text}</Text>;

  handleOnSubmit = (values, formikActions) => {
    if (!this.state.isAgreeWithTerms) {
      Alert.alert(
        "Terms of services",
        "Please read and agree to the terms presented in the Terms and Conditions agreement",
        [
          {
            text: "OK",
            onPress: () => console.log("OK Pressed"),
          },
        ],
        { cancelable: false }
      );
      return;
    }
    let data = Object.assign({}, values);
    delete data.confirmPassword;
    this.createUser(values);
    formikActions.setSubmitting(false);
  };

  render() {
    let items = [];

    const { isAgreeWithTerms } = this.state;
    const { navigate } = this.props.navigation;
    return (
      <View style={styles.container}>
        <Formik
          initialValues={initailValues}
          validationSchema={signUpSchema}
          onSubmit={this.handleOnSubmit}
        >
          {(props) => (
            <KeyboardAwareScrollView
              style={{ height: Dimensions.get("window").height }}
            >
              <ScrollView
                contentContainerStyle={{
                  flexGrow: 1,
                }}
              >
                <KeyboardAvoidingView>
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                      marginTop: 10,
                    }}
                  >
                    <Headline style={styles.welcomeText}>WELCOME TO</Headline>
                    <View>
                      <Image
                        style={{
                          width: 180,
                          height: 30,
                          resizeMode: "contain",
                        }}
                        source={require("../assets/images/logo-rounded.png")}
                      />
                    </View>
                  </View>
                  {this.state.loading && (
                    <ActivityIndicator
                      size="small"
                      color={color.primaryColor}
                    />
                  )}

                  <View
                    style={{
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: 10,
                    }}
                  >
                    {this.state.error && (
                      <View
                        style={{
                          alignItems: "flex-start",
                          backgroundColor: "#f8d7da",
                          borderRadius: 10,
                          padding: 10,
                        }}
                      >
                        {this.displayError(this.state.error)}
                      </View>
                    )}
                  </View>
                  <View style={{ flex: 1, marginTop: 20 }}>
                    <FontAwesome
                      style={styles.InfoEmailInputIcon}
                      name="user-o"
                      size={22}
                    />
                    <TextInput
                      autoCapitalize="none"
                      theme={{ colors: { primary: "#FF6600" } }}
                      style={styles.InfoEmailInput}
                      label="Username"
                      value={props.values.username}
                      onChangeText={props.handleChange("username")}
                      onBlur={props.handleBlur("username")}
                    />
                  </View>
                  {props.touched.username && props.errors.username
                    ? this.renderErrorText(props.errors.username)
                    : null}
                  <View style={{ flex: 1, marginTop: 5 }}>
                    <FontAwesome
                      style={styles.InfoEmailInputIcon}
                      name="user-o"
                      size={22}
                    ></FontAwesome>
                    <TextInput
                      theme={{ colors: { primary: "#FF6600" } }}
                      style={styles.InfoEmailInput}
                      label="First Name"
                      value={props.values.firstname}
                      onChangeText={props.handleChange("firstname")}
                      onBlur={props.handleBlur("firstname")}
                    />
                  </View>
                  {props.touched.firstname && props.errors.firstname
                    ? this.renderErrorText(props.errors.firstname)
                    : null}
                  <View style={{ flex: 1, marginTop: 5 }}>
                    <FontAwesome
                      style={styles.InfoEmailInputIcon}
                      name="user-o"
                      size={22}
                    ></FontAwesome>
                    <TextInput
                      theme={{ colors: { primary: "#FF6600" } }}
                      style={styles.InfoEmailInput}
                      label="Last Name"
                      value={props.values.lastname}
                      onChangeText={props.handleChange("lastname")}
                      onBlur={props.handleBlur("lastname")}
                    />
                  </View>
                  {props.touched.lastname && props.errors.lastname
                    ? this.renderErrorText(props.errors.lastname)
                    : null}
                  <View style={{ flex: 1, marginTop: 5 }}>
                    <FontAwesome
                      style={styles.InfoEmailInputIcon}
                      name="envelope-o"
                      size={22}
                    />
                    <TextInput
                      autoCapitalize="none"
                      keyboardType="email-address"
                      theme={{ colors: { primary: "#FF6600" } }}
                      style={styles.InfoEmailInput}
                      label="E-mail"
                      value={props.values.email}
                      onChangeText={props.handleChange("email")}
                      onBlur={props.handleBlur("email")}
                    />
                  </View>

                  {props.touched.email && props.errors.email
                    ? this.renderErrorText(props.errors.email)
                    : null}

                  <View style={{ flex: 1, marginTop: 5 }}>
                    <FontAwesome
                      style={styles.InfoEmailInputIcon}
                      name="unlock-alt"
                      size={22}
                    />
                    <TextInput
                      theme={{ colors: { primary: "#FF6600" } }}
                      secureTextEntry={this.state.hidePassword}
                      style={styles.InfoEmailInput}
                      label="Password"
                      value={props.values.password}
                      onChangeText={props.handleChange("password")}
                      onBlur={props.handleBlur("password")}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        this.setState({
                          hidePassword: !this.state.hidePassword,
                        })
                      }
                    >
                      <FontAwesome
                        style={{
                          color: this.state.hidePassword
                            ? "rgba(96,100,109, 1)"
                            : "#FF6600",
                        }}
                        name={this.state.hidePassword ? "eye" : "eye-slash"}
                        size={22}
                      />
                    </TouchableOpacity>
                  </View>
                  {props.touched.password && props.errors.password
                    ? this.renderErrorText(props.errors.password)
                    : null}
                  <View style={{ flex: 1, marginTop: 5 }}>
                    <FontAwesome
                      style={styles.InfoEmailInputIcon}
                      name="unlock-alt"
                      size={22}
                    />
                    <TextInput
                      theme={{ colors: { primary: "#FF6600" } }}
                      secureTextEntry={this.state.hideCPassword}
                      style={styles.InfoEmailInput}
                      label="Confirm Password"
                      value={props.values.confirmPassword}
                      onChangeText={props.handleChange("confirmPassword")}
                      onBlur={props.handleBlur("firstname")}
                    />
                    <TouchableOpacity
                      style={styles.eyeIcon}
                      onPress={() =>
                        this.setState({
                          hideCPassword: !this.state.hideCPassword,
                        })
                      }
                    >
                      <FontAwesome
                        style={{
                          color: this.state.hideCPassword
                            ? "rgba(96,100,109, 1)"
                            : "#FF6600",
                        }}
                        name={this.state.hideCPassword ? "eye" : "eye-slash"}
                        size={22}
                      />
                    </TouchableOpacity>
                    {props.touched.confirmPassword &&
                    props.errors.confirmPassword
                      ? this.renderErrorText(props.errors.confirmPassword)
                      : null}
                  </View>

                  <View
                    style={{
                      flex: 1,
                      marginTop: 20,
                      marginBottom: 10,
                      flexDirection: "row",
                    }}
                  >
                    <Checkbox.Android
                      style={{ margin: 10 }}
                      color={color.primaryColor}
                      status={isAgreeWithTerms ? "checked" : "unchecked"}
                      onPress={() => {
                        this.setState({ isAgreeWithTerms: !isAgreeWithTerms });
                      }}
                    />

                    <View style={{ flex: 1 }}>
                      <Text
                        style={{
                          color: color.blackColor,
                          fontFamily: FontFamily.Regular,
                          fontSize: 15,
                        }}
                      >
                        Confirm that you agree to{" "}
                        <Text
                          style={{ color: "#007AFF" }}
                          onPress={handleTermServicePress}
                        >
                          Procurement League's Terms of Services
                        </Text>{" "}
                        and{" "}
                        <Text
                          style={{ color: "#007AFF" }}
                          onPress={handleTermServicePress}
                        >
                          Privacy Policies
                        </Text>
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 1, marginTop: 10 }}>
                    <TouchableOpacity onPress={props.handleSubmit}>
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
                          Sign Up
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
                        Already have account ?
                      </Text>
                      <TouchableOpacity onPress={() => navigate("SignIn")}>
                        <Text
                          style={{
                            fontSize: 15,
                            color: "#007AFF",
                            fontFamily: FontFamily.Medium,
                            marginLeft: 4,
                          }}
                        >
                          Sign In
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </KeyboardAvoidingView>
              </ScrollView>
              <Alertify
                ref={this.alertifyRef}
                closeText="OK"
                onDismiss={this._onDismiss}
                description={
                  "We can't wait to welcome you to the Procurement League!\n\nPlease check the inbox or spam folder of your email that you used for signing up and click on Activate Account!"
                }
                title={"Success, account created!"}
                items={items}
              />
            </KeyboardAwareScrollView>
          )}
        </Formik>
      </View>
    );
  }
}

SignUpScreen.navigationOptions = {
  headerBackTitleStyle: { fontSize: 18 },
  title: "Sign Up",
};

function handleTermServicePress() {
  Linking.openURL("https://procurementleague.com/term-of-services");
}

const styles = StyleSheet.create({
  container: {
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
    padding: 15,
    borderRadius: 10,
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
  eyeIcon: {
    position: "absolute",
    top: 17,
    right: 10,
    bottom: 0,
    zIndex: 1,
  },
});

export default SignUpScreen;
