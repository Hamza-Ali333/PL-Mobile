import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List } from "react-native-paper";
import ProfilePhoto from "../components/ProfilePhoto";
import NewOfferHeadRight from "../components/NewOfferHeadRight";
import capitalize from "../helper/capitalize";

class NewOfferScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      message: "",
      snackEnable: false,
      visible: false,
      topic_ids: [],
      tag_ids: [],
      user_ids: [],
      user_data: [],
      emails: [],
      me: {},
      status: 1,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      postNewQuestion: this.postNewQuestion,
      postLoading: false,
    });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
  }

  updateTopics = (data) => {
    this.setState({ topic_ids: data });
  };

  updateTags = (data) => {
    this.setState({ tag_ids: data });
  };

  updateUsers = (data) => {
    this.setState({ user_data: data });
    let usersIds = [];
    data.map((item, index) => {
      usersIds.push(parseInt(item.id));
    });
    this.setState({ user_ids: usersIds });
  };

  updateEmails = (data) => {
    this.setState({ emails: data });
  };

  postNewQuestion = () => {
    Keyboard.dismiss();

    if (this.state.text === "") {
      this.toast.show("Please enter description");
      //this.setState({snackEnable: true,message: "Please enter description"});
      return false;
    }
    if (this.state.topic_ids.length === 0) {
      this.toast.show("Please select alteast one topic");
      //this.setState({snackEnable: true,message: "Please select alteast one topic"});
      return false;
    }
    if (this.state.tag_ids.length === 0) {
      this.toast.show("Please select alteast one tag");
      //this.setState({snackEnable: true,message: "Please select alteast one tag"});
      return false;
    }

    this.props.navigation.setParams({ postLoading: true });

    getLinkPreview(this.state.text)
      .then((data) => {
        let meta = JSON.stringify(data);
        this.submitQuestion(meta);
      })
      .catch((error) => {
        this.submitQuestion("");
      });
  };

  submitQuestion = (meta) => {
    client
      .mutate({
        mutation: postQuestionMutation,
        variables: {
          title: this.state.text,
          description: "App",
          categories: this.state.topic_ids,
          user_ids: this.state.user_ids,
          tag_ids: this.state.tag_ids,
          emails: this.state.emails,
          status: this.state.status,
          meta_text: meta,
        },
        optimisticResponse: {
          __typename: "Mutation",
          createQuestion: {
            __typename: "Question",
            question: this.state.text,
            random: Math.floor(Math.random() * 10000 + 1),
            voteStatus: -1,
            status: this.state.status,
            saveForCurrentUser: false,
            created_at: moment().format("YYYY-MM-DD hh:mm:ss"),
            id: "_" + Math.floor(Math.random() * 10000),
            users: this.state.me,
            slug: "",
            meta_text: meta,
            tags: {
              __typename: "QuestionAnswerTag",
              id: "_" + Math.floor(Math.random() * 20000),
              tag_title: "",
            },
            answers: {
              __typename: "QuestionAnswerPaginator",
              paginatorInfo: {
                __typename: "PaginatorInfo",
                total: 0,
              },
            },
            likes: {
              __typename: "QuestionVotePaginator",
              paginatorInfo: {
                __typename: "PaginatorInfo",
                total: 0,
              },
              data: [],
            },
            dislikes: {
              __typename: "QuestionVotePaginator",
              paginatorInfo: {
                __typename: "PaginatorInfo",
                total: 0,
              },
              data: [],
            },
          },
        },

        update: (cache, { data: { createQuestion } }) => {
          try {
            const data = cache.readQuery({
              query: getQuestions,
            });

            createQuestion.new = true;

            data.questions.data.unshift(createQuestion);

            cache.writeQuery({
              query: getQuestions,
              data: data,
            });
          } catch (e) {}

          this.setState({
            text: "",
            topic_ids: [],
            tag_ids: [],
            user_ids: [],
            emails: [],
            status: 1,
          });
          this.props.navigation.setParams({ postLoading: false });
          this.props.navigation.navigate("Feed", { postUpdate: true });
        },
      })
      .then((results) => {
        this.props.navigation.setParams({ postLoading: false });
      })
      .catch((error) => {
        this.props.navigation.setParams({ postLoading: false });
      });
  };

  showModal() {
    this.setState({ visible: true });
  }
  hideModal() {
    this.setState({ visible: false });
  }

  _setStatus = (status) => {
    this.setState({ status: status });
    this.hideModal();
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <TouchableWithoutFeedback>
          <View style={styles.postQuestionProfile}>
            <ProfilePhoto size={42} item={this.state.me} />
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 2, justifyContent: "center" }}>
                <Text style={styles.userName}>
                  {capitalize(this.state.me.firstname)}{" "}
                  {capitalize(this.state.me.lastname)}
                </Text>
                {/* <Text style={{
                                           color: color.grayColor,
                                           fontSize: 12,
                                           fontFamily: FontFamily.Regular,}}>
                                     {this.state.me.username}
                                   </Text>*/}
              </View>
              <View
                style={{ alignItems: "flex-end", justifyContent: "center" }}
              >
                <TouchableOpacity
                  activeOpacity={0.9}
                  style={styles.questionStatus}
                  onPress={() => this.showModal()}
                >
                  <Text style={styles.questionStatusTitle}>
                    {this.state.status === 1 ? "Public" : "Private"}
                  </Text>
                  <Image
                    style={{ width: 7, height: 6, resizeMode: "contain" }}
                    source={require("../assets/images/polygon-down.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </TouchableWithoutFeedback>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.dateRangeText}>Title</Text>
          <View style={{ marginTop: 10 }}>
            <TextInput
              style={styles.awardTextInput}
              value="Procurement League"
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.dateRangeText}>Period</Text>
          <View style={{ flexDirection: "row", marginTop: 10 }}>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={styles.dateFromText}>From</Text>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <Text style={styles.dateFromText}>To</Text>
            </View>
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.dateRangeText}>Enter award</Text>
          <View style={{ marginTop: 10 }}>
            <TextInput
              style={styles.awardTextInput}
              placeholder="Describe value of award"
            />
          </View>
        </View>
        <View style={{ marginTop: 40 }}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-around",
            }}
          >
            <TouchableOpacity
              onPress={() =>
                navigate("TopicScreen", {
                  updateTopics: this.updateTopics,
                  topic_ids: this.state.topic_ids,
                })
              }
              style={styles.chipFilters}
            >
              <Text
                style={{
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  fontSize: 12,
                  marginRight: 2,
                }}
              >
                Topic
              </Text>
              <Image
                style={{
                  width: 8,
                  height: 7,
                  resizeMode: "contain",
                  marginLeft: 2,
                }}
                source={require("../assets/images/polygon-down.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigate("TagScreen", {
                  updateTags: this.updateTags,
                  tag_ids: this.state.tag_ids,
                })
              }
              style={styles.chipFilters}
            >
              <Text
                style={{
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  fontSize: 12,
                  marginRight: 2,
                }}
              >
                Tag(s)
              </Text>
              <Image
                style={{
                  width: 7,
                  height: 7,
                  resizeMode: "contain",
                  marginLeft: 2,
                }}
                source={require("../assets/images/plus.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigate("ContributorScreen", {
                  updateUsers: this.updateUsers,
                  user_ids: this.state.user_data,
                })
              }
              style={styles.chipFilters}
            >
              <Text
                style={{
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  fontSize: 12,
                  marginRight: 2,
                }}
              >
                Member
              </Text>

              <Image
                style={{
                  width: 7,
                  height: 7,
                  resizeMode: "contain",
                  marginLeft: 2,
                }}
                source={require("../assets/images/plus.png")}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() =>
                navigate("EmailScreen", {
                  updateEmails: this.updateEmails,
                  peoples: this.state.emails,
                })
              }
              style={styles.chipFilters}
            >
              <Text
                style={{
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  fontSize: 12,
                  marginRight: 2,
                }}
              >
                E-mail
              </Text>
              <Image
                style={{
                  width: 11,
                  height: 8,
                  resizeMode: "contain",
                  marginLeft: 2,
                }}
                source={require("../assets/images/Email-black.png")}
              />
            </TouchableOpacity>
          </View>
        </View>
        <Modal
          animationType="fade"
          transparent={true}
          visible={this.state.visible}
        >
          <View style={styles.bottomModal}>
            <View style={styles.modalContent}>
              <TouchableOpacity
                style={styles.modalCloseIcon}
                onPress={() => this.hideModal()}
              >
                <Ionicons name="ios-close" size={32} color="red" />
              </TouchableOpacity>
              <Text
                style={styles.modalCloseList}
                onPress={() => this.hideModal()}
              >
                ACCESS
              </Text>
              <List.Item
                onPress={() => this._setStatus(1)}
                style={[
                  styles.BottomOptionListItems,
                  {
                    backgroundColor:
                      this.state.status === 1 ? "#F5F5F5" : "#ffffff",
                  },
                ]}
                titleStyle={{
                  fontSize: 16,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                title="Public"
                descriptionNumberOfLines={4}
                descriptionStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                description="Everyone sees who posted this question"
                left={(props) => (
                  <Image
                    style={styles.modalListItemIcons}
                    source={require("../assets/images/Earth.png")}
                  />
                )}
              />

              <List.Item
                style={[styles.BottomOptionListItems, { opacity: 0.3 }]}
                titleStyle={{
                  fontSize: 16,
                  fontFamily: FontFamily.Regular,
                  color: "#000",
                }}
                title="Private"
                descriptionNumberOfLines={4}
                descriptionStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                description="Question posted within your team(s) only"
                left={(props) => (
                  <Image
                    style={styles.modalListItemIcons}
                    source={require("../assets/images/Lock.png")}
                  />
                )}
              />
              <List.Item
                style={[styles.BottomOptionListItems, { opacity: 0.3 }]}
                titleStyle={{
                  fontSize: 16,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                title="Friends"
                descriptionNumberOfLines={4}
                descriptionStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                }}
                description="Your followers and people you follow receive this in their feed "
                left={(props) => (
                  <Image
                    style={styles.modalListItemIcons}
                    source={require("../assets/images/Friends.png")}
                  />
                )}
              />
            </View>
          </View>
        </Modal>
      </View>
    );
  }
}

