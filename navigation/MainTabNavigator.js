import React from "react";
import { View, Image, Text, DeviceEventEmitter } from "react-native";

import { createBottomTabNavigator } from "react-navigation-tabs";
import { createStackNavigator } from "react-navigation-stack";
import MessageScreen from "../screens/MessageScreen";
import PostQuestion from "../screens/PostQuestion";
import TopicScreen from "../screens/TopicScreen";
import TagScreen from "../screens/TagScreen";
import ContributorScreen from "../screens/ContributorScreen";
import EmailScreen from "../screens/EmailScreen";
import ProfileScreen from "../screens/ProfileScreen";
import UserProfileScreen from "../screens/UserProfileScreen";
import NewScreen from "../screens/Offer/Company/NewScreen";
import MyScreen from "../screens/Offer/Company/MyScreen";
import MyOfferScreen from "../screens/Offer/MyOfferScreen";
import NewOfferScreen from "../screens/Offer/PostOffer";
import YourVideoScreen from "../screens/YourVideoScreen";
import YourAttachmentScreen from "../screens/Offer/PostOffer/YourAttachmentScreen";
import AddQuestionScreen from "../screens/Offer/PostOffer/AddQuestionScreen";
import AddDescriptionScreen from "../screens/Offer/PostOffer/AddDescriptionScreen";
import LeadTopNavigationScreen from "../screens/LeadTopNavigationScreen";
import FontFamily from "../constants/FontFamily.js";
import StackNavigator from "../navigation/StackNavigator";
import ChatScreen from "../screens/ChatScreen";
import GroupChatScreen from "../screens/GroupChatScreen";
import GroupDetailScreen from "../screens/GroupDetailScreen";
import GroupEditScreen from "../screens/GroupEditScreen";
import ComposeMessageScreen from "../screens/ComposeMessageScreen";
import MenuScreen from "../screens/MenuScreen";
import HelpScreen from "../screens/HelpScreen";
import ActivitiesScreen from "../screens/ActivitiesScreen";
import BookmarkScreen from "../screens/BookmarkScreen";
import LeaderboardScreen from "../screens/LeaderboardScreen";
import FindOfferScreen from "../screens/Offer/FindOfferScreen";
import SavedOfferScreen from "../screens/Offer/SavedOfferScreen";
import ProposalsScreen from "../screens/Offer/ProposalsScreen";
import ActiveOfferScreen from "../screens/Offer/ActiveOfferScreen";
import OfferScreen from "../screens/Offer/OfferScreen";
import AskScreen from "../screens/AskScreen";
import EditProfileScreen from "../screens/EditProfileScreen";
import OfferAddAnswerScreen from "../screens/Offer/OfferAddAnswerScreen";
import OfferAnswerScreen from "../screens/Offer/OfferAnswerScreen";
import NotificationAnswerScreen from "../screens/NotificationAnswerScreen";
import RecomendationAnswerScreen from "../screens/RecomendationAnswerScreen";
import NotificationCommentScreen from "../screens/NotificationCommentScreen";
import AccessScreen from "../screens/AccessScreen";
import SettingScreen from "../screens/SettingScreen";
import ChatBackupScreen from "../screens/ChatBackupScreen";
import QuestionFeed from "../screens/QuestionFeed";
import FeedSearchFilterScreen from "../screens/FeedSearchFilterScreen";
import Recommendations from "../screens/Recommendations";
import Recommendation from "../screens/Recommendation";
import CategorySettingScreen from "../screens/CategorySettingScreen";
import MyClassesScreen from "../screens/classes/MyClassesScreen";
import ClassesScreen from "../screens/classes/ClassesScreen";
import ProcureClassesScreen from "../screens/classes/ProcureClassesScreen";
import ClassSearchScreen from "../screens/classes/ClassSearchScreen";
import SupportFilesScreen from "../screens/classes/SupportFilesScreen";
import ClassSessionScreen from "../screens/classes/ClassSessionScreen";
import BecomeProScreen from "../screens/classes/BecomeProScreen";
import UpcommingClassesScreen from "../screens/classes/UpcommingClassesScreen";
import ClassDetailScreen from "../screens/classes/ClassDetailScreen";
import PaymentPlanScreen from "../screens/classes/PaymentPlanScreen";
import PackagesPlanScreen from "../screens/classes/PackagesPlanScreen";
import ClassAboutScreen from "../screens/classes/ClassAboutScreen";
import GoToClassScreen from "../screens/classes/GoToClassScreen";
import MemberhsipScreen from "../screens/classes/MemberhsipScreen";
import AllReviewsScreen from "../screens/classes/AllReviewsScreen";
import InvoiceScreen from "../screens/classes/InvoiceScreen";
import AttendUpcomingScreen from "../screens/classes/AttendUpcomingScreen";
import CreateGroupScreen from "../screens/CreateGroupScreen";
import GroupMemberScreen from "../screens/GroupMemberScreen";
import DeactivateScreen from "../screens/DeactivateScreen";
import WithBadge from "../components/WithBadge";

