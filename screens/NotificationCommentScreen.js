import React, { Component } from "react";
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  View,
  Text,
  Easing,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign, Feather } from "@expo/vector-icons";
import OptimizedFlatList from "../components/OptimizedFlatList";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import ProfileImageTitle from "../components/ProfileImageTitle";
import CommentItem from "../components/CommentItem";
import deleteCommentMutation from "../graphql/mutations/deleteCommentMutation";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import moment from "moment";
import client from "../constants/client";
import LikeDislikeAnswer from "../components/LikeDislikeAnswer";
import * as Network from "expo-network";
import {
  _handleAnswerLikePressed,
  _handleAnswerDislikePressed,
} from "../components/CombineFunction";
import getNotificationComment from "../graphql/queries/getNotificationComment";

const ADD_COMMENT = gql`
  mutation createAnswerComment(
    $question_id: Int!
    $answer_id: Int!
    $reply: String!
  ) {
    createAnswerComment(
      question_id: $question_id
      answer_id: $answer_id
      reply: $reply
    ) {
      id
      comment
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

const USER_FROM_ANSWER = gql`
  query ($ID: ID) {
    questionanswer(id: $ID) {
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

const { State: TextInputState } = TextInput;
class NotificationCommentScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      text: "",
      profile_photo: "",
      me: {},
      data: this.props.navigation.state.params,
    };
    this.keyboardHeight = new Animated.Value(0);
    this.animation;
    this.refetch;
    this.question_id = null;
  }
  componentDidMount() {
    this.setState({
      isLoading: false,
    });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
    this.props.navigation.setParams({
      navigateQuestion: this.navigateQuestion,
    });
  }

  navigateQuestion = () => {
    this.props.navigation.navigate("NotificationAnswer", {
      id: this.question_id,
    });
  };

  resetAnimation = () => {
    this.animation.reset();
    this.animation.play();
  };

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

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        this.refetch();
      }
    }
  };

  deleteComment = (id) => {
    client
      .mutate({
        mutation: deleteCommentMutation,
        variables: {
          comment_id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          deleteComment: {
            __typename: "DeleteComment",
            message: "",
          },
        },

        update: (cache, { data: { deleteComment } }) => {
          try {
            const data = cache.readQuery({
              query: getNotificationComment,
              variables: { ID: this.props.navigation.getParam("id") },
            });

            const index = data.questionanswer.comments.data.findIndex(
              (data) => data.id === id
            );
            if (index > -1) {
              data.questionanswer.comments.data.splice(index, 1);
            }

            data.questionanswer.comments.paginatorInfo.total =
              data.questionanswer.comments.paginatorInfo.total - 1;

            cache.writeQuery({
              query: getNotificationComment,
              variables: { ID: this.props.navigation.getParam("id") },
              data,
            });
          } catch (e) {}
        },
      })
      .then((results) => {})
      .catch((error) => {});
  };

  render() {
    const { shift, text } = this.state;
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
      <View style={{ flex: 1, backgroundColor: "#ffffff" }}>
        <Query
          query={getNotificationComment}
          variables={{
            ID: this.props.navigation.getParam("id"),
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

            if (error)
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

            if (!data.questionanswer) {
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
                    Sorry, answer couldn't be loaded. It may have been deleted.
                  </Text>
                </View>
              );
            }

            this.question_id = data.questionanswer.questions.id;

            return (
              <View style={{ flex: 1 }}>
                <ScrollView ref={(ref) => (this.scrollView = ref)}>
                  <View>
                    <View
                      style={{
                        borderColor: "#e8e8e8",
                        borderBottomWidth: 1,
                      }}
                    >
                      <View style={{ padding: 15 }}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <View style={{ flexDirection: "row", flex: 2 }}>
                            <ProfileImageTitle
                              goToProfile={this._goToProfile}
                              item={data.questionanswer}
                            />
                          </View>
                        </View>
                        <Text
                          style={{
                            lineHeight: 21,
                            fontSize: 15,
                            color: color.blackColor,
                            fontFamily: FontFamily.Regular,
                            marginLeft: 50,
                          }}
                        >
                          {data.questionanswer.answer}
                        </Text>

                        <LikeDislikeAnswer
                          _handleAnswerLikePressed={_handleAnswerLikePressed}
                          _handleAnswerDislikePressed={
                            _handleAnswerDislikePressed
                          }
                          question_id={this.props.navigation.getParam(
                            "question_id"
                          )}
                          item={data.questionanswer}
                        />

                        <View style={{ flexDirection: "row", marginTop: 15 }}>
                          {/*<JobIconsFoot item={this.props.navigation.getParam("item")} />*/}
                        </View>
                      </View>
                    </View>
                    <View style={styles.AnswerContainer}>
                      <OptimizedFlatList
                        extraData={this.state}
                        data={data.questionanswer.comments.data}
                        renderItem={({ item }) => {
                          return (
                            <CommentItem
                              goToProfile={this._goToProfile}
                              answer_id={data.questionanswer.id}
                              item={item}
                              me={this.state.me}
                              onRightPress={() => alert(item.id)}
                              _deleteComment={this.deleteComment}
                            />
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        onEndReachedThreshold={0.5}
                        onEndReached={() => {
                          fetchMore({
                            variables: {
                              cursor:
                                data.questionanswer.comments.paginatorInfo
                                  .currentPage + 1,
                            },
                            updateQuery: (
                              previousResult,
                              { fetchMoreResult }
                            ) => {
                              const newQuestions =
                                fetchMoreResult.questionanswer.comments.data;
                              const pageInfo =
                                fetchMoreResult.questionanswer.comments
                                  .paginatorInfo;

                              //return [...previousResult, ...fetchMoreResult];

                              return newQuestions.length
                                ? {
                                    // Put the new comments at the end of the list and update `pageInfo`
                                    // so we have the new `endCursor` and `hasNextPage` values
                                    questionanswer: {
                                      __typename:
                                        previousResult.questionanswer
                                          .__typename,
                                      comments: {
                                        __typename:
                                          previousResult.questionanswer.comments
                                            .__typename,
                                        data: [
                                          ...previousResult.questionanswer
                                            .comments.data,
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
                    </View>
                  </View>
                </ScrollView>
                {data.questionanswer && (
                  <Mutation
                    mutation={ADD_COMMENT}
                    optimisticResponse={{
                      __typename: "Mutation",
                      createAnswerComment: {
                        __typename: "QuestionAnswerComment",
                        id: "_" + Math.floor(Math.random() * 10000),
                        comment: text,
                        created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
                        users: this.state.me,
                      },
                    }}
                    update={(cache, { data: { createAnswerComment } }) => {
                      try {
                        this.setState({ text: "" });
                        const data = cache.readQuery({
                          query: getNotificationComment,
                          variables: {
                            ID: this.props.navigation.getParam("id"),
                          },
                        });

                        const commentData = data.questionanswer.comments;

                        commentData.data.unshift(createAnswerComment);
                        commentData.paginatorInfo.total =
                          commentData.paginatorInfo.total + 1;

                        cache.writeQuery({
                          query: getNotificationComment,
                          variables: {
                            ID: this.props.navigation.getParam("id"),
                          },
                          data,
                        });
                        this.scrollView.scrollToOffset({
                          offset: 0,
                          animated: true,
                        });
                      } catch (e) {}
                      Keyboard.dismiss();
                    }}
                    /*
          update={(store, { data: { likes } }) =>
            this._updateCacheAfterComment(store, likes)
          }*/
                  >
                    {(createAnswerComment, { loading, error, data }) => {
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
                              height: 60,
                              borderTopWidth: 1,
                              borderColor: "#CCD0D9",
                              paddingLeft: 15,
                              paddingRight: 15,
                              backgroundColor: "#fff",
                            }}
                          >
                            <View style={styles.footAnswerInput}>
                              {/*<InputPhoto item={this.state.me} />*/}

                              <TextInput
                                style={{
                                  height: 40,
                                  fontFamily: FontFamily.Regular,
                                }}
                                value={this.state.text}
                                placeholder="Write your comment"
                                onChangeText={(text) => this.setState({ text })}
                              />

                              <TouchableOpacity
                                style={styles.submitButton}
                                onPress={() => {
                                  if (this.state.text) {
                                    createAnswerComment({
                                      variables: {
                                        question_id:
                                          this.props.navigation.getParam(
                                            "question_id"
                                          ),
                                        answer_id:
                                          this.props.navigation.getParam("id"),
                                        reply: this.state.text,
                                      },
                                    });
                                  }
                                }}
                              >
                                <Image
                                  style={{
                                    width: 28,
                                    height: 28,
                                    resizeMode: "cover",
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
                )}
              </View>
            );
          }}
        </Query>
      </View>
    );
  }
}

NotificationCommentScreen.navigationOptions = (screenProps) => ({
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
  headerRight: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("navigateQuestion")}
      style={{ marginRight: 10, flexDirection: "row" }}
    >
      <Text style={{ fontSize: 20, color: color.primaryColor }}>Go</Text>
      <AntDesign name="doubleright" size={24} color={color.primaryColor} />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  ReplyAnswerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
  },
  headerPageTitle: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 20,
  },
  ReplyUserProfileImage: {
    marginRight: 10,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  plusAddIcon: {
    marginRight: 20,
    width: 18,
    height: 18,
  },
  ReplyUserName: {
    fontSize: 15,
    fontFamily: FontFamily.Bold,
    color: "#333",
    letterSpacing: 0.5,
    paddingRight: 10,
  },
  ReplyUserDescription: {
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    fontSize: 14,
    paddingLeft: 0,
    marginTop: 5,
  },
  ReplyUserDate: {
    fontSize: 13,
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    marginTop: 4,
  },
  viewMoreComments: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 11,
    letterSpacing: 0.5,
    flex: 1,
  },
  ReplyUserLike: {
    fontSize: 22,
    color: color.blackColor,
  },
  ReplyUserDislike: {
    fontSize: 22,
    color: color.primaryColor,
  },
  ReplyText: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
  },
  bottomModal: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "stretch",
    padding: 10,
  },
  modalContent: {
    flex: 1,
    backgroundColor: "#fff",
    padding: 15,
    borderBottomLeftRadius: 9,
    borderBottomRightRadius: 9,
    // height:Dimensions.get('window').height/2.5,
  },
  modalClose: {
    backgroundColor: "#e8e8e8",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    justifyContent: "space-between",
    paddingBottom: 10,
    paddingTop: 10,
    borderTopLeftRadius: 9,
    borderTopRightRadius: 9,
  },
  modalCloseIcon: {
    height: 16,
    width: 16,
  },
  footAnswerInput: {
    backgroundColor: "#f5f5f5",
    position: "relative",
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 70,
    height: 42,
    borderWidth: 1,
    borderColor: "#CCD0D9",
  },
  footUserProfile: {
    position: "absolute",
    left: 8,
    top: 5,
    width: 32,
    height: 32,
    borderRadius: 20,
  },
  submitButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 2,
    top: 2,
    width: 36,
    height: 36,
    borderRadius: 30,
    backgroundColor: color.primaryColor,
  },
});

export default NotificationCommentScreen;
