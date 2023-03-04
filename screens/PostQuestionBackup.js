import React, { Component } from "react";
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  UIManager,
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  Keyboard,
  Platform,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as DocumentPicker from "expo-document-picker";
import Editor, { EU } from "../components/react-native-mentions-editor";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { AntDesign, Ionicons, Feather, Octicons } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List } from "react-native-paper";
import { getLinkPreview } from "link-preview-js";
import postQuestionMutation from "../graphql/mutations/postQuestionMutation";
import updateQuestion from "../graphql/mutations/updateQuestion";
import getQuestions from "../graphql/queries/getQuestions";
import allUsers from "../graphql/queries/allUsers";
import getQuestion from "../graphql/queries/getQuestion";
import client from "../constants/client";
import moment from "moment";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";
import * as ImagePicker from "expo-image-picker";
import link from "../constants/link";
import VideoPlayer from "../components/VideoPlayer";
import Toast, { DURATION } from "react-native-easy-toast";

class PostQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.mentionsMap = new Map();
    this.state = {
      text: "",
      message: "",
      snackEnable: false,
      visible: false,
      topic_ids: [],
      tag_ids: [],
      user_ids: [],
      user_data: [],
      tag_data: [],
      emails: [],
      me: {},
      status: 1,
      initialValue: "",
      showEditor: true,
      message: null,
      messages: [],
      clearInput: false,
      users: [],
      showMentions: false,
      show: false,
      autoFocus: false,
      flexDirection: "column",
      popupVisible: false,
      isTextAreaRender: false,
      initHTML: "",
      loading: false,
      update: false,
      shown: false,
      placeHolderEnable: true,
      postImages: [],
      postImagesObject: [],
      photoImageLoader: false,
      videoSource: null,
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.editorRef;
  }
  componentDidMount() {
    this.props.navigation.setParams({
      postNewQuestion: this.postNewQuestion,
      postLoading: false,
    });

    this.props.navigation.setParams({
      navigateToHome: this.navigateToHome,
    });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });

    this.props.navigation.setParams({
      enableAlert: this.enableAlert,
    });

    this.setInitialValue();

    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  tapOnTabNavigator = () => {
    if (this.props.navigation.getParam("id")) {
      this.setState({ loading: true, placeHolderEnable: false });
      this.getQuestion(this.props.navigation.getParam("id"));
    }
  };

  setInitialValue = async () => {
    const newDiscussionPost = await AsyncStorage.getItem("@newDiscussionPost");
    if (newDiscussionPost) {
      this.setState({
        text: newDiscussionPost,
        initialValue: newDiscussionPost,
        initHTML: newDiscussionPost,
        isTextAreaRender: true,
        placeHolderEnable: false,
      });
    } else {
      this.setState({ isTextAreaRender: true });
    }
  };

  enableAlert = () => {
    alert("hellow");
  };

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener("keyboardDidHide", () =>
      this.setState({ show: true })
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  handleKeyboardDidShow = (event) => {
    this.changeLayout();
    this.setState({ show: true });
  };

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  formatMentionNode = (txt, key) => <p key={key}>{txt}</p>;

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

  updateTopics = (data) => {
    this.setState({ topic_ids: data });
  };

  updateTags = (data) => {
    this.setState({ tag_data: data });
    let tagIds = [];
    data.map((item, index) => {
      tagIds.push(parseInt(item.id));
    });
    this.setState({ tag_ids: tagIds });
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

  navigateToHome = () => {
    if (this.state.text) {
      this.setState({ popupVisible: true });
    } else {
      this.setState({ show: false });
      AsyncStorage.removeItem("@newDiscussionPost");
      this.props.navigation.navigate("Home");
    }
  };

  postNewQuestion = () => {
    //this.child.emptyTextArea();
    Keyboard.dismiss();

    if (this.state.text === "") {
      this.toast.show("Please enter description");
      //this.setState({snackEnable: true,message: "Please enter description"});
      return false;
    }
    if (this.state.topic_ids.length === 0) {
      this.toast.show("Please select alteast one topic");
      this.props.navigation.navigate("TopicScreen", {
        updateTopics: this.updateTopics,
        topic_ids: this.state.topic_ids,
      });
      //this.setState({snackEnable: true,message: "Please select alteast one topic"});
      return false;
    }
    if (this.state.tag_ids.length === 0) {
      this.toast.show("Please select alteast one tag");
      this.props.navigation.navigate("TagScreen", {
        updateTags: this.updateTags,
        tag_ids: this.state.tag_data,
      });
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

  onChangeHandler = (message) => {
    //this.richtext.focusContentEditor();
    if (message) {
      this.setState({
        text: message,
        clearInput: false,
        shown: true,
        placeHolderEnable: false,
      });
    } else {
      this.setState({
        text: message,
        clearInput: false,
        shown: true,
        placeHolderEnable: true,
      });
    }

    this.scrollView.scrollToEnd({ animated: true });

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

  submitQuestion = (meta) => {
    Keyboard.dismiss();
    let update = this.state.update;
    if (update) {
      client
        .mutate({
          mutation: updateQuestion,
          variables: {
            id: this.state.question_id,
            question: this.state.text,
          },
          optimisticResponse: {
            __typename: "Mutation",
            updateQuestion: {
              __typename: "UpdateQuestion",
              question: this.state.text,
              id: this.state.question_id,
            },
          },
          update: (cache, { data: { updateQuestion } }) => {
            try {
              const data = cache.readQuery({
                query: getQuestions,
                variables: {
                  id: this.state.question_id,
                },
              });

              data.question = this.state.text;
              cache.writeQuery({
                query: getQuestions,
                variables: { id: this.state.question_id },
                data: data,
              });
            } catch (e) {}
          },
        })
        .then((results) => {
          this.setState({
            text: "",
            topic_ids: [],
            tag_ids: [],
            user_ids: [],
            emails: [],
            user_data: [],
            tag_data: [],
            status: 1,
            clearInput: true,
            show: false,
          });
          this.props.navigation.setParams({ postLoading: false });
          Alert.alert(
            "Question Updated",
            "You are successfully updated a question",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("Home", { postUpdate: true }),
              },
            ],
            { cancelable: false }
          );
        })
        .catch((error) => {
          this.props.navigation.setParams({ postLoading: false });
        });
    } else {
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
            pictures: this.state.postImages,
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
              user_data: [],
              tag_data: [],
              status: 1,
              clearInput: true,
              show: false,
            });
            this.props.navigation.setParams({ postLoading: false });
          },
        })
        .then((results) => {
          this.setState({
            text: "",
            topic_ids: [],
            tag_ids: [],
            user_ids: [],
            emails: [],
            user_data: [],
            tag_data: [],
            status: 1,
            clearInput: true,
            show: false,
          });
          this.props.navigation.setParams({ postLoading: false });
          Alert.alert(
            "Posted",
            "You are successfully posted a discussion",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("Home", { postUpdate: true }),
              },
            ],
            { cancelable: false }
          );
        })
        .catch((error) => {
          Alert.alert(
            "Posted",
            "You are successfully posted a discussion",
            [
              {
                text: "OK",
                onPress: () =>
                  this.props.navigation.navigate("Home", { postUpdate: true }),
              },
            ],
            { cancelable: false }
          );
          this.setState({
            text: "",
            topic_ids: [],
            tag_ids: [],
            user_ids: [],
            emails: [],
            status: 1,
            clearInput: true,
            show: false,
          });
          this.props.navigation.setParams({ postLoading: false });
        });
    }
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

  touchFeedback = () => {
    //this.editorRef.focus();
  };

  changeLayout = () => {
    if (this.state.flexDirection === "column" && this.state.show === false) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      this.setState({ flexDirection: "row" });
    } else {
      this.setState({ flexDirection: "column" });
    }
  };

  saveAsDraft = () => {
    AsyncStorage.setItem("@newDiscussionPost", this.state.text)
      .then((result) => {
        this.setState({ popupVisible: false, show: false });
        this.props.navigation.navigate("Home");
      })
      .catch((err) => {});
  };

  discardPost = () => {
    this.setState({ popupVisible: false, show: false });
    AsyncStorage.removeItem("@newDiscussionPost");
    this.props.navigation.navigate("Home");
  };

  cancelPost = () => {
    this.setState({ popupVisible: false });
  };

  getQuestion = (id) => {
    client
      .query({
        query: getQuestion,
        variables: { ID: id },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let topic_ids = [];
        let tag_ids = [];
        let tag_data = [];
        let user_ids = [];
        let user_data = [];
        result.data.question.categories.map((category) => {
          topic_ids.push(category.id);
        });
        result.data.question.tags.map((tag) => {
          tag_ids.push(tag.id);
        });
        tag_data = result.data.question.tags;

        result.data.question.invites.map((invite) => {
          user_ids.push(invite.id);
        });
        user_data = result.data.question.invites;

        if (!result.loading) {
          this.setState({
            initHTML: result.data.question.question,
            text: result.data.question,
            question_id: result.data.question.id,
            topic_ids: topic_ids,
            tag_ids: tag_ids,
            tag_data: tag_data,
            user_ids: user_ids,
            user_data: user_data,
            loading: false,
            update: true,
          });
        }
      })
      .catch((error) => {});
  };

  mentionedScreen = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("mentionedScreen");
  };
  handleCustomAction = () => {
    this.props.navigation.navigate("mentionedScreen");
  };

  _setUserSession = async () => {
    const save = await AsyncStorage.getItem("userSession");
    const item = JSON.parse(save);
    this.setState({ token: item.token });
  };

  createFormData = (photo, body) => {
    const data = new FormData();

    data.append("file", {
      name: "photo-file.jpg",
      type: "image/jpg",
      uri: Platform.OS === "android" ? photo : photo.replace("", ""),
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  handleUploadPhoto = (file) => {
    return fetch(link.url + "/api/s3upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.state.token}` || null,
      },
      body: this.createFormData(file, { type: "image" }),
    })
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  handleUploadVideo = (file) => {
    return fetch(link.url + "/api/s3upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.state.token}` || null,
      },
      body: this.createFormData(file, { type: "video" }),
    })
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  onSwipeDown(gestureState) {
    Keyboard.dismiss();
  }

  updateMentions = (data) => {
    let { text } = this.state;
    let html = "";
    let width = 0;
    data.map((item, index) => {
      width = (item.username.length + 1) * 8 + 8;
      html +=
        '<input type="text" disabled id="' +
        item.id +
        '" style="color:' +
        color.primaryColor +
        "; background-color:#fff;border:0px;width:" +
        width +
        'px;font-size:15px;" value="@' +
        item.username +
        '" />';
    });
    this.richtext.insertHTML(html);
    this.setState({ user_data: [] });
  };

  postRemoveImage = (index) => {
    let postImages = [...this.state.postImages]; // make a separate copy of the array
    if (index !== -1) {
      postImages.splice(index, 1);
      this.setState({ postImages });
    }
  };

  _pickFile = async () => {
    let postImages = this.state.postImages;
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    let val = result.uri.toLowerCase(),
      regex = new RegExp("(.*?).(mp4)$");

    if (!regex.test(val)) {
      alert("Please select correct file format");
      return false;
    }

    if (result.size > 10000000) {
      //alert("File must be less or equal to 10 MB");
      //return;
    }
    if (result.type === "success") {
      this.setState({ photoImageLoader: true });
      let res = await this.handleUploadVideo(result.uri);
      postImages.push({
        url: res.path,
        type: "video",
        mime: "video",
        size: 20,
      });
      this.setState({
        postImages: postImages,
        photoImageLoader: false,
      });
    }
  };

  _pickImage = async () => {
    let postImages = this.state.postImages;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: false,
      aspect: [4, 4],
      quality: 1,
    });
    if (!result.cancelled) {
      this.setState({ photoImageLoader: true });
      let res = await this.handleUploadPhoto(result.uri);

      postImages.push({
        url: res.path,
        type: "photo",
        mime: "image",
        size: 20,
      });
      this.setState({
        postImages: postImages,
        photoImageLoader: false,
      });
    }
  };

  render() {
    let { postImages } = this.state;
    let { postImagesObject } = this.state;
    const config = {
      velocityThreshold: 0.3,
      directionalOffsetThreshold: 80,
    };
    let initialValue = this.state.initialValue;
    let initHTML = this.state.initHTML;
    const placeholder =
      "1. Type your question text  \n\n2. Select topic - Select the topic this question most likely belongs to \n\n3. Add tags - Search and select tags for better reach \n\n4. Add members - Search and select members from Procurement League community \n\n5. Invite members - Invite your friends to participate by entering their email";
    const { navigate } = this.props.navigation;
    if (this.state.loading) {
      return (
        <View
          style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
        >
          <ActivityIndicator size={"large"} color={color.primaryColor} />
        </View>
      );
    }
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={getStatusBarHeight() + 70}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <Toast
          ref={(r) => (this.toast = r)}
          style={{ backgroundColor: "gray" }}
          defaultCloseDelay={3000}
          position="center"
          positionValue={200}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#ffffff" }}
        />
        <SafeAreaView style={[styles.postQuestionPage]}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <View style={[styles.postQuestionTextareaConatiner]}>
              <ScrollView
                contentContainerStyle={{ flex: 1, position: "relative" }}
                ref={(ref) => {
                  this.scrollView = ref;
                }}
                keyboardDismissMode="on-drag"
                showsVerticalScrollIndicator={false}
              >
                <RichEditor
                  scrollEnabled={true}
                  ref={(rf) => (this.richtext = rf)}
                  initialContentHTML={initHTML}
                  style={{ backgroundColor: "#fff", flex: 1 }}
                  onChange={this.onChangeHandler}
                />
                {this.state.placeHolderEnable ? (
                  <Text
                    style={{
                      marginTop: 5,
                      top: 0,
                      fontSize: 14,
                      fontFamily: FontFamily.Regular,
                      position: "absolute",
                      color: color.grayColor,
                      backgroundColor: "#fff",
                    }}
                  >
                    {placeholder}
                  </Text>
                ) : null}
              </ScrollView>
              {postImages.length > 0 ? (
                <ScrollView
                  horizontal={true}
                  style={{ flex: 1, flexDirection: "row", paddingBottom: 15 }}
                  showsHorizontalScrollIndicator={false}
                >
                  {postImages.map((img, index) => {
                    return (
                      <View>
                        <View
                          style={{
                            marginRight: 10,
                          }}
                        >
                          <Image
                            key={index}
                            style={{
                              borderWidth: 1,
                              borderColor: color.grayColor,
                              borderRadius: 10,
                              width: 70,
                              height: 70,
                              resizeMode: "cover",
                            }}
                            source={{ uri: link.s3 + img.url }}
                          />
                          <TouchableOpacity
                            style={{ margin: 5 }}
                            onPress={() => this.postRemoveImage(index)}
                          >
                            <Text
                              style={{
                                textAlign: "center",
                                color: color.primaryColor,
                              }}
                            >
                              Remove
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  })}
                  {this.state.photoImageLoader ? (
                    <View
                      style={{ justifyContent: "center", marginBottom: 20 }}
                    >
                      <ActivityIndicator />
                    </View>
                  ) : null}
                </ScrollView>
              ) : this.state.photoImageLoader ? (
                <View style={{ justifyContent: "center", marginBottom: 20 }}>
                  <ActivityIndicator />
                </View>
              ) : null}
              {this.state.source ? (
                <VideoPlayer source={this.state.source} />
              ) : null}
            </View>

            <View style={{ position: "relative" }}>
              {this.state.shown ? (
                <View>
                  <TouchableOpacity
                    style={styles.closeToolbar}
                    onPress={() => this.setState({ shown: !this.state.shown })}
                  >
                    <AntDesign name="close" size={28} color="gray" />
                  </TouchableOpacity>
                  <RichToolbar
                    onPress={() => this.setState({ shown: this.state.shown })}
                    style={{
                      backgroundColor: "#fff",
                      marginBottom: 8,
                      marginLeft: 53,
                    }}
                    unselectedButtonStyle={{
                      backgroundColor: "#F3F5FB",
                      borderRadius: 6,
                      marginRight: 3,
                    }}
                    selectedButtonStyle={{
                      backgroundColor: "#F3F5FB",
                      borderRadius: 6,
                      marginRight: 3,
                      opacity: 0.5,
                    }}
                    getEditor={() => this.richtext}
                    iconTint="gray"
                    iconSize={50}
                    actions={[
                      actions.setBold,
                      actions.setItalic,
                      actions.setUnderline,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      actions.insertImage,
                      "insertVideo",
                      //"inserMentioned",
                      actions.insertLink,
                    ]}
                    inserMentioned={() =>
                      navigate("ContributorScreen", {
                        updateMentions: this.updateMentions,
                        user_ids: this.state.user_data,
                      })
                    }
                    insertVideo={() => {
                      this._pickFile();
                    }}
                    onPressAddImage={() => {
                      this._pickImage();
                    }}
                    selectedIconTint="black"
                    iconMap={{
                      inserMentioned: ({ tintColor }) => (
                        <Text style={[styles.tib, { color: tintColor }]}>
                          <Octicons name="mention" size={22} />
                        </Text>
                      ),
                      [actions.setUnderline]: ({ tintColor }) => (
                        <Text style={[styles.tib, { color: tintColor }]}>
                          <Feather name="underline" size={22} />
                        </Text>
                      ),
                      insertVideo: ({ tintColor }) => (
                        <Text style={[styles.tib, { color: tintColor }]}>
                          <Feather name="video" size={22} />
                        </Text>
                      ),
                    }}
                    insertHTML={this.handleCustomAction}
                  />
                </View>
              ) : null}
            </View>

            {this.state.show ? (
              <View
                style={[
                  {
                    flexDirection: "row",
                    paddingTop: 10,
                    paddingBottom: 10,
                    borderWidth: 1,
                    borderColor: "#D3D3D3",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 1,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    justifyContent: "space-around",
                  },
                ]}
              >
                <TouchableOpacity
                  onPress={() =>
                    navigate("TopicScreen", {
                      updateTopics: this.updateTopics,
                      topic_ids: this.state.topic_ids,
                    })
                  }
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                    }}
                    source={
                      this.state.topic_ids.length > 0
                        ? require("../assets/images/select-topic.png")
                        : require("../assets/images/select-topicGray.png")
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigate("TagScreen", {
                      updateTags: this.updateTags,
                      tag_ids: this.state.tag_data,
                    })
                  }
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                    }}
                    source={
                      this.state.tag_data.length > 0
                        ? require("../assets/images/hashTags.png")
                        : require("../assets/images/hashTagsGray.png")
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigate("ContributorScreen", {
                      updateUsers: this.updateUsers,
                      user_ids: this.state.user_data,
                    })
                  }
                >
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                    }}
                    source={
                      this.state.user_data.length > 0
                        ? require("../assets/images/addplus.png")
                        : require("../assets/images/addplusGray.png")
                    }
                  />
                </TouchableOpacity>

                <TouchableOpacity
                  onPress={() =>
                    navigate("EmailScreen", {
                      updateEmails: this.updateEmails,
                      peoples: this.state.emails,
                    })
                  }
                >
                  <Image
                    style={{
                      width: 25,
                      height: 26,
                      resizeMode: "contain",
                    }}
                    source={
                      this.state.emails.length > 0
                        ? require("../assets/images/envolpeColor.png")
                        : require("../assets/images/envolpeGray.png")
                    }
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() =>
                    navigate("AccessScreen", {
                      updateEmails: this.updateEmails,
                      peoples: this.state.emails,
                    })
                  }
                >
                  <Image
                    style={{
                      width: 25,
                      height: 26,
                      resizeMode: "contain",
                    }}
                    source={
                      this.state.emails.length > 0
                        ? require("../assets/images/offer-public.png")
                        : require("../assets/images/offer-public.png")
                    }
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  {
                    padding: 15,
                    borderWidth: 1,
                    borderColor: "#D3D3D3",
                    shadowColor: "#000",
                    shadowOffset: { width: 0, height: 2 },
                    elevation: 1,
                    borderTopRightRadius: 20,
                    borderTopLeftRadius: 20,
                    justifyContent: "space-around",
                  },
                  { flexDirection: this.state.flexDirection },
                ]}
              >
                <List.Item
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  onPress={() =>
                    navigate("TopicScreen", {
                      updateTopics: this.updateTopics,
                      topic_ids: this.state.topic_ids,
                    })
                  }
                  titleStyle={{
                    fontSize: 17,
                    fontFamily: FontFamily.Regular,
                    color: color.blackColor,
                    marginLeft: 10,
                  }}
                  title="Add topics"
                  left={(props) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                        marginTop: 5,
                      }}
                      source={
                        this.state.topic_ids.length > 0
                          ? require("../assets/images/select-topic.png")
                          : require("../assets/images/select-topicGray.png")
                      }
                    />
                  )}
                />
                <List.Item
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  onPress={() =>
                    navigate("TagScreen", {
                      updateTags: this.updateTags,
                      tag_ids: this.state.tag_data,
                    })
                  }
                  titleStyle={{
                    fontSize: 17,
                    fontFamily: FontFamily.Regular,
                    color: color.blackColor,
                    marginLeft: 10,
                  }}
                  title="Add tags"
                  left={(props) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                      }}
                      source={
                        this.state.tag_data.length > 0
                          ? require("../assets/images/hashTags.png")
                          : require("../assets/images/hashTagsGray.png")
                      }
                    />
                  )}
                />
                <List.Item
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  onPress={() =>
                    navigate("ContributorScreen", {
                      updateUsers: this.updateUsers,
                      user_ids: this.state.user_data,
                    })
                  }
                  titleStyle={{
                    fontSize: 17,
                    fontFamily: FontFamily.Regular,
                    color: color.blackColor,
                    marginLeft: 10,
                  }}
                  title="Add members"
                  left={(props) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                        marginTop: 6,
                      }}
                      source={
                        this.state.user_data.length > 0
                          ? require("../assets/images/addplus.png")
                          : require("../assets/images/addplusGray.png")
                      }
                    />
                  )}
                />
                <List.Item
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  onPress={() =>
                    navigate("EmailScreen", {
                      updateEmails: this.updateEmails,
                      peoples: this.state.emails,
                    })
                  }
                  titleStyle={{
                    fontSize: 17,
                    fontFamily: FontFamily.Regular,
                    color: color.blackColor,
                    marginLeft: 10,
                  }}
                  title="Invite by email"
                  left={(props) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                        marginTop: 6,
                      }}
                      source={
                        this.state.emails.length > 0
                          ? require("../assets/images/envolpeColor.png")
                          : require("../assets/images/envolpeGray.png")
                      }
                    />
                  )}
                />
                <List.Item
                  style={{ paddingTop: 10, paddingBottom: 10 }}
                  onPress={() =>
                    navigate("AccessScreen", {
                      updateEmails: this.updateEmails,
                      peoples: this.state.emails,
                    })
                  }
                  titleStyle={{
                    fontSize: 17,
                    fontFamily: FontFamily.Regular,
                    color: color.blackColor,
                    marginLeft: 10,
                  }}
                  title="Access"
                  left={(props) => (
                    <Image
                      style={{
                        width: 25,
                        height: 25,
                        resizeMode: "contain",
                        marginTop: 6,
                      }}
                      source={
                        this.state.emails.length > 0
                          ? require("../assets/images/offer-public.png")
                          : require("../assets/images/offer-public.png")
                      }
                    />
                  )}
                />
              </View>
            )}
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
          <Dialog
            dialogStyle={{ borderRadius: 24 }}
            onTouchOutside={() => {
              this.setState({ scaleAnimationDialog: false });
            }}
            onHardwareBackPress={() => {
              this.setState({ popupVisible: false });
            }}
            width={0.7}
            visible={this.state.popupVisible}
            dialogAnimation={new ScaleAnimation()}
            dialogTitle={
              <DialogTitle
                title={"Save this post as a draft?"}
                hasTitleBar={true}
              />
            }
          >
            <DialogContent>
              <List.Item
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: color.lightGrayColor,
                }}
                onPress={this.saveAsDraft}
                title="Save Draft"
              />
              <List.Item
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: color.lightGrayColor,
                }}
                onPress={this.discardPost}
                title="Discard Post"
              />
              <List.Item
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: color.lightGrayColor,
                }}
                titleStyle={{ color: "red", textAlign: "center" }}
                onPress={this.cancelPost}
                title="Cancel"
              />
            </DialogContent>
          </Dialog>
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

