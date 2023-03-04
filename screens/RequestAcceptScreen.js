import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Avatar } from "react-native-paper";

class RequestAcceptScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <ScrollView>
          <View style={styles.threadContainer}>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Avatar.Image
                size={55}
                style={[
                  styles.userProfile,
                  this.props.style,
                  { backgroundColor: "red" },
                ]}
                source={require("../assets/images/answerProfile.png")}
              />
              <View style={{ flex: 1 }}>
                <TouchableOpacity>
                  <Text style={styles.userName}>No Name</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: "#9DA4B4",
                    fontSize: 12,
                    marginTop: 5,
                    fontFamily: FontFamily.Regular,
                  }}
                >
                  kurnoff
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.acceptBtn}>
              <Text style={styles.acceptBtnText}>Accept</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.threadContainer}>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Avatar.Image
                size={55}
                style={[
                  styles.userProfile,
                  this.props.style,
                  { backgroundColor: "red" },
                ]}
                source={require("../assets/images/answerProfile.png")}
              />
              <View style={{ flex: 1 }}>
                <TouchableOpacity>
                  <Text style={styles.userName}>No Name</Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: "#9DA4B4",
                    fontSize: 12,
                    marginTop: 5,
                    fontFamily: FontFamily.Regular,
                  }}
                >
                  kurnoff
                </Text>
              </View>
            </View>
            <TouchableOpacity style={[styles.acceptBtn, styles.notAcceptBtn]}>
              <Text style={[styles.acceptBtnText, styles.notAcceptBtnText]}>
                Accept
              </Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 15,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity></TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

RequestAcceptScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Requests</Text>,
  headerRight: () => (
    <TouchableOpacity style={styles.touchRightHeadText}>
      <Text style={styles.headerRightText}>Accept all</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    padding: 10,
  },
  threadContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#C4C4C4",
    paddingTop: 10,
    paddingBottom: 10,
  },
  userName: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    fontSize: 17,
  },
  userProfile: {
    marginRight: 10,
  },
  acceptBtn: {
    backgroundColor: color.primaryColor,
    borderRadius: 7,
    height: 26,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  notAcceptBtn: {
    backgroundColor: "#F5F6F6",
    borderRadius: 7,
    height: 26,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  notAcceptBtnText: {
    color: color.primaryColor,
  },
  acceptBtnText: {
    fontFamily: FontFamily.Regular,
    color: "#fff",
    fontSize: 12,
  },
});

export default RequestAcceptScreen;
