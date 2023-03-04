import AsyncStorage from "@react-native-async-storage/async-storage";
import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";
import { ImageBackground, StyleSheet, Text, View } from "react-native";
import { Divider } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import NoWifi from "../components/NoWifi/index.js";
import ProfilePageAnswerTabs from "../components/ProfilePageAnswerTabs";
import ProfilePageHeader from "../components/ProfilePageHeader";
import ProfilePageQuestionsTabs from "../components/ProfilePageQuestionsTabs";
import ProfileSkeleton from "../components/Skeleton/ProfileSkeleton.js";
import SinglePost from "../components/Skeleton/SinglePost.js";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import gstyles from "../constants/gstyles.js";
import link from "../constants/link";
import getTotalQuestionAndAwnser from "../graphql/queries/getTotalQuestionAndAwnser.js";
import client from "../constants/client";
import capitalize from "../helper/capitalize";

const PostsQuery = gql`
  query {
    me {
      id
      profile_photo
      large_photo: profile_photo(size: "large")
      small_photo: profile_photo(size: "small")
      firstname
      lastname
      username
      tagline
      color
      is_follower
      description
      country
      city
      timestamp
      companies(first: 10, page: 0) {
        data {
          id
          title
          logo
        }
      }
      questions(first: 1) {
        data {
          id
          question
        }
        paginatorInfo {
          total
          count
          currentPage
          lastPage
        }
      }
      answers(first: 1) {
        data {
          id
          answer
        }
        paginatorInfo {
          total
          count
          currentPage
          lastPage
        }
      }
      followers(first: 5) {
        data {
          id
        }
        paginatorInfo {
          total
        }
      }
      workboards(first: 3) {
        data {
          job_title
          company_id
          address
          experience_year
          work_experience
          job_achievement
          company_name
          start_date
          progress
          skills(first: 3) {
            data {
              id
              title
            }
          }
        }
      }
    }
  }
`;

const getTabBarIcon = (props, index, routes, data, totalQuestion) => {
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
        <Text
          style={[
            {
              color: index === tabIndex ? color.primaryColor : color.grayColor,
            },
            styles.scrollViewText,
          ]}
        >
          {" "}
          {totalQuestion === 0 ? "No" : totalQuestion}{" "}
          {data.me.questions.paginatorInfo.total > 1 ? "Questions" : "Question"}
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
        <Text
          style={[
            {
              color: index === tabIndex ? color.primaryColor : color.grayColor,
            },
            styles.scrollViewText,
          ]}
        >
          {" "}
          {data.me.answers.paginatorInfo.total === 0
            ? "No"
            : data.me.answers.paginatorInfo.total}{" "}
          {data.me.answers.paginatorInfo.total > 1 ? "Answers" : "Answer"}
        </Text>
      </View>
    );
  }
};

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      totalQuestion: 0,
      routes: [{ key: "questions" }, { key: "answers" }],
    };
    this.refetch = [];
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.props.navigation.setParams({ firstname: res.firstname });
    });

    this.props.navigation.addListener(
      "didFocus",
      this.getTotalOfQuestionAndAwnser
    );
  }

  getTotalOfQuestionAndAwnser = () => {
    client
      .query({
        query: getTotalQuestionAndAwnser,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        console.log(
          "🚀 ~ file: ProfileScreen.js:186 ~ ProfileScreen ~ .then ~ result",
          result.data.me.questions.paginatorInfo
        );
        this.setState({
          totalQuestion: result.data.me.questions.paginatorInfo.total,
        });
      })
      .catch((e) => {
        console.log(
          "🚀 ~ file: ProfileScreen.js:184 ~ ProfileScreen ~ .then ~ e",
          e
        );
      });
  };

  _onRefresh = () => {
    // (this.refetch || []).map((item, _) => {
    //   item && item();
    // });
    // this.refetch && this.refetch();
  };

  onDelete = () => {
    this.getTotalOfQuestionAndAwnser();
  };

  confirmQuestionDelete = () => {
    // this.refetch && this.refetch();
    this.refetch.map((item, _) => {
      item();
    });
  };

  changeTab = (tab) => {
    this.setState({ opacity: 0.1, tab: tab });
    setTimeout(() => {
      this.setState({ opacity: 1 });
    }, 1000);
  };

  setIndex = (index) => {
    this.setState({ index });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case "questions":
        return (
          <ProfilePageQuestionsTabs
            onDelete={this.onDelete}
            navigate={this.props.navigation}
            confirmQuestionDelete={this.confirmQuestionDelete}
          />
        );
      case "answers":
        return <ProfilePageAnswerTabs navigate={this.props.navigation} />;
      default:
        return null;
    }
  };

  render() {
    const { tab, index, routes } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Query query={PostsQuery} fetchPolicy="cache-and-network">
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
            if (loading)
              return (
                <>
                  <ProfileSkeleton />
                  <View style={gstyles.h_20} />
                  <Divider />
                  <View style={gstyles.h_20} />
                  <SinglePost />
                </>
              );

            if (error) return <NoWifi />;

            return (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                {data.me.large_photo ? (
                  <View
                    style={{ width: "100%", height: 220, resizeMode: "cover" }}
                  >
                    <ImageBackground
                      style={{ flex: 1 }}
                      source={{
                        uri:
                          link.url +
                          "/uploads/profile_images/" +
                          data.me.large_photo +
                          "?time=" +
                          data.me.timestamp,
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
                          {capitalize(data.me.firstname)}{" "}
                          {capitalize(data.me.lastname)}
                        </Text>
                        {
                          <Text style={styles.profileFieldType}>
                            @{data.me.username}
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
                      {capitalize(data.me.firstname)}{" "}
                      {capitalize(data.me.lastname)}
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
                        @{data.me.username}
                      </Text>
                    }
                  </View>
                )}

                <TabView
                  tabBarPosition="top"
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
                        getTabBarIcon(
                          props,
                          index,
                          routes,
                          data,
                          this.state.totalQuestion
                        )
                      }
                    />
                  )}
                />
              </View>
            );
          }}
        </Query>
      </View>
    );
  }
}

ProfileScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => <Text style={styles.headerPageTitle}>Profile</Text>,
  headerRight: () => <ProfilePageHeader {...screenProps} />,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  profileContainer: {
    backgroundColor: "#fff",
    // height: windowHeight,
    // backgroundColor: "red",
  },
  profileInfoContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
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
    marginBottom: 5,
  },
  userDescritpion: {
    fontSize: 12,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    color: color.grayColor,
    marginBottom: 5,
  },
  sendMessage: {
    fontSize: 14,
    borderWidth: 1,
    borderColor: color.primaryColor,
    color: color.grayColor,
    borderRadius: 4,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 12,
    paddingRight: 12,
    letterSpacing: 0.8,
  },
  userStats: {
    flexDirection: "row",
    justifyContent: "space-around",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  userStatsFigures: {
    textAlign: "center",
    color: color.blackColor,
    fontSize: 16,
    fontFamily: FontFamily.Bold,
    marginBottom: 5,
  },
  userStatsText: {
    textAlign: "center",
    color: color.blackColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  scrollViewTabs: {
    backgroundColor: "#fff",
    paddingTop: 20,
  },
  scrollView: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1.5,
    borderColor: color.grayColor,
    paddingBottom: 10,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
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
  TabBar: {
    backgroundColor: "#fff",
    elevation: 0,
    borderBottomWidth: 0,
    borderColor: "#D6D6D6",
  },
});

export default ProfileScreen;
