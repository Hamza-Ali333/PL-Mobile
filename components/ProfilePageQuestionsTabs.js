import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import React from "react";
import { Query } from "react-apollo";
import {
  ActivityIndicator,
  Alert,
  RefreshControl,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import {
  _handleDislikePressed,
  _handleLikePressed,
  _handleSavedPressed,
  _handleUnsavedPressed,
} from "../components/CombineFunction";
import FeedTab from "../components/FeedTab";
import OptimizedFlatList from "../components/OptimizedFlatList";
import client from "../constants/client";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import deleteQuestionMutation from "../graphql/mutations/deleteQuestionMutation";
import getQuestions from "../graphql/queries/getQuestions";
import myQuestions from "../graphql/queries/myQuestions";
import NoWifi from "./NoWifi";
import SinglePost from "./Skeleton/SinglePost";

class ProfilePageQuestionsTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      me: {},
      hasMorePage: false,
      opacity: 1,
      currntStatus: null,
    };
    this.refetch;
    this.optionShowModal = this.optionShowModal.bind(this);
    this.optionShowModalMore = this.optionShowModalMore.bind(this);
    this.delayTimer;
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res, profile_photo: res.profile_photo });
    });
    this.props.navigate.addListener("didFocus", this.tapOnTabNavigator);
    this._onRefresh();
  }

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color="black" style={{ margin: 15 }} />
    ) : null;
  }

  navigateDetail = (props) => {
    requestAnimationFrame(() => {
      this.props.navigate.navigate("NotificationAnswer", {
        id: props.item.id,
        filterTag: this._FilterTag,
        isBack: true,
      });
    });
  };

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
        <Text>No question found. Start a new discussion.</Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => this.props.navigate.navigate("Post")}
        >
          <Text style={styles.postText}>Post Discussion</Text>
        </TouchableOpacity>
      </View>
    );
  };

  confirmQuestionDelete() {
    Alert.alert(
      "Delete",
      "Are you sure you want to delete this?",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        { text: "OK", onPress: this.deleteQuestionMutation },
      ],
      { cancelable: false }
    );
  }

  _shouldItemUpdate = (prev, next) => {
    return prev.state !== next.state;
  };

  optionShowModal = (item, user) => {
    this.setState({ item: item, question_id: item.id, user: user });
    this.ActionSheet.show();
  };

  optionShowModalMore = (item, user) => {
    this.setState({ item: item, question_id: item.id, user: user });
    this.ActionSheetOthers.show();
  };

  _onActionSheetAction = (index) => {
    if (index === 0) {
      this.props.navigate.navigate("NewPost", { id: this.state.question_id });
    }
    if (index === 1) {
      this.onShare();
    }
    if (index === 2) {
      this.confirmQuestionDelete();
    }
  };

  _onActionSheetOthersAction = (buttonIndex) => {
    if (buttonIndex === 0) {
      this.setState({ modalVisible: true });
    }
  };
  _onActionSheetOthersActionDismiss = () => {
    this.setState({
      modalVisible: false,
    });
  };

  deleteQuestionMutation = () => {
    // this.setState({ currntStatus: this.state.question_id });
    client
      .mutate({
        mutation: deleteQuestionMutation,
        variables: {
          question_id: this.state.question_id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          deleteQuestion: {
            __typename: "DeleteQuestion",
            message: "",
          },
        },
        update: (cache, { data: { deleteQuestion } }) => {
          //this is for deleting the question on Question feed screen
          this.deleteQuestionFromGetQuestion(cache);
          //this will delete my Question
          this.deleteQuestionFromMyQuestion(cache);

          this.props.onDelete();
        },
      })
      .then((result) => {
        // this.setState({ currntStatus: null });
        this.props.confirmQuestionDelete();
      })
      .catch((error) => {
        // this.setState({ currntStatus: null });
      });
  };

  deleteQuestionFromMyQuestion = (cache) => {
    try {
      const data = cache.readQuery({
        query: myQuestions,
      });

      const index = data.me.questions.data.findIndex(
        (data) => data.id === this.state.question_id
      );
      if (index > -1) {
        data.me.questions.data.splice(index, 1);
      }
      cache.writeQuery({ query: myQuestions, data });
    } catch (e) {}
  };

  deleteQuestionFromGetQuestion = (cache) => {
    try {
      const data = cache.readQuery({
        query: getQuestions,
      });

      const index = data.questions.data.findIndex(
        (data) => data.id === this.state.question_id
      );
      if (index > -1) {
        data.questions.data.splice(index, 1);
      }
      cache.writeQuery({ query: getQuestions, data });
    } catch (e) {}
  };
  renderItem = ({ item, index }) => {
    return (
      <FeedTab
        handleLikePressed={_handleLikePressed}
        handleDislikePressed={_handleDislikePressed}
        handleSavedPressed={_handleSavedPressed}
        handleUnsavedPressed={_handleUnsavedPressed}
        actionShow={this.optionShowModal}
        actionShowMore={this.optionShowModalMore}
        onChangeText={this.textInput}
        item={item}
        navigate={this.props.navigate}
        navigateDetail={this.navigateDetail}
        me={this.state.me}
        key={index}
        isLoaded={this.state.isLoaded}
        setFinishLoading={this._setFinishLoading}
        currntStatus={this.state.currntStatus}
        isTag={true}
      />
    );
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message: link.url + "/discussions/" + this.state.item.slug,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
  };

  render() {
    return (
      <View style={{ backgroundColor: "#ffffff" }}>
        <Query query={myQuestions}>
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
            if (loading) return <SinglePost />;

            if (error)
              return (
                <View
                  style={{
                    height: 300,
                  }}
                >
                  <NoWifi onPress={() => refetch()} />
                </View>
              );

            return (
              <OptimizedFlatList
                ref={(r) => (this.flatlistRef = r)}
                refreshing={data.networkStatus === 4}
                extraData={this.state}
                data={data.me.questions.data}
                renderItem={this.renderItem}
                showsVerticalScrollIndicator={false}
                initialListSize={10}
                keyExtractor={this.keyExtractor}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                onEndReachedThreshold={0.5}
                onViewableItemsChanged={this.onViewableItemsChanged}
                viewabilityConfig={{
                  itemVisiblePercentThreshold: 50,
                }}
                //ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
                ListFooterComponent={this.renderFooter.bind(this)}
                ListEmptyComponent={this._listEmptyComponent}
                contentContainerStyle={{ flexGrow: 1 }}
                refreshControl={
                  <RefreshControl
                    tintColor={color.primaryColor}
                    refreshing={this.state.refreshing}
                    onRefresh={() => {
                      this.setState({ isLoaded: true });
                      refetch();
                      this._onRefresh.bind(this);
                    }}
                  />
                }
                onEndReached={() => {
                  fetchMore({
                    variables: {
                      cursor: data.me.questions.paginatorInfo.currentPage + 1,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newQuestions = fetchMoreResult.me.questions.data;
                      const pageInfo =
                        fetchMoreResult.me.questions.paginatorInfo;
                      if (
                        data.me.questions.paginatorInfo.total !== pageInfo.total
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
                              questions: {
                                __typename:
                                  previousResult.me.questions.__typename,
                                data: [
                                  ...previousResult.me.questions.data,
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
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          options={[
            //this.state.status === 0 ? "Publish" : "Private",
            "Edit",
            "Share",
            "Delete",
            "cancel",
          ]}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={this._onActionSheetAction}
        />

        <ActionSheet
          ref={(o) => (this.ActionSheetOthers = o)}
          title={"Reports this content"}
          options={["Report & Block", "cancel"]}
          cancelButtonIndex={1}
          destructiveButtonIndex={0}
          onPress={this._onActionSheetOthersAction}
        />
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

export default ProfilePageQuestionsTabs;
