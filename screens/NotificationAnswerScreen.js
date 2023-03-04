import React, { Component } from "react";
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  Image,
  KeyboardAvoidingView,
  View,
  Text,
  Easing,
  StyleSheet,
  TextInput,
  Keyboard,
  TouchableOpacity,
  Alert,
  Modal,
  Button,
  Share,
  Clipboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Editor from "../components/react-native-mentions-editor";
import { Ionicons, Feather } from "@expo/vector-icons";
import JobIconsFoot from "../components/JobIconsFoot";
import ProfileImageTitle from "../components/ProfileImageTitle";
import QuestionDescription from "../components/QuestionDescription";
import OptimizedFlatList from "../components/OptimizedFlatList";
import AllAnswer from "../components/AllAnswer";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { List, Chip, Divider } from "react-native-paper";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import getNotificationAnswer from "../graphql/queries/getNotificationAnswer";
import getQuestions from "../graphql/queries/getQuestions";
import allUsers from "../graphql/queries/allUsers";
import moment from "moment";
import StatusPill from "../components/StatusPill";
import MenuQuestion from "../components/MenuQuestion";
import DiscussionDetailPhoto from "../components/DiscussionDetailPhoto";
import ActionSheet from "react-native-actionsheet";
import {
  _handleLikePressed,
  _handleDislikePressed,
  _handleSavedPressed,
  _handleUnsavedPressed,
  _handleAnswerLikePressed,
  _handleAnswerDislikePressed,
} from "../components/CombineFunction";
import deleteAnswerMutation from "../graphql/mutations/deleteAnswerMutation";
import reportMessageMutation from "../graphql/mutations/reportMessageMutation";
import deleteQuestionMutation from "../graphql/mutations/deleteQuestionMutation";
import * as Network from "expo-network";
import client from "../constants/client";
import link from "../constants/link";
import SinglePost from "../components/Skeleton/SinglePost";
import gstyles from "../constants/gstyles";
import NoWifi from "../components/NoWifi";

const ADD_COMMENT = gql`
  mutation createAnswer($question_id: Int!, $reply: String!) {
    createAnswer(question_id: $question_id, reply: $reply) {
      id
      answer
      voteStatus
      created_at
      users {
        id
        firstname
        lastname
        profile_photo
        color
      }
      likes(first: 1) {
        data {
          users {
            id
          }
        }
        paginatorInfo {
          total
        }
      }
      dislikes(first: 1) {
        data {
          users {
            id
          }
        }
        paginatorInfo {
          total
        }
      }
      comments(first: 1) {
        data {
          id
          comment
        }
        paginatorInfo {
          total
        }
      }
    }
  }
`;

