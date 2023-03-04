import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import ProfilePageQuestionsTabs from "../components/ProfilePageQuestionsTabs";
import ProfilePageAnswerTabs from "../components/ProfilePageAnswerTabs";
import ProfilePageHeader from "../components/ProfilePageHeader";
import ProfilePhoto from "../components/ProfilePhoto";
import { List } from "react-native-paper";
import { TabView, TabBar } from "react-native-tab-view";
import gql from "graphql-tag";
import { Query } from "react-apollo";
import * as Network from "expo-network";

const PostsQuery = gql`
  query {
    me {
      id
      profile_photo
      firstname
      lastname
      tagline
      color
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

class ProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      index: 0,
      routes: [
        { key: "first", title: "Question" },
        { key: "second", title: "Answer" },
      ],
      opacity: 1,
      tab: 1,
    };
    this.refetch;
  }

  _handleIndexChange = (index) => this.setState({ index });

  _renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <ProfilePageQuestionsTabs navigate={this.props.navigation} />;
      case "second":
        return <ProfilePageAnswerTabs navigate={this.props.navigation} />;
      default:
        return null;
    }
  };

  _renderBadge = ({ route }, item) => {
    switch (route.key) {
      case "first":
        return <Text>{item.questions.paginatorInfo.total}</Text>;
      case "second":
        return <Text>{item.answers.paginatorInfo.total}</Text>;
      default:
        return null;
    }
  };

  _renderTabBar = (props, item) => {
    return (
      <TabBar
        style={styles.TabBar}
        {...props}
        indicatorStyle={{ backgroundColor: "#3f3f3f" }}
        labelStyle={{
          color: color.blackColor,
          fontFamily: FontFamily.Regular,
          fontSize: 14,
        }}
        renderBadge={(route) => this._renderBadge(route, item)}
      />
    );
  };

  getTabBarIcon = (props) => {
    const { route } = props;
    if (route.key === "first") {
      return (
        <Text
          style={{
            color: color.blackColor,
            fontFamily: FontFamily.Regular,
            fontSize: 14,
          }}
        >
          Question
        </Text>
      );
    } else if (route.key === "second") {
      return (
        <Text
          style={{
            color: color.blackColor,
            fontFamily: FontFamily.Regular,
            fontSize: 14,
          }}
        >
          Answer
        </Text>
      );
    }
  };

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.props.navigation.setParams({ firstname: res.firstname });
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
        //this.refetch();
      }
    }
  };

  render() {
    return (
      <Query query={PostsQuery} fetchPolicy="cache-and-network">
        {({ loading, error, data, fetchMore, refetch }) => {
          this.refetch = refetch;
          if (loading)
            return (
              <View
                style={{
                  flex: 1,
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F7F7F7",
                }}
              >
                <ActivityIndicator size="small" color={color.primaryColor} />
              </View>
            );

          if (error)
            return (
              <View>
                <Text>Something went wrong</Text>
              </View>
            );

          return (
            <ScrollView style={{ flex: 1, backgroundColor: "#F7F7F7" }}>
              <View style={styles.profileContainer}>
                <View style={styles.profileInfoContainer}>
                  <ProfilePhoto
                    size={42}
                    style={styles.profileImage}
                    item={data.me}
                  />

                  <View style={{ flex: 1 }}>
                    <Text style={styles.profileName}>
                      {data.me.firstname} {data.me.lastname}
                    </Text>
                    {/*<Text style={styles.profileFieldType}>UI/UX Designer</Text>*/}
                    <Text style={styles.userDescritpion}>
                      {data.me.tagline}
                    </Text>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      {/*
                      <TouchableOpacity >
                        <Text style={styles.sendMessage}>Send Message</Text>
                      </TouchableOpacity>
                    */}
                    </View>
                  </View>
                </View>
                <View style={styles.userStats}>
                  {/*  <View>
                    <Text style={styles.userStatsFigures}>
                      {data.me.questions.paginatorInfo.total}
                    </Text>
                    <Text style={styles.userStatsText}>Question</Text>
                  </View>
                  <View>
                    <Text style={styles.userStatsFigures}>
                      {data.me.answers.paginatorInfo.total}
                    </Text>
                    <Text style={styles.userStatsText}>Answers</Text>
                  </View>
                
                  <View>
                    <Text style={styles.userStatsFigures}>
                      {data.me.followers.paginatorInfo.total}
                    </Text>
                    <Text style={styles.userStatsText}>Followers</Text>
                  </View>
                  <View>
                    <Text style={styles.userStatsFigures}>0</Text>
                    <Text style={styles.userStatsText}>Popular</Text>
                  </View>
                */}
                </View>
              </View>
              <TabView
                navigationState={this.state}
                renderScene={this._renderScene}
                renderTabBar={(props) => this._renderTabBar(props, data.me)}
                onIndexChange={this._handleIndexChange}
              />

              {data.me.workboards.data.length > 0 && (
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
                    {/* 
                 <FontAwesome
                    style={{
                      color: color.grayColor,
                      fontSize: 22,
                      marginRight: 15
                    }}
                    name="edit"
                  ></FontAwesome>
              */}
                  </View>

                  {data.me.workboards.data.map((item, key) => (
                    <View
                      key={key}
                      style={{ flex: 1, flexDirection: "row", marginTop: 20 }}
                    >
                      <Image
                        style={styles.experienceUserImage}
                        source={{
                          uri:
                            "https://procurementleague.com/uploads/profile_images/" +
                            data.me.profile_photo,
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
                          {item.job_title} ({item.company_name})
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
              {data.me.workboards.data.length > 0 &&
                data.me.workboards.data[0].skills.data.length > 0 && (
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
                      {/* 
                  <FontAwesome
                    style={{
                      color: color.grayColor,
                      fontSize: 22,
                      marginRight: 15
                    }}
                    name="edit"
                  ></FontAwesome>
                  */}
                    </View>

                    {data.me.workboards.data.map((item, key) =>
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

ProfileScreen.navigationOptions = (screenProps) => ({
  headerLeft: () => <Text style={styles.headerPageTitle}>Profile</Text>,
  headerRight: () => <ProfilePageHeader {...screenProps} />,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginLeft: 15,
  },
  profileContainer: {
    marginBottom: 10,
    padding: 15,
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
  profileInfoContainer: {
    flexDirection: "row",
    marginBottom: 10,
  },
  profileImage: {
    marginRight: 10,
  },
  profileName: {
    fontSize: 15,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
    color: color.blackColor,
  },
  profileFieldType: {
    fontSize: 11,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    color: color.grayColor,
    marginTop: 4,
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
    paddingBottom: 10,
    paddingTop: 20,
    paddingLeft: 15,
    paddingRight: 15,
  },
  scrollView: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderBottomWidth: 1,
    borderColor: "#D6D6D6",
    paddingBottom: 10,
  },
  scrollViewText: {
    textAlign: "center",
    color: color.blackColor,
    fontSize: 14,
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
    color: "red",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});

export default ProfileScreen;
