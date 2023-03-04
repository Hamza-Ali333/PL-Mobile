import React from "react";
import {
  ActivityIndicator,
  FlatList,
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  RefreshControl,
  SafeAreaView,
  Modal,
  Dimensions,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import ProfilePhoto from "../components/ProfilePhoto";
import LeadboardFilter from "../components/LeadboardFilter";
import LeaderBoardTagsComponent from "../components/LeaderBoardTagsComponent";
import { List, Checkbox, Divider } from "react-native-paper";
import getLeaderBoard from "../graphql/queries/getLeaderBoard";
import getCategories from "../graphql/queries/getCategories";
import { Query } from "react-apollo";
import capitalize from "../helper/capitalize";
import client from "../constants/client";
import * as Network from "expo-network";
import { Ionicons } from "@expo/vector-icons";
import ListItem from "../components/Skeleton/ListItem.js";
import gstyles from "../constants/gstyles.js";

class LeaderboardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      topData: [],
      listdata: [],
      me: {},
      refreshing: false,
      value: "f",
      modalVisible: false,
      yearModalVisible: false,
      monthModalVisible: false,
      checked: [],
      switch: 1,
      listYears: [],
      category_id: "",
      category_name: null,
      month_name: null,
      year_name: null,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
      tagsData: [],
      tag_ids: [],
      forceRefresh: true,
    };
    this.ActionSheet, this.showActionSheet;
  }

  componentDidMount() {
    //AsyncStorage.removeItem("leaderboard_setting");
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });

    this.props.navigation.addListener("didFocus", this.getNetworkInfo);

    AsyncStorage.getItem("leaderboard_setting").then((result) => {
      let res = JSON.parse(result);

      if (res) {
        if (res.category_id) {
          this.setState({
            category_id: res.category_id,
            category_name: res.category_name,
          });
        }
        if (res.month) {
          this.setState({
            month: res.month,
            month_name: res.month_name,
          });
        }
        if (res.year) {
          this.setState({ year: res.year, year_name: res.year });
        }
      } else {
        this.setState({ switch: 0 });
      }
      this.getNetworkInfo();
    });

    this.getYears();
  }

  getNetworkInfo = async () => {
    if (!this.state.forceRefresh) {
      this.setState({ forceRefresh: true });
      return false;
    }

    this.setState({
      loading: true,
      topData: [],
      listdata: [],
      forceRefresh: true,
    });
    const netInfo = await Network.getNetworkStateAsync();
    const fetchPolicy = netInfo.isConnected ? "network-only" : "cache-only";
    let category_id = "",
      month = null,
      year = null;

    // if (
    //   this.state.month === new Date().getMonth() &&
    //   this.state.year === new Date().getFullYear()
    // ) {

    month =
      new Date().getUTCDate() < 7 ? this.state.month : this.state.month + 1;
    year = this.state.year;
    if (month === 0 || month === "0") {
      year = year - 1;
      month = 12;
    }

    // } else {

    //   month = (this.state.month + 1).toString();
    //   year = this.state.year.toString();
    // }

    if (this.state.category_id) {
      category_id = this.state.category_id;
    }

    // if (month.) {

    // }
    client
      .query({
        query: getLeaderBoard,
        fetchPolicy: fetchPolicy,
        variables: {
          category_id: parseInt(category_id),
          month: parseInt(month),
          year: parseInt(year),
          tags: this.state.tag_ids,
        },
      })
      .then((result) => {
        let topData = []; //result.data.leaderboard.slice(0, 3);
        let listdata = result.data.leaderboard;
        this.setState({
          topData: topData,
          listdata: listdata,
          refreshing: false,
          loading: false,
        });
      })
      .catch((e) => {
        console.log(
          "🚀 ~ file: LeaderboardScreen.js:169 ~ LeaderboardScreen ~ .then ~ e",
          e
        );
      });
  };

  goToProfile = (id) => {
    this.setState({ forceRefresh: false });
    this.props.navigation.navigate("UserProfile", { user_id: id });
  };

  refetch = () => {
    this.setState({ refreshing: true });
    this.getNetworkInfo();
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  updateTags = (tagsData) => {
    let tag_ids = [],
      forceRefresh = true;
    tagsData.map((item, index) => {
      tag_ids.push(parseInt(item.id));
    });
    this.setState({ tagsData, tag_ids, forceRefresh });
  };

  removeTags = (tag) => {
    let tagsData = this.state.tagsData;

    if (!tagsData.find((data) => data.id === tag.id)) {
      tagsData = [...tagsData, tag];
    } else {
      tagsData = tagsData.filter((item) => item.id !== tag.id);
    }
    this.updateTags(tagsData);

    setTimeout(() => {
      this.getNetworkInfo();
    }, 1000);
  };

  clearFilters = () => {
    this.setState({ tagsData: [] });
    setTimeout(() => {
      this.getNetworkInfo();
    }, 1000);
  };

  onActionSheetAction = (buttonIndex) => {
    if (buttonIndex === 0) {
      this.setState({ modalVisible: true });
    } else if (buttonIndex === 1) {
      this.setState({ yearModalVisible: true });
    } else if (buttonIndex === 2) {
      this.setState({ monthModalVisible: true });
    } else if (buttonIndex === 3) {
      this.props.navigation.navigate("TagScreen", {
        updateTags: this.updateTags,
        tag_ids: this.state.tagsData,
        limit: true,
      });
    }
  };
  onActionSheetActionDismiss = () => {
    this.setState({
      modalVisible: false,
      yearModalVisible: false,
      monthModalVisible: false,
    });
  };

  onApplyAndClose = (id) => {
    if (id === 1) {
      AsyncStorage.getItem("leaderboard_setting").then((result) => {
        let res = JSON.parse(result);

        if (res) {
          res.category_id = this.state.category_id;
          res.category_name = this.state.category_name;
        } else {
          res = {
            category_id: this.state.category_id,
            category_name: this.state.category_name,
          };
        }

        AsyncStorage.setItem("leaderboard_setting", JSON.stringify(res));
        this.getNetworkInfo();
      });
    } else if (id === 2) {
      AsyncStorage.getItem("leaderboard_setting").then((result) => {
        let res = JSON.parse(result);

        if (res) {
          res.year = this.state.year;
          res.year_name = this.state.year;
        } else {
          res = { year: this.state.year, year_name: this.state.year };
        }
        AsyncStorage.setItem("leaderboard_setting", JSON.stringify(res));
        this.getNetworkInfo();
      });
    } else if (id === 3) {
      AsyncStorage.getItem("leaderboard_setting").then((result) => {
        let res = JSON.parse(result);

        if (res) {
          res.month = this.state.month;
          res.month_name = this.state.month_name;
        } else {
          res = {
            month: this.state.month,
            month_name: this.state.month_name,
          };
        }
        AsyncStorage.setItem("leaderboard_setting", JSON.stringify(res));
        this.getNetworkInfo();
      });
    }
    this.setState({
      modalVisible: false,
      yearModalVisible: false,
      monthModalVisible: false,
    });
  };

  handleCategoryChange = (id, name) => {
    let { category_id, category_name } = this.state;
    category_id = id;
    category_name = name;
    this.setState({ category_id, category_name });
  };

  handleYearChange = (value) => {
    let { year, year_name } = this.state;
    year = value;
    this.setState({ year });
    this.setState({ year_name: value });
  };

  handleMonthChange = (value, name) => {
    let { month } = this.state;
    month = value;
    this.setState({ month });
    this.setState({ month_name: name });
  };

  _storeSwitch = (value) => {
    AsyncStorage.getItem("leaderboard_setting").then((result) => {
      let res = JSON.parse(result);
      if (res) {
        res.switch_setting = value;
      } else {
        res = { switch_setting: value };
      }
      if (value === "others") {
        this.setState({ switch: 1 });
      } else {
        this.setState({ switch: 0 });
      }

      AsyncStorage.setItem("leaderboard_setting", JSON.stringify(res));
      this.getNetworkInfo();
    });
  };

  getYears = () => {
    var currentYear = new Date().getFullYear(),
      years = [];
    startYear = 2017;
    while (startYear <= currentYear) {
      years.unshift({ name: startYear, id: startYear });
      startYear++;
    }
    this.setState({ listYears: years });
  };

  renderCategory = () => {
    if (this.state.category_name) {
      return <Text style={{ marginLeft: 10 }}>{this.state.category_name}</Text>;
    } else {
      return null;
    }
    <Text style={{ marginLeft: 10 }}>Month:{this.state.month}</Text>;
  };

  renderMonth = () => {
    if (this.state.month) {
      return (
        <Text style={{ marginLeft: 10 }}>Month:{this.state.month_name}</Text>
      );
    } else {
      return null;
    }
  };

  renderYear = () => {
    if (this.state.year) {
      return <Text style={{ marginLeft: 10 }}>Year:{this.state.year}</Text>;
    } else {
      return null;
    }
  };

  _listEmptyComponent = () => {
    if (this.state.loading) {
      return (
        <>
          <ListItem />
          <View style={gstyles.h_10} />
          <Divider />
          <View style={gstyles.h_10} />
          <ListItem />
          <Divider />
          <View style={gstyles.h_10} />
          <ListItem />
          <Divider />
          <View style={gstyles.h_10} />
          <ListItem />
          <Divider />
          <View style={gstyles.h_10} />
          <ListItem />
          <Divider />
          <View style={gstyles.h_10} />
          <ListItem />
          <Divider />
          <View style={gstyles.h_10} />
          <ListItem />
        </>
      );
    } else {
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <Text style={styles.emptyText}>No Records Found</Text>
          <View style={{ alignItems: "center" }}>
            <Image
              style={{
                resizeMode: "contain",
                width: "90%",
                height: Dimensions.get("window").height - 350,
              }}
              source={require("../assets/lottie/empty-box.gif")}
            />
          </View>
        </View>
      );
    }
  };

  render() {
    const { category_id, month, year } = this.state;
    if (this.state.me.id) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <ScrollView
            showsVerticalScrollIndicator={false}
            refreshControl={
              <RefreshControl
                tintColor={color.primaryColor}
                refreshing={this.state.refreshing}
                onRefresh={() => {
                  this.refetch();
                }}
              />
            }
          >
            <View
              style={{ height: 45, marginHorizontal: 10, marginBottom: 10 }}
            >
              <LeadboardFilter
                onActionSheetAction={this.onActionSheetAction}
                month_name={this.state.month_name}
                year={this.state.year_name}
                category_name={this.state.category_name}
              />
            </View>
            <LeaderBoardTagsComponent
              tags={this.state.tagsData}
              _clearFilters={this.clearFilters}
              _removeTags={this.removeTags}
            />

            <View style={{ marginLeft: 15, marginRight: 10 }}>
              <List.Item
                style={{ padding: 0, margin: 0 }}
                titleStyle={{
                  fontFamily: FontFamily.Regular,
                  color: "#9299A1",
                  fontSize: 14,
                  marginLeft: 18,
                }}
                title="USER"
                left={() => (
                  <Text
                    style={{
                      fontFamily: FontFamily.Regular,
                      color: "#9299A1",
                      fontSize: 14,
                      marginTop: 5,
                    }}
                  >
                    #
                  </Text>
                )}
                right={() => (
                  <Text
                    style={{
                      fontFamily: FontFamily.Regular,
                      color: "#9299A1",
                      fontSize: 14,
                      marginTop: 5,
                    }}
                  >
                    PROGRESS
                  </Text>
                )}
              />
            </View>

            <View>
              <FlatList
                data={this.state.listdata}
                ListEmptyComponent={this._listEmptyComponent}
                renderItem={({ item, index }) => {
                  return (
                    <View
                      key={index}
                      style={[
                        styles.LeaderboardCardContainer,
                        index === 0
                          ? { backgroundColor: color.primaryColor }
                          : {},
                      ]}
                    >
                      <View
                        style={[
                          styles.trendingUserPoints,
                          styles.cardPoints,
                          index === 1 || index === 2
                            ? styles.trendingBadge
                            : {},
                          index === 0 ? styles.trendingBadgeFirst : {},
                        ]}
                      >
                        <Text
                          style={[
                            { fontSize: 11 },
                            index === 1 || index === 2 ? { color: "#fff" } : {},
                            index === 0 ? { color: color.primaryColor } : {},
                          ]}
                        >
                          {index + 1}
                        </Text>
                      </View>

                      <View style={styles.LeaderboardCards}>
                        <TouchableOpacity
                          onPress={() => this.goToProfile(item.user_id)}
                        >
                          <List.Item
                            style={styles.LeaderboardCardsItems}
                            titleStyle={{
                              fontFamily: FontFamily.Medium,
                              color: index === 0 ? "#fff" : color.blackColor,
                              fontSize: 14,
                              margin: 0,
                            }}
                            descriptionStyle={{
                              color: index === 0 ? "#fff" : color.grayColor,
                              fontSize: 12,
                            }}
                            title={
                              capitalize(item.firstname) +
                              " " +
                              capitalize(item.lastname)
                            }
                            description={"@" + item.username}
                            left={(props) => (
                              <ProfilePhoto
                                item={item}
                                me={this.state.me}
                                size={45}
                              />
                            )}
                            right={(props) => (
                              <View style={styles.LeaderboardCardsProgress}>
                                {item.down_position && (
                                  <View
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.caretUpText,
                                        index === 0 ? { color: "#fff" } : {},
                                      ]}
                                    >
                                      {item.down_position}
                                    </Text>
                                    <AntDesign
                                      style={styles.caretDown}
                                      name="caretdown"
                                    />
                                  </View>
                                )}
                                {item.up_position && (
                                  <View
                                    style={{
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Text
                                      style={[
                                        styles.caretUpText,
                                        index === 0 ? { color: "#fff" } : {},
                                      ]}
                                    >
                                      {item.up_position}
                                    </Text>
                                    <AntDesign
                                      style={[
                                        styles.caretUp,
                                        index === 0 ? { color: "#fff" } : {},
                                      ]}
                                      name="caretup"
                                    />
                                  </View>
                                )}

                                {item.up_position === null &&
                                  item.down_position === null && (
                                    <View
                                      style={{
                                        justifyContent: "center",
                                        alignItems: "center",
                                      }}
                                    >
                                      <Text
                                        style={[
                                          styles.caretUpText,
                                          index === 0 ? { color: "#fff" } : {},
                                        ]}
                                      >
                                        {index + 4}
                                      </Text>
                                      <AntDesign
                                        style={[
                                          styles.caretUp,
                                          index === 0 ? { color: "#fff" } : {},
                                        ]}
                                        name="caretup"
                                      />
                                    </View>
                                  )}
                              </View>
                            )}
                          />
                        </TouchableOpacity>
                      </View>
                    </View>
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            </View>
          </ScrollView>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.modalVisible}
          >
            <View style={styles.leadboardModal}>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={this.onActionSheetActionDismiss}
              >
                <Ionicons
                  name="ios-close"
                  size={48}
                  color={color.primaryColor}
                />
              </TouchableOpacity>
              <View style={styles.leadboardModalContent}>
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
                        <Text style={styles.popUpHeading}>Topics</Text>
                        <List.Item
                          style={styles.BottomOptionListItems}
                          onPress={() => this.handleCategoryChange("", "All")}
                          titleStyle={{
                            fontSize: 15,
                            marginLeft: -5,
                            fontFamily: FontFamily.Regular,
                            color: "#616161",
                          }}
                          title={"All"}
                          right={(props) => (
                            <Checkbox
                              color={color.primaryColor}
                              style={styles.TopicPageCheckboxes}
                              status={
                                category_id === "" ? "checked" : "unchecked"
                              }
                            />
                          )}
                        />
                        <FlatList
                          data={data.categories}
                          extraData={this.state}
                          renderItem={({ item, index }) => {
                            return (
                              <List.Item
                                style={styles.BottomOptionListItems}
                                onPress={() =>
                                  this.handleCategoryChange(item.id, item.name)
                                }
                                titleStyle={{
                                  fontSize: 15,
                                  marginLeft: -5,
                                  fontFamily: FontFamily.Regular,
                                  color: "#616161",
                                }}
                                title={item.name}
                                right={(props) => (
                                  <Checkbox
                                    color={color.primaryColor}
                                    style={styles.TopicPageCheckboxes}
                                    status={
                                      category_id === item.id
                                        ? "checked"
                                        : "unchecked"
                                    }
                                  />
                                )}
                              />
                            );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                        />
                      </View>
                    );
                  }}
                </Query>

                <View style={{ margin: 20 }}>
                  <Button
                    color={color.primaryColor}
                    title="Apply & Close"
                    onPress={() => this.onApplyAndClose(1)}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.yearModalVisible}
          >
            <View style={styles.leadboardModal}>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={this.onActionSheetActionDismiss}
              >
                <Ionicons
                  name="ios-close"
                  size={48}
                  color={color.primaryColor}
                />
              </TouchableOpacity>
              <View style={styles.leadboardModalContent}>
                <Text style={styles.popUpHeading}>Year</Text>
                <FlatList
                  data={this.state.listYears}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    return (
                      <List.Item
                        style={styles.BottomOptionListItems}
                        onPress={() => this.handleYearChange(item.id)}
                        titleStyle={{
                          fontSize: 15,
                          marginLeft: -5,
                          fontFamily: FontFamily.Regular,
                          color: "#616161",
                        }}
                        title={item.name}
                        right={(props) => (
                          <Checkbox
                            color={color.primaryColor}
                            style={styles.TopicPageCheckboxes}
                            status={year === item.id ? "checked" : "unchecked"}
                          />
                        )}
                      />
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />

                <View style={{ margin: 20 }}>
                  <Button
                    color={color.primaryColor}
                    title="Apply & Close"
                    onPress={() => this.onApplyAndClose(2)}
                  />
                </View>
              </View>
            </View>
          </Modal>
          <Modal
            animationType="slide"
            transparent={true}
            visible={this.state.monthModalVisible}
          >
            <View style={styles.leadboardModal}>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={this.onActionSheetActionDismiss}
              >
                <Ionicons
                  name="ios-close"
                  size={48}
                  color={color.primaryColor}
                />
              </TouchableOpacity>
              <View style={styles.leadboardModalContent}>
                <Text style={styles.popUpHeading}>Month</Text>
                <FlatList
                  data={[
                    { name: "January", id: 0 },
                    { name: "February", id: 1 },
                    { name: "March", id: 2 },
                    { name: "April", id: 3 },
                    { name: "May", id: 4 },
                    { name: "June", id: 5 },
                    { name: "July", id: 6 },
                    { name: "August", id: 7 },
                    { name: "September", id: 8 },
                    { name: "October ", id: 9 },
                    { name: "November ", id: 10 },
                    { name: "December ", id: 11 },
                  ]}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    return (
                      <List.Item
                        style={styles.BottomOptionListItems}
                        onPress={() =>
                          this.handleMonthChange(item.id, item.name)
                        }
                        titleStyle={{
                          fontSize: 15,
                          marginLeft: -5,
                          fontFamily: FontFamily.Regular,
                          color: "#616161",
                        }}
                        title={item.name}
                        right={(props) => (
                          <Checkbox
                            color={color.primaryColor}
                            style={styles.TopicPageCheckboxes}
                            status={month === item.id ? "checked" : "unchecked"}
                          />
                        )}
                      />
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                />

                <View style={{ margin: 20 }}>
                  <Button
                    color={color.primaryColor}
                    title="Apply & Close"
                    onPress={() => this.onApplyAndClose(3)}
                  />
                </View>
              </View>
            </View>
          </Modal>
        </SafeAreaView>
      );
    } else {
      return null;
    }
  }
}

LeaderboardScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Leaders</Text>,
});
const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  pageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
  },
  leaderboardFiltersPopup: {
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    margin: 10,
  },
  trendingContainer: {
    backgroundColor: "#fff",
  },
  trendingCatgories: {
    padding: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    justifyContent: "space-around",
  },
  starTextColor: {
    color: color.primaryColor,
  },
  starTextWhite: {
    position: "absolute",
    fontSize: 10,
    color: "#fff",
    fontFamily: FontFamily.Regular,
  },
  trendingCatgoriesText: {
    fontSize: 14,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    paddingBottom: 10,
  },
  trendingTextActive: {
    borderBottomWidth: 2,
    borderColor: color.primaryColor,
  },
  trendingUserContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    marginBottom: 30,
    marginTop: 12,
  },
  trendingContainerBgColor: {
    backgroundColor: color.primaryColor,
  },
  trendingTopUserbox: {
    position: "relative",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
    borderWidth: 1,
    borderColor: color.primaryColor,
    borderRadius: 10,
    paddingTop: 10,
    paddingBottom: 10,
  },
  caretUp: {
    fontSize: 16,
    color: "#2ECC71",
    height: 15,
  },
  caretDown: {
    fontSize: 16,
    color: "#E74C3C",
  },
  crownIcon: {
    fontSize: 25,
    color: "#FFC02E",
    marginBottom: -6,
    zIndex: 1,
  },
  caretUpText: {
    fontSize: 14,
    color: color.blackColor,
    fontFamily: FontFamily.Reuglar,
  },
  trendingUserNameWhiteColor: {
    color: "#fff",
  },
  trendingUserName: {
    fontSize: 13,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    marginBottom: 3,
    marginTop: 5,
  },
  trendingUserPoints: {
    fontSize: 13,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
  },
  LeaderboardCardContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#CCCFD6",
    paddingLeft: 10,
    paddingRight: 10,
    height: 85,
  },
  LeaderboardCardsProgress: {
    alignItems: "center",
    flex: 1 / 7,
    flexDirection: "row",
    justifyContent: "center",
  },
  LeaderboardCards: {
    flex: 1,
  },
  LeaderboardCardsItems: {
    padding: 10,
  },
  cardPoints: {
    textAlign: "center",
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    paddingTop: 2,
    paddingBottom: 2,
    paddingLeft: 6,
    paddingRight: 6,
    borderRadius: 4,
  },
  userProfile: {
    width: 45,
    height: 45,
    borderRadius: 90,
  },
  leadboardModal: {
    backgroundColor: "rgba(226, 226, 226, .75)",
    flex: 1,
    flexDirection: "column",
    paddingTop: "6%",
    paddingLeft: "3%",
    paddingRight: "3%",
    zIndex: 11111,
    // height:Dimensions.get('window').height,
  },
  leadboardModalContent: {
    flex: 1,
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 24,
    padding: 15,
    zIndex: 111,
  },
  popUpHeading: {
    fontSize: 20,
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    marginBottom: 20,
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    margin: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 0,
    paddingRight: 0,
  },
  TopicPageCheckboxes: {
    marginRight: 20,
  },
  modalCloseIcon: {
    lineHeight: 28,
    position: "absolute",
    right: 5,
    top: 20,
    zIndex: 111,
    width: 40,
    alignItems: "center",
  },
  trendingBadgeFirst: {
    backgroundColor: "#fff",
    color: color.primaryColor,
  },
  trendingBadge: {
    backgroundColor: color.primaryColor,
    color: "#fff",
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 22,
    textAlign: "center",
    marginTop: 20,
  },
});

export default LeaderboardScreen;
