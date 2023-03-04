import React, { Component } from "react";
import {
  ActivityIndicator,
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List } from "react-native-paper";
import getCategories from "../graphql/queries/getCategories";
import { Query } from "react-apollo";
import capitalize from "../helper/capitalize";
import MePhoto from "../components/MePhoto";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import client from "../constants/client";

const cache = new InMemoryCache({});

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage,
});

class SidebarMenuScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: {},
    };
  }
  profile = () => {
    this.props.navigation.navigate("Profile");
  };
  messageScreen = () => {
    this.props.navigation.navigate("MessageScreen");
  };
  activitiesScreen = () => {
    this.props.navigation.navigate("Activities");
  };
  bookmarkScreen = () => {
    this.props.navigation.navigate("BookmarkScreen");
  };
  requestScreen = () => {
    this.props.navigation.navigate("RequestScreen");
  };
  settingScreen = () => {
    this.props.navigation.navigate("SettingScreen");
  };

  logout = async () => {
    if (persistor) {
      persistor.pause();
      await persistor.purge();
      await client.resetStore();
      persistor.resume();
    }
    await AsyncStorage.clear();
    this.props.navigation.navigate("AuthLoading");
  };
  filter = (item) => {
    this.props.navigation.closeDrawer();
    this.props.navigation.navigate("Feed");
    this.props.navigation.state.routes[0].routes[0].routes[0].params.Doit(item);
  };

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);

      this.setState({ me: res });
    });
  }
  closeDrawer = () => {
    this.props.navigation.closeDrawer();
  };

  render() {
    return null;
    const navigation = this.state;
    return (
      <ScrollView
        style={{
          flex: 1,
          position: "relative",
        }}
      >
        <TouchableOpacity
          style={styles.modalCloseIcon}
          onPress={this.closeDrawer.bind(this)}
        >
          <Ionicons name="ios-close" size={48} color={color.primaryColor} />
        </TouchableOpacity>
        <View
          style={{
            flex: 1,
            // backgroundColor: 'rgba(0, 0, 0, .71)',
            // backgroundColor: 'rgba(226, 226, 226, 1)',
          }}
        >
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
              margin: 5,
              padding: 20,
              borderRadius: 24,
              width: "80%",
              height: Dimensions.get("window").height - 15,
            }}
          >
            <View style={styles.userProfileContainer}>
              <MePhoto item={this.state.me} random={Math.random()} />
              <View style={{ flex: 1, justifyContent: "center" }}>
                <Text style={styles.userName}>
                  {capitalize(this.state.me.firstname)}{" "}
                  {capitalize(this.state.me.lastname)}
                </Text>
                {/*<TouchableOpacity onPress={this.profile.bind(this)}>
                  <Text style={styles.ViewProfile}>View Profile</Text>
                </TouchableOpacity>*/}
              </View>
            </View>
            <View style={{ flex: 1, justifyContent: "center" }}>
              {/*
            <List.Item
              onPress={this.messageScreen.bind(this)}
              style={[styles.menuListItems, styles.firstListItem]}
              titleStyle={{
                fontSize: 14,
                fontFamily: FontFamily.Regular,
                color: color.blackColor
              }}
              title="Message"
              left={props => (
                <Image
                  style={styles.drawerListImage}
                  source={require("../assets/images/messages.png")}
                />
              )}
            />
            <List.Item
              style={styles.menuListItems}
              titleStyle={{
                fontSize: 14,
                fontFamily: FontFamily.Regular,
                color: color.blackColor
              }}
              title="Stats"
              right={props => (
                <Image
                  style={styles.drawerListImage}
                  source={require("../assets/images/stats.png")}
                />
              )}
            />
          */}
              <List.Item
                onPress={this.profile.bind(this)}
                style={styles.menuListItems}
                titleStyle={{
                  fontSize: 15,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  margin: -7,
                }}
                title="Profile"
                right={(props) => (
                  <Image
                    style={styles.drawerListImage}
                    source={require("../assets/images/profile.png")}
                  />
                )}
              />
              {/*
            <List.Item
              onPress={this.requestScreen.bind(this)}
              style={styles.menuListItems}
              titleStyle={{
                fontSize: 15,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
                margin:-7,
              }}
              title="Request"
              right={props => (
                <Image
                  style={styles.drawerListImage}
                  source={require("../assets/images/lockOultlined.png")}
                />
              )}
            />*/}
              <List.Item
                onPress={this.activitiesScreen.bind(this)}
                style={styles.menuListItems}
                titleStyle={{
                  fontSize: 15,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  margin: -7,
                }}
                title="Activities"
                right={(props) => (
                  <Image
                    style={[styles.drawerListImage, styles.activitiesIcon]}
                    source={require("../assets/images/notification.png")}
                  />
                )}
              />
              <List.Item
                onPress={this.bookmarkScreen.bind(this)}
                style={styles.menuListItems}
                titleStyle={{
                  fontSize: 15,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  margin: -7,
                }}
                title="Bookmarks"
                right={(props) => (
                  <Image
                    style={[styles.drawerListImage, styles.bookmarksIcon]}
                    source={require("../assets/images/bookmarkBlack.png")}
                  />
                )}
              />

              {/*<List.Item
              onPress={this.messageScreen.bind(this)}
              style={styles.menuListItems}
              titleStyle={{
                fontSize: 14,
                fontFamily: FontFamily.Regular,
                color: color.blackColor
              }}
              title="Messages"
              left={props => (
                <Image
                  style={styles.drawerListImage}
                  source={require("../assets/images/bookmarks.png")}
                />
              )}
            />*/}
            </View>
            <View style={styles.Topics}>
              <Text style={styles.topicText}>Topics</Text>
              <Query query={getCategories}>
                {({ loading, error, data, fetchMore }) => {
                  if (loading)
                    return (
                      <View>
                        <ActivityIndicator
                          size="small"
                          color={color.primaryColor}
                        />
                      </View>
                    );

                  if (error) return <Text>error</Text>;
                  return (
                    <View>
                      <List.Item
                        onPress={() =>
                          this.filter({ id: null, name: "All topics" })
                        }
                        style={styles.menuListItems}
                        titleStyle={{
                          fontSize: 15.3,
                          fontFamily: FontFamily.Regular,
                          color: color.blackColor,
                          margin: -7,
                        }}
                        title="All"
                      />
                      {data.categories &&
                        data.categories.map((item, index) => (
                          <List.Item
                            onPress={() => this.filter(item)}
                            key={item.id}
                            style={styles.menuListItems}
                            titleStyle={{
                              fontSize: 15.3,
                              fontFamily: FontFamily.Regular,
                              color: color.blackColor,
                              marginLeft: -7,
                            }}
                            title={item.name}
                          />
                        ))}
                    </View>
                  );
                }}
              </Query>
            </View>

            <View style={{ flex: 1 / 2, justifyContent: "flex-end" }}>
              <List.Item
                onPress={this.settingScreen.bind(this)}
                style={[styles.menuListItems]}
                titleStyle={{
                  fontSize: 15,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  margin: -7,
                }}
                title="Settings"
                right={(props) => (
                  <Image
                    style={[styles.drawerListImage, styles.activitiesIcon]}
                    source={require("../assets/images/settings.png")}
                  />
                )}
              />
              <List.Item
                onPress={this.logout.bind(this)}
                style={[styles.menuListItems, styles.logout]}
                titleStyle={{
                  fontSize: 15,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  margin: -7,
                }}
                title="Logout"
                right={(props) => (
                  <Image
                    style={[styles.drawerListImage, styles.logoutIcon]}
                    source={require("../assets/images/logout.png")}
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

const styles = StyleSheet.create({
  userProfileContainer: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  userProfile: {
    marginRight: 10,
    width: 42,
    height: 42,
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
    color: color.blackColor,
  },
  ViewProfile: {
    color: color.primaryColor,
    fontSize: 12,
    fontFamily: FontFamily.Regular,
    marginTop: 3,
  },
  firstListItem: {
    borderTopWidth: 0,
  },
  menuListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 0,
    paddingRight: 0,
  },
  logout: {
    borderBottomWidth: 0,
  },
  drawerListImage: {
    marginTop: 8,
    width: 14,
    height: 18,
    resizeMode: "contain",
  },
  activitiesIcon: {
    width: 14,
    height: 18,
  },
  bookmarksIcon: {
    width: 13,
    height: 17,
  },
  logoutIcon: {
    width: 16,
    height: 17,
  },
  drawerListImageRight: {
    marginRight: 20,
    marginTop: 4,
    width: 18,
    height: 18,
  },
  Topics: {
    flex: 4,
    justifyContent: "center",
  },
  topicText: {
    fontSize: 17,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    marginBottom: 10,
  },
  // Divider:{
  //   borderColor:'#E8E8E8',
  //   borderTopWidth:1,
  //   marginTop:20,
  //   flex:1/2,
  // },
  modalCloseIcon: {
    lineHeight: 28,
    position: "absolute",
    right: 10,
    top: 8,
    zIndex: 111,
    width: 40,
    alignItems: "center",
  },
});

export default SidebarMenuScreen;