NewOfferScreen.navigationOptions = (screenProps) => ({
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
  headerLeft: () => (
    <TouchableOpacity
      style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
      onPress={this.showModal}
    >
      <Text style={styles.postQuestionPageTitle}>Post your Offer</Text>
      <Image
        style={{ width: 14, height: 14, resizeMode: "contain" }}
        source={require("../assets/images/ArrowDown.png")}
      />
    </TouchableOpacity>
  ),
  headerRight: () => <NewOfferHeadRight {...screenProps} />,
});

const styles = StyleSheet.create({
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginLeft: 15,
    marginRight: 5,
  },
  postQuestionPage: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postQuestionProfile: {
    paddingBottom: 15,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  userProfile: {
    marginRight: 10,
    width: 38,
    height: 38,
    overflow: "visible",
    borderRadius: 90,
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
  questionStatus: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 80,
    height: 28,
    borderWidth: 1,
    borderColor: color.primaryColor,
    borderRadius: 6,
  },
  earthIcon: {
    color: "#878787",
    fontSize: 14,
  },
  questionStatusTitle: {
    color: color.blackColor,
    fontSize: 12,
    fontFamily: FontFamily.Regular,
  },
  questionStatusArrow: {
    color: color.blackColor,
    fontSize: 15,
  },
  postQuestionTextareaConatiner: {
    flex: 1 / 1.4,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "row",
  },
  postQuestionTextInput: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    width: "100%",
    textAlignVertical: "top",
    backgroundColor: color.lightGrayColor,
    borderRadius: 8,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  postQuestionBottomOption: {
    flex: 1,
    justifyContent: "flex-end",
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
  },
  BottomOptionImage: {
    width: 24,
    height: 24,
    marginTop: 5,
    marginRight: 8,
    marginLeft: 8,
  },
  bottomModal: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "stretch",
  },
  modalContent: {
    backgroundColor: "#fff",
    // height:Dimensions.get('window').height/2.5,
  },
  modalListItemIcons: {
    width: 20,
    height: 20,
    marginTop: 8,
    marginRight: 5,
    marginLeft: 5,
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
  chipFilters: {
    borderRadius: 6,
    marginRight: 2,
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    borderWidth: 1,
    borderColor: color.primaryColor,
  },

  dateRangeText: {
    fontSize: 20,
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
  },
  dateFromText: {
    fontSize: 17,
    fontFamily: FontFamily.Regular,
    color: "#929292",
  },
  awardTextInput: {
    borderColor: "#bfbfbf",
    padding: 13,
    color: color.blackColor,
    fontSize: 16,
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
  },
});

export default NewOfferScreen;
