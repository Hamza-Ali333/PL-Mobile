import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Button,
  ActivityIndicator,
  RefreshControl,
  Share,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily.js";
import { AntDesign } from "@expo/vector-icons";
import FeedTab from "./FeedTab";
import { Query } from "react-apollo";
import {
  _handleLikePressed,
  _handleDislikePressed,
  _handleSavedPressed,
  _handleUnsavedPressed,
} from "./CombineFunction";
import getQuestions from "../graphql/queries/getQuestions";
import deleteQuestionMutation from "../graphql/mutations/deleteQuestionMutation";
import LottieView from "lottie-react-native";
import OptimizedFlatList from "./OptimizedFlatList";
import ActionSheet from "react-native-actionsheet";
import link from "../constants/link";
import client from "../constants/client";

class DiscussionComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      me: {},
      hasMorePage: false,
      search: "",
      isLoaded: false,
      optionVisible: false,
      unanswered: false,
      newq: false,
      hot: false,
      filterText: "All Topics",
      sortText: "",
      currntStatus: null,
      status: "...",
      tag: null,
      tag_title: "",
      modalVisible: false,
      all: true,
      reportDescription: "",
      feedbackLoading: false,
      user: {},
      is_follower: null,
      unanswered_question: false,
      filter_id: 0,
      reportType: "",
      isReportType: true,
      item: {},
      visible: false,
    };
    this.refetch;
    this.optionHideModal = this.optionHideModal.bind(this);
    this.optionShowModal = this.optionShowModal.bind(this);
    this.optionShowModalMore = this.optionShowModalMore.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.confirmQuestionDelete = this.confirmQuestionDelete.bind(this);
    this.delayTimer;
  }

  UNSAFE_componentWillMount() {
    //this.props.navigation.navigate("MentionTest");

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState(
        { me: res, profile_photo: res.profile_photo },
        this.categorySettingTrigger
      );
    });
  }
  componentDidMount() {
    this.setState({
      isLoading: false,
      category: null,
      question_id: null,
    });
  }
  componentDidUpdate(prevProps) {
    if (prevProps.index === this.props.index) {
      // this.refetch();
      // this.forceUpdate();
    }
  }

  showModal() {
    this.setState({ visible: !this.state.visible });
    this.props.navigation.setParams({ isFilterVisible: !this.state.visible });
  }
  hideModal() {
    this.setState({ visible: false });
    this.props.navigation.setParams({ isFilterVisible: false });
  }
  navigateDetail = (props) => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate("NotificationAnswer", {
        id: props.item.id,
        filterTag: this._FilterTag,
        isBack: true,
      });
    });
  };

  optionHideModal = () => {
    //this.ActionSheet.show()
    //this.setState({ optionVisible: false });
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
      this.props.navigation.navigate("NewPost", { id: this.state.question_id });
    }
    if (index === 1) {
      this.onShare();
    }
    if (index === 2) {
      this.confirmQuestionDelete();
    }
  };
  onClipboard = async () => {
    await Clipboard.setString(
      link.url + "/discussions/" + this.state.item.slug
    );
    Alert.alert(
      "Successful!",
      "Copied to Clipboard!",
      [
        {
          text: "OK",
          onPress: () => {},
        },
      ],
      { cancelable: true }
    );
  };

  _onActionSheetOthersAction = (buttonIndex) => {
    if (buttonIndex === 0) {
      this.onShare();
    }
    if (buttonIndex === 1) {
      this.onClipboard();
    }
    if (buttonIndex === 2) {
      this.setState({ modalVisible: true, isReportType: true });
    }
  };
  _onActionSheetOthersActionDismiss = () => {
    this.setState({
      modalVisible: false,
    });
  };

  textInput() {
    this.setState({ text: "sss" });
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
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
    } catch (error) {
      alert(error.message);
    }
  };

  deleteQuestionMutation = () => {
    // this.setState({ currntStatus: this.state.question_id });
    client
      .mutate({
        mutation: deleteQuestionMutation,
        variables: {
          question_id: this.state.question_id,
        },

        optimisticResponse: (vars) => {
          return {
            deleteQuestion: {
              error: false,
              message: "Question has been deleted successfully",
              __typename: "DeleteQuestion",
              payload: {
                id: vars.question_id,
                __typename: "Question",
              },
            },
          };
        },
        update: (cache, result) => {
          if (result.data.deleteQuestion.error === false) {
            const deletedQuestion = cache.identify(
              result.data.deleteQuestion.payload
            );
            console.log("deletedQuestion", deletedQuestion);
            cache.modify({
              fields: {
                Question: (existingQuestionRefs) => {
                  console.log("existingQuestionRefs", existingQuestionRefs);
                  return existingQuestionRefs?.data?.filter((questionRef) => {
                    return cache.identify(questionRef) !== deletedQuestion;
                  });
                },
              },
            });
            cache.evict({ id: deletedQuestion });
          }
        },
      })
      .then((result) => {
        this.setState({ currntStatus: null });
      })
      .catch((error) => {
        this.setState({ currntStatus: null });
      });
  };

  confirmQuestionDelete = () => {
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
  };

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  refetch = () => {
    this.refetch();
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
        navigate={this.props.navigation}
        navigateDetail={this.navigateDetail}
        me={this.state.me}
        key={index}
        isLoaded={this.state.isLoaded}
        setFinishLoading={this._setFinishLoading}
        currntStatus={this.state.currntStatus}
        tag={this.state.tag}
      />
    );
  };

  render() {
    const { navigation, item, is_pro } = this.props;

    let variables = {};
    if (item.id) {
      variables.course_id = item.id;
    }
    return (
      <View
        style={{ ...styles.container }}
        onLayout={(event) => {
          this.props.setTab2Height(event.nativeEvent.layout.height);
        }}
      >
        <Query query={getQuestions} variables={variables}>
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
            if (loading)
              return (
                <View>
                  <LottieView
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                    }}
                    source={require("../assets/lottie/list-loader.json")}
                    autoPlay
                    loop
                  />
                </View>
              );

            if (error) {
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
                    <Text
                      style={{
                        color: color.grayColor,
                        fontFamily: FontFamily.Medium,
                        fontSize: 16,
                        marginBottom: 8,
                      }}
                    >
                      No Internet Connection
                    </Text>
                    <Text
                      style={{
                        color: color.grayColor,
                        fontFamily: FontFamily.Regular,
                        fontSize: 12,
                      }}
                    >
                      Could not connected to the network{" "}
                    </Text>
                    <Text
                      style={{
                        color: color.grayColor,
                        fontFamily: FontFamily.Regular,
                        fontSize: 12,
                      }}
                    >
                      Please check and try again.
                    </Text>
                    <Button title="Retry" onPress={() => refetch()} />
                  </View>
                </View>
              );
            }

            if (data) {
              return (
                <OptimizedFlatList
                  ref={(r) => (this.flatlistRef = r)}
                  refreshing={data.networkStatus === 4}
                  extraData={this.state}
                  data={data.questions.data}
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
                        cursor: data.questions.paginatorInfo.currentPage + 1,
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newQuestions = fetchMoreResult.questions.data;
                        const pageInfo =
                          fetchMoreResult.questions.paginatorInfo;
                        if (
                          data.questions.paginatorInfo.total !== pageInfo.total
                        ) {
                          // refetch();
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
                              questions: {
                                __typename: previousResult.questions.__typename,
                                data: [
                                  ...previousResult.questions.data,
                                  ...newQuestions,
                                ],
                                paginatorInfo: pageInfo,
                              },
                            }
                          : previousResult;
                      },
                    });
                  }}
                />
              );
            } else {
              return null;
            }
          }}
        </Query>

        <View style={{ height: 30 }} />

        {item.is_enroll || item?.is_training === "0" ? (
          <TouchableOpacity
            onPress={() =>
              navigation.navigate("AccessScreen", {
                type: "course_discussion",
                courseId: item.id,
              })
            }
            style={styles.fillBtn}
          >
            <AntDesign name="plus" size={24} color={color.whiteColor} />
            <Text style={styles.fillBtnText}>Add Discussion</Text>
          </TouchableOpacity>
        ) : item?.data_type === "PAST_EVENT" ? (
          <Text
            style={{
              textAlign: "center",
              fontFamily: FontFamily.Regular,
              color: color.grayColor,
            }}
          >
            You can't participate in discussion because this event has expired.
          </Text>
        ) : (
          <>
            <Text
              style={{
                alignSelf: "center",
                fontFamily: FontFamily.Regular,
                color: color.grayColor,
                marginVertical: 13,
              }}
            >
              {item?.data_type === "PRODUCT"
                ? "Kindly buy this product to participate in discussion."
                : "Kindly enroll in this course to participate in discussion."}
            </Text>
            {is_pro && item?.data_type === "PRODUCT" ? (
              false
            ) : (
              <TouchableOpacity
                style={styles.fillBtn}
                onPress={() => {
                  item?.data_type === "PRODUCT"
                    ? this.props.navigation.navigate("PaymentPlan", {
                        item: {
                          id: item.id,
                          price: item.course_objective,
                          name: item.course_name,
                          __typename: "Product",
                          type: "Additional Resources",
                          course_id: item.id,
                          is_shippable: item.is_shippable,
                        },
                      })
                    : this.props.navigation.navigate("PackagesPlan");
                }}
              >
                <Text style={styles.fillBtnText}>
                  {item?.data_type === "PRODUCT"
                    ? `Price $${item.course_objective}`
                    : "To access, sign-up for Pro"}
                </Text>
              </TouchableOpacity>
            )}
          </>
        )}

        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          options={[
            //this.state.status === 0 ? "Publish" : "Private",
            "Edit",
            "Share",
            "Delete",
            "Cancel",
          ]}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={this._onActionSheetAction}
        />

        <ActionSheet
          ref={(o) => (this.ActionSheetOthers = o)}
          options={["Share", "Copy", "Report & Block", "Cancel"]}
          cancelButtonIndex={3}
          destructiveButtonIndex={2}
          onPress={this._onActionSheetOthersAction}
        />
      </View>
    );
  }
}
export default DiscussionComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#fff",
    margin: 10,
    borderColor: "#CCCFD6",
  },

  fillBtn: {
    marginBottom: 13,
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  fillBtnText: {
    color: "#fff",
    fontFamily: FontFamily.Medium,
    fontSize: 18,
  },
});
