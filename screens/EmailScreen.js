import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Snackbar } from "react-native-paper";

class EmailScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: "",
      text: "",
      visible: false,
      users: [],
    };
  }

  componentDidMount() {
    this.setState({ users: this.props.navigation.getParam("peoples") });
  }

  addEmail = () => {
    let reg = /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/;
    if (reg.test(this.state.text) === false) {
      this.setState({
        visible: true,
        message: "Please enter valid email address",
      });
      return false;
    }

    let peoples = this.state.users;

    let found = peoples.find((data) => data === this.state.text);

    if (found) {
      this.setState({ visible: true, message: "Email already entered" });
      return false;
    }

    peoples.push(this.state.text);
    this.setState({ users: peoples, text: "" });
    this.props.navigation.state.params.updateEmails(peoples);
  };

  removeEmail = (index) => {
    var array = [...this.state.users];
    array.splice(index, 1);
    this.setState({ users: array });
    this.props.navigation.state.params.updateEmails(array);
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Snackbar
          visible={this.state.visible}
          onDismiss={() => this.setState({ visible: false })}
        >
          {this.state.message}
        </Snackbar>
        <ScrollView style={styles.EmailScreenPage}>
          <View style={styles.HotPagesSearchInputContainer}>
            <TextInput
              style={styles.HotPagesTextInput}
              value={this.state.text}
              placeholder="Enter email and invite to answer"
              onChangeText={(text) => this.setState({ text })}
            />
            <TouchableOpacity
              onPress={this.addEmail}
              style={{
                position: "absolute",
                top: 10,
                right: 25,
                backgroundColor: "#F8F8F8",
              }}
            >
              <AntDesign color="grey" size={22} name="pluscircleo" />
            </TouchableOpacity>
          </View>

          {this.state.users.map((person, index) => (
            <View style={styles.ListItems} key={index}>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={styles.emailText}>{person}</Text>
                <TouchableOpacity
                  onPress={() => this.removeEmail(index)}
                  style={styles.toggleIcon}
                >
                  <AntDesign style={styles.plusIcon} name="check"></AntDesign>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }
}

EmailScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>E-mail</Text>,
  headerRight: () => (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={() => screenProps.navigation.goBack()}
    >
      <Text style={styles.headerRightText}>Next</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    borderRadius: 3,
    borderColor: color.primaryColor,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  EmailScreenPage: {
    flex: 1,
    backgroundColor: "#fff",
  },
  HotPagesSearchInputContainer: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    flex: 1,
    justifyContent: "flex-end",
    flexDirection: "row",
  },
  HotPagesTextInput: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 10,
    fontSize: 16,
    height: 40,
    fontFamily: FontFamily.Regular,
  },
  ListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
  },
  toggleIcon: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
  },
  emailText: {
    width: "90%",
    color: color.blackColor,
    fontSize: 17,
    letterSpacing: 0.6,
  },
  plusIcon: {
    color: color.primaryColor,
    fontSize: 20,
  },
  checkIcon: {
    color: color.grayColor,
    fontSize: 22,
  },
});

export default EmailScreen;
