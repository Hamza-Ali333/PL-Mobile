import React from "react";
import {
  Alert,
  ActivityIndicator,
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  Modal,
  TouchableOpacity,
  LayoutAnimation,
  Keyboard,
  TextInput,
  Platform,
  UIManager,
  KeyboardAvoidingView,
  ScrollView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import { StackActions, NavigationActions } from "react-navigation";
import { getStatusBarHeight } from "react-native-status-bar-height";
import { LinearGradient } from "expo-linear-gradient";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import color from "../../../constants/Colors.js";
import link from "../../../constants/link";
import FontFamily from "../../../constants/FontFamily.js";
import { Avatar } from "react-native-paper";
import firstChar from "../../../helper/firstChar";
import { List } from "react-native-paper";
import saveOfferDescriptionMutatiion from "../../../graphql/mutations/saveOfferDescriptionMutatiion";
import getOffer from "../../../graphql/queries/getOffer";
import client from "../../../constants/client";
import capitalize from "../../../helper/capitalize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";
import ActionSheet from "react-native-actionsheet";

class AddDescriptionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      title: "",
      description: "",
      award: "",
      message: "",
      snackEnable: false,
      visible: false,
      topic_ids: [],
      tag_ids: [],
      tag_data: [],
      user_ids: [],
      user_data: [],
      emails: [],
      me: {},
      status: 1,
      position: [],
      errorMessage: [],
      offer_id: null,
      scaleAnimationDialog: false,
      offer: {},
      company: {},
      visibility: false,
      show: false,
      autoFocus: false,
      flexDirection: "column",
      loading: false,
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentWillMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this.handleKeyboardDidShow.bind(this)
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this.handleKeyboardDidHide.bind(this)
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

  handleKeyboardDidHide = (event) => {
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

  changeLayout = () => {
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
    if (this.state.flexDirection === "column") {
      this.setState({ flexDirection: "row" });
    } else {
      this.setState({ flexDirection: "column" });
    }
  };

  touchFeedback = () => {
    this.editorRef.focus();
  };

  componentDidMount() {
    if (Object.keys(this.props.navigation.getParam("offer")).length > 0) {
      let offer = this.props.navigation.getParam("offer");
      let topic_ids = [];
      let tag_ids = [];
      let tag_data = [];
      let user_ids = [];
      let user_data = [];
      offer.categories.map((category) => {
        topic_ids.push(category.id);
      });
      offer.tags.map((tag) => {
        tag_ids.push(tag.id);
      });
      tag_data = offer.tags;

      offer.invites.map((invite) => {
        user_ids.push(invite.id);
      });
      user_data = offer.invites;
      this.setState({
        description: offer.description,
        topic_ids: topic_ids,
        tag_ids: tag_ids,
        tag_data: tag_data,
        user_ids: user_ids,
        user_data: user_data,
      });
    }

    this.props.navigation.setParams({
      postNewOffer: this.postNewOffer,
    });

    this.props.navigation.setParams({
      navigateToHome: this.navigateToHome,
    });

    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
  }

  tapOnTabNavigator = () => {
    if (this.props.navigation.getParam("id")) {
      this.setState({ loading: true });
      this.getOffer(this.props.navigation.getParam("id"));
    }
    this.setState({ visibility: false });
  };

  updateTopics = (data) => {
    this.setState({ topic_ids: data });
  };

  updateCompany = (data) => {
    this.setState({ company: data });
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

  setTitle = (description) => {
    this.setState({ description });
  };

  setAward = (award) => {
    this.setState({ award });
  };

  displayError = (error) => {
    try {
      if (error) {
        let { graphQLErrors } = error;
        if (graphQLErrors[0].extensions.category === "validation") {
          this.validationErrors = graphQLErrors[0].extensions.validation;
        }
      }
      let errorMessage = [];
      for (var key in this.validationErrors) {
        var value = this.validationErrors[key];
        errorMessage.push(value[0]);
      }

      this.setState({ errorMessage });
    } catch (e) {}
  };

  postNewOffer = () => {
    Keyboard.dismiss();
    let flag = true;
    let position = [];

    if (this.state.description === "") {
      position[0] = "description field is required!";
      flag = false;
    }

    this.setState({ position });

    if (!flag) {
      return false;
    }
    if (this.state.topic_ids.length === 0) {
      this.props.navigation.navigate("TopicScreen", {
        updateTopics: this.updateTopics,
        topic_ids: this.state.topic_ids,
      });
      return false;
    }
    if (this.state.tag_ids.length === 0) {
      this.props.navigation.navigate("TagScreen", {
        updateTags: this.updateTags,
        tag_ids: this.state.tag_data,
      });
      return false;
    }

    this.ActionSheet.show();
  };

  _onActionSheetAction = (index) => {
    if (index === 0) {
      this.setState({
        scaleAnimationDialog: true,
        status: 1,
      });
      this.submitQuestion(1);
    } else if (index === 1) {
      this.setState({
        scaleAnimationDialog: true,
        status: 0,
      });
      this.submitQuestion(0);
    }
  };

  submitQuestion = (status) => {
    client
      .mutate({
        mutation: saveOfferDescriptionMutatiion,
        variables: {
          offer_id: this.props.navigation.getParam("data").id,
          status: status,
          description: this.state.description,
          categories: this.state.topic_ids,
          invites: this.state.user_ids,
          tags: this.state.tag_ids,
        },
      })
      .then((results) => {
        if (results.data.saveOfferDescription.id) {
          this.setState({ scaleAnimationDialog: false, loading: false });
          this.props.navigation.navigate("MyOffer", { status: status });
        }
      })
      .catch((res) => {
        this.displayError(res);
        this.setState({
          scaleAnimationDialog: false,
        });
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

  changeFromDate = (event, date) => {
    if (date !== undefined) {
      let state = {
        fromObject: date,
        fromDate: this.formatDate(date, "MMM, DD, YYYY"),
        toObject: date,
        toDate: this.formatDate(null, "MMM, DD, YYYY"),
      };
      if (Platform.OS === "android") {
        state.fromDateShow = false;
      }
      this.setState(state);
    } else {
      this.setState({
        fromDateShow: false,
      });
    }
  };

  changeToDate = (event, date) => {
    if (date !== undefined) {
      let state = {
        toObject: date,
        toDate: this.formatDate(date, "MMM, DD, YYYY"),
      };
      if (Platform.OS === "android") {
        state.toDateShow = false;
      }

      this.setState(state);
    } else {
      this.setState({
        toDateShow: false,
      });
    }
  };

  navigateToHome = () => {
    this.setState({ show: false });
    this.props.navigation.goBack();
  };

  getOffer = (id) => {
    client
      .query({
        query: getOffer,
        variables: { id: id },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let topic_ids = [];
        let tag_ids = [];
        let tag_data = [];
        let user_ids = [];
        let user_data = [];
        result.data.offer.categories.map((category) => {
          topic_ids.push(category.id);
        });
        result.data.offer.tags.map((tag) => {
          tag_ids.push(tag.id);
        });
        tag_data = result.data.offer.tags;

        result.data.offer.invites.map((invite) => {
          user_ids.push(invite.id);
        });
        user_data = result.data.offer.invites;

        if (!result.loading) {
          this.setState({
            offer: result.data.offer,
            offer_id: result.data.offer.id,
            visibility: result.data.offer.visibility,
            status: result.data.offer.status,
            title: result.data.offer.title,
            description: result.data.offer.description,
            fromDate: this.formatDate(result.data.offer.from, "MMM, DD, YYYY"),
            toDate: this.formatDate(result.data.offer.to, "MMM, DD, YYYY"),
            fromObject: new Date(
              Date.parse(moment(result.data.offer.from, "DD-MM-YYYY"))
            ),
            toObject: new Date(
              Date.parse(moment(result.data.offer.to, "DD-MM-YYYY"))
            ),
            award: result.data.offer.award,
            topic_ids: topic_ids,
            tag_ids: tag_ids,
            tag_data: tag_data,
            user_ids: user_ids,
            user_data: user_data,
            company: result.data.offer.company,
            loading: false,
          });
        }
      })
      .catch((error) => {});
  };
  render() {
    if (this.state.loading)
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={color.primaryColor} />
        </View>
      );

    let d = new Date(
      Date.parse(moment(this.state.fromObject, "DD-MM-YYYY").add("days", 1))
    );

    let url = link.url + "/" + this.state.company.logo;

    const { navigate } = this.props.navigation;
    return (
      <KeyboardAvoidingView
        keyboardVerticalOffset={getStatusBarHeight() + 70}
        behavior={Platform.OS === "ios" ? "padding" : null}
        style={{ flex: 1, backgroundColor: "#fff" }}
      >
        <SafeAreaView style={[styles.postQuestionPage]}>
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <ScrollView
              style={{
                flex: 1,
                backgroundColor: "#fff",
              }}
            >
              <View style={{ flex: 1 }}>
                <TextInput
                  onRef={(input) => (this.editorRef = input)}
                  style={[
                    styles.awardTextInput,
                    this.state.position[0]
                      ? { borderColor: "red", borderWidth: 1 }
                      : {},
                  ]}
                  placeholder="Type your description..."
                  value={this.state.description}
                  onChangeText={this.setTitle}
                  multiline={true}
                />
              </View>

              <View>
                {this.state.position[3] ? (
                  <Text style={{ color: "red" }}>{this.state.position[3]}</Text>
                ) : null}

                {this.state.errorMessage.map((error, index) => (
                  <Text key={index} style={{ color: "red" }}>
                    {error}
                  </Text>
                ))}
              </View>

              <Dialog
                dialogStyle={{ borderRadius: 24 }}
                onTouchOutside={() => {
                  this.setState({ scaleAnimationDialog: false });
                }}
                width={0.7}
                visible={this.state.scaleAnimationDialog}
                dialogAnimation={new ScaleAnimation()}
                dialogTitle={
                  <DialogTitle
                    title={
                      this.state.status === 0
                        ? "Save as draft"
                        : "Publish offer"
                    }
                    hasTitleBar={false}
                  />
                }
              >
                <DialogContent>
                  <ActivityIndicator size="large" color={color.primaryColor} />
                </DialogContent>
              </Dialog>
            </ScrollView>

            {this.state.show ? (
              <View
                style={[
                  {
                    backgroundColor: "#fff",
                    flexDirection: "row",
                    paddingTop: 21,
                    paddingBottom: 14,
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
                        ? require("../../../assets/images/select-topic.png")
                        : require("../../../assets/images/select-topicGray.png")
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
                        ? require("../../../assets/images/hashTags.png")
                        : require("../../../assets/images/hashTagsGray.png")
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
                        ? require("../../../assets/images/addplus.png")
                        : require("../../../assets/images/addplusGray.png")
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
                        ? require("../../../assets/images/envolpeColor.png")
                        : require("../../../assets/images/envolpeGray.png")
                    }
                  />
                </TouchableOpacity>
              </View>
            ) : (
              <View
                style={[
                  {
                    flexDirection: "column",
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
                ]}
              >
                <List.Item
                  style={{ paddingTop: 15, paddingBottom: 15 }}
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
                  title="Select topic"
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
                          ? require("../../../assets/images/select-topic.png")
                          : require("../../../assets/images/select-topicGray.png")
                      }
                    />
                  )}
                />
                <List.Item
                  style={{ paddingTop: 15, paddingBottom: 15 }}
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
                        width: 10,
                        height: 10,
                        resizeMode: "contain",
                      }}
                      source={
                        this.state.tag_data.length > 0
                          ? require("../../../assets/images/hashTags.png")
                          : require("../../../assets/images/hashTagsGray.png")
                      }
                    />
                  )}
                />
                <List.Item
                  style={{ paddingTop: 15, paddingBottom: 15 }}
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
                          ? require("../../../assets/images/addplus.png")
                          : require("../../../assets/images/addplusGray.png")
                      }
                    />
                  )}
                />
                <List.Item
                  style={{ paddingTop: 15, paddingBottom: 15 }}
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
                          ? require("../../../assets/images/envolpeColor.png")
                          : require("../../../assets/images/envolpeGray.png")
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
                  description="Visible to Community"
                  left={(props) => (
                    <Image
                      style={styles.modalListItemIcons}
                      source={require("../../../assets/images/offer-public.png")}
                    />
                  )}
                />

                <List.Item
                  onPress={() => this._setStatus(0)}
                  style={[
                    styles.BottomOptionListItems,
                    {
                      backgroundColor:
                        this.state.status === 0 ? "#F5F5F5" : "#ffffff",
                    },
                  ]}
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
                  description="Users you invite and only your team(s) see this"
                  left={(props) => (
                    <Image
                      style={styles.modalListItemIcons}
                      source={require("../../../assets/images/offer-private.png")}
                    />
                  )}
                />
              </View>
            </View>
          </Modal>
          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            title={"Actions"}
            options={["Publish Offer", "Save as draft", "Cancel"]}
            cancelButtonIndex={2}
            onPress={this._onActionSheetAction}
          />
        </SafeAreaView>
      </KeyboardAvoidingView>
    );
  }
}

AddDescriptionScreen.navigationOptions = (screenProps) => ({
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
    <Text style={styles.postQuestionPageTitle}>Add Description</Text>
  ),
  headerRight: () => (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={screenProps.navigation.getParam("postNewOffer")}
    >
      <Text style={styles.postText}>Save</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  touchRightHeadText: {
    padding: 10,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
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
    lineHeight: 20,
    borderColor: "#fff",
    padding: 13,
    color: color.blackColor,
    fontSize: 16,
    backgroundColor: "#fff",
    borderRadius: 6,
  },
  SignUpButton: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
  },
});

export default AddDescriptionScreen;
