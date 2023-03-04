import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import myAnswers from "../graphql/queries/myAnswers";
import FeedTabWithoutProfile from "./FeedTabWithoutProfile";
import { Query } from "react-apollo";
import * as Network from "expo-network";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class ProfilePageAnswerTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      me: {},
      hasMorePage: false,
      opacity: 1,
    };
    this.refetch;
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res, profile_photo: res.profile_photo });
    });
    this.tapOnTabNavigator();
    this.props.navigate.addListener("didFocus", () => {
      this._onRefresh();
    });
  }

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  _onRefresh = () => {
    this.refetch();
  };

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        this.refetch();
      }
    }
  };

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "7%",
        }}
      >
        <Text
          style={{
            fontSize: 18,
            fontFamily: FontFamily.Regular,
            color: color.blackColor,
          }}
        >
          No answer found.
        </Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => this.props.navigate.navigate("Feed")}
        >
          <Text style={styles.postText}>Join a discussion</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    return (
      <View style={{ backgroundColor: "#fff", flex: 1 }}>
        <Query query={myAnswers}>
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
            if (loading)
              return (
                <View>
                  <ActivityIndicator size="small" color={color.primaryColor} />
                </View>
              );

            if (error)
              return (
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Image source={require("../assets/images/wifi.png")} />
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>No Internet Connection</Text>
                    <Text>Could not connected to the network </Text>
                    <Text>Please check and try again.</Text>
                    <Button title="Retry" onPress={() => refetch()} />
                  </View>
                </View>
              );

            return (
              <FlatList
                extraData={this.state}
                data={data.me.answers.data}
                renderItem={({ item, key }) => {
                  return (
                    <FeedTabWithoutProfile
                      tab={2}
                      me={this.state.me}
                      style={this.props.style}
                      navigation={this.props.navigate}
                      item={item}
                    />
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                onEndReachedThreshold={1200}
                ListFooterComponent={this.renderFooter.bind(this)}
                ListEmptyComponent={this._listEmptyComponent}
                refreshControl={
                  <RefreshControl
                    tintColor={color.primaryColor}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                      refetch();
                      this._onRefresh.bind(this);
                    }}
                  />
                }
                onEndReached={() => {
                  fetchMore({
                    variables: {
                      cursor: data.me.answers.paginatorInfo.currentPage + 1,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newQuestions = fetchMoreResult.me.answers.data;
                      const pageInfo = fetchMoreResult.me.answers.paginatorInfo;
                      if (
                        data.me.answers.paginatorInfo.total !== pageInfo.total
                      ) {
                        refetch();
                      }

                      //return [...previousResult, ...fetchMoreResult];
                      if (pageInfo.hasMorePages) {
                        this.setState({ hasMorePage: true });
                      } else {
                        this.setState({ hasMorePage: false });
                      }
                      return newQuestions.length
                        ? {
                            // Put the new comments at the end of the list and update `pageInfo`
                            // so we have the new `endCursor` and `hasNextPage` values
                            me: {
                              __typename: previousResult.me.__typename,
                              id: previousResult.me.id,
                              answers: {
                                __typename:
                                  previousResult.me.answers.__typename,
                                data: [
                                  ...previousResult.me.answers.data,
                                  ...newQuestions,
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
    );
  }
}

const styles = StyleSheet.create({
  postButton: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 15,
  },
});

export default ProfilePageAnswerTabs;
