import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ExpoConfigView } from "@expo/samples";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List } from "react-native-paper";

class LanguageSettingScreen extends React.Component {
  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <List.Item
            style={[styles.settingListItems, styles.firstListItem]}
            titleStyle={{
              fontSize: 16,
              fontFamily: FontFamily.Regular,
              color: color.blackColor,
            }}
            title="English"
            descriptionStyle={{
              fontSize: 14,
              fontFamily: FontFamily.Regular,
              color: color.grayColor,
              marginTop: 4,
            }}
            description="Primary"
            left={(props) => (
              <Text
                style={[styles.drawerLanguageText, styles.primaryLanguageText]}
              >
                EN
              </Text>
            )}
          />
          <List.Item
            style={styles.settingListItems}
            titleStyle={{
              fontSize: 16,
              fontFamily: FontFamily.Regular,
              color: color.blackColor,
            }}
            title="Español"
            left={(props) => (
              <Text
                style={[styles.drawerLanguageText, styles.EspañolLanguageText]}
              >
                ES
              </Text>
            )}
          />
          <List.Item
            style={styles.settingListItems}
            titleStyle={{
              fontSize: 16,
              fontFamily: FontFamily.Regular,
              color: color.blackColor,
            }}
            title="Français"
            left={(props) => (
              <Text
                style={[styles.drawerLanguageText, styles.FrançaisLanguageText]}
              >
                FR
              </Text>
            )}
          />
          <List.Item
            style={styles.settingListItems}
            titleStyle={{
              fontSize: 16,
              fontFamily: FontFamily.Regular,
              color: color.blackColor,
            }}
            title="Deutsch"
            left={(props) => (
              <Text
                style={[styles.drawerLanguageText, styles.DeutschLanguageText]}
              >
                DE
              </Text>
            )}
          />
          <List.Item
            style={styles.settingListItems}
            titleStyle={{
              fontSize: 16,
              fontFamily: FontFamily.Regular,
              color: color.blackColor,
            }}
            title="Italiano"
            left={(props) => (
              <Text
                style={[styles.drawerLanguageText, styles.ItalianoLanguageText]}
              >
                IT
              </Text>
            )}
          />
          <List.Item
            style={styles.settingListItems}
            titleStyle={{
              fontSize: 16,
              fontFamily: FontFamily.Regular,
              color: color.blackColor,
            }}
            title="English"
            left={(props) => (
              <Text
                style={[styles.drawerLanguageText, styles.EnglishLanguageText]}
              >
                EN
              </Text>
            )}
          />
        </View>
      </View>
    );
  }
}

LanguageSettingScreen.navigationOptions = (screenProps) => ({
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
    <Text style={styles.headerPageTitle}>Language Settings</Text>
  ),
  headerRight: () => (
    <TouchableOpacity>
      <Image
        style={styles.headerRightText}
        source={require("../assets/images/search.png")}
      />
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
    marginRight: 15,
  },
  firstListItem: {
    borderTopWidth: 0,
  },
  settingListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
  },
  drawerLanguageText: {
    marginRight: 10,
    width: 30,
    height: 30,
    borderRadius: 20,
    color: "#fff",
    textAlign: "center",
    textAlignVertical: "center",
  },
  primaryLanguageText: {
    marginTop: 5,
    backgroundColor: "#00B0FF",
  },
  EspañolLanguageText: {
    backgroundColor: "#D2A40D",
  },
  FrançaisLanguageText: {
    backgroundColor: "#2000FF",
  },
  DeutschLanguageText: {
    backgroundColor: "#FFBB00",
  },
  ItalianoLanguageText: {
    backgroundColor: "#0CA201",
  },
  EnglishLanguageText: {
    backgroundColor: "#00B0FF",
  },
});

export default LanguageSettingScreen;
