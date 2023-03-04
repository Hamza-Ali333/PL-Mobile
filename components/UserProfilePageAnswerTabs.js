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
import userAnswers from "../graphql/queries/userAnswers";
import FeedTabWithoutProfile from "./FeedTabWithoutProfile";
import { Query } from "react-apollo";
import * as Network from "expo-network";

class UserProfilePageAnswerTabs extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      me: {},
      hasMorePage: false,
      opacity: 1,
      user_id: this.props.user_id,
    };
    this.refetch;
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res, profile_photo: res.profile_photo });
    });
    this.props.navigate.addListener("didFocus", this.tapOnTabNavigator);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.user_id !== nextProps.user_id) {
      this.setState({ user_id: nextProps.user_id }, this.tapOnTabNavigator);
    }
  }

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
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
        <Text>No answer found.</Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => this.props.navigate.goBack()}
        >
          <Text style={styles.postText}>Join a discussion</Text>
        </TouchableOpacity>
      </View>
    );
  };

  render() {
    let height = {};
    if (this.props.index !== 1) {
      height = { height: 0 };
    }
    return (
      <View style={[{ backgroundColor: "#F7F7F7" }, height]}>
        <Query query={userAnswers} variables={{ id: this.state.user_id }}>
          {({ loading, error, data, fetchMore, refetch }) => {
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
                nestedScrollEnabled
                extraData={this.state}
                data={data.user.answers.data}
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
                      cursor: data.user.answers.paginatorInfo.currentPage + 1,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newQuestions = fetchMoreResult.user.answers.data;
                      const pageInfo =
                        fetchMoreResult.user.answers.paginatorInfo;
                      if (
                        data.user.answers.paginatorInfo.total !== pageInfo.total
                      ) {
                        refetch();
                      }

                      if (pageInfo.hasMorePages) {
                        this.setState({ hasMorePage: true });
                      } else {
                        this.setState({ hasMorePage: false });
                      }
                      return newQuestions.length
                        ? {
                            user: {
                              __typename: previousResult.user.__typename,
                              id: previousResult.user.id,
                              answers: {
                                __typename:
                                  previousResult.user.answers.__typename,
                                data: [
                                  ...previousResult.user.answers.data,
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

export default UserProfilePageAnswerTabs;
