import React from "react";
import {
  Platform,
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import { createAppContainer, createBottomTabNavigator } from "react-navigation";
import { createStackNavigator } from "react-navigation-stack";
import TabBarIcon from "../components/TabBarIcon";
import HomeScreen from "../screens/HomeScreen";
import SignUpScreen from "../screens/SignUpScreen";
import QuestionFeed from "../screens/QuestionFeed";
import QuestionDetail from "../screens/QuestionDetail";
import PostQuestion from "../screens/PostQuestion";
import TopicScreen from "../screens/TopicScreen";
import TagScreen from "../screens/TagScreen";
import ContributorScreen from "../screens/ContributorScreen";
import EmailScreen from "../screens/EmailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import MessageScreen from "../screens/MessageScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import BookmarkScreen from "../screens/BookmarkScreen";
import SettingScreen from "../screens/SettingScreen";
import LanguageSettingScreen from "../screens/LanguageSettingScreen";
import PrivacySettingScreen from "../screens/PrivacySettingScreen";
import HumburgerIcon from "./drawer";
import PlusIconAddQuestion from "./PlusIconAddQuestion";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import ProfilePageHeader from "../components/ProfilePageHeader";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const StackNavigator = createStackNavigator({
  QuestionFeed: {
    screen: QuestionFeed,
    navigationOptions: ({ navigation }) => {
      return {
        headerBackTitleStyle: { fontSize: 18 },
        headerLeft: () => <HumburgerIcon navigationProps={navigation} />,
        headerTitle: () => (
          <View style={styles.SearchInputContainer}>
            <AntDesign style={styles.SearchIcon} name="search1"></AntDesign>
            <TextInput
              style={styles.SearchPagesTextInput}
              placeholder="Search"
            />
          </View>
        ),
        headerRight: () => <PlusIconAddQuestion navigationProps={navigation} />,
      };
    },
  },
  SignUpScreen: { screen: SignUpScreen },
  QuestionDetail: { screen: QuestionDetail },
  EditProfileScreen: { screen: EditProfileScreen },
  MessageScreen: { screen: MessageScreen },
  ActivitiesScreen: { screen: ActivitiesScreen },
  BookmarkScreen: { screen: BookmarkScreen },
  SettingScreen: { screen: SettingScreen },
  LanguageSettingScreen: { screen: LanguageSettingScreen },
  PrivacySettingScreen: { screen: PrivacySettingScreen },
  ProfileScreen: {
    screen: ProfileScreen,
    navigationOptions: ({ navigation }) => {
      return {
        headerTitle: () => <Text style={styles.headerPageTitle}>Sara</Text>,
        headerRight: () => <ProfilePageHeader navigationProps={navigation} />,
      };
    },
  },
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  SearchInputContainer: {
    position: "relative",
    flex: 1,
    textAlignVertical: "center",
  },
  SearchIcon: {
    position: "absolute",
    left: 5,
    top: 5,
    fontSize: 20,
    zIndex: 1,
    color: "#8C8C8C",
  },
  SearchPagesTextInput: {
    width: 300,
    height: "60%",
    backgroundColor: "#fff",
    paddingLeft: 30,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
});

export default StackNavigator;
