import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ScrollView,
  ImageBackground,
  Dimensions,
} from "react-native";
import { TabView, TabBar } from "react-native-tab-view";
import color from "../constants/Colors.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import FontFamily from "../constants/FontFamily.js";
import UserProfilePageQuestionsTabs from "../components/UserProfilePageQuestionsTabs";
import UserProfilePageAnswerTabs from "../components/UserProfilePageAnswerTabs";
import UserProfilePageAboutTabs from "../components/UserProfilePageAboutTabs";
import FollowUnfollowUser from "../components/FollowUnfollowUser";
import { Divider, List } from "react-native-paper";
import getUser from "../graphql/queries/getUser";
import {
  _handleFollowerPressed,
  _handleUnfollowerPressed,
} from "../components/CombineFunction";
import { Query } from "react-apollo";
import * as Network from "expo-network";
import { LinearGradient } from "expo-linear-gradient";
import capitalize from "../helper/capitalize";
import link from "../constants/link";
import ProfileSkeleton from "../components/Skeleton/ProfileSkeleton.js";
import gstyles from "../constants/gstyles.js";
import SinglePost from "../components/Skeleton/SinglePost.js";
import NoWifi from "../components/NoWifi/index.js";

const windowHeight = Dimensions.get("window").height;

const getTabBarIcon = (props, index, routes, data) => {
  const { route } = props;
  if (route.key === "questions") {
    let tabIndex = routes.findIndex((data) => data.key === "questions");
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Image
          style={{ width: 15, height: 15, marginLeft: 6 }}
          source={
            index === tabIndex
              ? require("../assets/images/answerIconColor.png")
              : require("../assets/images/answerIcon.png")
          }
        /> */}
        <Text
          style={[
            {
              color: index === tabIndex ? color.primaryColor : color.grayColor,
            },
            styles.scrollViewText,
          ]}
        >
          {" "}
          {data.user.questions.paginatorInfo.total === 0
            ? "No"
            : data.user.questions.paginatorInfo.total}{" "}
          {data.user.questions.paginatorInfo.total > 1
            ? "Questions"
            : "Question"}
        </Text>
      </View>
    );
  } else if (route.key === "answers") {
    let tabIndex = routes.findIndex((data) => data.key === "answers");
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {/* <Image
          style={{ width: 15, height: 15, marginLeft: 6 }}
          source={
            index === tabIndex
              ? require("../assets/images/lineToggleColor.png")
              : require("../assets/images/lineToggle.png")
          }
        /> */}
        <Text
          style={[
            {
              color: index === tabIndex ? color.primaryColor : color.grayColor,
            },
            styles.scrollViewText,
          ]}
        >
          {" "}
          {data.user.answers.paginatorInfo.total === 0
            ? "No"
            : data.user.answers.paginatorInfo.total}{" "}
          {data.user.answers.paginatorInfo.total > 1 ? "Answers" : "Answer"}
        </Text>
      </View>
    );
  } else if (route.key === "about") {
    let tabIndex = routes.findIndex((data) => data.key === "about");
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ width: 15, height: 15, marginLeft: 6 }}
          source={
            index === tabIndex
              ? require("../assets/images/AdminColor.png")
              : require("../assets/images/Admin.png")
          }
        />
      </View>
    );
  }
};

class UserProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 1,
      tab: 1,
      user_id: this.props.navigation.getParam("user_id"),
      me: {},
      show: false,
      index: 0,
      routes: [{ key: "questions" }, { key: "answers" }],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  changeTab = (tab) => {
    this.setState({ opacity: 0.1, tab: tab });
    setTimeout(() => {
      this.setState({ opacity: 1 });
    }, 1000);
  };

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        if (this.state.user_id !== this.props.navigation.getParam("user_id")) {
          this.scrollViewRef.scrollTo({ x: 0, y: 0, animated: true });
        }
        this.setState(
          { user_id: this.props.navigation.getParam("user_id") },
          this.refresh
        );
      }
    }
  };

  refresh = () => {
    this.refetch();
  };

  setIndex = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case "questions":
        return (
          <UserProfilePageQuestionsTabs
            index={this.state.index}
            navigate={this.props.navigation}
            user_id={this.state.user_id}
          />
        );
      case "answers":
        return (
          <UserProfilePageAnswerTabs
            index={this.state.index}
            navigate={this.props.navigation}
            user_id={this.state.user_id}
          />
        );
      case "about":
        return (
          <UserProfilePageAboutTabs
            index={this.state.index}
            navigate={this.props.navigation}
            user_id={this.state.user_id}
          />
        );
      default:
        return null;
    }
  };

  render() {
    const { index, routes } = this.state;
    return (
      <Query query={getUser} variables={{ id: this.state.user_id }}>
        {({ loading, error, data, refetch }) => {
          this.refetch = refetch;
          if (loading)
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  backgroundColor: "#fff",
                }}
              >
                <ProfileSkeleton />
                <View style={gstyles.h_10} />
                <Divider />
                <View style={gstyles.h_10} />
                <SinglePost />
              </View>
            );

          if (error)
            return (
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                }}
              >
                <NoWifi />
              </View>
            );

          return (
            <ScrollView
              style={{ flex: 1, flexGrow: 1, backgroundColor: "#fff" }}
              ref={(ref) => {
                this.scrollViewRef = ref;
              }}
            >
              {data.user.large_photo ? (
                <View
                  style={{ width: "100%", height: 350, resizeMode: "cover" }}
                >
                  <ImageBackground
                    style={{ flex: 1 }}
                    source={{
                      uri:
                        link.url +
                        "/uploads/profile_images/" +
                        data.user.large_photo,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        justifyContent: "flex-end",
                        padding: 20,
                      }}
                    >
                      <Text style={styles.profileName}>
                        {capitalize(data.user.firstname)}{" "}
                        {capitalize(data.user.lastname)}
                      </Text>
                      {
                        <Text style={styles.profileFieldType}>
                          @{data.user.username}
                        </Text>
                      }
                    </View>
                  </ImageBackground>
                </View>
              ) : (
                <View
                  style={{ flex: 1, justifyContent: "flex-end", padding: 20 }}
                >
                  <Text
                    style={[
                      styles.profileName,
                      {
                        color: color.primaryColor,
                        textShadowColor: "rgba(0, 0, 0, 0)",
                      },
                    ]}
                  >
                    {capitalize(data.user.firstname)}{" "}
                    {capitalize(data.user.lastname)}
                  </Text>
                  {
                    <Text
                      style={[
                        styles.profileFieldType,
                        {
                          color: color.primaryColor,
                          textShadowColor: "rgba(0, 0, 0, 0.10)",
                        },
                      ]}
                    >
                      @{data.user.username}
                    </Text>
                  }
                </View>
              )}

              <View style={styles.profileContainer}>
                {this.state.me.id !== data.user.id && (
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        this.props.navigation.navigate("Chat", {
                          data: data.user,
                        })
                      }
                      style={{ flex: 1, marginRight: 3 }}
                    >
                      <LinearGradient
                        style={styles.sendMessage}
                        colors={["#FF8635", "#FF7735", "#FF6635"]}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 1 }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontFamily: FontFamily.Regular,
                          }}
                        >
                          Message
                        </Text>
                        <Image
                          style={{
                            width: 26,
                            height: 26,
                            resizeMode: "cover",
                            marginLeft: 6,
                          }}
                          source={require("../assets/images/send.png")}
                        />
                      </LinearGradient>
                    </TouchableOpacity>
                    <View style={{ flex: 1, marginLeft: 3 }}>
                      <FollowUnfollowUser
                        item={data.user}
                        _handleFollowerPressed={_handleFollowerPressed}
                        _handleUnfollowerPressed={_handleUnfollowerPressed}
                      />
                    </View>
                  </View>
                )}
              </View>
              <View style={styles.scrollViewTabs}>
                <TabView
                  tabBarPosition="top"
                  style={{ height: windowHeight }}
                  navigationState={{ index, routes }}
                  renderScene={this.renderScene}
                  onIndexChange={this.setIndex}
                  renderTabBar={(props) => (
                    <TabBar
                      style={styles.TabBar}
                      {...props}
                      navigation={this.props.navigation}
                      indicatorStyle={{
                        backgroundColor: color.primaryColor,
                      }}
                      renderIcon={(props) =>
                        getTabBarIcon(props, index, routes, data)
                      }
                    />
                  )}
                />
              </View>

              {data.user.workboards.data.length > 0 && (
                <View style={styles.experienceContainer}>
                  <View style={styles.experienceContainerHeader}>
                    <Text
                      style={{
                        color: color.blackColor,
                        fontSize: 18,
                        fontFamily: FontFamily.Bold,
                      }}
                    >
                      Experience
                    </Text>
                  </View>

                  {data.user.workboards.data.map((item, key) => (
                    <View
                      key={key}
                      style={{ flex: 1, flexDirection: "row", marginTop: 20 }}
                    >
                      <Image
                        style={styles.experienceUserImage}
                        source={{
                          uri:
                            "https://procurementleague.com/uploads/profile_images/" +
                            data.user.profile_photo,
                        }}
                      />
                      <View
                        style={{
                          flex: 1,
                          paddingBottom: 10,
                          borderBottomWidth: 1,
                          borderColor: "#D6D6D6",
                        }}
                      >
                        <Text style={styles.experienceUserName}>
                          {item.job_title} {item.company_name}
                        </Text>
                        <Text style={styles.experienceUserDescription}>
                          {item.work_experience}
                        </Text>
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            marginTop: 4,
                          }}
                        >
                          <Text style={styles.experienceUserDate}>
                            {item.start_date} - {item.end_date}
                          </Text>
                          <Text style={styles.experienceUserDuration}>
                            {item.experience_year} Years
                          </Text>
                        </View>
                      </View>
                    </View>
                  ))}
                </View>
              )}
              {data.user.workboards.data.length > 0 &&
                data.user.workboards.data[0].skills.data.length > 0 && (
                  <View style={styles.skillsContainer}>
                    <View style={styles.skillsContainerHeader}>
                      <Text
                        style={{
                          color: color.blackColor,
                          fontSize: 18,
                          fontFamily: FontFamily.Bold,
                        }}
                      >
                        Skills
                      </Text>
                    </View>

                    {data.user.workboards.data.map((item, key) =>
                      item.skills.data.map((sub, k) => (
                        <List.Item
                          key={k}
                          style={[
                            styles.skillsListItems,
                            styles.firstSkillsListItems,
                          ]}
                          titleStyle={{
                            fontSize: 13,
                            fontFamily: FontFamily.Regular,
                            color: color.blackColor,
                          }}
                          title={sub.title}
                        />
                      ))
                    )}
                  </View>
                )}
            </ScrollView>
          );
        }}
      </Query>
    );
  }
}

UserProfileScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Profile</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  profileContainer: {
    marginTop: 0,
    paddingTop: 13,
    paddingRight: 15,
    paddingLeft: 15,
    paddingBottom: 13,
    backgroundColor: "#fff",
  },
  profileInfoContainer: {
    flexDirection: "row",
    marginBottom: 5,
  },
  profileImage: {
    marginRight: 10,
  },
  profileName: {
    fontSize: 18,
    fontFamily: FontFamily.Bold,
    color: "#fff",
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  profileFieldType: {
    fontSize: 11,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    color: "#fff",
    marginTop: 4,
    marginBottom: 5,
    textShadowColor: "rgba(0, 0, 0, 0.75)",
    textShadowOffset: { width: -1, height: 1 },
    textShadowRadius: 1,
  },
  userDescritpion: {
    fontSize: 13,
    fontFamily: FontFamily.Regular,
    color: "#424242",
    lineHeight: 20,
  },
  sendMessage: {
    borderRadius: 11,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
  },
  scrollViewTabs: {
    backgroundColor: "#fff",
  },
  scrollView: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderWidth: 1,
    borderColor: "#D6D6D6",
    height: 70,
    alignItems: "center",
  },
  scrollViewText: {
    textAlign: "center",
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
  experienceContainer: {
    marginTop: 10,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
  },
  experienceContainerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  experienceUserImage: {
    marginRight: 10,
    width: 38,
    height: 38,
    borderRadius: 30,
  },
  experienceUserName: {
    fontSize: 15,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.5,
  },
  experienceUserDescription: {
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    fontSize: 12,
  },
  experienceUserDate: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 12,
  },
  experienceUserDuration: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 12,
    marginLeft: 15,
  },
  skillsContainer: {
    marginTop: 10,
    marginBottom: 10,
    paddingLeft: 15,
    paddingTop: 15,
    paddingBottom: 15,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  skillsContainerHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  firstSkillsListItems: {
    borderTopWidth: 0,
  },
  skillsListItems: {
    borderTopWidth: 1,
    borderColor: "#D6D6D6",
    paddingLeft: 0,
  },
  socialLinks: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#F3F5FB",
    borderRadius: 6,
    marginRight: 15,
    width: 35,
    height: 35,
  },
  TabBar: {
    backgroundColor: "#fff",
    elevation: 0,
    borderBottomWidth: 0,
    borderColor: "#D6D6D6",
  },
});

export default UserProfileScreen;
