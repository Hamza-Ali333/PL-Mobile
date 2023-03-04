import { Feather, Ionicons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Network from "expo-network";
import gql from "graphql-tag";
import React from "react";
import { Query } from "react-apollo";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  Clipboard,
  Dimensions,
  Easing,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Modal,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import ActionSheet from "react-native-actionsheet";
import { Chip, List } from "react-native-paper";
import DiscussionDetailPhoto from "../components/DiscussionDetailPhoto";
import OptimizedFlatList from "../components/OptimizedFlatList";
import Editor from "../components/react-native-mentions-editor";
import AllAnswer from "../components/recomendations/AllAnswer";
import MenuQuestion from "../components/recomendations/MenuQuestion";
import ProfileImageTitle from "../components/recomendations/ProfileImageTitle";
import QuestionDescription from "../components/recomendations/QuestionDescription";
import client from "../constants/client";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import addOrUpdateOfferComments from "../graphql/mutations/addOrUpdateOfferComments";
import deleteOfferCommentById from "../graphql/mutations/deleteOfferCommentById";
import deleteQuestionMutation from "../graphql/mutations/deleteQuestionMutation";
import reportMessageMutation from "../graphql/mutations/reportMessageMutation";
import allUsers from "../graphql/queries/allUsers";
import getExpertOpinionById from "../graphql/queries/getExpertOpinionById";
import getQuestions from "../graphql/queries/getQuestions";

const QUESTION_TOTAL = gql`
  query ($ID: ID) {
    question(id: $ID) {
      id
      voteStatus
      saveForCurrentUser
      likes(first: 1) {
        paginatorInfo {
          total
        }
      }
      dislikes(first: 1) {
        paginatorInfo {
          total
        }
      }
      answers(first: 1, page: 1) {
        paginatorInfo {
          total
        }
      }
    }
  }
`;

const sleep = (milliseconds) => {
  return new Promise((resolve) => setTimeout(resolve, milliseconds));
};

class RecomendationAnswerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      text: "",
      profile_photo: "",
      me: {},
      requestRefetch: false,
      data: {},
      initialValue: "",
      showEditor: true,
      users: [],
      clearInput: false,
      modalVisible: false,
      reportType: "",
      isReportType: true,
      itemHeight: 0,
      totalAnswer: 0,
      aLoader: false,
      answer_id: null,
      totalComments: 0,
    };
    this.refetch;
    this.editorComment = React.createRef();
    this.text = "";
    this.answerData = [];
    this.delayScrollToItem;
    this.callCounter = 0;
    this.flatListData = null;
    this.optionShowModal = this.optionShowModal.bind(this);
    this.optionShowModalMore = this.optionShowModalMore.bind(this);
    this.keyboardHeight = new Animated.Value(0);
  }

  startTypingRequest = (str) => {
    client
      .query({
        query: allUsers,
        variables: { q: "%" + str + "%" },
      })
      .then((result) => {
        this.setState({ users: result.data.UserSearch.data });
      });
  };

  navigateDetail = (props) => {
    requestAnimationFrame(() => {
      this.props.navigation.navigate("NotificationComment", {
        id: props.item.id,
        question_id: props.question_id,
      });
    });
  };
  componentDidMount() {
    this.setState({
      isLoading: false,
    });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });

    client
      .query({
        query: QUESTION_TOTAL,
        variables: { ID: this.props.navigation.getParam("id") },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let item = result.data.question;
        this.setState({ totalAnswer: item.answers.paginatorInfo.total });

        try {
          const data = client.readQuery({
            query: getQuestions,
          });

          const votedLink = data.questions.data.find(
            (data) => data.id === item.id
          );

          votedLink.likes.paginatorInfo.total = item.likes.paginatorInfo.total;
          votedLink.dislikes.paginatorInfo.total =
            item.dislikes.paginatorInfo.total;
          votedLink.voteStatus = item.voteStatus;
          client.writeQuery({ query: getQuestions, data });
        } catch (e) {}
      })
      .catch((error) => {});
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
    clearTimeout(this.delayScrollToItem);
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
      easing: Easing.out(Easing.elastic(1)),
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
    }).start();
  };

  _goToProfile = (id) => {
    this.props.navigation.navigate("UserProfile", { user_id: id });
  };

  _onRefresh = () => {
    this.setState({ refreshing: true, requestRefetch: true });
  };

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        this.refetch();
      }
    }
    if (this.props.navigation.getParam("answer_id")) {
      this.setState({ aLoader: true });
      this.callCounter = 0;
      this.delayScrollToItem = setTimeout(() => {
        this.scrollToItem();
      }, 2000);
    }
  };

  scrollToItem = async () => {
    if (this.props.navigation.getParam("answer_id")) {
      if (!this.flatListData) {
        this.setState({ aLoader: false });
      }

      const index = this.answerData.findIndex(
        (data) =>
          data.id === this.props.navigation.getParam("answer_id").toString()
      );

      if (index > -1) {
        this.flatListRef.scrollToIndex({
          animated: true,
          index: index,
          viewIndex: Dimensions.get("window").height / 2,
        });
        this.setState({ aLoader: false });
      } else {
        try {
          this.flatListRef.scrollToEnd({ animated: true });
          if (this.state.totalAnswer !== this.answerData.length) {
            await sleep(2000);

            if (this.callCounter != this.answerData.length) {
              this.scrollToItem();
            } else {
              this.setState({ aLoader: false });
            }
            this.callCounter = this.answerData.length;
          } else {
            this.setState({ aLoader: false });
          }
        } catch (e) {}
      }
    }
  };

  deleteItem = (id) => {
    client.mutate({
      mutation: deleteOfferCommentById,
      variables: {
        id: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        delete_sg_offer_comment_by_id: {
          __typename: "SgOfferComment",
          id: "",
        },
      },
      update: (cache, { data: { deleteOfferCommentById } }) => {
        try {
          const data = cache.readQuery({
            query: getExpertOpinionById,
            variables: { id: this.props.navigation.getParam("id") },
          });

          console.log("data delete data", data);

          const index = data.expert_opinion_by_id.comments.data.findIndex(
            (data) => data.id == id
          );

          if (index > -1) {
            data.expert_opinion_by_id.comments.data.splice(index, 1);
          }

          cache.writeQuery({
            query: getExpertOpinionById,
            variables: { id: this.props.navigation.getParam("id") },
            data,
          });
        } catch (e) {}
      },
    });
  };

  onChangeHandler = (message) => {
    if (this.state.clearInput) {
      this.setState({ clearInput: false });
    }
    this.text = message.text;
    //this.setState({text:message.text})
    /**
     * this callback will be called whenever input value change and will have
     * formatted value for mentioned syntax
     * @message : {text: 'Hey @(mrazadar)(id:1) this is good work.', displayText: `Hey @mrazadar this is good work`}
     * */
  };

  toggleEditor = () => {
    /**
     * This callback will be called
     * once user left the input field.
     * This will handle blur event.
     */
    // this.setState({
    //   showEditor: false,
    // })
  };

  onHideMentions = () => {
    /**
     * This callback will be called
     * When MentionsList hide due to any user change
     */
    this.setState({
      showMentions: false,
    });
  };

  optionShowModal = (item, user) => {
    this.setState({ item: item, question_id: item.id, user: user });
    this.ActionSheet.show();
  };

  onShare = async () => {
    try {
      const result = await Share.share({
        message: link.shareUrl + "/share/recommendation/" + this.state.item.id,
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
      link.shareUrl + "/share/recommendation/" + this.state.item.id
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

  navigateDetailPro = () => {
    this.props.navigateRecDetail(this.props);
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

  deleteQuestionMutation = () => {
    this.setState({ currntStatus: this.state.question_id });
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
        },
      })
      .then((result) => {
        this.setState({ currntStatus: null });
        this.props.navigation.navigate("Home");
      })
      .catch((error) => {
        this.setState({ currntStatus: null });
      });
  };

  getItemLayout = (data, index) => {
    this.answerData = data;
    let itemHeight = data[index].itemHeight ?? 0;
    itemHeight = itemHeight * 1.3;
    return { length: data.length, offset: itemHeight * index, index };
  };

  onContentSizeChange = (width, height) => {
    //setTimeout(() => this.flatListRef.scrollToEnd(), 2000)
    //this.flatListRef.scrollToEnd({animated:true});
  };

  onLayout = (event) => {
    this.setState({ itemHeight: event.nativeEvent.layout.height });
  };

  renderHeader = (data) => {
    return (
      <View style={styles.JobContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <View style={{ flexDirection: "row", flex: 2, marginBottom: 10 }}>
            <ProfileImageTitle
              goToProfile={this._goToProfile}
              item={data.expert_opinion_by_id}
              me={this.state.me}
            />
          </View>
          {/* <StatusPill item={data.recommendation} me={this.state.me} /> */}

          <View
            style={{
              flex: 1 / 2,
              flexDirection: "row-reverse",
            }}
          >
            <MenuQuestion
              actionShow={this.optionShowModal}
              actionShowMore={this.optionShowModalMore}
              item={data.expert_opinion_by_id}
              me={this.state.me}
            />
          </View>
        </View>
        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
          <QuestionDescription
            navigation={this.props.navigation}
            item={data.expert_opinion_by_id}
          />
        </View>
        <DiscussionDetailPhoto
          attachments={data.expert_opinion_by_id.attachments}
          controlModal={this.controlModal}
        />
        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              borderTopWidth: 1,
              borderColor: "#CCCFD6",
            }}
          >
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <TouchableOpacity
                style={{
                  flexDirection: "row",
                  paddingBottom: 13,
                  paddingTop: 13,
                }}
              >
                <Image
                  source={require("../assets/images/messages.png")}
                  style={{
                    width: 20,
                    height: 18,
                    resizeMode: "contain",
                  }}
                />
                <Text
                  style={{
                    color: color.grayColor,
                    fontFamily: FontFamily.Regular,
                    fontSize: 13,
                    marginLeft: 5,
                  }}
                >
                  {data.expert_opinion_by_id.comments?.paginatorInfo?.total}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    );
  };

  controlModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  addOrUpdateComments = (text) => {
    client
      .mutate({
        mutation: addOrUpdateOfferComments,
        variables: {
          offer_id: this.props.navigation.getParam("id"),
          comment: text,
        },
      })
      .then((res) => {
        this.setState({ clearInput: true });
        this.refetch();
      })
      .catch((e) => {
        console.log(
          "🚀 ~ file: RecomendationAnswerScreen.js:682 ~ RecomendationAnswerScreen ~ e",
          e
        );
      });
  };

  render() {
    const { aLoader, totalComments } = this.state;
    if (this.state.isLoading) {
      return (
        <View>
          <Text></Text>
        </View>
      );
    }

    return (
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {aLoader && (
          <View style={styles.aLoader}>
            <ActivityIndicator size="large" color={color.primaryColor} />
          </View>
        )}
        <Query
          query={getExpertOpinionById}
          variables={{
            id: this.props.navigation.getParam("id"),
          }}
        >
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;

            if (loading)
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <ActivityIndicator size="small" color={color.primaryColor} />
                </View>
              );

            if (error) {
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  <Feather size={32} name="wifi-off" />
                  <Text>No connection</Text>
                  <Button title="Retry" onPress={() => refetch()} />
                </View>
              );
            }

            if (!data.expert_opinion_by_id) {
              this.flatListData = data.expert_opinion_by_id;
              return (
                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                  }}
                >
                  <Image
                    style={{
                      width: "90%",
                      height: Dimensions.get("window").height - 250,
                    }}
                    source={require("../assets/lottie/empty-and-lost.gif")}
                  />
                  <Text
                    style={{
                      margin: 20,
                      textAlign: "center",
                      fontFamily: FontFamily.Regular,
                    }}
                  >
                    Sorry, question couldn't be loaded. It may have been
                    deleted.
                  </Text>
                </View>
              );
            }

            return (
              <View style={{ flex: 1, backgroundColor: "#fff" }}>
                <View style={{ flex: 1 }}>
                  <View style={styles.AnswerContainer}>
                    <OptimizedFlatList
                      ListHeaderComponent={() => this.renderHeader(data)}
                      ref={(ref) => {
                        this.flatListRef = ref;
                      }}
                      getItemLayout={this.getItemLayout}
                      extraData={data}
                      data={data.expert_opinion_by_id.comments.data}
                      renderItem={({ item }) => {
                        return (
                          <View style={{ marginBottom: 15 }}>
                            <AllAnswer
                              selectedAnswerId={this.props.navigation.getParam(
                                "answer_id"
                              )}
                              navigation={this.props.navigation}
                              navigateDetail={this.navigateDetail}
                              item={item}
                              question_id={this.props.navigation.getParam("id")}
                              _deleteItem={this.deleteItem}
                              me={this.state.me}
                            />
                          </View>
                        );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      initialNumToRender={10}
                      maxToRenderPerBatch={10}
                      onEndReachedThreshold={0.5}
                    />
                  </View>
                </View>

                {data.expert_opinion_by_id && (
                  <View>
                    <Animated.View
                      style={[
                        styles.container,
                        { paddingBottom: this.keyboardHeight },
                      ]}
                    >
                      <View
                        style={{
                          justifyContent: "center",
                          minHeight: 60,
                          borderColor: "#CCD0D9",
                          paddingLeft: 15,
                          paddingRight: 15,
                          backgroundColor: "#fff",
                        }}
                      >
                        <View style={styles.footAnswerInput}>
                          <View style={styles.editorStyle}>
                            <Editor
                              ref={this.editorComment}
                              editorStyles={{
                                input: {
                                  textAlignVertical: "bottom",
                                  borderWidth: 1,
                                },
                              }}
                              list={this.state.users}
                              initialValue={this.state.initialValue}
                              clearInput={this.state.clearInput}
                              onChange={this.onChangeHandler}
                              showEditor={this.state.showEditor}
                              toggleEditor={this.toggleEditor}
                              showMentions={this.state.showMentions}
                              onHideMentions={this.onHideMentions}
                              placeholder={"Write your answer"}
                              onTriggerChange={this.startTypingRequest}
                              editorHeight={30}
                              multiline
                              editorType={"relative"}
                              // disabledMultiline={true}
                              ///renderMentionList={this.renderMessageList}
                            />
                          </View>
                          <TouchableOpacity
                            style={styles.submitButton}
                            onPress={() => {
                              //this.editorComment.current.resetTextboxHeight();
                              if (this.text) {
                                this.addOrUpdateComments(this.text);
                              }
                            }}
                          >
                            <Image
                              style={{
                                width: 28,
                                height: 28,
                                resizeMode: "contain",
                              }}
                              source={require("../assets/images/send.png")}
                            />
                          </TouchableOpacity>
                        </View>
                      </View>
                    </Animated.View>
                  </View>
                )}
              </View>
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
      </KeyboardAvoidingView>
    );
  }
}
RecomendationAnswerScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 20 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    shadowOpacity: 0,
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 57,
    elevation: 0,
  },
  headerTitle: () => (
    <Text style={styles.headerPageTitle}>Discussion Detail</Text>
  ),
});

