import React from "react";
import {
  TextInput,
  Alert,
  ActivityIndicator,
  Animated,
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
  PanResponder,
  DeviceEventEmitter,
  Linking,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  RichEditor,
  RichToolbar,
  actions,
} from "react-native-pell-rich-editor";
import { getStatusBarHeight } from "react-native-status-bar-height";
import {
  AntDesign,
  Ionicons,
  Feather,
  Octicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import Constants from "expo-constants";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List } from "react-native-paper";
import { getLinkPreview } from "link-preview-js";
import postQuestionMutation from "../graphql/mutations/postQuestionMutation";
import updateQuestion from "../graphql/mutations/updateQuestion";
import getQuestions from "../graphql/queries/getQuestions";
import allUsers from "../graphql/queries/allUsers";
import client from "../constants/client";
import moment from "moment";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";
import { StackActions, NavigationActions } from "react-navigation";
import * as ImagePicker from "expo-image-picker";
import * as IntentLauncher from "expo-intent-launcher";
import link from "../constants/link";
import { postWithProgress } from "../helper/postWithProgress";
import ProfilePhoto from "../components/ProfilePhoto";
import VideoPlayer from "../components/VideoPlayer";
import Toast, { DURATION } from "react-native-easy-toast";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";

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
      isKeyboardShowed: false,
      translateValue: new Animated.Value(0),
      isShowMention: false,
      searchActivity: false,
      refreshEditor: true,
      label: "",
      stripHtml: "",
      editable: false,
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }

    this.editorRef;

    this.searchTextInput;
    this.panResponder = PanResponder.create({
      onStartShouldSetPanResponder: () => true,
      onPanResponderMove: (event, gestureState) => {
        this.state.translateValue.setValue(Math.max(0, 0 + gestureState.dy)); //step 1
      },
      onPanResponderRelease: (e, gesture) => {
        if (gesture.moveY > 400) {
          this.setState({ show: true });
        }

        const shouldOpen = gesture.vy <= 0;
        Animated.spring(this.state.translateValue, {
          toValue: shouldOpen ? 0 : 0,
          velocity: gesture.vy,
          tension: 0,
          friction: 8,
        }).start(); //step 2
      },
    });
  }

  componentDidMount() {
    this.props.navigation.setParams({
      postNewQuestion: this.postNewQuestion,
      postLoading: false,
    });

    this.props.navigation.setParams({
      text: this.state.text,
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
    this._setUserSession();

    this.focusListener = this.props.navigation.addListener("didFocus", () => {
      this.tapOnTabNavigator();
    });
  }

  requestCameraPermission = async () => {
    let permission = await Permissions.getAsync(Permissions.CAMERA);
    if (permission.status !== "granted") {
      permission = await Permissions.askAsync(Permissions.CAMERA);
    }

    return permission;
  };

  requestCameraRollPermission = async () => {
    let permission = await Permissions.getAsync(Permissions.CAMERA_ROLL);
    if (permission.status !== "granted") {
      permission = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    }

    return permission;
  };

  tapOnTabNavigator = () => {
    this.setState({ label: this.props.navigation.getParam("label") });
    console.log(this.state.topic_ids.length);
    console.log(this.state.tag_ids.length);
    if (this.state.topic_ids.length > 0 && this.state.tag_ids.length > 0) {
      this.props.navigation.setParams({ postNewText: "Post" });
    } else {
      this.props.navigation.setParams({ postNewText: "Next" });
    }

    this.state.translateValue.setValue(Math.max(0, 0));
    this.setState({ flexDirection: "column" });

    if (this.props.navigation.getParam("question_id")) {
      this.setState({
        placeHolderEnable: false,
        editable: true,
      });

      this.setPreviousDataInState();

      this.props.navigation.setParams({ postNewText: "Update" });
    }
  };

  setPreviousDataInState = () => {
    const {
      label,
      question,
      text,
      question_id,
      topic_ids,
      tag_ids,
      tag_data,
      user_ids,
      user_data,
    } = this.props.navigation.state.params;

    this.setState({
      label: label,
      initHTML: question,
      text: text,
      question_id: question_id,
      topic_ids: topic_ids,
      tag_ids: tag_ids,
      tag_data: tag_data,
      user_ids: user_ids,
      user_data: user_data,
      update: true,
    });
  };

  resetEditor = async () => {
    const newDiscussionPost = await AsyncStorage.getItem("@newDiscussionPost");
    if (newDiscussionPost) {
      this.setState({ placeHolderEnable: false });
    } else {
      this.setState({ placeHolderEnable: true, initHTML: "" });
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

  enableAlert = () => {};

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide.bind(this)
    );
    DeviceEventEmitter.addListener("event.progress", this._onProgress);
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
    this.focusListener.remove();
    DeviceEventEmitter.removeListener("event.progress");
  }

  handleKeyboardDidShow = (event) => {
    Animated.spring(this.state.translateValue, {
      toValue: 0,
      velocity: 10,
      tension: 1,
      friction: 9,
    }).start();
    this.changeLayout();
    this.setState({
      show: true,
      isKeyboardShowed: true,
      placeHolderEnable: false,
    });
  };

  handleKeyboardDidHide = (event) => {
    //this.changeLayout();
    this.setState({ isKeyboardShowed: false });
  };

  onPressMoreButton = () => {
    Animated.spring(this.state.translateValue, {
      toValue: 0,
      velocity: 10,
      tension: 1,
      friction: 9,
    }).start();

    this.richtext.blurContentEditor();
    Keyboard.dismiss();
    this.changeLayout();
    this.setState({ show: false });
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
    this.setState({ searchValue: str, searchActivity: true });
    if (str == "") {
      this.setState({ isShowMention: false, searchActivity: false });
    }
    str = str.replace("@", "");
    if (str === "") {
      str = " ";
    }
    client
      .query({
        query: allUsers,
        variables: { q: "%" + str + "%" },
      })
      .then((result) => {
        this.setState({
          users: result.data.UserSearch.data,
          searchActivity: false,
        });
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
      // this.toast.show("Please select alteast one topic");
      this.props.navigation.navigate("TopicScreen", {
        updateTopics: this.updateTopics,
        topic_ids: this.state.topic_ids,
      });
      return false;
    }
    if (this.state.tag_ids.length === 0) {
      // this.toast.show("Please select alteast one tag");
      this.props.navigation.navigate("TagScreen", {
        updateTags: this.updateTags,
        tag_ids: this.state.tag_data,
      });
      return false;
    }

    this.props.navigation.setParams({ postLoading: true });
    let text = this.state.text;
    let filtertext = text.replace(/(<([^>]+)>)|&nbsp;/gi, " ");
    getLinkPreview(filtertext)
      .then((data) => {
        let meta = JSON.stringify(data);
        this.submitQuestion(meta);
      })
      .catch((error) => {
        this.submitQuestion("");
      });
  };

  onChangeHandler = (message) => {
    let messageHtml = message;
    let strippedString = messageHtml.replace(/(<([^>]+)>)|&nbsp;/gi, "");
    var lastChar = strippedString[strippedString.length - 1];

    if (
      this.state.stripHtml.length < strippedString.length &&
      lastChar === "@"
    ) {
      message = message.slice(0, -1);

      this.setState(
        { isShowMention: true, searchValue: "@", refreshEditor: false },
        () => this.searchTextInput.focus()
      );

      setTimeout(() => {
        this.setState({ refreshEditor: true });
      }, 500);

      if (message === "") {
        message = " ";
      }
    }

    if (this.props.navigation.getParam("setHtml")) {
      this.props.navigation.getParam("setHtml")(message);
    }

    let msgWithBr = message.split("</div>").join("<br>");
    if (message) {
      this.setState({
        text: msgWithBr,
        clearInput: false,
        shown: true,
        placeHolderEnable: false,
        initHTML: msgWithBr,
        stripHtml: strippedString,
      });

      this.props.navigation.setParams({
        text: strippedString,
      });
    } else {
      this.setState({
        text: msgWithBr,
        clearInput: false,
        shown: true,
        placeHolderEnable: true,
        initHTML: msgWithBr,
        stripHtml: strippedString,
      });
      this.props.navigation.setParams({
        text: strippedString,
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

  onPressKeyboardButton = () => {
    if (this.state.isKeyboardShowed) {
      this.richtext.blurContentEditor();
      Keyboard.dismiss();
    } else {
      this.richtext.focusContentEditor();
    }
  };

  submitQuestion = (meta) => {
    const courseId = this.props.navigation.getParam("courseId");
    Keyboard.dismiss();
    let update = this.state.update;
    if (update) {
      client
        .mutate({
          mutation: updateQuestion,
          variables: {
            id: this.state.question_id,
            description: this.state.label,
            question: this.state.text,
            categories: this.state.topic_ids,
            tag_ids: this.state.tag_ids,
          },
          optimisticResponse: {
            __typename: "Mutation",
            updateQuestion: {
              __typename: "UpdateQuestion",
              question: this.state.text,
              id: this.state.question_id,
              description: this.state.label,
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
                onPress: () => {
                  const popAction = StackActions.pop({
                    n: 1,
                  });

                  this.props.navigation.dispatch(popAction);
                  this.props.navigation.navigate("Home", {
                    postUpdate: true,
                  });
                },
              },
            ],
            { cancelable: false }
          );
        })
        .catch((error) => {
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
          this.props.navigation.setParams({ postLoading: false });
        });
    } else {
      this.props.navigation.setParams({ postLoading: true });
      this.props.navigation.getParam("resetActionState")();
      this.props.navigation.dispatch(StackActions.popToTop());

      client
        .mutate({
          mutation: postQuestionMutation,
          variables: {
            title: this.state.text,
            description: this.state.label,
            categories: this.state.topic_ids,
            user_ids: this.state.user_ids,
            tag_ids: this.state.tag_ids,
            emails: this.state.emails,
            status: this.state.status,
            meta_text: meta,
            pictures: this.state.postImages,
            course_id: courseId,
          },
          optimisticResponse: {
            __typename: "Mutation",
            createQuestion: {
              __typename: "Question",
              question: this.state.text,
              description: this.state.label,
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
              initHTML: "",
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
            AsyncStorage.removeItem("@newDiscussionPost");
            this.props.navigation.setParams({ postLoading: false });
          },
        })
        .then((results) => {
          this.setState({
            text: "",
            initHTML: "",
            topic_ids: [],
            tag_ids: [],
            user_ids: [],
            emails: [],
            user_data: [],
            tag_data: [],
            status: 1,
            clearInput: true,
            show: false,
            slug: results.data.createQuestion.slug,
          });
          AsyncStorage.removeItem("@newDiscussionPost");

          this.props.navigation.setParams({ postLoading: false });
          this.props.navigation.getParam("resetActionState")(
            results.data.createQuestion
          );
        })
        .catch((error) => {
          this.props.navigation.getParam("resetActionState")();

          this.setState({
            text: "",
            initHTML: "",
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
          AsyncStorage.removeItem("@newDiscussionPost");
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
      // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });
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
    this.setState({ popupVisible: false, show: false, initHTML: "" });
    AsyncStorage.removeItem("@newDiscussionPost");
    this.props.navigation.navigate("Home");
  };

  cancelPost = () => {
    this.setState({ popupVisible: false });
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
    console.log(
      "🚀 ~ file: PostQuestion.js:814 ~ PostQuestion ~ _setUserSession= ~ item",
      item
    );
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
        Authorization: `Bearer ${this.state.token}`,
      },
      body: this.createFormData(file, { type: "video" }),
    })
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => {
        console.log(
          "🚀 ~ file: PostQuestion.js:861 ~ PostQuestion ~ error",
          error
        );

        this.setState({ loading: false });
      });
  };

  onSwipeDown(gestureState) {
    Keyboard.dismiss();
  }

  updateMentions = (item) => {
    let html = "";
    let width = 0;

    width = (item.username.length + 1) * 8 + 4;

    // html +=
    //   '<span type="text" readonly id="' +
    //   item.id +
    //   '" style="color:' +
    //   color.textColorBlack +
    //   "; background-color:#fff;border:0px;width:" +
    //   width +
    //   'px;font-size:14px;font-weight:bold;" value="@' +
    //   item.username +
    //   '" >'+
    //   item.username +'</span>&nbsp;';

    html +=
      '&nbsp;<mention id="' +
      item.id +
      '" style="color:' +
      color.textColorBlack +
      '; font-weight:bold;">@' +
      item.username +
      "</mention>&nbsp;";

    this.richtext.insertHTML(html);
    this.setState({ isShowMention: false });
  };

  postRemoveImage = (index) => {
    let postImages = [...this.state.postImages]; // make a separate copy of the array
    if (index !== -1) {
      postImages.splice(index, 1);
      this.setState({ postImages });
    }
  };

  updateProgress = (oEvent) => {
    if (oEvent.lengthComputable) {
      var progress = oEvent.loaded / oEvent.total;
    }
  };

  _onProgress = (e) => {};

  _pickFile = async () => {
    let postImages = this.state.postImages;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Videos,
      videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
      quality: 0.4,
    });

    let val = result.type,
      regex = new RegExp("video$");

    if (!result.cancelled) {
      if (!regex.test(val)) {
        Alert.alert(
          "Video",
          "Please select correct video only",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
        return false;
      }

      if (result.size > 10000000) {
        //alert("File must be less or equal to 10 MB");
        //return;
      }
      this.props.navigation.setParams({ postLoading: true });

      this.setState({ photoImageLoader: true });
      //let res = await this.handleUploadVideo(result.uri);
      let res = await postWithProgress(
        link.url + "/api/s3upload",
        this.createFormData(result.uri, { type: "image" })
      );

      postImages.push({
        url: res.path,
        type: "video",
        mime: "video",
        size: 20,
        width: result.width,
        height: result.height,
      });
      this.setState({
        postImages: postImages,
        photoImageLoader: false,
      });
      this.props.navigation.setParams({ postLoading: false });
    }
  };

  _pickImage = async () => {
    let postImages = this.state.postImages;
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.6,
    });
    let val = result.type,
      regex = new RegExp("image$");
    if (!result.cancelled) {
      if (!regex.test(val)) {
        Alert.alert(
          "Photo",
          "Please select photo only",
          [
            {
              text: "OK",
            },
          ],
          { cancelable: false }
        );
        return false;
      }
      this.props.navigation.setParams({ postLoading: true });
      this.setState({ photoImageLoader: true });
      //let res = await this.handleUploadPhoto(result.uri);
      let res = await postWithProgress(
        link.url + "/api/s3upload",
        this.createFormData(result.uri, { type: "image" })
      );

      postImages.push({
        url: res.path,
        type: "photo",
        mime: "image",
        size: 20,
        width: result.width,
        height: result.height,
      });
      this.setState({
        postImages: postImages,
        photoImageLoader: false,
      });
      this.props.navigation.setParams({ postLoading: false });
    }
  };

  _mediaProcess = async (mediaTypes, requestType) => {
    let postImages = this.state.postImages;
    if (this.state.photoImageLoader) {
      return false;
    }

    let result;
    if (requestType === "live") {
      result = await ImagePicker.launchCameraAsync({
        mediaTypes: mediaTypes,
        allowsEditing: true,
        //aspect: [4, 4],
        videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
        quality: 0.6,
      });
    } else if (requestType === "media") {
      result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: mediaTypes,
        allowsEditing: true,
        //aspect: [4, 4],
        videoExportPreset: ImagePicker.VideoExportPreset.HighestQuality,
        quality: 0.6,
      });
    }

    const images = postImages.filter((item) => item.type === result.type);
    switch (result.type) {
      case "image":
        if (images.length > 3) {
          Alert.alert(
            "Photo limit ",
            "Maximum 4 photos allowed!",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
          return false;
        }
        break;
      case "video":
        if (images.length > 2) {
          Alert.alert(
            "Video limit ",
            "Maximum 3 videos allowed!",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
          return false;
        }
        break;
    }

    let fileSystem = await FileSystem.getInfoAsync(result.uri);

    switch (result.type) {
      case "image":
        if (fileSystem.size > 5000000) {
          Alert.alert(
            "File size",
            "File size must be less or equal to 5MB",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
          return false;
        }
        break;
      case "video":
        if (fileSystem.size > 20000000) {
          Alert.alert(
            "File size",
            "File size must be less or equal to 20MB",
            [
              {
                text: "OK",
              },
            ],
            { cancelable: false }
          );
          return false;
        }
        break;
    }

    if (result.cancelled) {
      return false;
    }

    this.props.navigation.setParams({ postLoading: true });
    this.setState({ photoImageLoader: true });

    try {
      let res = await this.handleUploadVideo(result.uri);
      console.log(
        "🚀 ~ file: PostQuestion.js:1122 ~ PostQuestion ~ _mediaProcess= ~ res",
        res
      );

      postImages.push({
        url: res.path,
        type: result.type,
        mime: result.type,
        size: 20,
        width: result.width,
        height: result.height,
      });
    } catch (e) {
      console.log(
        "🚀 ~ file: PostQuestion.js:1131 ~ PostQuestion ~ _mediaProcess= ~ e",
        e
      );
      Alert.alert(
        "Something went wrong",
        "Try another file something wrong with this file",
        [
          {
            text: "OK",
          },
        ],
        { cancelable: false }
      );
    } finally {
      this.setState({
        postImages: postImages,
        photoImageLoader: false,
      });

      this.props.navigation.setParams({ postLoading: false });
    }

    //let res = await postWithProgress(link.url + "/api/s3upload",this.createFormData(result.uri, { type: result.type }));
  };

  _openSettings = () => {
    if (Platform.OS === "android") {
      const pkg = Constants.manifest.releaseChannel
        ? Constants.manifest.android.package
        : "host.exp.exponent";

      IntentLauncher.startActivityAsync(
        IntentLauncher.ACTION_APPLICATION_DETAILS_SETTINGS,
        { data: "package:" + pkg }
      );
    } else {
      Linking.openURL("app-settings:");
    }
  };

  _takePhoto = async () => {
    const resultPermission = await this.requestCameraPermission();
    if (resultPermission.status !== "granted") {
      Alert.alert(
        "Enable Camera Access",
        "Go to settings to enable camera access.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "Settings", onPress: this._openSettings },
        ],
        { cancelable: false }
      );
      return false;
    }

    this._mediaProcess(ImagePicker.MediaTypeOptions.Images, "live");
  };

  _addMedia = async () => {
    const resultPermission = await this.requestCameraRollPermission();
    if (resultPermission.status !== "granted") {
      Alert.alert(
        "Enable Camera Roll Access",
        "Go to settings to enable camera roll access.",
        [
          {
            text: "Cancel",
            style: "cancel",
          },
          { text: "Settings", onPress: () => this._openSettings },
        ],
        { cancelable: false }
      );
      return false;
    }
    this._mediaProcess(ImagePicker.MediaTypeOptions.Images, "media");
  };

  render() {
    let { postImages, editable } = this.state;

    let initHTML = this.state.initHTML;
    const placeholder =
      "\n1.  Type your question text  \n2.  Choose A Topic and Add Industry Tag for Reference \n3.  Add members from the community or invite your friends by entering their email to answer ";
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
                {this.state.refreshEditor ? (
                  <RichEditor
                    scrollEnabled={true}
                    ref={(rf) => (this.richtext = rf)}
                    initialContentHTML={initHTML}
                    style={{ backgroundColor: "#fff", flex: 1 }}
                    onChange={this.onChangeHandler}
                  />
                ) : null}
                {this.state.isShowMention ? (
                  <View
                    style={{
                      marginTop: 5,
                      top: 0,
                      position: "absolute",
                      backgroundColor: "#fff",
                      width: "100%",
                    }}
                  >
                    <TextInput
                      ref={(ref) => (this.searchTextInput = ref)}
                      placeholder="Search users"
                      onChangeText={(text) => this.startTypingRequest(text)}
                      style={{ padding: 8, fontSize: 18 }}
                      value={this.state.searchValue}
                    />

                    <ScrollView
                      contentContainerStyle={{ flexGrow: 1 }}
                      style={{
                        borderTopWidth: 1,
                        borderColor: color.grayColor,
                        borderRadius: 3,
                        //height: 200,
                      }}
                    >
                      {this.state.searchActivity ? (
                        <ActivityIndicator color={color.primaryColor} />
                      ) : null}
                      {this.state.users.map((item, sIndex) => (
                        <TouchableOpacity
                          onPress={() => this.updateMentions(item)}
                          key={sIndex}
                          style={{
                            borderBottomWidth: 1,
                            borderColor: color.grayColor,
                          }}
                        >
                          <List.Item
                            style={{
                              paddingTop: 7,
                              paddingBottom: 7,
                              paddingLeft: 5,
                              paddingRight: 0,
                            }}
                            titleStyle={{
                              fontSize: 15,
                              fontFamily: FontFamily.Bold,
                              color: color.blackColor,
                              marginLeft: 10,
                            }}
                            title={item.firstname + " " + item.lastname}
                            descriptionStyle={{
                              fontSize: 15,
                              fontFamily: FontFamily.Regular,
                              color: color.grayColor,
                              marginLeft: 10,
                            }}
                            description={"@" + item.username}
                            left={(props) => (
                              <ProfilePhoto size={42} item={item} />
                            )}
                          />
                        </TouchableOpacity>
                      ))}
                    </ScrollView>
                  </View>
                ) : null}
                {this.state.placeHolderEnable ? (
                  <TouchableOpacity
                    activeOpacity={1}
                    onPress={this.onPressKeyboardButton}
                    style={{
                      marginTop: 5,
                      top: 0,
                      position: "absolute",
                      backgroundColor: "#fff",
                    }}
                  >
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.Regular,
                        color: color.grayColor,
                      }}
                    >
                      {"Steps to post a new question - "}
                    </Text>

                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.Regular,
                        color: color.grayColor,
                        marginLeft: 20,
                      }}
                    >
                      {placeholder}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.Bold,
                        color: color.grayColor,
                      }}
                    >
                      {"\nQuick Tips to make your question stand out\n"}
                    </Text>
                    <Text
                      style={{
                        fontSize: 14,
                        fontFamily: FontFamily.Regular,
                        color: color.grayColor,
                        marginLeft: 20,
                      }}
                    >
                      {
                        "1.  Use rich-text feature\n2.  Add media - picture or video from your library\n3.  Take a live photo or video"
                      }
                    </Text>
                  </TouchableOpacity>
                ) : null}
              </ScrollView>
              {postImages.length > 0 && this.state.isShowMention === false ? (
                <View>
                  <ScrollView
                    horizontal={true}
                    style={{ paddingBottom: 2 }}
                    showsHorizontalScrollIndicator={false}
                  >
                    {postImages.map((img, index) => {
                      return (
                        <View style={{}} key={index}>
                          <View
                            style={{
                              marginRight: 10,
                            }}
                          >
                            {img.type === "image" ? (
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
                            ) : (
                              <View
                                style={{
                                  borderWidth: 1,
                                  borderColor: color.grayColor,
                                  borderRadius: 10,
                                  width: 70,
                                  height: 70,
                                  backgroundColor: "rgba(0, 0, 0, .25)",
                                  justifyContent: "center",
                                  alignItems: "center",
                                }}
                              >
                                <Image
                                  key={index}
                                  style={{
                                    width: 30,
                                    height: 30,
                                    resizeMode: "cover",
                                  }}
                                  source={require("../assets/images/playButton.png")}
                                />
                              </View>
                            )}
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
                        <ActivityIndicator color={color.primaryColor} />
                      </View>
                    ) : null}
                  </ScrollView>
                </View>
              ) : this.state.photoImageLoader ? (
                <View style={{ justifyContent: "center", marginBottom: 20 }}>
                  <ActivityIndicator color={color.primaryColor} />
                </View>
              ) : null}
              {this.state.source ? (
                <VideoPlayer source={this.state.source} />
              ) : null}
            </View>

            <View
              style={{
                position: "relative",
              }}
            >
              {this.state.shown &&
              this.state.refreshEditor &&
              this.state.isShowMention === false ? (
                <View>
                  <RichToolbar
                    onPress={() => this.setState({ shown: this.state.shown })}
                    style={{
                      backgroundColor: "#fff",
                      marginBottom: 8,

                      justifyContent: "center",
                    }}
                    unselectedButtonStyle={{
                      backgroundColor: "#F3F5FB",
                      borderRadius: 6,
                      marginRight: 3,
                    }}
                    selectedButtonStyle={{
                      backgroundColor: "#DADCE1",
                      borderRadius: 6,
                      marginRight: 3,
                      opacity: 0.5,
                    }}
                    getEditor={() => this.richtext}
                    iconTint="gray"
                    iconSize={30}
                    actions={[
                      "insertClose",
                      actions.setBold,
                      actions.setItalic,
                      actions.setUnderline,
                      actions.insertBulletsList,
                      actions.insertOrderedList,
                      actions.insertLink,
                    ]}
                    inserMentioned={() =>
                      navigate("ContributorScreen", {
                        updateMentions: this.updateMentions,
                        user_ids: this.state.user_data,
                      })
                    }
                    selectedIconTint="black"
                    iconMap={{
                      insertClose: ({ tintColor }) => (
                        <TouchableOpacity
                          style={styles.closeToolbar}
                          onPress={() =>
                            this.setState({ shown: !this.state.shown })
                          }
                        >
                          <AntDesign name="close" size={22} color="gray" />
                        </TouchableOpacity>
                      ),
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
              <View style={{ flexDirection: "row", margin: 15 }}>
                <TouchableOpacity
                  onPress={() => this.onChangeHandler(this.state.text + "@")}
                >
                  <Text
                    style={{ fontWeight: "bold", color: color.primaryColor }}
                  >
                    Add mention
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    color: "#696969",
                    marginLeft: 10,
                    opacity: 0.8,
                    fontWeight: "600",
                  }}
                >
                  Help the right people see your post
                </Text>
              </View>
            ) : null}

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
                  },
                ]}
              >
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-around",
                    flex: 1,
                  }}
                >
                  {!editable && (
                    <TouchableOpacity onPress={this._takePhoto}>
                      <Feather color="grey" name="camera" size={22} />
                    </TouchableOpacity>
                  )}

                  {!editable && (
                    <TouchableOpacity onPress={this._addMedia}>
                      <Feather color="grey" name="image" size={22} />
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity onPress={this.onPressMoreButton}>
                    <Feather color="grey" name="more-horizontal" size={22} />
                  </TouchableOpacity>
                </View>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "flex-end",
                    marginRight: 15,
                    flex: 0.5,
                  }}
                >
                  <TouchableOpacity onPress={this.onPressKeyboardButton}>
                    <MaterialCommunityIcons
                      name="keyboard-outline"
                      size={22}
                      color="black"
                    />
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <Animated.View
                {...this.panResponder.panHandlers}
                style={{
                  transform: [{ translateY: this.state.translateValue }],
                }}
              >
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
                  <View
                    style={{
                      backgroundColor: "rgba(0,0,0,0.6)",
                      borderRadius: 90,
                      height: 7,
                      width: 50,
                      alignSelf: "center",
                    }}
                  />

                  <List.Item
                    disabled={editable}
                    style={{ paddingTop: 7, paddingBottom: 7 }}
                    onPress={this._takePhoto}
                    titleStyle={{
                      fontSize: 15,
                      fontFamily: "Lato-Bold",
                      color: editable ? "#e6e6e6" : color.blackColor,
                      marginLeft: 10,
                    }}
                    title="Take a photo"
                    left={(props) => (
                      <Feather
                        style={{ marginTop: 5 }}
                        color={editable ? "#e6e6e6" : "grey"}
                        name="camera"
                        size={22}
                      />
                    )}
                  />

                  <List.Item
                    disabled={editable}
                    style={{ paddingTop: 7, paddingBottom: 7 }}
                    onPress={this._addMedia}
                    titleStyle={{
                      fontSize: 15,
                      fontFamily: "Lato-Bold",
                      color:
                        this.state.postImages.length > 0
                          ? color.primaryColor
                          : editable
                          ? "#e6e6e6"
                          : color.blackColor,
                      marginLeft: 10,
                    }}
                    title={`Add a media`}
                    left={(props) => (
                      <Feather
                        style={{ marginTop: 5 }}
                        color={
                          this.state.postImages.length > 0
                            ? color.primaryColor
                            : editable
                            ? "#e6e6e6"
                            : "grey"
                        }
                        name="image"
                        size={22}
                      />
                    )}
                  />
                  <List.Item
                    style={{ paddingTop: 7, paddingBottom: 7 }}
                    onPress={() =>
                      navigate("TopicScreen", {
                        updateTopics: this.updateTopics,
                        topic_ids: this.state.topic_ids,
                      })
                    }
                    titleStyle={{
                      fontSize: 15,
                      fontFamily: "Lato-Bold",
                      color:
                        this.state.topic_ids.length > 0
                          ? color.primaryColor
                          : color.blackColor,
                      marginLeft: 10,
                    }}
                    title={`Add topic ${"*"}`}
                    left={(props) => (
                      <Image
                        style={{
                          width: 22,
                          height: 22,
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
                    style={{ paddingTop: 7, paddingBottom: 7 }}
                    onPress={() =>
                      navigate("TagScreen", {
                        updateTags: this.updateTags,
                        tag_ids: this.state.tag_data,
                      })
                    }
                    titleStyle={{
                      fontSize: 15,
                      fontFamily: "Lato-Bold",
                      color:
                        this.state.tag_data.length > 0
                          ? color.primaryColor
                          : color.blackColor,
                      marginLeft: 10,
                    }}
                    title={`Add tags ${"*"}`}
                    left={(props) => (
                      <Image
                        style={{
                          width: 22,
                          height: 22,
                          resizeMode: "contain",
                          marginTop: 5,
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
                    disabled={editable}
                    style={{ paddingTop: 7, paddingBottom: 7 }}
                    onPress={() =>
                      navigate("ContributorScreen", {
                        updateUsers: this.updateUsers,
                        user_ids: this.state.user_data,
                      })
                    }
                    titleStyle={{
                      fontSize: 15,
                      fontFamily: "Lato-Bold",
                      color: editable
                        ? "#e6e6e6"
                        : this.state.user_ids.length > 0
                        ? color.primaryColor
                        : color.blackColor,

                      marginLeft: 10,
                    }}
                    title="Add member"
                    left={(props) => (
                      <Feather
                        style={{ marginTop: 5 }}
                        color={
                          editable
                            ? "#e6e6e6"
                            : this.state.user_data.length > 0
                            ? color.primaryColor
                            : "grey"
                        }
                        name="user-plus"
                        size={22}
                      />
                    )}
                  />
                  <List.Item
                    disabled={editable}
                    style={{ paddingTop: 7, paddingBottom: 7 }}
                    onPress={() =>
                      navigate("EmailScreen", {
                        updateEmails: this.updateEmails,
                        peoples: this.state.emails,
                      })
                    }
                    titleStyle={{
                      fontSize: 15,
                      fontFamily: "Lato-Bold",
                      color: editable
                        ? "#e6e6e6"
                        : this.state.emails.length > 0
                        ? color.primaryColor
                        : color.blackColor,
                      marginLeft: 10,
                    }}
                    title="Invite by email"
                    left={(props) => (
                      <Feather
                        style={{ marginTop: 5 }}
                        color={
                          this.state.emails.length > 0
                            ? color.primaryColor
                            : editable
                            ? "#e6e6e6"
                            : "grey"
                        }
                        name="inbox"
                        size={22}
                      />
                    )}
                  />
                  {/* <List.Item
                    style={{ paddingTop: 7, paddingBottom: 7 }}
                    onPress={() =>
                      navigate("AccessScreen", {
                        updateEmails: this.updateEmails,
                        peoples: this.state.emails,
                      })
                    }
                    titleStyle={{
                      fontSize: 15,
                      fontFamily: "Lato-Bold",
                      color: color.blackColor,
                      marginLeft: 10,
                    }}
                    title="Access"
                    left={(props) => (
                      <Image
                        style={{
                          width: 22,
                          height: 22,
                          resizeMode: "contain",
                          marginTop: 5,
                        }}
                        source={
                          this.state.emails.length > 0
                            ? require("../assets/images/offer-public.png")
                            : require("../assets/images/offer-public.png")
                        }
                      />
                    )}
                  /> */}
                </View>
              </Animated.View>
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
        >
          <Text style={styles.postText}>
            {screenProps.navigation.getParam("postNewText")}
          </Text>
        </TouchableOpacity>
      )}
    </View>
  ),

  headerLeft: () => (
    <>
      {
        <TouchableOpacity
          onPress={() => {
            screenProps.navigation.getParam("text") === ""
              ? screenProps.navigation.getParam("question_id")
                ? screenProps.navigation.navigate("AccessScreen", {
                    data: screenProps.navigation.state.params,
                  })
                : screenProps.navigation.goBack()
              : Alert.alert(
                  "Are you sure?",
                  "Question will be discard if you go back.",
                  [
                    {
                      text: "Cancel",
                      onPress: () => console.log("Cancel Pressed"),
                      style: "cancel",
                    },
                    {
                      text: "OK",
                      onPress: () =>
                        screenProps.navigation.getParam("question_id")
                          ? screenProps.navigation.navigate("AccessScreen", {
                              data: screenProps.navigation.state.params,
                            })
                          : screenProps.navigation.goBack(),
                    },
                  ]
                );
          }}
          style={{ marginLeft: 7 }}
        >
          {Platform.OS === "android" ? (
            <AntDesign name="arrowleft" size={24} color={color.primaryColor} />
          ) : (
            <Feather name="chevron-left" size={32} color={color.primaryColor} />
          )}
        </TouchableOpacity>
      }
    </>
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
    borderRadius: 6,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
  tib: {
    textAlign: "center",
  },
});

export default PostQuestion;
