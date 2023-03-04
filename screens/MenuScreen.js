import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { NavigationActions } from "react-navigation";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List } from "react-native-paper";
import capitalize from "../helper/capitalize";
import MePhoto from "../components/MePhoto";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import client from "../constants/client";
import WithBadge from "../components/WithBadge";
import {
  MaterialIcons,
  MaterialCommunityIcons,
  Feather,
} from "@expo/vector-icons";
import { AntDesign } from "@expo/vector-icons";
const cache = new InMemoryCache({});

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage,
});

class MenuScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: {},
      expanded: true,
    };
  }
  profile = () => {
    this.props.navigation.navigate("Profile");
  };
  messageScreen = () => {
    this.props.navigation.navigate("Message");
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
  findOfferScreen = () => {
    this.props.navigation.navigate("Offer");
  };
  savedOfferScreen = () => {
    this.props.navigation.navigate("SavedOffer");
  };
  proposalsScreen = () => {
    this.props.navigation.navigate("Proposals");
  };
  activeOfferScreen = () => {
    this.props.navigation.navigate("ActiveOffer");
  };
  myOfferScreen = () => {
    this.props.navigation.navigate("MyOffer");
  };

  newOfferScreen = () => {
    this.props.navigation.navigate("NewOffers");
  };

  chatBackupScreen = () => {
    this.props.navigation.navigate("ChatBackup", { exists: true });
  };
  categorySettingScreen = () => {
    this.props.navigation.navigate("CategorySetting");
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
    const navigation = this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ flexGrow: 1, backgroundColor: "#fff" }}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <View style={styles.userProfileContainer}>
            <MePhoto item={this.state.me} random={Math.random()} />
            <View style={{ flex: 1, justifyContent: "center" }}>
              {this.state.me && (
                <View>
                  <Text style={styles.userName}>
                    {capitalize(this.state.me.firstname ?? "")}{" "}
                    {capitalize(this.state.me.lastname ?? "")}
                  </Text>
                  <Text style={styles.userOnlineTime}>
                    @{this.state.me.username ?? ""}
                  </Text>
                </View>
              )}
            </View>
          </View>
          <View style={{ flex: 1, justifyContent: "center", marginTop: 20 }}>
            <View
              style={{
                flex: 1,
                flexWrap: "wrap",
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                onPress={this.profile.bind(this)}
                style={styles.profileGridItems}
              >
                <Image
                  style={{ width: 17, height: 18, resizeMode: "contain" }}
                  source={require("../assets/images/userColor.png")}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Profile
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.activitiesScreen.bind(this)}
                style={styles.profileGridItems}
              >
                <Image
                  style={{ width: 17, height: 18, resizeMode: "contain" }}
                  source={require("../assets/images/bellColor.png")}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Activities
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.bookmarkScreen.bind(this)}
                style={styles.profileGridItems}
              >
                <Image
                  style={{ width: 17, height: 18, resizeMode: "contain" }}
                  source={require("../assets/images/BookmarkColor.png")}
                />
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Bookmarks
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Leaderboard")}
                style={styles.profileGridItems}
              >
                <View>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                    }}
                    source={require("../assets/images/trendingColor.png")}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Leaders
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={this.messageScreen.bind(this)}
                style={styles.profileGridItems}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    style={{ width: 17, height: 18, resizeMode: "contain" }}
                    source={require("../assets/images/commentColor.png")}
                  />
                  <WithBadge navigation={this.props.navigation} />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Inbox
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => {
                  this.props.navigation.navigate(
                    "Feed",
                    {},
                    NavigationActions.navigate({
                      routeName: "Home",
                      params: { own: true },
                    })
                  );
                }}
                // onPress={() => {
                //   this.props.navigation.navigate("Feed");
                // }}
                style={styles.profileGridItems}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-start",
                  }}
                >
                  <Image
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                    source={require("../assets/images/HomeColor.png")}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Public Discussion
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("FeedSearchFilterScreen")
                }
                style={styles.profileGridItems}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                  }}
                >
                  <Image
                    style={{ width: 20, height: 20, resizeMode: "contain" }}
                    source={require("../assets/images/searchColor.png")}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Search
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() =>
                  this.props.navigation.navigate("Recommendations")
                }
                style={styles.profileGridItems}
              >
                <View>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                    }}
                    source={require("../assets/images/discussion.png")}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Personal Discussion
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("MyClasses")}
                style={styles.profileGridItems}
              >
                <View>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                      transform: [{ rotate: "180deg" }],
                    }}
                    source={require("../assets/images/saved.png")}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  My Classes
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.props.navigation.navigate("Help")}
                style={styles.profileGridItems}
              >
                <View>
                  <Image
                    style={{
                      width: 20,
                      height: 20,
                      resizeMode: "contain",
                    }}
                    source={require("../assets/images/question.png")}
                  />
                </View>
                <Text
                  style={{
                    fontSize: 18,
                    color: color.blackColor,
                  }}
                >
                  Help
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
        <View
          style={{
            justifyContent: "flex-end",
            marginTop: 25,
            marginBottom: 10,
          }}
        >
          <List.Section style={{ marginBottom: 0 }}>
            <List.Accordion
              expanded={this.state.expanded}
              onPress={() => this.setState({ expanded: !this.state.expanded })}
              style={styles.accordion}
              titleStyle={styles.accordionTitle}
              title="Settings"
              left={(props) => (
                <AntDesign
                  name="setting"
                  size={20}
                  color="black"
                  style={{ marginLeft: 10 }}
                />
              )}
            >
              <TouchableOpacity
                style={[styles.listPanel, styles.boxShadow]}
                onPress={this.categorySettingScreen}
              >
                <MaterialCommunityIcons
                  name="select"
                  size={22}
                  color={color.black}
                  style={styles.listPanelIcon}
                />
                <Text style={styles.menuscreenpillstext}>
                  Category Expertise
                </Text>
              </TouchableOpacity>
              {/* <TouchableOpacity style={[styles.listPanel, styles.boxShadow]}>
                <MaterialIcons
                  name="backup"
                  size={22}
                  color={color.black}
                  style={styles.listPanelIcon}
                />
                <Text style={styles.menuscreenpillstext}>Chat backup</Text>
              </TouchableOpacity> */}
              <TouchableOpacity
                style={[styles.listPanel, styles.boxShadow]}
                onPress={() => this.props.navigation.navigate("Deactivate")}
              >
                <Feather
                  name="power"
                  size={20}
                  color={color.danger}
                  style={styles.listPanelIcon}
                />
                <Text
                  style={[styles.menuscreenpillstext, { color: color.danger }]}
                >
                  Deactivate Account
                </Text>
              </TouchableOpacity>
            </List.Accordion>
          </List.Section>
          <List.Item
            onPress={this.logout.bind(this)}
            style={[styles.menuListItems, styles.logout]}
            titleStyle={{
              fontSize: 18,
              fontFamily: FontFamily.Bold,
              color: color.blackColor,
            }}
            title="Logout"
            right={(props) => (
              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "#F3F5FB",
                  width: 50,
                  height: 50,
                  borderRadius: 7,
                }}
              >
                <Image
                  style={styles.logoutIcon}
                  source={require("../assets/images/logout.png")}
                />
              </View>
            )}
          />
        </View>
      </ScrollView>
    );
  }
}

MenuScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerBackTitle: null,
  headerTitle: () => <Text style={styles.headerPageTitle}>Menu</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
    flex: Platform.OS === "android" ? 1 : 0,
  },
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
  userOnlineTime: {
    fontSize: 14,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.2,
    color: color.grayColor,
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
  profileGridItems: {
    marginBottom: "2%",
    backgroundColor: "#F3F5FB",
    width: "49%",
    height: 80,
    borderRadius: 10,
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
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
    paddingRight: 10,
  },
  gridListImage: {
    marginTop: 8,
    width: 17,
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
    width: 19,
    height: 20,
    resizeMode: "contain",
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

  modalCloseIcon: {
    lineHeight: 28,
    position: "absolute",
    right: 10,
    top: 8,
    zIndex: 111,
    width: 40,
    alignItems: "center",
  },

  accordion: {
    backgroundColor: "#fff",
    paddingHorizontal: 0,
  },

  accordionTitle: {
    fontFamily: FontFamily.Medium,
    color: color.black,
    fontSize: 18,
  },
  listPanel: {
    margin: 5,
    marginHorizontal: 10,
    padding: 10,
    borderRadius: 6,
    backgroundColor: color.lightGrayColor,
    paddingLeft: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  listPanelIcon: {
    marginRight: 10,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  menuscreenpillstext: {
    color: color.black,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
});

export default MenuScreen;
