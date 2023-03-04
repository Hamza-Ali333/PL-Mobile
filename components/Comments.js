import React, { Component } from "react";
import {
  Animated,
  ActivityIndicator,
  Dimensions,
  Image,
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Keyboard,
  UIManager,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import OptimizedFlatList from "./OptimizedFlatList";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import ProfileImageTitle from "../components/ProfileImageTitle";
import CommentItem from "../components/CommentItem";
import getAnswerDetails from "../graphql/queries/getAnswerDetails";
import gql from "graphql-tag";
import { Query, Mutation } from "react-apollo";
import moment from "moment";
import InputPhoto from "./InputPhoto";

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
      }
    }
  }
`;

const { State: TextInputState } = TextInput;
class Comments extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      dataSource: [],
      text: "",
      profile_photo: "",
      shift: new Animated.Value(0),
      me: {},
      data: this.props.navigation.state.params,
    };
    //this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
  }
  componentDidMount() {
    this.setState({
      isLoading: false,
    });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
  }

  componentWillMount() {
    this.keyboardDidShowSub = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow
    );
    this.keyboardDidHideSub = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowSub.remove();
    this.keyboardDidHideSub.remove();
  }

  handleKeyboardDidShow = (event) => {
    const { height: windowHeight } = Dimensions.get("window");
    const keyboardHeight = event.endCoordinates.height;
    const currentlyFocusedField = TextInputState.currentlyFocusedField();
    UIManager.measure(
      currentlyFocusedField,
      (originX, originY, width, height, pageX, pageY) => {
        const fieldHeight = height;
        const fieldTop = pageY;
        const gap =
          windowHeight - keyboardHeight - (fieldTop + fieldHeight) - 10;
        if (gap >= 0) {
          return;
        }
        Animated.timing(this.state.shift, {
          toValue: gap,
          duration: 1000,
          useNativeDriver: true,
        }).start();
      }
    );
  };

  handleKeyboardDidHide = () => {
    Animated.timing(this.state.shift, {
      toValue: 0,
      duration: 10,
      useNativeDriver: true,
    }).start();
    this.scrollView.scrollToEnd({ animated: true });
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
      <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
        <ScrollView
          ref={(ref) => (this.scrollView = ref)}
          style={{ flex: 1, backgroundColor: "#fff", marginTop: 15 }}
        >
          <View
            style={{
              borderColor: "#e8e8e8",
              borderBottomWidth: 1,
              marginBottom: 10,
            }}
          >
            <View style={{ padding: 15 }}>
              <Text
                style={{
                  lineHeight: 21,
                  fontSize: 14,
                  color: color.blackColor,
                  fontFamily: FontFamily.Regular,
                }}
              >
                {this.state.data.item.answer}
              </Text>

              <View style={{ flexDirection: "row", marginTop: 15 }}>
                {/*<JobIconsFoot item={this.props.navigation.getParam("item")} />*/}
              </View>
            </View>
          </View>
          <View style={styles.AnswerContainer}>
            <Query
              query={getAnswerDetails}
              variables={{
                ID: this.props.navigation.getParam("item").id,
              }}
            >
              {({ loading, error, data, fetchMore, refetch }) => {
                console.log("comments => ", data);
                if (loading)
                  return (
                    <View>
                      <ActivityIndicator
                        size="small"
                        color={color.primaryColor}
                      />
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

                return (
                  <OptimizedFlatList
                    extraData={this.state}
                    data={data.questionanswer.comments.data}
                    renderItem={({ item }) => {
                      return (
                        <CommentItem
                          answer_id={this.props.navigation.getParam("item").id}
                          item={item}
                          auth_id={this.state.me.id}
                          onRightPress={() => alert(item.id)}
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
                        updateQuery: (previousResult, { fetchMoreResult }) => {
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
                                    previousResult.questionanswer.__typename,
                                  comments: {
                                    __typename:
                                      previousResult.questionanswer.comments
                                        .__typename,
                                    data: [
                                      ...previousResult.questionanswer.comments
                                        .data,
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
        </ScrollView>
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
                query: getAnswerDetails,
                variables: { ID: this.props.navigation.getParam("item").id },
              });

              const commentData = data.questionanswer.comments.data;

              commentData.push(createAnswerComment);

              cache.writeQuery({
                query: getAnswerDetails,
                variables: { ID: this.props.navigation.getParam("item").id },
                data,
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
                  { transform: [{ translateY: shift }] },
                ]}
              >
                <View
                  style={{
                    width: "100%",
                    justifyContent: "center",
                    height: 60,
                    borderTopWidth: 1,
                    borderColor: "#E8E8E8",
                    paddingLeft: 15,
                    paddingRight: 15,
                    backgroundColor: "#fff",
                  }}
                >
                  <View style={styles.footAnswerInput}>
                    <InputPhoto item={this.state.me} />

                    <TextInput
                      style={{ width: "100%" }}
                      value={this.state.text}
                      placeholder="Write a comment"
                      onChangeText={(text) => this.setState({ text })}
                    />

                    <TouchableOpacity
                      style={styles.submitButton}
                      onPress={() => {
                        if (this.state.text) {
                          createAnswerComment({
                            variables: {
                              question_id: this.state.data.question_id,
                              answer_id:
                                this.props.navigation.getParam("item").id,
                              reply: this.state.text,
                            },
                          });
                        }
                      }}
                    >
                      <Text style={{ color: color.primaryColor, fontSize: 16 }}>
                        Submit
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              </Animated.View>
            );
          }}
        </Mutation>
      </View>
    );
  }
}

Comments.navigationOptions = (screenProps) => ({
  headerTitle: () => (
    <ProfileImageTitle
      style={styles.header}
      item={screenProps.navigation.getParam("item")}
    />
  ),
  headerRight: () => (
    <TouchableOpacity>
      <Image
        style={styles.plusAddIcon}
        source={require("../assets/images/options.png")}
      />
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
    height: 40,
    flexDirection: "row",
    justifyContent: "flex-end",
    backgroundColor: "#f6f6f6",
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 20,
    paddingLeft: 50,
    paddingRight: 70,
  },
  footUserProfile: {
    position: "absolute",
    left: 8,
    top: 5,
    width: 32,
    height: 32,
  },
  footUserProfileTextInput: {
    width: "100%",
  },
  submitButton: {
    alignItems: "flex-end",
    position: "absolute",
    right: 25,
    top: 12,
    width: 55,
  },
});

export default Comments;
