import { Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as FileSystem from "expo-file-system";
import * as Linking from "expo-linking";
import * as Notifications from "expo-notifications";
import React from "react";
import { Query } from "react-apollo";
import {
  ActivityIndicator,
  Alert,
  Button,
  Clipboard,
  DeviceEventEmitter,
  Dimensions,
  Image,
  Modal,
  RefreshControl,
  SafeAreaView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import { Chip, Divider, List } from "react-native-paper";
import {
  _handleDislikePressed,
  _handleLikePressed,
  _handleSavedPressed,
  _handleUnsavedPressed,
} from "../components/CombineFunction";
import FeedTab from "../components/FeedTab";
import NoWifi from "../components/NoWifi/index.js";
import OptimizedFlatList from "../components/OptimizedFlatList";
import QuestionFilter from "../components/QuestionFilter";
import RecomendationComponent from "../components/recomendations/recomendationComponent.js";
import SinglePost from "../components/Skeleton/SinglePost.js";
import client from "../constants/client";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import gstyles from "../constants/gstyles.js";
import link from "../constants/link";
import deleteQuestionMutation from "../graphql/mutations/deleteQuestionMutation";
import questionStatusMutation from "../graphql/mutations/questionStatusMutation";
import reportMessageMutation from "../graphql/mutations/reportMessageMutation";
import getQuestions from "../graphql/queries/getQuestions";
import getRecommendations from "../graphql/queries/getRecommendations.js";
import PlusIconAddQuestion from "../navigation/PlusIconAddQuestion";

const SCREEN_HEIGHT = Dimensions.get("window").height;
const Buffer = require("buffer").Buffer;

class FeedScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      url: "",
      profile_photo: "",
      refreshing: false,
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
      expert: false,
      me: {},
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

  componentDidCatch(error, info) {}

  componentWillMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState(
        { me: res, profile_photo: res.profile_photo }
        // this.categorySettingTrigger
      );
    });

    this.props.navigation.setParams({
      scrollToTop: this._scrollToTop,
    });

    Linking.removeEventListener("url", this.handleOpenURL);
  }

  categorySettingTrigger = () => {
    let { me } = this.state;
    let categories = typeof me.categories !== "undefined" ? me.categories : [];
    if (categories.length === 0) {
      this.props.navigation.navigate("CategorySetting");
    }
  };

  checkChatExist = async () => {};

  triggerBackup = async () => {
    try {
      const fileUri = FileSystem.documentDirectory + "/SQLite/ChatApp";
      const info = await FileSystem.getInfoAsync(fileUri);
      if (!info.exists) {
        const triggerBackup = await AsyncStorage.getItem("@triggerBackup");

        if (!triggerBackup) {
          this.props.navigation.navigate("ChatBackup", { exists: false });
        }
      }
    } catch (e) {}
  };
  resetFilter = () => {
    // this.setState({
    //   all: true,
    //   unanswered: false,
    //   newq: false,
    //   hot: false,
    //   my: false,
    //   expert: false,
    //   filter_id: 0,
    //   filterText: "All Topic",
    //   sortText: "",
    //   category: null,
    //   visible: false,
    // });
    // this.props.navigation.setParams({ filterText: "All Topic" });
  };

  async componentDidMount() {
    DeviceEventEmitter.addListener("resetFilter", this.resetFilter);
    this.props.navigation.addListener("didFocus", () => {
      this.myDiscusstionFilter();
      // this.resetFilter();
    });

    this.setState({
      isLoading: false,
      category: null,
      question_id: null,
    });

    this.props.navigation.setParams({ Doit: this._OpenFilterModel });
    this.props.navigation.setParams({ isFilterVisible: this.state.visible });
    this.props.navigation.setParams({ filterTag: this._FilterTag });
    this.props.navigation.setParams({ openFilter: this.openFilter });
    this.props.navigation.setParams({ filterText: this.state.filterText });
    this.props.navigation.setParams({
      openBottomFilter: this._openBottomFilter,
    });
    this.props.navigation.setParams({ searchFilter: this._onSearchFilter });
    this._notificationSubscription =
      Notifications.addNotificationReceivedListener(this._handleNotification);
    // this.props.navigation.addListener("didFocus", this.myDiscusstionFilter);

    Linking.getInitialURL().then((url) => {
      this.navigate(url);
    });

    Linking.addEventListener("url", this.handleOpenURL);
  }

  handleOpenURL = (event) => {
    this.navigate(event.url);
  };
  navigate = (url) => {
    const { item, type } = this.props;

    // console.log("class type", type);
    // console.log("url :>> ", url);
    const { navigate } = this.props.navigation;
    const route = url.replace(/.*?:\/\//g, "");

    // console.log("route :>> ", route);

    let id = route.split("/")[1];

    const routeName = route.split("/")[0];

    // console.log("route :>> ", routeName);

    let decodedId = Buffer.from(id, "base64").toString("ascii");

    // console.log("decoded ooo :>>", decodedId);
    if (
      routeName === "event" ||
      routeName === "product" ||
      routeName === "classes"
    ) {
      navigate("ClassDetail", {
        item: {
          id: decodedId,
          // type: type,
          // data: item,
        },
        // item: item,
        // type: type,
        // authUser: authUser,
      });
    }

    if (routeName === "discussions") {
      navigate("NotificationAnswer", {
        id: decodedId,
        filterTag: null,
        isBack: true,
      });
    }

    if (routeName === "recommendation") {
      navigate("RecomendationAnswer", {
        id: decodedId,
        filterTag: null,
        isBack: true,
      });
    }
  };

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
    if (typeof queryParams.id !== "undefined") {
      this.props.navigation.navigate("NotificationAnswer", {
        id: queryParams.id,
      });
    }
  };

  _FilterTag = (id, title) => {
    if (this.state.tag === id) {
      this.setState({
        tag: null,
        tag_title: null,
      });
    } else {
      this.setState({
        tag: id,
        tag_title: title,
      });
    }
  };

  _OpenFilterModel = (item) => {
    this.setState({
      filterText: item.name,
      category: item.id,
    });
    this.props.navigation.setParams({ filterText: item.name });
  };

  openFilter = () => {
    this.props.navigation.state.params.openBottomFilter();
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
    this.props.navigation.setParams({ isFilterVisible: !this.state.visible });
  };

  showModal() {
    this.setState({ visible: !this.state.visible });
    this.props.navigation.setParams({ isFilterVisible: !this.state.visible });
  }
  hideModal() {
    this.setState({ visible: false });
    this.props.navigation.setParams({ isFilterVisible: false });
  }
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
      this.props.navigation.navigate("AccessScreen", {
        id: this.state.question_id,
      });
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

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  _onRefresh = () => {
    this.refetch();
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

  navigateRecDetail = (props) => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate("RecomendationAnswer", {
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

        if (notification.data.type === "Answer") {
          this.props.navigation.navigate("NotificationAnswer", {
            id: notification.data.question_id,
            answer_id: notification.data.answer_id,
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
      if (notification.data.type === "ScheduleBackup") {
        this.props.navigation.navigate("ChatBackup", { exists: true });
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

  myDiscusstionFilter = () => {
    const own = this.props.navigation.getParam("own");
    if (own) {
      this.props.navigation.setParams({
        filterText: "All Topics - My Discussion",
      });
      this.setState({
        all: true,
        unanswered: false,
        newq: false,
        hot: false,
        my: true,
        filter_id: 4,
        filterText: "All Topics",
        sortText: " - My Discussion",
        category: null,
        visible: false,
      });

      this.props.navigation.setParams({ own: false });
    }
  };

  filter = (id, category, filterText, sortText) => {
    this.props.navigation.setParams({ filterText: filterText + sortText });
    this.props.navigation.setParams({ isFilterVisible: false });

    if (id === 0) {
      this.setState({
        all: true,
        unanswered: false,
        newq: false,
        hot: false,
        my: false,
        expert: false,
        filter_id: 0,
        filterText: filterText,
        sortText: sortText,
        category: category,
        visible: false,
      });
    } else if (id === 1) {
      this.setState({
        all: false,
        unanswered: false,
        newq: false,
        hot: true,
        expert: false,
        my: false,
        filter_id: 1,
        filterText: filterText,
        sortText: sortText,
        category: category,
        visible: false,
      });
    } else if (id === 2) {
      this.setState({
        all: false,
        unanswered: false,
        newq: true,
        hot: false,
        my: false,
        expert: false,
        filter_id: 2,
        filterText: filterText,
        sortText: sortText,
        category: category,
        visible: false,
      });
    } else if (id === 3) {
      this.setState({
        all: false,
        unanswered: true,
        newq: false,
        hot: false,
        my: false,
        expert: false,
        filter_id: 3,
        filterText: filterText,
        sortText: sortText,
        category: category,
        visible: false,
      });
    } else if (id === 4) {
      this.setState({
        all: false,
        unanswered: false,
        newq: false,
        hot: false,
        my: true,
        expert: false,
        filter_id: 4,
        filterText: filterText,
        sortText: sortText,
        category: category,
        visible: false,
      });
    } else if (id === 5) {
      this.setState({
        all: false,
        unanswered: false,
        newq: false,
        hot: false,
        my: false,
        expert: true,
        filter_id: 5,
        filterText: filterText,
        sortText: sortText,
        category: category,
        visible: false,
      });
    }
  };

  deleteQuestionMutation = () => {
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
        this.refetch();
      })
      .catch((error) => {
        console.log(
          "🚀 ~ file: QuestionFeed.js:619 ~ FeedScreen ~ deleteQuestionMutation ~ error",
          error
        );
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
    this.setState({ hasMorePage: false, unanswered_question: true });
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: SCREEN_HEIGHT - 100,
        }}
      >
        <Text>No question found. Start a new discussion.</Text>
        <TouchableOpacity
          style={styles.postButton}
          onPress={() => this.props.navigation.navigate("Post")}
        >
          <Text style={styles.postText}>Post a question</Text>
        </TouchableOpacity>
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
        tag={this.state.tag}
      />
    );
  };

  renderRecommendations = ({ item, index }) => {
    return (
      <RecomendationComponent
        handleLikePressed={_handleLikePressed}
        handleDislikePressed={_handleDislikePressed}
        handleSavedPressed={_handleSavedPressed}
        handleUnsavedPressed={_handleUnsavedPressed}
        actionShow={this.optionShowModal}
        actionShowMore={this.optionShowModalMore}
        onChangeText={this.textInput}
        item={item}
        navigate={this.props.navigation}
        navigateRecDetail={this.navigateRecDetail}
        me={this.state.me}
        key={index}
        isLoaded={this.state.isLoaded}
        setFinishLoading={this._setFinishLoading}
        currntStatus={this.state.currntStatus}
        tag={this.state.tag}
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

  keyExtractor = (item, index) => index.toString();

  onViewableItemsChanged = ({ viewableItems, changed }) => {};

  clearTags = () => {
    this.setState({
      tag: null,
    });
  };

  clearCategory = () => {
    this.setState({
      category: null,
      filterText: "",
    });
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message: link.shareUrl + "/share/discussions/" + this.state.item.id,
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
      Alert.alert(error.message);
    }
  };

  onClipboard = async () => {
    await Clipboard.setString(
      link.shareUrl + "/share/discussions/" + this.state.item.id
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
    const { category, search, unanswered, newq, hot, my, tag, expert } =
      this.state;
    if (this.state.isLoading) {
      return (
        <View>
          <Text></Text>
        </View>
      );
    }

    let variables = {};
    if (category) {
      variables.category = category;
    }
    if (tag) {
      variables.getTagQuestion = tag;
    }
    if (search !== "") {
      variables.question = search + "%";
    }
    if (unanswered) {
      variables.unanswered = true;
    }
    if (newq) {
      variables.new = true;
    }
    if (hot) {
      variables.hot = true;
    }
    if (my) {
      variables.my = true;
    }

    let recomendationVariables = {};
    let recomendationCategories = [];

    if (this.state.me && this.state.me.categories) {
      this.state.me.categories.map((category) =>
        recomendationCategories.push(parseInt(category.id))
      );
    } else {
      recomendationCategories.push(2, 3, 4, 5, 6);
    }

    recomendationVariables = { categories: recomendationCategories };

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
        }}
      >
        <SafeAreaView style={{ flex: 1 }}>
          {this.state.tag ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
              }}
            >
              <Chip
                style={{ backgroundColor: "#F0F2F6", marginRight: 4 }}
                textStyle={{
                  color: color.grayColor,
                  fontFamily: FontFamily.Regular,
                }}
                onClose={this.clearTags}
              >
                {this.state.tag_title}
              </Chip>
            </View>
          ) : null}
          {this.state.me.id && (
            <View>
              {this.state.expert ? (
                <Query
                  query={getRecommendations}
                  variables={recomendationVariables}
                >
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

                    if (error)
                      return (
                        <View
                          style={{
                            height: SCREEN_HEIGHT,
                          }}
                        >
                          <NoWifi onPress={() => refetch()} />
                        </View>
                      );

                    if (data) {
                      return (
                        <OptimizedFlatList
                          ref={(r) => (this.flatlistRef = r)}
                          refreshing={data.networkStatus === 4}
                          extraData={this.state}
                          data={data.recommendations.data}
                          renderItem={this.renderRecommendations}
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
                              }}
                            />
                          }
                          onEndReached={() => {
                            fetchMore({
                              variables: {
                                cursor:
                                  data.recommendations.paginatorInfo
                                    .currentPage + 1,
                              },
                              updateQuery: (
                                previousResult,
                                { fetchMoreResult }
                              ) => {
                                const newRecomendations =
                                  fetchMoreResult.recommendations.data;
                                const pageInfo =
                                  fetchMoreResult.recommendations.paginatorInfo;
                                if (
                                  data.recommendations.paginatorInfo.total !=
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
                                return newRecomendations.length
                                  ? {
                                      recommendations: {
                                        __typename:
                                          previousResult.recommendations
                                            .__typename,
                                        data: [
                                          ...previousResult.recommendations
                                            .data,
                                          ...newRecomendations,
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
              ) : (
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

                    if (error)
                      return (
                        <View
                          style={{
                            height: SCREEN_HEIGHT,
                          }}
                        >
                          <NoWifi onPress={() => refetch()} />
                        </View>
                      );

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
                                // this._onRefresh.bind(this);
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
                                const newQuestions =
                                  fetchMoreResult.questions.data;
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
            </View>
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
        </SafeAreaView>
        <Modal
          animationType="slide"
          transparent={true}
          visible={this.state.modalVisible}
          //this.state.modalVisible
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
        {this.state.visible && (
          <QuestionFilter
            all={this.state.all}
            unanswered={this.state.unanswered}
            new={this.state.newq}
            hot={this.state.hot}
            my={this.state.my}
            openBottomFilter={this._openBottomFilter}
            openFilterModel={this._OpenFilterModel}
            category={this.state.category}
            _filter_id={this.state.filter_id}
            filter={this.filter}
            filterText={this.state.filterText}
            sortText={this.state.sortText}
            visible={this.state.visible}
          />
        )}
      </View>
    );
  }
}

FeedScreen.navigationOptions = (screenProps) => {
  return {
    headerTintColor: color.primaryColor,
    headerBackTitleStyle: { fontSize: 18 },
    headerBackTitle: null,
    headerForceInset: { top: "never", bottom: "never" },
    headerStyle: {
      paddingTop: 10,
      borderBottomColor: "transparent",
      borderWidth: 0,
      shadowOpacity: 0,
      height: 57,
      elevation: 0,
    },
    headerTitle: () => (
      <TouchableOpacity
        onPress={
          screenProps.navigation.state.routeName === "MyDiscussion"
            ? null
            : screenProps.navigation.getParam("openFilter")
        }
        style={{
          flex: 1,
          alignItems: "center",
          justifyContent: "center",
          flexDirection: "row",
          width: Dimensions.get("window").width - 70,
        }}
      >
        <Text numberOfLines={1} style={styles.headerPageTitle}>
          {screenProps.navigation.getParam("filterText")}
        </Text>
        {screenProps.navigation.state.routeName ===
        "MyDiscussion" ? null : screenProps.navigation.getParam(
            "isFilterVisible"
          ) ? (
          <Image
            style={{
              width: 15,
              height: 15,
              resizeMode: "contain",
              marginTop: 2,
            }}
            source={require("../assets/images/colorarrwdown.png")}
          />
        ) : (
          <Image
            style={{
              width: 15,
              height: 15,
              resizeMode: "contain",
              marginTop: 2,
            }}
            source={require("../assets/images/arrow-right-side.png")}
          />
        )}
      </TouchableOpacity>
    ),
    headerRight: () => (
      <PlusIconAddQuestion navigationProps={screenProps.navigation} />
    ),
  };
};

const styles = StyleSheet.create({
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
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    fontSize: 17,
    marginLeft: 15,
    marginRight: 5,
    textAlign: "center",
  },
});
export default FeedScreen;
