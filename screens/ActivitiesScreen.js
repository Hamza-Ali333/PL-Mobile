import React, { Component } from "react";
import {
  ActivityIndicator,
  Dimensions,
  View,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  TouchableOpacity,
  RefreshControl,
  FlatList,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import client from "../constants/client";
import { Query } from "react-apollo";
import capitalize from "../helper/capitalize";
import ProfilePhoto from "../components/ProfilePhoto";
import TimeAgo from "../components/TimeAgo";
import readNotificationMutation from "../graphql/mutations/readNotificationMutation";
import getNotifications from "../graphql/queries/getNotifications";
import * as Network from "expo-network";
import ActivitiesFilterComponent from "../components/ActivitiesFilterComponent";
import { clockRunning } from "react-native-reanimated";
import moment, { locale } from "moment";
import ListItem from "../components/Skeleton/ListItem";
import { Divider } from "react-native-paper";
import NoWifi from "../components/NoWifi";
const SCREEN_HEIGHT = Dimensions.get("window").height;

class ActivitiesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      footerLoading: false,
      refreshing: false,
      me: {},
      componentLoad: false,
      fetchPolicy: null,
      show: false,
      notify_type: 1,
      filterText: "Activities",
      isFilterOpen: false,
    };
  }

  showHideComponent = () => {
    this.setState({ show: !this.state.show });
  };

  applyFilter = (notify_type) => {
    this.setState({
      notify_type: notify_type,
      isFilterOpen: !this.state.isFilterOpen,
    });
    var filterText = "Activities";
    if (notify_type === 2) {
      filterText = "Likes";
    } else if (notify_type === 3) {
      filterText = "Answers";
    } else if (notify_type === 4) {
      filterText = "Comments";
    } else if (notify_type === 5) {
      filterText = "Followers";
    }
    this.props.navigation.setParams({ offerFilterText: filterText });
  };

  renderFooter() {
    return this.state.footerLoading ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
  };

  _convertData = (data) => {};

  _routeToDetailScreen = (notify) => {
    if (notify.read_at === null) {
      client
        .mutate({
          mutation: readNotificationMutation,
          variables: {
            id: notify.id,
          },
          optimisticResponse: {
            __typename: "Mutation",
            readNotification: {
              __typename: "Notifications",
              read_at: "read",
            },
          },

          update: (cache, { data: { readNotification } }) => {
            try {
              const data = cache.readQuery({
                query: getNotifications,
                variables: { getAll: true },
              });

              const readLink = data.me.notifications.data.find(
                (item) => item.id === notify.id
              );

              readLink.read_at = readNotification.read_at;

              cache.writeQuery({
                query: getNotifications,
                data: data,
              });
            } catch (e) {}
          },
        })
        .then((results) => {})
        .catch((error) => {});
    }

    if (notify.data.type === "Question") {
      this.props.navigation.navigate("NotificationAnswer", {
        id: notify.data.id,
      });
    }

    if (notify.data.type === "Comment") {
      this.props.navigation.navigate("NotificationComment", {
        id: notify.data.answer_id,
        question_id: notify.data.question_id,
      });
    }

    if (notify.data.type === "Answer") {
      this.props.navigation.navigate("NotificationAnswer", {
        id: notify.data.question_id,
        answer_id: notify.data.answer_id,
      });
    }
  };

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
    this.props.navigation.setParams({
      showHideComponent: this.showHideComponent,
    });
    this.props.navigation.setParams({ isComponentshow: false });
    this.props.navigation.setParams({ openOfferFilter: this.openOfferFilter });
    this.props.navigation.setParams({ offerFilterText: this.state.filterText });
    this.props.navigation.addListener("didFocus", this.didFocus);
  }

  componentWillMount() {
    this.getNetworkInfo();
  }

  didFocus = () => {
    if (this.props.navigation.getParam("status") === 0) {
      this.setState({ filter_id: 2, filterText: "Draft" });
      this.props.navigation.setParams({ offerFilterText: "Draft" });
      setTimeout(() => {
        this.tapOnTabNavigator();
      }, 1000);
    } else if (this.props.navigation.getParam("status") === 1) {
      this.setState({ filter_id: 1, filterText: "Published" });
      this.props.navigation.setParams({ offerFilterText: "Published" });
      setTimeout(() => {
        this.tapOnTabNavigator();
      }, 1000);
    }
  };

  getNetworkInfo = async () => {
    const netInfo = await Network.getNetworkStateAsync();
    const fetchPolicy = netInfo.isConnected ? "network-only" : "cache-only";
    this.setState({ fetchPolicy: fetchPolicy });
  };

  handlerLongClick = () => {
    alert("long");
  };

  applyOfferFilters = (filters, filterText) => {
    this.setState(filters);
    this.props.navigation.setParams({ offerFilterText: filterText });
  };

  openOfferFilter = () => {
    this.setState({ isFilterOpen: !this.state.isFilterOpen });
  };

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: SCREEN_HEIGHT,
        }}
      >
        <Text>No activity found</Text>
      </View>
    );
  };

  render() {
    const { notify_type } = this.state;
    let variables = {};
    if (notify_type === 2) {
      variables.getLikes = true;
    } else if (notify_type === 3) {
      variables.getAnswers = true;
    } else if (notify_type === 4) {
      variables.getComments = true;
    } else if (notify_type === 5) {
      variables.getfollowers = true;
    } else {
      variables.getAll = true;
    }

    if (this.state.me.id) {
      return (
        <SafeAreaView style={{ flex: 1, backgroundColor: "#fff" }}>
          <View
            style={{
              flex: 1,
              backgroundColor: "#fff",
            }}
          >
            <Query query={getNotifications} variables={variables}>
              {({ loading, error, data, fetchMore, refetch }) => {
                {
                  /* this.refetch = refetch */
                }
                if (loading)
                  return (
                    <>
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                      <ListItem />
                      <Divider />
                    </>
                  );

                if (error) return <NoWifi />;

                if (data) {
                  console.log("Notifications", data);
                }

                return (
                  <FlatList
                    extraData={this.state}
                    data={data.me.notifications.data}
                    renderItem={({ item }) => {
                      return (
                        <TouchableOpacity
                          style={[
                            {
                              backgroundColor: item.read_at
                                ? "#ffffff"
                                : "#e9ecef",
                            },
                          ]}
                          onPress={() => this._routeToDetailScreen(item)}
                        >
                          <View style={styles.ListItems}>
                            <ProfilePhoto
                              size={40}
                              item={item.sender}
                              me={this.state.me}
                            />
                            <View style={{ flex: 1 }}>
                              <View
                                style={{
                                  flex: 1,
                                  flexDirection: "row",
                                  justifyContent: "space-between",
                                }}
                              >
                                <Text style={styles.msgUserName}>
                                  {item.sender &&
                                    capitalize(item.sender.firstname)}{" "}
                                  {item.sender &&
                                    item.sender.lastname &&
                                    capitalize(item.sender.lastname)}{" "}
                                </Text>

                                <View>
                                  <Text style={styles.msgDescription}>
                                    {moment(item.created_at).format(
                                      "YYYY-MM-DD"
                                    )}
                                  </Text>
                                  {/* <TimeAgo
                                    style={styles.msgTime}
                                    created_at={item.created_at}
                                  /> */}
                                </View>
                              </View>

                              <View style={{ flex: 1 }}>
                                <Text
                                  style={styles.msgDescription}
                                  numberOfLines={1}
                                >
                                  {item.message}
                                </Text>
                              </View>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    onEndReachedThreshold={0.5}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    ListEmptyComponent={this._listEmptyComponent}
                    refreshControl={
                      <RefreshControl
                        refreshing={this.state.refreshing}
                        tintColor={color.primaryColor}
                        onRefresh={() => {
                          refetch();
                          this._onRefresh.bind(this);
                        }}
                      />
                    }
                    onEndReached={() => {
                      fetchMore({
                        variables: {
                          cursor:
                            data.me.notifications.paginatorInfo.currentPage + 1,
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                          const newNotifications =
                            fetchMoreResult.me.notifications.data;
                          const pageInfo =
                            fetchMoreResult.me.notifications.paginatorInfo;

                          if (!pageInfo.hasMorePages) {
                            this.setState({ footerLoading: false });
                          } else {
                            this.setState({ footerLoading: true });
                          }
                          clockRunning();

                          //return [...previousResult, ...fetchMoreResult];

                          return newNotifications.length
                            ? {
                                // Put the new comments at the end of the list and update `pageInfo`
                                // so we have the new `endCursor` and `hasNextPage` values
                                me: {
                                  id: previousResult.me.id,
                                  __typename: previousResult.me.__typename,
                                  notifications: {
                                    __typename:
                                      previousResult.me.notifications
                                        .__typename,
                                    data: [
                                      ...previousResult.me.notifications.data,
                                      ...newNotifications,
                                    ],
                                    paginatorInfo: pageInfo,
                                  },
                                },
                              }
                            : previousResult;
                        },
                      });
                    }}
                  />
                );
              }}
            </Query>
          </View>
          {this.state.isFilterOpen && (
            <ActivitiesFilterComponent
              _applyFilter={this.applyFilter}
              _notify_type={this.state.notify_type}
              _show={this.state.show}
              _showHideComponent={this.showHideComponent}
            />
          )}
        </SafeAreaView>
      );
    } else {
      return null;
    }
  }
}

ActivitiesScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
    shadowOpacity: 0,
  },
  headerTitle: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("openOfferFilter")}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
        marginLeft: -25,
      }}
    >
      <Text style={styles.headerPageTitle}>
        {screenProps.navigation.getParam("offerFilterText")}
      </Text>
      <Image
        style={{ width: 15, height: 15, resizeMode: "contain" }}
        source={require("../assets/images/ArrowDown.png")}
      />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
    marginRight: 10,
  },
  msgDayPeriods: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 16,
    marginBottom: 20,
  },
  childmsgDayPeriods: {
    marginTop: 30,
  },
  ListItems: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    position: "relative",
    marginLeft: 15,
    marginRight: 15,
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 1,
    borderBottomWidth: 1,
    borderColor: "#f8f9fa",
  },
  firstListItem: {
    paddingTop: 0,
  },
  msgProfileImage: {
    marginRight: 10,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  onlineShown: {
    backgroundColor: color.primaryColor,
    width: 8,
    height: 8,
    borderRadius: 10,
    position: "absolute",
    right: 0,
    bottom: 0,
  },
  msgUserName: {
    fontSize: 15,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
  msgTime: {
    fontSize: 11,
    fontFamily: FontFamily.Regular,
    color: "#424242",
  },
  msgDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 12,
  },
  acceptButton: {
    width: 70,
    height: 25,
    paddingTop: 4,
    borderRadius: 4,
    backgroundColor: color.primaryColor,
  },
  rejectButton: {
    width: 70,
    height: 25,
    paddingTop: 4,
    borderRadius: 4,
    backgroundColor: "#E9F2F8",
    marginLeft: 10,
  },
});

export default ActivitiesScreen;