const styles = StyleSheet.create({
  container: {
    bottom: 0,
    width: "100%",
  },
  leadboardModal: {
    backgroundColor: "rgba(226, 226, 226, .75)",
    flex: 1,
    flexDirection: "column",
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
  JobContainer: {
    backgroundColor: "#fff",
    paddingBottom: 0,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  headerPageTitle: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 20,
  },
  header: {
    marginLeft: 30,
  },
  plusAddIcon: {
    marginRight: 20,
    width: 18,
    height: 18,
  },
  AnswerContainer: {
    backgroundColor: "#fff",
  },
  footAnswerInput: {
    flexDirection: "row",
    alignItems: "flex-end",
  },
  editorStyle: {
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingHorizontal: 10,
    borderWidth: 1,
    paddingVertical: 3,
    minHeight: 40,
    flex: 1,
    textAlignVertical: "center",
    justifyContent: "center",
    borderColor: "#CCD0D9",
  },
  submitButton: {
    justifyContent: "center",
    alignItems: "center",
    width: 36,
    height: 36,
    marginLeft: 2,
    borderRadius: 30,
    backgroundColor: color.primaryColor,
  },
  bottomModal: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    alignItems: "stretch",
  },
  modalContent: {
    backgroundColor: "#fff",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    // height:Dimensions.get('window').height/2.5,
  },
  modalListItemIcons: {
    marginTop: 6,
    marginRight: 10,
    marginLeft: 10,
    color: color.grayColor,
    fontSize: 28,
  },
  modalCloseList: {
    color: color.blackColor,
    textAlign: "center",
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalCloseIcon: {
    alignContent: "flex-end",
    position: "absolute",
    right: 15,
    top: 5,
    zIndex: 1,
  },
  aLoader: {
    position: "absolute",
    justifyContent: "center",
    backgroundColor: "rgba(255,255,255,0.7)",
    zIndex: 1,
    width: "100%",
    height: "100%",
  },
});

export default RecomendationAnswerScreen;
