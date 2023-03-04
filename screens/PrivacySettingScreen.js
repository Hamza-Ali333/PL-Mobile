import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ExpoConfigView } from "@expo/samples";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Switch } from "react-native-paper";

class PrivacySettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isSwitchOne: true,
      isSwitchTwo: false,
      isSwitchThree: true,
    };
  }

  render() {
    const { isSwitchOne, isSwitchTwo, isSwitchThree } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            marginBottom: 15,
            backgroundColor: "#fff",
            padding: 15,
          }}
        >
          <Text style={styles.PrivacyText}>Privacy Settings</Text>
          <View style={[styles.privacyListItems, styles.firstListItem]}>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyDescription}>
                Allow search engines to index your name.
              </Text>
            </View>
            <View style={{ flex: 1 / 6 }}>
              <Switch
                style={styles.switchToggle}
                value={isSwitchOne}
                color={color.primaryColor}
                onValueChange={() => {
                  this.setState({ isSwitchOne: !isSwitchOne });
                }}
              />
            </View>
          </View>
          <View style={styles.privacyListItems}>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyDescription}>
                Allow other people to see when you are writing an answer.{" "}
              </Text>
            </View>
            <View style={{ flex: 1 / 6 }}>
              <Switch
                style={styles.switchToggle}
                value={isSwitchTwo}
                color={color.primaryColor}
                onValueChange={() => {
                  this.setState({ isSwitchTwo: !isSwitchTwo });
                }}
              />
            </View>
          </View>
          <View style={styles.privacyListItems}>
            <View style={{ flex: 1 }}>
              <Text style={styles.privacyDescription}>
                Allow search engines to index your name.{" "}
              </Text>
            </View>
            <View style={{ flex: 1 / 6 }}>
              <Switch
                style={styles.switchToggle}
                value={isSwitchThree}
                color={color.primaryColor}
                onValueChange={() => {
                  this.setState({ isSwitchThree: !isSwitchThree });
                }}
              />
            </View>
          </View>
        </View>
      </View>
    );
  }
}

PrivacySettingScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => (
    <Text style={styles.headerPageTitle}>Privacy Settings</Text>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  PrivacyText: {
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 16,
    marginBottom: 10,
  },
  firstListItem: {
    borderTopWidth: 0,
  },
  privacyListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
    flexDirection: "row",
    justifyContent: "flex-start",
    alignItems: "center",
    height: 60,
  },
  privacyDescription: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 14,
    letterSpacing: 0.8,
    paddingRight: 20,
  },
});

export default PrivacySettingScreen;
