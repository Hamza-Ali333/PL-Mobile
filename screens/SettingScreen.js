import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ExpoConfigView } from "@expo/samples";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List } from "react-native-paper";

class SettingScreen extends React.Component {
  chatBackupScreen = () => {
    this.props.navigation.navigate("ChatBackup", { exists: true });
  };

  categorySettingScreen = () => {
    this.props.navigation.navigate("CategorySetting");
  };

  render() {
    const { navigate } = this.props.navigation;
    return (
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <ScrollView style={{ flex: 1 }}>
          <View
            style={{
              flex: 1,
              marginTop: 15,
              marginBottom: 15,
              backgroundColor: "#fff",
            }}
          >
            <List.Item
              onPress={this.chatBackupScreen}
              style={[styles.settingListItems, styles.firstListItem]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Bold,
                color: color.blackColor,
              }}
              title="Chat backup"
              right={(props) => (
                <Image
                  style={styles.drawerListImageRight}
                  source={require("../assets/images/next.png")}
                />
              )}
            />
            <List.Item
              onPress={this.categorySettingScreen}
              style={[styles.settingListItems, styles.firstListItem]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Bold,
                color: color.blackColor,
              }}
              title="Category"
              right={(props) => (
                <Image
                  style={styles.drawerListImageRight}
                  source={require("../assets/images/next.png")}
                />
              )}
            />

            {/*
                <List.Item
                  onPress={() => navigate("AccountSettingScreen")}
                  style={[styles.settingListItems,styles.firstListItem]}
                  titleStyle={{fontSize:16, fontFamily:FontFamily.Regular,color: color.blackColor,}}
                  title="Account"
                  right={props => <Image
                        style={styles.drawerListImageRight}
                        source={require("../assets/images/next.png")}/>}
                />
                <List.Item
                  onPress={() => navigate("PrivacySettingScreen")}
                  style={styles.settingListItems}
                  titleStyle={{fontSize:16, fontFamily:FontFamily.Regular,color: color.blackColor,}}
                  title="Privacy"
                  right={props => <Image
                        style={styles.drawerListImageRight}
                        source={require("../assets/images/next.png")}/>}
                />
                <List.Item
                	onPress={() => navigate("LanguageSettingScreen")}
                  style={styles.settingListItems}
                  titleStyle={{fontSize:16, fontFamily:FontFamily.Regular,color: color.blackColor,}}
                  title="Languages"
                  right={props => <Image
                        style={styles.drawerListImageRight}
                        source={require("../assets/images/next.png")}/>}
                />
              */}
          </View>
        </ScrollView>
      </View>
    );
  }
}

SettingScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Settings</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    borderRadius: 3,
    backgroundColor: color.primaryColor,
    marginRight: 15,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: "#fff",
    fontSize: 13,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  firstListItem: {
    borderTopWidth: 0,
  },
  settingListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
    padding: 15,
  },
  drawerListImageRight: {
    marginRight: 10,
    marginTop: 10,
  },
});

export default SettingScreen;
