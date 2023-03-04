import { AntDesign } from "@expo/vector-icons";
import React, { Component } from "react";
import {
  ActivityIndicator,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import Toast from "react-native-easy-toast";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import client from "../../constants/client.js";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import attendCourseMutation from "../../graphql/mutations/attendCourseMutation.js";
class AttendUpcomingScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      firstname: "",
      lastname: "",
      position: [],
      loading: false,
    };
  }

  onChange = (text, type) => {
    if (type === "email") {
      this.setState({
        email: text,
      });
    } else if (type === "firstname") {
      this.setState({
        firstname: text,
      });
    } else if (type === "lastname") {
      this.setState({
        lastname: text,
      });
    }
  };

  formValidation = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w\w+)+$/;

    let position = [];
    if (this.state.email == "" || this.state.email == null) {
      position[0] = " ";
    } else if (!reg.test(this.state.email)) {
      position[0] = " ";
    } else if (this.state.firstname == "" || this.state.firstname == null) {
      position[1] = " ";
    } else if (this.state.lastname == "" || this.state.lastname == null) {
      position[2] = " ";
    }

    this.setState({ position });
    if (position.length === 0) {
      return true;
    }
    return false;
  };

  onSubmit = () => {
    const { email, firstname, lastname } = this.state;
    let item = this.props.navigation.getParam("item");
    let res = this.formValidation();

    if (res) {
      this.setState({
        loading: true,
      });
      client
        .mutate({
          mutation: attendCourseMutation,
          variables: {
            course_id: item.id,
            email: email,
            firstname: firstname,
            lastname: lastname,
            new_user: false,
          },
        })
        .then((result) => {
          alert("Your information sent to admin!");
          this.setState({
            loading: false,
            email: "",
            firstname: "",
            lastname: "",
          });
          this.props.navigation.navigate("ProcureClasses");
        })
        .catch((error) => {
          this.setState({
            loading: false,
          });
        });
    }
  };

  render() {
    let item = this.props.navigation.getParam("item");
    let imageUrl;
    if (item.course_cover_pic === undefined) {
      imageUrl = "https://procurementleague.com/images/showcase-img-4.png";
    } else {
      imageUrl = item.course_cover_pic;
    }
    return (
      <KeyboardAwareScrollView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        style={styles.container}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps={"handled"}
      >
        <Toast
          ref={(r) => (this.toast = r)}
          style={{ backgroundColor: "gray" }}
          defaultCloseDelay={3000}
          position="center"
          positionValue={200}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#ffffff" }}
        />

        <Image
          source={{
            uri: imageUrl,
          }}
          style={{ height: 200, resizeMode: "cover" }}
        />
        <View style={{ padding: 15 }}>
          <View style={(styles.boxShadow, styles.panel)}>
            <Text
              style={[styles.heading, { textAlign: "center" }]}
              numberOfLines={2}
            >
              {item.course_name}
            </Text>
            <View style={styles.spacing} />
            {/* <Text style={styles.grayText}>21 August 2021, 02:30pm</Text> */}
            <Text style={styles.grayText}>Will be published after 1 Week</Text>
          </View>
          <View style={styles.spacing} />
          {/* <Text style={styles.text}>We'll send this information to school</Text> */}
          <View style={styles.spacing} />
          <View style={(styles.boxShadow, styles.panel)}>
            <View>
              <Text style={styles.label}>Email Address</Text>
              <TextInput
                value={this.state.email}
                style={[
                  styles.TextInput,
                  this.state.position[0]
                    ? { borderColor: "red", borderWidth: 1 }
                    : {},
                ]}
                placeholder="E-mail Address"
                onChangeText={(text) => this.onChange(text, "email")}
              />
            </View>
            <View style={styles.spacing} />
            <View>
              <Text style={styles.label}>First Name</Text>
              <TextInput
                value={this.state.firstname}
                style={[
                  styles.TextInput,
                  this.state.position[1]
                    ? { borderColor: "red", borderWidth: 1 }
                    : {},
                ]}
                placeholder="First Name"
                onChangeText={(text) => this.onChange(text, "firstname")}
              />
            </View>
            <View style={styles.spacing} />
            <View>
              <Text style={styles.label}>Last Name</Text>
              <TextInput
                value={this.state.lastname}
                style={[
                  styles.TextInput,
                  this.state.position[2]
                    ? { borderColor: "red", borderWidth: 1 }
                    : {},
                ]}
                placeholder="Last Name"
                onChangeText={(text) => this.onChange(text, "lastname")}
              />
            </View>
          </View>
          <View style={styles.spacing} />
          <View style={[styles.boxShadow, styles.panel, { marginBottom: 30 }]}>
            <TouchableOpacity
              style={{
                backgroundColor: color.primaryColor,
                height: 40,
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 46,
              }}
              onPress={() => this.onSubmit()}
            >
              {this.state.loading ? (
                <ActivityIndicator size="small" color={color.whiteColor} />
              ) : (
                <Text
                  style={{
                    fontFamily: FontFamily.Medium,
                    color: color.whiteColor,
                  }}
                >
                  Submit
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

AttendUpcomingScreen.navigationOptions = (screenProps) => ({
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
  headerLeft: () => (
    <TouchableOpacity
      style={{
        flex: 1,
        height: 70,
        alignItems: "center",
        justifyContent: "center",
        paddingLeft: 13,
      }}
      onPress={() => screenProps.navigation.goBack()}
    >
      <AntDesign name="close" size={24} color={color.primaryColor} />
    </TouchableOpacity>
  ),
  headerTitle: () => null,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: color.lightGrayColor,
  },
  heading: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 18,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  panel: {
    backgroundColor: color.whiteColor,
    padding: 15,
    borderRadius: 6,
  },
  spacing: {
    height: 13,
  },
  grayText: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 15,
  },
  text: {
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    fontSize: 15,
  },
  label: {
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    fontSize: 13,
    marginBottom: 4,
  },
  TextInput: {
    borderWidth: 1,
    borderColor: color.grayColor,
    borderRadius: 6,
    height: 40,
    paddingHorizontal: 10,
  },
});

export default AttendUpcomingScreen;
