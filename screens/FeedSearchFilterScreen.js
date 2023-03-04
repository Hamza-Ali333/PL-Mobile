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
  Keyboard,
  Share,
  Clipboard,
  Linking,
  ScrollView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Notifications from "expo-notifications";
import { Ionicons, AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import FeedTab from "../components/FeedTab";
import QuestionFilter from "../components/QuestionFilter";
import OptimizedFlatList from "../components/OptimizedFlatList";
import getQuestions from "../graphql/queries/getQuestions";
import searchTags from "../graphql/queries/searchTags";
import searchUsers from "../graphql/queries/searchUsers";
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
import { List, Chip } from "react-native-paper";
import ActionSheet from "react-native-actionsheet";
import { Query } from "react-apollo";
import LottieView from "lottie-react-native";
import link from "../constants/link";
import ProfilePhoto from "../components/ProfilePhoto";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
// import getRecommendations from "../graphql/queries/getRecommendations.js";
import getExperOpinion from "../graphql/queries/getExpertOpinion.js";
import RecomendationComponent from "../components/recomendations/recomendationComponent.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class FeedSearchFilterScreen extends React.PureComponent {
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
      unanswered_question: false,
      searchText: "",
      searchRecText: "",
      reportType: "",
      isReportType: true,
      item: {},
      selectedTab: "discussion",
      tagSearch: "",
      text: "",
    };
    this.refetch;
    this.optionHideModal = this.optionHideModal.bind(this);
    this.optionShowModal = this.optionShowModal.bind(this);
    this.optionShowModalMore = this.optionShowModalMore.bind(this);
    this.hideModal = this.hideModal.bind(this);
    this.showModal = this.showModal.bind(this);
    this.confirmQuestionDelete = this.confirmQuestionDelete.bind(this);
    this.delayTimer;
    this.delaySearchTimer;
    this.timeoutValue = 0;
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

  getSearchTerm = async () => {
    let termString = await AsyncStorage.getItem("@searchTerm");
    let term = JSON.parse(termString);

    console.log("term", term);
    if (term) {
      this.setState({
        selectedTab: term.selectedTab,
        text: term.text,
        searchText: term.searchText,
        searchRecText: term.searchRecText,
      });
    }
  };

  componentDidMount() {
    this.getSearchTerm();
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
      unanswered_question: false,
    });
  };

  _OpenFilterModel = (item) => {
    this.setState({
      unanswered: false,
      newq: false,
      hot: false,
      my: false,
      visible: false,
      filterText: item.name,
      category: item.id,
      tag: null,
      unanswered_question: false,
    });
  };

  _onSearchFilter = () => {
    Keyboard.dismiss();
    this.setState({
      unanswered: false,
      newq: false,
      hot: false,
      my: false,
      visible: false,
      filterText: "",
      search: this.state.searchText,
    });
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
  optionHideModal = () => {
    //this.ActionSheet.show()
    //this.setState({ optionVisible: false });
  };
  optionShowModal = (id, status) => {
    this.setState({ question_id: id, status: status });
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
      this.deleteQuestionMutation();
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
    if (this.state.search !== "") {
      return (
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text style={{ fontFamily: FontFamily.Regular, textAlign: "center" }}>
            If you didn't find what you looking for, start a new discussion?
          </Text>
          <TouchableOpacity
            style={styles.postButton}
            onPress={() => this.props.navigation.navigate("Post")}
          >
            <Text style={styles.postText}>Post a question</Text>
          </TouchableOpacity>
        </View>
      );
    }
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
    this.setState({ currntStatus: this.state.question_id.id });
    client
      .mutate({
        mutation: deleteQuestionMutation,
        variables: {
          question_id: this.state.question_id.id,
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
    this.setState({ hasMorePage: false, unanswered_question: true });
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: SCREEN_HEIGHT / 2,
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

  _listEmptyComponentTag = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: SCREEN_HEIGHT / 2,
        }}
      >
        <Text
          style={{
            color: color.grayColor,
            fontSize: 18,
            fontFamily: FontFamily.Bold,
          }}
        >
          No tag found.
        </Text>
      </View>
    );
  };

  _listEmptyComponentPeople = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: SCREEN_HEIGHT / 2,
        }}
      >
        <Text
          style={{
            color: color.grayColor,
            fontSize: 18,
            fontFamily: FontFamily.Bold,
          }}
        >
          No people found.
        </Text>
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

  clearCategory = () => {
    this.setState({
      category: null,
      filterText: "",
    });
  };

  searchText = (text) => {
    this.setState({ text });
    clearTimeout(this.delaySearchTimer);
    this.delaySearchTimer = setTimeout(() => {
      this.setState({
        searchText: text,
        unanswered: false,
        newq: false,
        hot: false,
        my: false,
        visible: false,
        filterText: "",
        search: this.state.searchText,
      });
      this.clearTags();
    }, 1000);

    let searchTerm = JSON.stringify({
      text: text,
      searchText: text,
      searchRecText: text,
      selectedTab: this.state.selectedTab,
    });

    AsyncStorage.setItem("@searchTerm", searchTerm);
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

  selectedTab = async (selectedTab) => {
    this.setState({ selectedTab });
    let termString = await AsyncStorage.getItem("@searchTerm");

    let term = JSON.parse(termString);

    console.log("term", term);
    term.selectedTab = selectedTab;
    AsyncStorage.setItem("@searchTerm", JSON.stringify(term));
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

  renderRecommendations = ({ item, index }) => {
    return (
      <RecomendationComponent
        item={item}
        navigate={this.props.navigation}
        navigateRecDetail={this.navigateRecDetail}
        me={this.state.me}
        key={index}
        isLoaded={this.state.isLoaded}
        currntStatus={this.state.currntStatus}
        tag={this.state.tag}
      />
    );
  };

  handleSelectTag = (item) => {
    this.setState({
      tag: item.id,
      tag_title: item.tag_title,
      selectedTab: "discussion",
    });
  };

  goToProfile = (id) => {
    this.props.navigation.navigate("UserProfile", { user_id: id });
  };

  render() {
    const {
      category,
      search,
      unanswered,
      newq,
      hot,
      my,
      tag,
      searchText,
      searchRecText,
    } = this.state;
    if (this.state.isLoading) {
      return (
        <View>
          <Text></Text>
        </View>
      );
    }
    const { navigate } = this.props.navigation;

    let recVariables = {};

    let variables = {};
    if (category) {
      variables.category = category;
    }
    if (tag) {
      variables.getTagQuestion = tag;
    }
    if (searchText !== "") {
      variables.question = "%" + searchText + "%";
    }
    if (searchRecText !== "") {
      recVariables.search = searchText;
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

    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingHorizontal: 10,
        }}
      >
        <SafeAreaView>
          <View style={styles.searchInputContainer}>
            <AntDesign style={styles.searchIcon} name="search1"></AntDesign>
            <TextInput
              style={styles.searchTextInput}
              // value={this.state.text}
              placeholder="Search Discussion, People and Tags"
              onSubmitEditing={this._onSearchFilter}
              onChangeText={(text) => {
                clearTimeout(this.timeoutValue);
                this.timeoutValue = setTimeout(() => {
                  this.searchText(text.trim());
                }, 500);
              }}
            />
          </View>

          {(this.state.searchText !== "" ||
            this.state.searchRecText !== "") && (
            <ScrollView
              horizontal={true}
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ height: 54 }}
            >
              <TouchableOpacity
                onPress={() => this.selectedTab("discussion")}
                style={[
                  styles.filterSelection,
                  this.state.selectedTab === "discussion"
                    ? { backgroundColor: color.primaryColor }
                    : {},
                ]}
              >
                <Text
                  style={[
                    this.state.selectedTab === "discussion"
                      ? { color: color.lightGrayColor }
                      : { color: color.primaryColor },
                  ]}
                >
                  Discussion
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.selectedTab("people")}
                style={[
                  styles.filterSelection,
                  this.state.selectedTab === "people"
                    ? { backgroundColor: color.primaryColor }
                    : {},
                ]}
              >
                <Text
                  style={[
                    this.state.selectedTab === "people"
                      ? { color: color.lightGrayColor }
                      : { color: color.primaryColor },
                  ]}
                >
                  People
                </Text>
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => this.selectedTab("tag")}
                style={[
                  styles.filterSelection,
                  this.state.selectedTab === "tag"
                    ? { backgroundColor: color.primaryColor }
                    : {},
                ]}
              >
                <Text
                  style={[
                    this.state.selectedTab === "tag"
                      ? { color: color.lightGrayColor }
                      : { color: color.primaryColor },
                  ]}
                >
                  Tags
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                onPress={() => this.selectedTab("recommendations")}
                style={[
                  styles.filterSelection,
                  this.state.selectedTab === "recommendations"
                    ? { backgroundColor: color.primaryColor }
                    : {},
                ]}
              >
                <Text
                  style={[
                    this.state.selectedTab === "recommendations"
                      ? { color: color.lightGrayColor }
                      : { color: color.primaryColor },
                  ]}
                >
                  Recommendations
                </Text>
              </TouchableOpacity>
            </ScrollView>
          )}

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

          {this.state.category ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "center",
                backgroundColor: "#EBEBEB",
                alignItems: "center",
              }}
            >
              <Text style={{ color: "#000000", padding: 10 }}>
                {this.state.filterText}
              </Text>
              <TouchableOpacity onPress={this.clearCategory} style={{}}>
                <Ionicons size={25} name="ios-close-circle" />
              </TouchableOpacity>
            </View>
          ) : null}

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
            <KeyboardAwareScrollView style={{ marginBottom: 90 }}>
              {this.state.selectedTab === "discussion" &&
                searchText.length >= 3 && (
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

                      if (
                        !variables.question ||
                        this.state.searchText.length < 3
                      )
                        return null;

                      if (error)
                        return (
                          <View
                            style={{
                              alignItems: "center",
                            }}
                          >
                            <Image
                              source={require("../assets/images/wifi.png")}
                            />
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

                      if (data && data.questions) {
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
                            //ListFooterComponent={this.renderFooter.bind(this)}
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
                                    data.questions.paginatorInfo.currentPage +
                                    1,
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

              {this.state.selectedTab === "recommendations" && (
                <Query query={getExperOpinion} variables={recVariables}>
                  {({ loading, error, data, fetchMore, refetch }) => {
                    this.refetch = refetch;
                    console.log(
                      "🚀 ~ file: FeedSearchFilterScreen.js:1329 ~ FeedSearchFilterScreen ~ render ~ data",
                      data
                    );
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

                    if (error)
                      return (
                        <View
                          style={{
                            alignItems: "center",
                          }}
                        >
                          <Image
                            source={require("../assets/images/wifi.png")}
                          />
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

                    if (data) {
                      console.log("data.expert_opinion", data.expert_opinion);
                      return (
                        <OptimizedFlatList
                          ref={(r) => (this.flatlistRef = r)}
                          refreshing={data.networkStatus === 4}
                          extraData={this.state}
                          data={data.expert_opinion.data}
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
                          //ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
                          // ListFooterComponent={this.renderFooter.bind(this)}
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
                                  data.expert_opinion.paginatorInfo
                                    .currentPage + 1,
                              },
                              updateQuery: (
                                previousResult,
                                { fetchMoreResult }
                              ) => {
                                const newRecomendations =
                                  fetchMoreResult.expert_opinion.data;
                                const pageInfo =
                                  fetchMoreResult.expert_opinion.paginatorInfo;
                                if (
                                  data.expert_opinion.paginatorInfo.total !=
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
                                      // Put the new comments at the end of the list and update `pageInfo`
                                      // so we have the new `endCursor` and `hasNextPage` values
                                      recommendations: {
                                        __typename:
                                          previousResult.expert_opinion
                                            .__typename,
                                        data: [
                                          ...previousResult.expert_opinion.data,
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
              )}

              {this.state.selectedTab === "tag" &&
                this.state.searchText.length >= 3 && (
                  <Query query={searchTags} variables={{ q: searchText + "%" }}>
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
                        <OptimizedFlatList
                          data={data.tagSearch.data}
                          extraData={this.state}
                          renderItem={({ item, index }) => {
                            return (
                              <List.Item
                                onPress={() => this.handleSelectTag(item)}
                                style={styles.BottomOptionListItems}
                                titleStyle={{
                                  fontSize: 17,
                                  fontFamily: FontFamily.Regular,
                                  color: color.blackColor,
                                }}
                                title={item.tag_title}
                              />
                            );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                          initialNumToRender={10}
                          onEndReachedThreshold={0.5}
                          ListEmptyComponent={this._listEmptyComponentTag}
                        />
                      );
                    }}
                  </Query>
                )}
              {this.state.selectedTab === "people" &&
                this.state.searchText.length >= 3 && (
                  <Query
                    query={searchUsers}
                    variables={{ q: searchText + "%" }}
                  >
                    {({ loading, error, data, fetchMore, refetch }) => {
                      this.refetch = refetch;
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
                        <OptimizedFlatList
                          data={data.UserSearch.data}
                          extraData={this.state}
                          renderItem={({ item, index }) => {
                            return (
                              <View style={styles.ListItems}>
                                <TouchableOpacity
                                  onPress={() => this.goToProfile(item.id)}
                                  style={{ flex: 1, flexDirection: "row" }}
                                >
                                  <ProfilePhoto
                                    size={42}
                                    item={item}
                                    me={this.state.me}
                                  />

                                  <View
                                    style={{
                                      flex: 1,
                                      justifyContent: "center",
                                      alignItems: "flex-start",
                                    }}
                                  >
                                    <View>
                                      <Text style={styles.UserName}>
                                        {item.firstname} {item.lastname}
                                      </Text>
                                      <Text
                                        style={{
                                          color: color.grayColor,
                                          fontSize: 14,
                                        }}
                                      >
                                        @{item.username}
                                      </Text>
                                      {item.tagline && (
                                        <Text style={styles.UserDescription}>
                                          {" "}
                                          {item.tagline}
                                        </Text>
                                      )}
                                    </View>
                                  </View>
                                </TouchableOpacity>
                              </View>
                            );
                          }}
                          keyExtractor={(item, index) => index.toString()}
                          initialNumToRender={10}
                          onEndReachedThreshold={0.5}
                          ListEmptyComponent={this._listEmptyComponentPeople}
                        />
                      );
                    }}
                  </Query>
                )}
            </KeyboardAwareScrollView>
          )}

          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            title={"You can change your question status and delete question."}
            options={[
              //this.state.status === 0 ? "Publish" : "Private",
              "Delete",
              "cancel",
            ]}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={this._onActionSheetAction}
          />

          <ActionSheet
            ref={(o) => (this.ActionSheetOthers = o)}
            options={["Share", "Copy", "Report & Block", "cancel"]}
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
      </View>
    );
  }
}

FeedSearchFilterScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => <Text style={styles.headerPageTitle}>Search</Text>,
  // headerRight: () => (
  //   <TouchableOpacity
  //     onPress={screenProps.navigation.getParam("searchFilter")}
  //     style={{ flex: 1, justifyContent: "center", height: "100%" }}
  //   >
  //     <Text style={styles.headerPageTitleRight}>Find</Text>
  //   </TouchableOpacity>
  // ),
});

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
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  headerPageTitleRight: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    paddingRight: 15,
  },
  searchInputContainer: {
    marginBottom: 5,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: 8,
    fontSize: 22,
    zIndex: 1,
    color: "#8C8C8C",
  },
  searchTextInput: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingLeft: 40,
    fontSize: 14,
    height: 40,
    fontFamily: FontFamily.Regular,
    color: "#686D76",
  },
  searchListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
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
  filterSelection: {
    height: Platform.OS === "android" ? 30 : 27,
    alignItems: "center",
    margin: 5,
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    paddingTop: 5,
    paddingBottom: 5,
    paddingRight: 10,
    paddingLeft: 10,
  },
  ListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
  },
  UserProfileImage: {
    marginRight: 12,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  UserName: {
    fontSize: 16,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.5,
  },
});
export default FeedSearchFilterScreen;
