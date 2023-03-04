import React from "react";
import {
  Platform,
  View,
  Image,
  StyleSheet,
  TextInput,
  Text,
} from "react-native";
import { createStackNavigator } from "react-navigation-stack";
import SignUpScreen from "../screens/SignUpScreen";
import QuestionFeed from "../screens/QuestionFeed";
import TopicScreen from "../screens/TopicScreen";
import TagScreen from "../screens/TagScreen";
import ContributorScreen from "../screens/ContributorScreen";
import EmailScreen from "../screens/EmailScreen";
import AccessScreen from "../screens/AccessScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import MessageScreen from "../screens/MessageScreen";
import BookmarkScreen from "../screens/BookmarkScreen";
import RequestScreen from "../screens/RequestScreen";
import RequestAcceptScreen from "../screens/RequestAcceptScreen";
import SettingScreen from "../screens/SettingScreen";
import AccountSettingScreen from "../screens/AccountSettingScreen";
import PrivacySettingScreen from "../screens/PrivacySettingScreen";
import LanguageSettingScreen from "../screens/LanguageSettingScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import ProfileScreen from "../screens/ProfileScreen";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import Comments from "../components/Comments";
import ChatScreen from "../screens/ChatScreen";
import NotificationAnswerScreen from "../screens/NotificationAnswerScreen";
import RecomendationAnswerScreen from "../screens/RecomendationAnswerScreen";
import NotificationCommentScreen from "../screens/NotificationCommentScreen";
import FeedSearchFilterScreen from "../screens/FeedSearchFilterScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import ChatBackupScreen from "../screens/ChatBackupScreen";
import OfferRequestScreen from "../screens/Offer/OfferRequestScreen";
import OfferInvitationScreen from "../screens/Offer/OfferInvitationScreen";
import PostQuestion from "../screens/PostQuestion";
import OfferAnswerScreen from "../screens/Offer/OfferAnswerScreen";
import OfferAddAnswerScreen from "../screens/Offer/OfferAddAnswerScreen";
import NewScreen from "../screens/Offer/Company/NewScreen";
import MyScreen from "../screens/Offer/Company/MyScreen";
import InAppBrowser from "../screens/InAppBrowser";
import CategorySettingScreen from "../screens/CategorySettingScreen";
import PrivateDiscussionFilterScreen from "../screens/PrivateDiscussionFilterScreen";

const config = Platform.select({
  web: { headerMode: "screen" },
  default: {},
});

const StackNavigator = createStackNavigator(
  {
    Home: { screen: QuestionFeed },
    SignUpScreen: { screen: SignUpScreen },
    MessageScreen: { screen: MessageScreen },
    BookmarkScreen: { screen: BookmarkScreen },
    RequestScreen: { screen: RequestScreen },
    RequestAccept: { screen: RequestAcceptScreen },
    Activities: { screen: ActivitiesScreen },
    SettingScreen: { screen: SettingScreen },
    AccountSettingScreen: { screen: AccountSettingScreen },
    PrivacySettingScreen: { screen: PrivacySettingScreen },
    LanguageSettingScreen: { screen: LanguageSettingScreen },
    CommentsDetail: { screen: Comments },
    UserProfile: { screen: UserProfileScreen },
    NotificationAnswer: { screen: NotificationAnswerScreen },
    RecomendationAnswer: { screen: RecomendationAnswerScreen },
    NotificationComment: { screen: NotificationCommentScreen },
    FeedSearchFilterScreen: { screen: FeedSearchFilterScreen },
    Chat: { screen: ChatScreen },
    ChatBackup: { screen: ChatBackupScreen },
    OfferRequestScreen: { screen: OfferRequestScreen },
    OfferInvitationScreen: { screen: OfferInvitationScreen },
    OfferAnswerScreen: { screen: OfferAnswerScreen },
    OfferAddAnswerScreen: { screen: OfferAddAnswerScreen },
    MyCompany: { screen: MyScreen },
    NewCompany: { screen: NewScreen },
    ContributorScreen: { screen: ContributorScreen },
    TopicScreen: { screen: TopicScreen },
    TagScreen: { screen: TagScreen },
    EmailScreen: { screen: EmailScreen },
    AccessScreen: { screen: AccessScreen },
    Profile: { screen: ProfileScreen },
    EditProfile: { screen: EditProfileScreen },
    NewPost: { screen: PostQuestion },
    InAppBrowser: { screen: InAppBrowser },
    CategorySetting: { screen: CategorySettingScreen },
    PrivateDiscussionFilter: { screen: PrivateDiscussionFilterScreen },
  },
  {
    mode: "modal",
  }
);

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginLeft: 15,
  },
  SearchInputContainer: {
    position: "relative",
    flex: 1,
    textAlignVertical: "center",
  },
  SearchIcon: {
    position: "absolute",
    left: 5,
    top: 8,
    fontSize: 18,
    zIndex: 1,
    color: "#8C8C8C",
  },
  SearchPagesTextInput: {
    maxWidth: "90%",
    height: "75%",
    backgroundColor: "#fff",
    paddingLeft: 30,
    fontSize: 16,
    borderRadius: 4,
    fontFamily: FontFamily.Regular,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 2,
  },
});

export default StackNavigator;
