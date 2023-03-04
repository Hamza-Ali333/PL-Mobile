import React from "react";
import { Platform, View, Image, Text, Dimensions } from "react-native";
import { createAppContainer } from "react-navigation";
import { createDrawerNavigator } from "react-navigation-drawer";
import TabBarIcon from "../components/TabBarIcon";
import SignUpScreen from "../screens/SignUpScreen";
import QuestionFeed from "../screens/QuestionFeed";
import ChatScreen from "../screens/ChatScreen";
import SidebarMenuScreen from "../screens/SidebarMenuScreen";
import MainTabNavigator from "./MainTabNavigator";
import WithoutTabNavigator from "./WithoutTabNavigator";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const DrawerNavigator = createDrawerNavigator(
  {
    Home: {
      screen: MainTabNavigator,
    },
  },
  {
    drawerLockMode: "locked-closed",
    contentComponent: SidebarMenuScreen,
    drawerType: "front",
    drawerBackgroundColor: "transparent",
    overlayColor: "#E2E2E2",
    drawerWidth: Dimensions.get("window").width / 1,
  }
);

export default DrawerNavigator;
