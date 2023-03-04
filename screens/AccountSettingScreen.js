import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
} from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ExpoConfigView } from "@expo/samples";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Button, Divider, List } from "react-native-paper";

class AccountSettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
    };
  }
  render() {
    return (
      <ScrollView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <View
          style={{
            flex: 1,
            marginTop: 15,
            marginBottom: 15,
            backgroundColor: "#fff",
          }}
        >
          <View style={styles.accountSettingItems}>
            <View style={{ padding: 15 }}>
              <Text style={styles.accountSettingItemsLabels}>Email</Text>
              <TextInput
                style={{ height: 40 }}
                placeholder="example@gmail.com"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              />
              <Text style={styles.accountSettingItemsLabels}>
                Primary Email
              </Text>
            </View>
            <Divider style={styles.Divider} />
          </View>
          <View style={styles.accountSettingItems}>
            <View style={{ padding: 15 }}>
              <Text style={styles.accountSettingItemsLabels}>Add Email</Text>
              <TextInput
                style={{ height: 40 }}
                placeholder="example@gmail.com"
                onChangeText={(email) => this.setState({ email })}
                value={this.state.email}
              />
            </View>
            <Divider style={styles.Divider} />
            <View style={{ padding: 15 }}>
              <Button
                mode="contained"
                uppercase={false}
                color={color.primaryColor}
                onPress={() => Alert.alert("Add Email")}
              >
                Add Email
              </Button>
            </View>
          </View>
          <View style={styles.accountSettingItems}>
            <View>
              <Text
                style={[styles.accountSettingItemsLabels, styles.passwordLabel]}
              >
                Password
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
              >
                <View style={{ flex: 1 / 4 }}>
                  <Text
                    style={{
                      color: color.blackColor,
                      fontFamily: FontFamily.Regular,
                      fontSize: 14,
                    }}
                  >
                    Current
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={{ height: 40 }}
                    placeholder="Required"
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                  />
                </View>
              </View>
              <Divider style={styles.Divider} />
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-start",
                  alignItems: "center",
                  paddingLeft: 15,
                  paddingRight: 15,
                }}
              >
                <View style={{ flex: 1 / 4 }}>
                  <Text
                    style={{
                      color: color.blackColor,
                      fontFamily: FontFamily.Regular,
                      fontSize: 14,
                    }}
                  >
                    New
                  </Text>
                </View>
                <View style={{ flex: 1 }}>
                  <TextInput
                    style={{ height: 40 }}
                    placeholder="Required"
                    onChangeText={(email) => this.setState({ email })}
                    value={this.state.email}
                  />
                </View>
              </View>
              <Divider style={styles.Divider} />
            </View>
            <View style={{ padding: 15 }}>
              <Button
                mode="contained"
                uppercase={false}
                color={color.primaryColor}
                onPress={() => Alert.alert("Change Password")}
              >
                Change Password
              </Button>
            </View>
          </View>
          <View style={styles.accountSettingItems}>
            <View style={{ padding: 15 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginBottom: 10,
                }}
              >
                <View>
                  <Text style={styles.accountSettingItemsLabels}>
                    Connected Accounts
                  </Text>
                </View>
                <TouchableOpacity onPress={() => Alert.alert("Action Pressed")}>
                  <Text style={styles.accountSettingItemsLabels}>
                    Learn More
                  </Text>
                </TouchableOpacity>
              </View>
              <List.Item
                onPress={() => Alert.alert("Action Pressed")}
                style={[styles.settingListItems, styles.firstListItem]}
                titleStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                title="sara.johnson@gmail.com"
                description="Disconnect"
                descriptionStyle={{
                  fontSize: 14,
                  marginTop: 5,
                  fontFamily: FontFamily.Regular,
                  color: color.grayColor,
                }}
                left={(props) => (
                  <Image
                    style={styles.drawerListImageLeft}
                    source={require("../assets/images/google.png")}
                  />
                )}
              />
              <List.Item
                onPress={() => Alert.alert("Action Pressed")}
                style={styles.settingListItems}
                titleStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                title="Connect LinkedIn Account"
                left={(props) => (
                  <Image
                    style={styles.drawerListImageLeft}
                    source={require("../assets/images/linkedin.png")}
                  />
                )}
              />
              <List.Item
                onPress={() => Alert.alert("Action Pressed")}
                style={styles.settingListItems}
                titleStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                title="Connect to Facebook"
                left={(props) => (
                  <Image
                    style={styles.drawerListImageLeft}
                    source={require("../assets/images/facebook.png")}
                  />
                )}
              />
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}

AccountSettingScreen.navigationOptions = (screenProps) => ({
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
    <Text style={styles.headerPageTitle}>Account Setting</Text>
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
  accountSettingItems: {},
  accountSettingItemsLabels: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 12,
  },
  passwordLabel: {
    paddingLeft: 15,
    paddingRight: 15,
    paddingTop: 15,
  },
  Divider: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
  },
  firstListItem: {
    borderTopWidth: 0,
  },
  settingListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
    padding: 0,
    paddingTop: 5,
    paddingBottom: 5,
  },
  drawerListImageLeft: {
    marginRight: 3,
    marginTop: 5,
    width: 24,
    height: 24,
  },
});

export default AccountSettingScreen;