PostQuestion.navigationOptions = (screenProps) => ({
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
      onPress={screenProps.navigation.getParam("navigateToHome")}
      style={{
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Ionicons name="ios-close" color={color.primaryColor} size={42} />
    </TouchableOpacity>
  ),
  headerTitle: () => (
    <Text style={styles.postQuestionPageTitle}>New Discussion</Text>
  ),
  headerRight: () => (
    <View>
      {screenProps.navigation.getParam("postLoading") && (
        <ActivityIndicator
          style={{ marginRight: 15 }}
          size="small"
          color={color.primaryColor}
        />
      )}
      {!screenProps.navigation.getParam("postLoading") && (
        <TouchableOpacity
          style={styles.touchRightHeadText}
          onPress={screenProps.navigation.getParam("postNewQuestion")}
          //onPress={()=>screenProps.navigation.getParam("postNewQuestion")}
        >
          <Text style={styles.postText}>Post</Text>
        </TouchableOpacity>
      )}
    </View>
  ),
});

const styles = StyleSheet.create({
  touchRightHeadText: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
  postQuestionPage: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postQuestionProfile: {
    paddingLeft: 15,
    paddingRight: 15,
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
    flex: 1,
    backgroundColor: "#fff",
    borderRadius: 8,
    padding: 15,
  },
  postQuestionTextInput: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    textAlignVertical: "top",
    backgroundColor: color.lightGrayColor,
    borderRadius: 8,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
    borderWidth: 0,
    width: "100%",
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
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginLeft: 15,
    marginRight: 5,
  },
  messageList: {
    borderWidth: 0,
  },
  mention: {
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: "rgba(36, 77, 201, 0.05)",
    color: "#244dc9",
  },
  closeToolbar: {
    backgroundColor: "#F3F5FB",
    borderRadius: 6,
    width: 50,
    height: 50,
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
  },
  tib: {
    textAlign: "center",
  },
});

export default PostQuestion;
