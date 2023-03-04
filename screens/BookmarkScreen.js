import React from "react";
import {
  Alert,
  Dimensions,
  ActivityIndicator,
  Button,
  Image,
  View,
  TouchableOpacity,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
  RefreshControl,
  Modal,
  Share,
  Clipboard,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Ionicons } from "@expo/vector-icons";

import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import FeedTab from "../components/FeedTab";
import QuestionFilter from "../components/QuestionFilter";
import OptimizedFlatList from "../components/OptimizedFlatList";
import getQuestions from "../graphql/queries/getQuestions";
import client from "../constants/client";
import deleteQuestionMutation from "../graphql/mutations/deleteQuestionMutation";
import questionStatusMutation from "../graphql/mutations/questionStatusMutation";
import reportMessageMutation from "../graphql/mutations/reportMessageMutation";
import {
  _handleLikePressed,
  _handleDislikePressed,
  _handleSavedPressed,
  _handleUnsavedPressed,
} from "../components/CombineFunction";
import { List, Chip, Divider } from "react-native-paper";
import ActionSheet from "react-native-actionsheet";
import { Query } from "react-apollo";
import LottieView from "lottie-react-native";
import * as Network from "expo-network";
import link from "../constants/link";
import SinglePost from "../components/Skeleton/SinglePost.js";
import gstyles from "../constants/gstyles.js";
import NoWifi from "../components/NoWifi/index.js";

class BookmarkScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      url: "",
      profile_photo: "",
      refreshing: false,
      me: {},
      hasMorePage: false,
      search: "",
      isLoaded: false,
      optionVisible: false,
      unanswered: false,
      newq: false,
      hot: false,
      filterText: "",
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
      reportType: "",
      isReportType: true,
    };
    this.refetch;
    this.optionShowModal = this.optionShowModal.bind(this);
    this.optionShowModalMore = this.optionShowModalMore.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.confirmQuestionDelete = this.confirmQuestionDelete.bind(this);
    this.delayTimer;
  }

  componentWillMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res, profile_photo: res.profile_photo });
    });

    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop,
    });
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  componentDidMount() {
    this.setState({
      isLoading: false,
      visible: false,
      category: null,
      question_id: null,
    });

    this.props.navigation.setParams({ Doit: this._OpenFilterModel });
    this.props.navigation.setParams({ filterTag: this._FilterTag });
    this.props.navigation.setParams({
      openBottomFilter: this._openBottomFilter,
    });
    this.props.navigation.setParams({ searchFilter: this._onSearchFilter });
    this._notificationSubscription =
      Notifications.addNotificationReceivedListener(this._handleNotification);

    Linking.getInitialURL()
      .then((url) => {
        if (url) {
          let ev = { url: url };
          this._handleURL(ev);
        }
      })
      .catch((err) => {});

    Linking.addEventListener("url", this._handleURL);

    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  _reportType = (txt) => {
    this.setState({ reportType: txt, isReportType: false });
  };

  _scrollToTop = () => {
    // Scroll to top, in this case I am using FlatList
    if (!!this.flatlistRef) {
      this.flatlistRef.scrollToOffset({ offset: 0, animated: true });
    }
  };

  _handleURL = (event) => {
    let { path, queryParams } = Linking.parse(event.url);
    if (path === "shareQuestion") {
      this.props.navigation.navigate("NotificationAnswer", {
        id: queryParams.id,
      });
    }
  };

  _FilterTag = (id, title) => {
    this.setState({
      unanswered: false,
      newq: false,
      hot: false,
      my: false,
      visible: false,
      filterText: "",
      category: null,
      tag: id,
      tag_title: title,
    });
  };

  _OpenFilterModel = (id) => {
    this.setState({
      unanswered: false,
      newq: false,
      hot: false,
      my: false,
      visible: false,
      filterText: "",
      category: id,
      tag: null,
    });
  };

  _onSearchFilter = (search) => {
    clearTimeout(this.delayTimer);
    this.delayTimer = setTimeout(() => {
      this.setState({
        unanswered: false,
        newq: false,
        hot: false,
        my: false,
        visible: false,
        filterText: "",
        search: search,
      });
    }, 2000);
  };

  _createNotificationAsync = () => {
    Notifications.scheduleNotificationAsync({
      title: "Reminder",
      body: "This is an important reminder!!!!",
      android: {
        priority: "high",
        vibrate: [0, 250, 250, 250],
        color: "#FF0000",
      },
    });
  };

  _openBottomFilter = (id) => {
    this.setState({ visible: !this.state.visible });
  };

  showModal() {
    this.setState({ visible: !this.state.visible });
  }
  hideModal() {
    this.setState({ visible: false });
  }

  optionShowModal = (item, user) => {
    this.setState({ item: item, question_id: item.id, user: user });
    this.ActionSheet.show();
  };

  optionShowModalMore = (item, user) => {
    this.setState({ item: item, question_id: item.id, user: user });
    this.ActionSheetOthers.show();
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

  _onActionSheetOthersActionDismiss = () => {
    this.setState({
      modalVisible: false,
    });
  };

  textInput() {
    this.setState({ text: "sss" });
  }

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
  };

  _setFinishLoading = () => {
    this.setState({ isLoaded: false });
  };

  navigateDetail = (props) => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate("NotificationAnswer", {
        id: props.item.id,
        filterTag: this._FilterTag,
        isBack: true,
      });
    });
  };

  _updateCacheAfterVote = (store, createLike, linkId) => {
    const data = store.readQuery({ query: getQuestions, variables: {} });

    const votedLink = data.questions.data.find((data) => data.id === linkId);

    votedLink.likes.paginatorInfo.total =
      votedLink.likes.paginatorInfo.total + 1;
    store.writeQuery({ query: getQuestions, data });
  };

  _handleNotification = (notification) => {
    if (notification.origin === "selected") {
      if (!notification.hasOwnProperty("experienceId")) {
        if (notification.data.type === "Question") {
          this.props.navigation.navigate("NotificationAnswer", {
            id: notification.data.id,
          });
        }

        if (notification.data.type === "Comment") {
          this.props.navigation.navigate("NotificationComment", {
            id: notification.data.answer_id,
            question_id: notification.data.question_id,
          });
        }
        if (notification.data.type === "ChatMessage") {
          this.props.navigation.navigate("Chat", {
            data: notification.data.user,
          });
        }
      }
    }
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

  filter = (id) => {
    if (id === 0) {
      this.setState({
        all: true,
        unanswered: false,
        newq: false,
        hot: false,
        filterText: "What's hot",
        my: false,
        tag: null,
      });
    } else if (id === 1) {
      this.setState({
        all: false,
        unanswered: false,
        newq: false,
        hot: true,
        filterText: "What's hot",
        my: false,
        tag: null,
      });
    } else if (id === 2) {
      this.setState({
        all: false,
        unanswered: false,
        newq: true,
        hot: false,
        filterText: "What's new",
        my: false,
        tag: null,
      });
    } else if (id === 3) {
      this.setState({
        all: false,
        unanswered: true,
        newq: false,
        hot: false,
        filterText: "Unanswered question",
        my: false,
        tag: null,
      });
    } else if (id === 4) {
      this.setState({
        all: false,
        unanswered: false,
        newq: false,
        hot: false,
        filterText: "My discussions",
        my: true,
        tag: null,
      });
    }
  };

  deleteQuestionMutation = () => {
    this.setState({ currntStatus: this.state.question_id });
    client
      .mutate({
        mutation: deleteQuestionMutation,
        variables: {
          question_id: this.state.question_id,
        },

        update: (cache, { data: { deleteQuestion } }) => {
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
        },
      })
      .then((result) => {
        this.setState({ currntStatus: null });
      })
      .catch((error) => {
        this.setState({ currntStatus: null });
      });
  };

  updateStatusMutation = () => {
    let status = this.state.status === 1 ? 0 : 1;
    let question_id = this.state.question_id;
    client
      .mutate({
        mutation: questionStatusMutation,
        variables: {
          question_id: question_id,
          status: status,
        },
        optimisticResponse: {
          __typename: "Mutation",
          changeQuestionStatus: {
            __typename: "Response",
            message: "",
            status: status,
          },
        },
        update: (cache, { data: { changeQuestionStatus } }) => {
          const data = cache.readQuery({
            query: getQuestions,
          });

          const statusUpdate = data.questions.data.find(
            (data) => data.id === question_id
          );

          statusUpdate.status = status;
          cache.writeQuery({ query: getQuestions, data });
        },
      })
      .then((result) => {})
      .catch((error) => {});
  };

  _listEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.emptyText}>Keep what you like here.</Text>
        <Text style={styles.emptyText}>Just click on this icon.</Text>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Image
            style={{ width: 28, height: 38, resizeMode: "contain" }}
            source={require("../assets/images/bookmarks.png")}
          />
        </View>
      </View>
    );
  };

  _shouldItemUpdate = (prev, next) => {
    return prev.state !== next.state;
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
        tapOnTabNavigator={this.tapOnTabNavigator}
      />
    );
  };

  sendReports = () => {
    let question_id = this.state.question_id;
    let reportDescription =
      "Type: " +
      this.state.reportType +
      ", Description: " +
      this.state.reportDescription;

    if (reportDescription) {
      this.setState({ feedbackLoading: true });
      client
        .mutate({
          mutation: reportMessageMutation,
          variables: {
            question_id: question_id,
            title: reportDescription,
            tag: "question",
          },
        })
        .then((result) => {
          Alert.alert(
            "Successfully sent",
            "Thanks for your feedback! We'll take action soon.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.setState({
                    reportDescription: "",
                    modalVisible: false,
                  }),
              },
            ],
            { cancelable: false }
          );
          this.setState({ feedbackLoading: false });
        })
        .catch((error) => {
          Alert.alert(
            "Successfully sent",
            "Thanks for your feedback! We'll take action soon.",
            [
              {
                text: "OK",
                onPress: () =>
                  this.setState({
                    reportDescription: "",
                    modalVisible: false,
                  }),
              },
            ],
            { cancelable: false }
          );
          this.setState({ feedbackLoading: false });
        });
    }
  };

  componentDidUpdate() {}

  keyExtractor = (item, index) => index.toString();

  onViewableItemsChanged = ({ viewableItems, changed }) => {};

  clearTags = () => {
    this.setState({
      tag: null,
    });
  };

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        this.refetch();
      }
    }
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

  render() {
    const { category, search, unanswered, newq, hot, my, tag } = this.state;
    if (this.state.isLoading) {
      return (
        <View>
          <Text></Text>
        </View>
      );
    }
    const { navigate } = this.props.navigation;

    let variables = { getSavedQuestions: true };
    if (category) {
      variables.category = category;
    }
    if (tag) {
      variables.getTagQuestion = tag;
    }

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {this.state.visible && (
            <View
              style={{
                backgroundColor: "#fff",
                alignItems: "center",
                flexDirection: "row",
              }}
            >
              <QuestionFilter
                all={this.state.all}
                unanswered={this.state.unanswered}
                new={this.state.newq}
                hot={this.state.hot}
                my={this.state.my}
                filter={this.filter}
              />
            </View>
          )}

          {this.state.tag ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "#EBEBEB",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#000000", padding: 10 }}>
                {this.state.tag_title}
              </Text>
              <TouchableOpacity onPress={this.clearTags} style={{}}>
                <Ionicons size={25} name="ios-close-circle" />
              </TouchableOpacity>
            </View>
          ) : null}
          {this.state.me.id && (
            <Query query={getQuestions} variables={variables}>
              {({ loading, error, data, fetchMore, refetch }) => {
                this.refetch = refetch;
                if (loading)
                  return (
                    <>
                      <SinglePost />
                      <View style={gstyles.h_10} />
                      <Divider />
                      <View style={gstyles.h_10} />
                      <SinglePost />
                    </>
                  );

                if (error) return <NoWifi onPress={() => refetch()} />;

                if (data.questions) {
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
                            cursor:
                              data.questions.paginatorInfo.currentPage + 1,
                          },
                          updateQuery: (
                            previousResult,
                            { fetchMoreResult }
                          ) => {
                            const newQuestions = fetchMoreResult.questions.data;
                            const pageInfo =
                              fetchMoreResult.questions.paginatorInfo;
                            if (
                              data.questions.paginatorInfo.total !==
                              pageInfo.total
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
                                  questions: {
                                    __typename:
                                      previousResult.questions.__typename,
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

          {/*<ViewsBottomPopup
            filter={this.filter}
            actionHide={this.hideModal}
            visible={this.state.visible}
          />*/}
        </SafeAreaView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
        >
          <View style={styles.leadboardModal}>
            <View style={styles.leadboardModalContent}>
              <TouchableOpacity
                onPress={this._onActionSheetOthersActionDismiss}
              >
                <List.Item
                  style={{ backgroundColor: "#F7F7F7" }}
                  titleStyle={{
                    fontSize: 15,
                    fontFamily: FontFamily.Regular,
                    color: color.blackColor,
                    textAlign: "center",
                  }}
                  title="Report question"
                  right={(props) => (
                    <Ionicons
                      style={styles.modalCloseIcon}
                      name="ios-close"
                      size={32}
                      color="red"
                    />
                  )}
                />
              </TouchableOpacity>
              <View style={styles.postQuestionTextareaConatiner}>
                {this.state.isReportType ? (
                  <View>
                    <Text
                      style={{
                        fontFamily: FontFamily.Regular,
                        fontSize: 18,
                        fontWeight: "bold",
                      }}
                    >
                      Please select a problem to continue
                    </Text>
                    <Text
                      style={{
                        fontFamily: FontFamily.Regular,
                        fontSize: 14,
                        color: color.grayColor,
                      }}
                    >
                      You can report this after selecting a problem. Please note
                      we have fewer reviewers available right now.{" "}
                    </Text>
                    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Nudity")}
                      >
                        Nudity
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Violence")}
                      >
                        Violence
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Harassment")}
                      >
                        Harassment
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("False news")}
                      >
                        False news
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Spam")}
                      >
                        Spam
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Unauthorized sales")}
                      >
                        Unauthorized sales
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Hate speech")}
                      >
                        Hate speech
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Terrorism")}
                      >
                        Terrorism
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Not relevant")}
                      >
                        Not relevant
                      </Chip>
                      <Chip
                        textStyle={{ fontWeight: "bold" }}
                        style={{ margin: 5 }}
                        onPress={() => this._reportType("Abusive language")}
                      >
                        Abusive language
                      </Chip>
                    </View>
                  </View>
                ) : (
                  <View>
                    <TextInput
                      returnKeyType="done"
                      autoFocus
                      blurOnSubmit={true}
                      maxLength={1000}
                      numberOfLines={4}
                      style={styles.postQuestionTextInput}
                      multiline={true}
                      value={this.state.reportDescription}
                      placeholder={"Write something about this question"}
                      onChangeText={(text) =>
                        this.setState({ reportDescription: text })
                      }
                    />
                  </View>
                )}
              </View>

              {!this.state.isReportType ? (
                <View style={{ margin: 20 }}>
                  {!this.state.feedbackLoading && (
                    <Button
                      color={color.primaryColor}
                      title="Send & Close"
                      onPress={this.sendReports}
                    />
                  )}
                  {this.state.feedbackLoading && (
                    <ActivityIndicator
                      size="small"
                      color={color.primaryColor}
                    />
                  )}
                </View>
              ) : null}
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

BookmarkScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Bookmarks</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  keyboardAvoidContainer: {
    flex: 1,
    backgroundColor: "orange",
  },
  leadboardModal: {
    backgroundColor: "rgba(226, 226, 226, .75)",
    flex: 1,
    flexDirection: "column",
    // height:Dimensions.get('window').height/2,
  },
  leadboardModalContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "20%",
  },
  postQuestionTextareaConatiner: {
    flex: 1,
    margin: 15,
    flexDirection: "column",
  },
  postQuestionTextInput: {
    fontSize: 20,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    width: "100%",
    textAlignVertical: "top",
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 22,
    textAlign: "center",
  },
});
export default BookmarkScreen;
