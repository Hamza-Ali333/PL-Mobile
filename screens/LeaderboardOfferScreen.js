import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  RefreshControl,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import getLeaderBoard from "../graphql/queries/getLeaderBoard";
import client from "../constants/client";
import * as Network from "expo-network";
import ActionSheet from "react-native-actionsheet";

class LeaderboardOfferScreen extends React.Component {
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
      switch: null,
      listYears: [],
      category_id: "",
      category_name: null,
      year: new Date().getFullYear(),
      month: new Date().getMonth(),
      currentYear: new Date().getFullYear(),
      currentMonth: new Date().getMonth(),
    };
    this.ActionSheet, this.showActionSheet;
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });

    AsyncStorage.getItem("leaderboard_setting").then((result) => {
      let res = JSON.parse(result);

      if (res) {
        if (res.switch_setting === "others") {
          this.setState({ switch: 1 });
        } else {
          this.setState({ switch: 0 });
        }
        if (res.filter.category_id) {
          this.setState({
            category_id: res.filter.category_id,
            category_name: res.filter.category_name,
          });
        }
        if (res.filter.month) {
          this.setState({ month: res.filter.month });
        }
        if (res.filter.year) {
          this.setState({ year: res.filter.year });
        }
      } else {
        this.setState({ switch: 0 });
      }
      this.getNetworkInfo();
    });

    this.getYears();
  }

  getNetworkInfo = async () => {
    this.setState({ loading: true, topData: [], listdata: [] });
    const netInfo = await Network.getNetworkStateAsync();
    const fetchPolicy = netInfo.isConnected ? "network-only" : "cache-only";
    let category_id = "",
      month = "",
      year = "";
    if (this.state.switch === 0) {
      month =
        new Date().getDay() < 7
          ? this.state.currentMonth.toString()
          : (this.state.currentMonth + 1).toString();
      year = this.state.currentYear.toString();
    } else {
      month = (this.state.month + 1).toString();
      year = this.state.year.toString();
      if (this.state.category_id) {
        category_id = this.state.category_id.toString();
      }
    }
    client
      .query({
        query: getLeaderBoard,
        fetchPolicy: fetchPolicy,
        variables: {
          category_id: category_id,
          month: month,
          year: year,
        },
      })
      .then((result) => {
        let topData = result.data.leaderboard.slice(0, 3);
        let listdata = result.data.leaderboard.slice(3, result.data.length);
        this.setState({
          topData: topData,
          listdata: listdata,
          refreshing: false,
          loading: false,
        });
      });
  };

  goToProfile = (id) => {
    this.props.navigation.navigate("UserProfile", { user_id: id });
  };

  refetch = () => {
    this.setState({ refreshing: true });
    this.getNetworkInfo();
  };

  showActionSheet = () => {
    this.ActionSheet.show();
  };

  onActionSheetAction = (buttonIndex) => {
    if (buttonIndex === 0) {
      this.setState({ modalVisible: true });
    } else if (buttonIndex === 1) {
      this.setState({ yearModalVisible: true });
    } else if (buttonIndex === 2) {
      this.setState({ monthModalVisible: true });
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
          if (res.filter) {
            res.filter.category_id = this.state.category_id;
            res.filter.category_name = this.state.category_name;
          } else {
            res.filter = {
              category_id: this.state.category_id,
              category_name: this.state.category_name,
            };
          }
          AsyncStorage.setItem("leaderboard_setting", JSON.stringify(res));
          this.getNetworkInfo();
        }
      });
    } else if (id === 2) {
      AsyncStorage.getItem("leaderboard_setting").then((result) => {
        let res = JSON.parse(result);
        if (res) {
          if (res.filter) {
            res.filter.year = this.state.year;
          } else {
            res.filter = { year: this.state.year };
          }
          AsyncStorage.setItem("leaderboard_setting", JSON.stringify(res));
          this.getNetworkInfo();
        }
      });
    } else if (id === 3) {
      AsyncStorage.getItem("leaderboard_setting").then((result) => {
        let res = JSON.parse(result);
        if (res) {
          if (res.filter) {
            res.filter.month = this.state.month;
          } else {
            res.filter = { month: this.state.month };
          }
          AsyncStorage.setItem("leaderboard_setting", JSON.stringify(res));
          this.getNetworkInfo();
        }
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
    let { year } = this.state;
    year = value;
    this.setState({ year });
  };

  handleMonthChange = (value) => {
    let { month } = this.state;
    month = value;
    this.setState({ month });
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
        <Text style={{ marginLeft: 10 }}>Month:{this.state.month + 1}</Text>
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

  render() {
    const { category_id, month, year } = this.state;
    if (this.state.me.id) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
          <ScrollView
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
            <View style={styles.leaderboardFiltersPopup}>
              <ActionSheet
                ref={(o) => (this.ActionSheet = o)}
                title={"Filter by"}
                options={["Topics", "Year", "Month", "Cancel"]}
                cancelButtonIndex={3}
                destructiveButtonIndex={3}
                onPress={this.onActionSheetAction}
              />
            </View>
            <View>
              <Text
                style={{
                  textAlign: "center",
                  fontSize: 20,
                  fontFamily: FontFamily.Bold,
                }}
              >
                Comming soon
              </Text>
              {/*<LeadboardOtherToggle navigate={this.props.navigation} />*/}
            </View>
          </ScrollView>
        </SafeAreaView>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  headerPageTitle: {
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
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  trendingCatgories: {
    padding: 10,
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    flexDirection: "row",
    justifyContent: "space-around",
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
    paddingTop: 20,
    paddingBottom: 20,
  },
  caretUp: {
    fontSize: 18,
    color: "#2ECC71",
    height: 15,
  },
  caretDown: {
    fontSize: 18,
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
  trendingUserName: {
    fontSize: 14,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    marginBottom: 3,
  },
  trendingUserPoints: {
    fontSize: 12,
    color: color.primaryColor,
    fontFamily: FontFamily.Bold,
  },
  LeaderboardCardContainer: {
    flexDirection: "row",
    marginTop: 10,
    marginBottom: 10,
  },
  LeaderboardCardsProgress: {
    alignItems: "center",
    flex: 1 / 7,
    flexDirection: "column",
    justifyContent: "center",
  },
  LeaderboardCards: {
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 42,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  cardPoints: {
    paddingRight: 3,
    marginTop: 20,
  },
  userProfile: {
    width: 45,
    height: 45,
    borderRadius: 90,
  },
  leadboardModal: {
    backgroundColor: "rgba(0, 0, 0, .1)",
    flex: 1,
    flexDirection: "column",
    // height:Dimensions.get('window').height/2,
  },
  leadboardModalContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "20%",
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
  },
  TopicPageCheckboxes: {
    marginRight: 20,
  },
  modalCloseIcon: {
    marginRight: 10,
    height: 22,
    lineHeight: 28,
  },
});

export default LeaderboardOfferScreen;