const USER_FROM_QUESTION = gql`
  query ($ID: ID) {
    question(id: $ID) {
      id
      created_at
      users {
        id
        firstname
        lastname
        profile_photo
        color
      }
    }
  }
`;

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
const { State: TextInputState } = TextInput;
class NotificationAnswerScreen extends React.Component {
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
      mutation: deleteAnswerMutation,
      variables: {
        answer_id: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        deleteAnswer: {
          __typename: "QuestionAnswer",
          message: "",
        },
      },
      update: (cache, { data: { deleteAnswer } }) => {
        try {
          const data = cache.readQuery({
            query: getNotificationAnswer,
            variables: { ID: this.props.navigation.getParam("id") },
          });

          data.question.answers.paginatorInfo.total =
            data.question.answers.paginatorInfo.total - 1;

          const index = data.question.answers.data.findIndex(
            (data) => data.id === id
          );

          if (index > -1) {
            data.question.answers.data.splice(index, 1);
          }

          cache.writeQuery({
            query: getNotificationAnswer,
            variables: { ID: this.props.navigation.getParam("id") },
            data,
          });

          try {
            const data = cache.readQuery({
              query: getQuestions,
            });

            const commentLink = data.questions.data.find(
              (data) => data.id === this.props.navigation.getParam("id")
            );
            commentLink.answers.paginatorInfo.total =
              commentLink.answers.paginatorInfo.total - 1;

            cache.writeQuery({
              query: getQuestions,
              data,
            });
          } catch (e) {}
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
      alert(error.message);
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
              item={data.question}
              me={this.state.me}
            />
          </View>
          <StatusPill item={data.question} me={this.state.me} />

          <View
            style={{
              flex: 1 / 2,
              flexDirection: "row-reverse",
            }}
          >
            <MenuQuestion
              actionShow={this.optionShowModal}
              actionShowMore={this.optionShowModalMore}
              item={data.question}
              me={this.state.me}
            />
          </View>
        </View>
        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
          <QuestionDescription
            navigation={this.props.navigation}
            item={data.question}
          />
        </View>
        <DiscussionDetailPhoto
          attachments={data.question.attachments}
          controlModal={this.controlModal}
        />
        <View style={{ paddingLeft: 15, paddingRight: 15 }}>
          <JobIconsFoot
            _handleSavedPressed={_handleSavedPressed}
            _handleUnsavedPressed={_handleUnsavedPressed}
            _handleDislikePressed={_handleDislikePressed}
            _handleLikePressed={_handleLikePressed}
            item={data.question}
          />
        </View>
      </View>
    );
  };

  controlModal = () => {
    this.setState({
      visible: !this.state.visible,
    });
  };