const getTabBarIcon = (navigation, focused, tintColor) => {
  const { routeName } = navigation.state;
  let iconName, tabName, iconImage;
  let badgeChanged = "Feed";
  if (routeName === "Feed") {
    if (navigation.isFocused()) {
      iconImage = require("../assets/images/HomeColor.png");
    } else {
      iconImage = require("../assets/images/Home.png");
    }

    tabName = (
      <Text
        style={{
          fontSize: 12,
          color: tintColor,
          fontFamily: FontFamily.Regular,
        }}
      >
        {"Discussion"}
      </Text>
    );
  } else if (routeName === "Settings") {
    badgeChanged = "Settings";
    iconImage = require("../assets/images/Leaderboard.png");
    tabName = (
      <Text
        style={{
          fontSize: 12,
          color: tintColor,
          fontFamily: FontFamily.Regular,
        }}
      >
        Settings
      </Text>
    );
  } else if (routeName === "Post") {
    badgeChanged = "Post";
    if (navigation.isFocused()) {
      iconImage = require("../assets/images/AddQuestion.png");
    } else {
      iconImage = require("../assets/images/AddQuestionColor.png");
    }
  } else if (routeName === "ProcureClasses") {
    badgeChanged = "ProcureClasses";
    if (navigation.isFocused()) {
      iconImage = require("../assets/images/classesColor.png");
    } else {
      iconImage = require("../assets/images/classes.png");
    }

    tabName = (
      <Text
        style={{
          fontSize: 12,
          color: tintColor,
          fontFamily: FontFamily.Regular,
        }}
      >
        Classes
      </Text>
    );
  } else if (routeName === "Offer") {
    badgeChanged = "Offer";
    if (navigation.isFocused()) {
      iconImage = require("../assets/images/offerColor.png");
    } else {
      iconImage = require("../assets/images/offer.png");
    }

    tabName = (
      <Text
        style={{
          fontSize: 12,
          color: tintColor,
          fontFamily: FontFamily.Regular,
        }}
      >
        Offers
      </Text>
    );
  } else if (routeName === "Menu") {
    badgeChanged = "Menu";
    if (navigation.isFocused()) {
      iconImage = require("../assets/images/HamburgerColor.png");
    } else {
      iconImage = require("../assets/images/Hamburger.png");
    }

    tabName = (
      <Text
        style={{
          fontSize: 12,
          color: tintColor,
          fontFamily: FontFamily.Regular,
        }}
      >
        Menu
      </Text>
    );
  } else if (routeName === "MessageList") {
    badgeChanged = "MessageList";
    if (navigation.isFocused()) {
      iconImage = require("../assets/images/InboxColor.png");
    } else {
      iconImage = require("../assets/images/Inbox.png");
    }

    tabName = (
      <Text
        style={{
          fontSize: 12,
          color: tintColor,
          fontFamily: FontFamily.Regular,
        }}
      >
        Inbox
      </Text>
    );
  }

  return (
    <View>
      <View
        style={{
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        {routeName == "MessageList" ? (
          <WithBadge
            navigation={navigation}
            style={{
              position: "absolute",
              right: -6,
              top: 0,
              zIndex: 1,
            }}
          />
        ) : null}
        <Image
          source={iconImage}
          style={{
            borderWidth: 0,
            width: routeName == "Post" ? 47 : 24,
            height: routeName == "Post" ? 44 : 24,
            resizeMode: "contain",
            marginBottom: 5,
          }}
        />
        {tabName}
      </View>
    </View>
  );
};

const PostStack = createStackNavigator({
  AccessScreen: { screen: AccessScreen },
  Ask: { screen: PostQuestion },
  ContributorScreen: { screen: ContributorScreen },
  TopicScreen: { screen: TopicScreen },
  TagScreen: { screen: TagScreen },
  EmailScreen: { screen: EmailScreen },
});

const MenuNavigator = createStackNavigator({
  Menu: { screen: MenuScreen },
  Profile: { screen: ProfileScreen },
  Help: { screen: HelpScreen },
  EditProfile: { screen: EditProfileScreen },
  Activities: { screen: ActivitiesScreen },
  BookmarkScreen: { screen: BookmarkScreen },
  MessageScreen: { screen: MessageScreen },
  Chat: { screen: ChatScreen },
  SettingScreen: { screen: SettingScreen },
  ChatBackup: { screen: ChatBackupScreen },
  ComposeMessage: { screen: ComposeMessageScreen },
  MyOffer: { screen: MyOfferScreen },
  FindOffer: { screen: FindOfferScreen },
  SavedOffer: { screen: SavedOfferScreen },
  Proposals: { screen: ProposalsScreen },
  ActiveOffer: { screen: ActiveOfferScreen },
  NewOffers: { screen: NewOfferScreen },
  NewCompany: { screen: NewScreen },
  MyCompany: { screen: MyScreen },
  YourVideoScreen: { screen: YourVideoScreen },
  YourAttachment: { screen: YourAttachmentScreen },
  AddQuestionScreen: { screen: AddQuestionScreen },
  AddDescriptionScreen: { screen: AddDescriptionScreen },
  ContributorScreen: { screen: ContributorScreen },
  TopicScreen: { screen: TopicScreen },
  TagScreen: { screen: TagScreen },
  EmailScreen: { screen: EmailScreen },
  OfferScreen: { screen: OfferScreen },
  OfferAddAnswerScreen: { screen: OfferAddAnswerScreen },
  OfferAnswerScreen: { screen: OfferAnswerScreen },
  NotificationAnswer: { screen: NotificationAnswerScreen },
  RecomendationAnswer: { screen: RecomendationAnswerScreen },
  NotificationComment: { screen: NotificationCommentScreen },
  UserProfile: { screen: UserProfileScreen },
  FeedSearchFilterScreen: { screen: FeedSearchFilterScreen },
  MyDiscussion: { screen: QuestionFeed },
  Recommendations: { screen: Recommendations },
  Recommendation: { screen: Recommendation },
  CategorySetting: { screen: CategorySettingScreen },
  Memberhsip: { screen: MemberhsipScreen },
  Invoice: { screen: InvoiceScreen },
  NewPost: { screen: PostQuestion },
  AccessScreen: { screen: AccessScreen },
  AllReviews: { screen: AllReviewsScreen },
  // ClassSearch: { screen: ClassSearchScreen },
  // AttendUpcoming: { screen: AttendUpcomingScreen },
  Leaderboard: { screen: LeaderboardScreen },
  UserProfile: { screen: UserProfileScreen },
  LeadTopNavigationScreen: { screen: LeadTopNavigationScreen },
  TagScreen: { screen: TagScreen },
  NotificationAnswer: { screen: NotificationAnswerScreen },
  RecomendationAnswer: { screen: RecomendationAnswerScreen },
  NotificationComment: { screen: NotificationCommentScreen },
  Deactivate: { screen: DeactivateScreen },
});

const ProcureClassesNavigator = createStackNavigator({
  ProcureClasses: { screen: ProcureClassesScreen },
  MyClasses: { screen: MyClassesScreen },
  Classes: { screen: ClassesScreen },
  SupportFiles: { screen: SupportFilesScreen },
  ClassSession: { screen: ClassSessionScreen },
  BecomePro: { screen: BecomeProScreen },
  UpcommingClasses: { screen: UpcommingClassesScreen },
  ClassDetail: { screen: ClassDetailScreen },
  PaymentPlan: { screen: PaymentPlanScreen },
  PackagesPlan: { screen: PackagesPlanScreen },
  ClassAbout: { screen: ClassAboutScreen },
  GoToClass: { screen: GoToClassScreen },
  AllReviews: { screen: AllReviewsScreen },
  ClassSearch: { screen: ClassSearchScreen },
  AttendUpcoming: { screen: AttendUpcomingScreen },
  EditProfile: { screen: EditProfileScreen },
  AccessScreen: { screen: AccessScreen },
});

const MessageListNavigator = createStackNavigator({
  Message: { screen: MessageScreen },
  Chat: { screen: ChatScreen },
  GroupChat: { screen: GroupChatScreen },
  GroupDetail: { screen: GroupDetailScreen },
  GroupEdit: { screen: GroupEditScreen },
  ComposeMessage: { screen: ComposeMessageScreen },
  CreateGroup: { screen: CreateGroupScreen },
  GroupMember: { screen: GroupMemberScreen },
  UserProfile: { screen: UserProfileScreen },
  NotificationAnswer: { screen: NotificationAnswerScreen },
  NotificationComment: { screen: NotificationCommentScreen },
});

const OfferNavigator = createStackNavigator({
  FindOffer: { screen: FindOfferScreen },
  MyOffer: { screen: MyOfferScreen },
  SavedOffer: { screen: SavedOfferScreen },
  Proposals: { screen: ProposalsScreen },
  ActiveOffer: { screen: ActiveOfferScreen },
  OfferScreen: { screen: OfferScreen },
  UserProfile: { screen: UserProfileScreen },
  NewOffers: { screen: NewOfferScreen },
  OfferAddAnswerScreen: { screen: OfferAddAnswerScreen },
});

MessageListNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map((route) => {
      if (route.routeName === "Chat") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
  };
};

MenuNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map((route) => {
      if (
        route.routeName === "AddDescriptionScreen" ||
        route.routeName === "Chat" ||
        route.routeName === "NewPost" ||
        route.routeName === "Recommendation"
      ) {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
  };
};

StackNavigator.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 1) {
    navigation.state.routes.map((route) => {
      if (route.routeName === "Chat" || route.routeName === "PostQuestion") {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
  };
};

PostStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible;
  if (navigation.state.routes.length > 0) {
    navigation.state.routes.map((route) => {
      if (
        route.routeName === "Home" ||
        route.routeName === "TopicScreen" ||
        route.routeName === "TagScreen" ||
        route.routeName === "ContributorScreen" ||
        route.routeName === "EmailScreen" ||
        route.routeName === "Ask" ||
        route.routeName === "AccessScreen"
      ) {
        tabBarVisible = false;
      } else {
        tabBarVisible = true;
      }
    });
  }

  return {
    tabBarVisible,
  };
};

const MainTabNavigator = createBottomTabNavigator(
  {
    Feed: StackNavigator,
    ProcureClasses: ProcureClassesNavigator,
    Post: PostStack,
    MessageList: MessageListNavigator,
    Menu: MenuNavigator,
  },
  {
    initialRouteName: "Feed",
    defaultNavigationOptions: ({ navigation }) => ({
      tabBarIcon: ({ focused, tintColor }) =>
        getTabBarIcon(navigation, focused, tintColor),
      tabBarOnPress: ({ navigation, defaultHandler }) => {
        if (navigation.state.index === 0 && navigation.isFocused()) {
          DeviceEventEmitter.emit("resetFilter");
          const navigationInRoute = navigation.state.routes[0];
          if (
            !!navigationInRoute &&
            !!navigationInRoute.params &&
            !!navigationInRoute.params.scrollToTop
          ) {
            navigationInRoute.params.scrollToTop();
          }
        } else {
        }

        defaultHandler();
      },
    }),

    tabBarOptions: {
      keyboardHidesTabBar: true,
      showLabel: false,
      activeTintColor: "#FF8635",
      inactiveTintColor: "#9DA4B4",
      style: {
        borderTopWidth: 0,
        borderTopLeftRadius: 20,
        borderTopRightRadius: 20,
        height: 60,
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 7,
        },
        shadowOpacity: 0.43,
        shadowRadius: 9.51,
        elevation: 15,
      },
    },
  }
);

export default MainTabNavigator;
