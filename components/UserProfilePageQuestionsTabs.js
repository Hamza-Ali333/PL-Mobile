import React from "react";
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  Share,
  Image,
  Clipboard,
  Modal,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import ActionSheet from "react-native-actionsheet";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import userQuestions from "../graphql/queries/userQuestions";
import { Query } from "react-apollo";
import * as Network from "expo-network";
import FeedTab from "../components/FeedTab";
import { List, Chip } from "react-native-paper";
import client from "../constants/client";
import reportMessageMutation from "../graphql/mutations/reportMessageMutation";
import {
  _handleLikePressed,
  _handleDislikePressed,
  _handleSavedPressed,
  _handleUnsavedPressed,
} from "../components/CombineFunction";
import link from "../constants/link";

class UserProfilePageQuestionsTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      me: {},
      hasMorePage: false,
      opacity: 1,
      modalVisible: false,
      user_id: this.props.user_id,
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

  navigateDetail = (props) => {
    requestAnimationFrame(() => {
      this.props.navigate.navigate("NotificationAnswer", {
        id: props.item.id,
        filterTag: this._FilterTag,
        isBack: true,
      });
    });
  };

  _reportType = (txt) => {
    this.setState({ reportType: txt, isReportType: false });
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
  _onActionSheetOthersActionDismiss = () => {
    this.setState({
      modalVisible: false,
    });
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

  render() {
    let height = {};
    if (this.props.index !== 0) {
      height = { height: 0 };
    }
    return (
      <View style={[{ backgroundColor: "#fff" }]}>
        <Query query={userQuestions} variables={{ id: this.state.user_id }}>
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
                nestedScrollEnabled
                data={data.user.questions.data}
                renderItem={this.renderItem}
                keyExtractor={(item, index) => index.toString()}
                initialNumToRender={10}
                maxToRenderPerBatch={10}
                onEndReachedThreshold={0.5}
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
                      cursor: data.user.questions.paginatorInfo.currentPage + 1,
                    },
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newQuestions = fetchMoreResult.user.questions.data;
                      const pageInfo =
                        fetchMoreResult.user.questions.paginatorInfo;
                      if (
                        data.user.questions.paginatorInfo.total !==
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
                            user: {
                              __typename: previousResult.user.__typename,
                              id: previousResult.user.id,
                              questions: {
                                __typename:
                                  previousResult.user.questions.__typename,
                                data: [
                                  ...previousResult.user.questions.data,
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

const styles = StyleSheet.create({
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
});

export default UserProfilePageQuestionsTabs;