  render() {
    const { shift, text, aLoader } = this.state;
    const { navigate } = this.props.navigation;
    const profile_photo = this.state.profile_photo;
    if (this.state.isLoading) {
      return (
        <View>
          <Text></Text>
        </View>
      );
    }
    return (
      <KeyboardAvoidingView style={{ flex: 1, backgroundColor: "white" }}>
        {aLoader && (
          <View style={styles.aLoader}>
            <ActivityIndicator size="large" color={color.primaryColor} />
          </View>
        )}
        <Query
          query={getNotificationAnswer}
          variables={{
            ID: this.props.navigation.getParam("id"),
          }}
        >
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
            if (loading)
              return (
                <>
                  <SinglePost />
                  <View style={gstyles.h_20} />
                  <Divider />
                  <View style={gstyles.h_20} />
                  <SinglePost />
                </>
              );

            if (error) return <NoWifi onPress={() => refetch()} />;

            if (!data.question) {
              this.flatListData = data.question;
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
                      //initialScrollIndex={4}
                      extraData={data}
                      data={data.question.answers.data}
                      renderItem={({ item }) => {
                        return (
                          <View style={{ marginBottom: 15 }}>
                            <AllAnswer
                              selectedAnswerId={this.props.navigation.getParam(
                                "answer_id"
                              )}
                              handleAnswerLikePressed={_handleAnswerLikePressed}
                              handleAnswerDislikePressed={
                                _handleAnswerDislikePressed
                              }
                              navigation={this.props.navigation}
                              goToProfile={this._goToProfile}
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
                      onEndReached={() => {
                        //if(data.question.answers.paginatorInfo.hasMorePages){
                        fetchMore({
                          variables: {
                            cursor:
                              data.question.answers.paginatorInfo.currentPage +
                              1,
                          },
                          updateQuery: (
                            previousResult,
                            { fetchMoreResult }
                          ) => {
                            const newQuestions =
                              fetchMoreResult.question.answers.data;
                            const pageInfo =
                              fetchMoreResult.question.answers.paginatorInfo;
                            if (
                              data.question.answers.paginatorInfo.total !==
                              pageInfo.total
                            ) {
                              refetch();
                            }
                            //alert(JSON.stringify(pageInfo, null, 2))

                            //return [...previousResult, ...fetchMoreResult];

                            return newQuestions.length
                              ? {
                                  // Put the new comments at the end of the list and update `pageInfo`
                                  // so we have the new `endCursor` and `hasNextPage` values
                                  question: {
                                    __typename:
                                      previousResult.question.__typename,
                                    id: previousResult.question.id,
                                    question: previousResult.question.question,
                                    description:
                                      previousResult.question.description,
                                    slug: previousResult.question.slug,
                                    meta_text:
                                      previousResult.question.meta_text,
                                    attachments:
                                      previousResult.question.attachments,
                                    tags: previousResult.question.tags,

                                    created_at:
                                      previousResult.question.created_at,
                                    voteStatus:
                                      previousResult.question.voteStatus,
                                    saveForCurrentUser:
                                      previousResult.question
                                        .saveForCurrentUser,
                                    categories:
                                      previousResult.question.categories,
                                    likes: previousResult.question.likes,
                                    dislikes: previousResult.question.dislikes,
                                    users: previousResult.question.users,
                                    answers: {
                                      __typename:
                                        previousResult.question.answers
                                          .__typename,
                                      data: [
                                        ...previousResult.question.answers.data,
                                        ...newQuestions,
                                      ],
                                      paginatorInfo: pageInfo,
                                    },
                                  },
                                }
                              : previousResult;
                          },
                        });
                        //}
                      }}
                    />
                  </View>
                </View>

                {data.question && (
                  <View>
                    <Mutation
                      //style={{flex:0.1}}
                      mutation={ADD_COMMENT}
                      optimisticResponse={{
                        __typename: "Mutation",
                        createAnswer: {
                          __typename: "QuestionAnswer",
                          answer: this.text,
                          voteStatus: -1,
                          created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
                          id: "_" + Math.floor(Math.random() * 10000),
                          users: this.state.me,
                          comments: {
                            __typename: "QuestionAnswerCommentPaginator",
                            data: [],
                          },
                          likes: {
                            __typename: "QuestionAnswerVotePaginator",
                            data: [],
                            paginatorInfo: {
                              __typename: "PaginatorInfo",
                              total: 0,
                            },
                          },
                          dislikes: {
                            __typename: "QuestionAnswerVotePaginator",
                            data: [],
                            paginatorInfo: {
                              __typename: "PaginatorInfo",
                              total: 0,
                            },
                          },
                        },
                      }}
                      update={(cache, { data: { createAnswer } }) => {
                        try {
                          this.text = "";
                          this.setState({ clearInput: true, text: "" });

                          const data = cache.readQuery({
                            query: getNotificationAnswer,
                            variables: {
                              ID: this.props.navigation.getParam("id"),
                            },
                          });

                          const commentData = data.question.answers;

                          commentData.data.unshift(createAnswer);
                          commentData.paginatorInfo.total =
                            commentData.paginatorInfo.total + 1;

                          cache.writeQuery({
                            query: getNotificationAnswer,
                            variables: {
                              ID: this.props.navigation.getParam("id"),
                            },
                            data,
                          });

                          this.flatListRef.scrollToOffset({
                            offset: 0,
                            animated: true,
                          });
                        } catch (e) {}
                        Keyboard.dismiss();
                        try {
                          const data = cache.readQuery({
                            query: getQuestions,
                          });

                          const commentLink = data.questions.data.find(
                            (data) =>
                              data.id === this.props.navigation.getParam("id")
                          );
                          commentLink.answers.paginatorInfo.total =
                            commentLink.answers.paginatorInfo.total + 1;

                          cache.writeQuery({
                            query: getQuestions,
                            data,
                          });
                        } catch (e) {}
                      }}
                    >
                      {(createAnswer, { loading, error, data }) => {
                        return (
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
                                      createAnswer({
                                        variables: {
                                          question_id:
                                            this.props.navigation.getParam(
                                              "id"
                                            ),
                                          reply: this.text,
                                        },
                                      });
                                      this.refetch();
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
                        );
                      }}
                    </Mutation>
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
NotificationAnswerScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 20 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    shadowOpacity: 0,
    paddingTop: 10,
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

export default NotificationAnswerScreen;
