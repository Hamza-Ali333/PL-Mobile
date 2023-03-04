import React from "react";
import {
  Alert,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
  Share,
  Clipboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { ActivityIndicator, List } from "react-native-paper";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import getQuestion from "../graphql/queries/getQuestion";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";
import isAuthorized from "../graphql/queries/isAuthorized";
import me from "../graphql/queries/me";
import link from "../constants/link";
import client from "../constants/client";
import Alertify from "../components/Alertify";

class AccessScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      label: "",
      position: [],
      loaderVisible: false,
      popupVisible: false,
      number: 0,
      html: "",
      item: null,
      // data for next page
      text: "",
      question: "",
      question_id: [],
      topic_ids: [],
      tag_ids: [],
      tag_data: [],
      user_ids: [],
      user_data: [],
      loading: false,
      update: false,
    };
    this.alertifyRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      nextScreen: this.nextScreen,
      navigateToHome: this.navigateToHome,
    });
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  navigateToHome = () => {
    let courseId = this.props.navigation.getParam("courseId");
    if (courseId) {
      if (this.state.label) {
        this.setState({ popupVisible: true });
      } else {
        this.setState({ show: false });
        AsyncStorage.removeItem("@newDiscussionPost");
        this.props.navigation.navigate("ClassDetail");
      }
    } else {
      if (this.state.label) {
        this.setState({ popupVisible: true });
      } else {
        this.setState({ show: false });
        AsyncStorage.removeItem("@newDiscussionPost");
        this.props.navigation.navigate("Home");
      }
    }
  };

  nextScreen = () => {
    if (this.formValidation()) {
      if (this.props.navigation.getParam("id")) {
        this.props.navigation.navigate("Ask", {
          label: this.state.label,
          resetActionState: this.resetActionState,
          setHtml: this.setHtml,
          type: this.props.navigation.getParam("type"),
          courseId: this.props.navigation.getParam("courseId"),
          //extra for updating
          text: this.state.text,
          question_id: this.state.question_id,
          question: this.state.question,
          topic_ids: this.state.topic_ids,
          tag_ids: this.state.tag_ids,
          tag_data: this.state.tag_data,
          user_ids: this.state.user_ids,
          user_data: this.state.user_data,
        });
      } else {
        this.props.navigation.navigate("Ask", {
          label: this.state.label,
          resetActionState: this.resetActionState,
          setHtml: this.setHtml,
          type: this.props.navigation.getParam("type"),
          courseId: this.props.navigation.getParam("courseId"),
        });
      }
    }
  };

  setHtml = (html) => {
    this.setState({ html });
  };

  formValidation = () => {
    let position = [];
    if (this.state.label == "" || this.state.label == null) {
      position[0] = " ";
    } else if (this.state.label.length < 32) {
      position[0] = "Minimum 32 characters required!";
    } else if (this.state.label.length > 160) {
      position[0] = "Maximum 160 characters allowed!";
    }

    this.setState({ position });
    if (position.length === 0) {
      return true;
    }
    return false;
  };

  setLabel = (label) => {
    this.setState({ label: label, number: label.length }, () =>
      this.formValidation()
    );
  };

  resetActionState = (data = null) => {
    this.setState({
      label: "",
      number: 0,
      loaderVisible: !this.state.loaderVisible,
      html: "",
    });
    if (data) {
      this.setState({ item: data }, () => this.alertifyRef.current.open());
    }
  };

  _onDismiss = () => {
    let courseId = this.props.navigation.getParam("courseId");
    if (courseId) {
      this.props.navigation.navigate("ClassDetail", { postUpdate: true });
    } else {
      this.props.navigation.navigate("Home", { postUpdate: true });
    }
  };

  saveAsDraft = () => {
    AsyncStorage.setItem("@newDiscussionPost", this.state.html)
      .then((result) => {
        this.setState({ popupVisible: false, show: false });
        this.props.navigation.navigate("Home");
      })
      .catch((err) => {});
  };

  discardPost = () => {
    this.setState({ popupVisible: false, show: false, html: "", label: "" });
    AsyncStorage.removeItem("@newDiscussionPost");
    this.props.navigation.navigate("Home");
  };

  cancelPost = () => {
    this.setState({ popupVisible: false });
  };

  checkUserAuthorized = async () => {
    let isUserAuthorized = await this.isUserAuthorized();

    if (!isUserAuthorized) {
      let doUserAuthorized = await this.doUserAuthorized();
      if (!doUserAuthorized) {
        Alert.alert(
          "Need updates!",
          "We found some issues into your profile, please update your profile for add a new discussion",
          [
            {
              text: "Update profile",
              onPress: () => this.props.navigation.navigate("EditProfile"),
            },
          ],
          { cancelable: false }
        );
      }
    }
  };

  isUserAuthorized = () => {
    return new Promise((resolve) => {
      client
        .query({
          query: me,
          fetchPolicy: "network-only",
        })
        .then((result) => {
          if (result.data.me.is_authorized) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          resolve(false);
        });
    });
  };

  doUserAuthorized = () => {
    return new Promise((resolve) => {
      client
        .query({
          query: isAuthorized,
          fetchPolicy: "network-only",
        })
        .then((result) => {
          if (result.data.authorizedUser.is_authorized) {
            resolve(true);
          } else {
            resolve(false);
          }
        })
        .catch((error) => {
          resolve(false);
        });
    });
  };

  tapOnTabNavigator = () => {
    this.checkUserAuthorized();

    console.log(" ID => ", this.props.navigation.getParam("id"));
    console.log("Data => ", this.props.navigation.getParam("data"));

    if (this.props.navigation.getParam("data")) {
      this.setState(this.props.navigation.getParam("data"));
    } else if (this.props.navigation.getParam("id")) {
      this.setState({
        loading: true,
        placeHolderEnable: false,
        editable: true,
      });
      this.getQuestion(this.props.navigation.getParam("id"));
      this.props.navigation.setParams({ postNewText: "Update" });
    }
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
            label: result.data.question.description,
            text: result.data.question.question,
            question: result.data.question.question,
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

  onEdit = () => {
    this.alertifyRef.current.toggle(false);
    this.props.navigation.navigate("NewPost", { id: this.state.item.id });
  };

  onShare = async (item) => {
    try {
      const result = await Share.share({
        message: link.shareUrl + "/share/discussions/" + this.state.item.id,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          this.alertifyRef.current.toggle();
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {}
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
          onPress: () => this.alertifyRef.current.toggle(),
        },
      ],
      { cancelable: true }
    );
  };

  render() {
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
      <View style={{ flex: 1, backgroundColor: "#fff", padding: 15 }}>
        <KeyboardAwareScrollView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
          showsVerticalScrollIndicator={false}
        >
          <View style={{ backgroundColor: "#F3F5FB", borderRadius: 10 }}>
            <View
              style={{
                backgroundColor: "#F3F5FB",
                borderRadius: 10,
                height: 50,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text
                style={{
                  fontSize: 18,
                  fontFamily: FontFamily.Medium,
                  color: color.blackColor,
                }}
              >
                Access
              </Text>
            </View>
            <TouchableOpacity
              style={{
                backgroundColor: "#E9EBF2",
                height: 75,
                justifyContent: "center",
                paddingLeft: 20,
              }}
            >
              <List.Item
                style={{}}
                titleStyle={{
                  fontSize: 17,
                  fontFamily: FontFamily.Medium,
                  color: color.blackColor,
                  marginLeft: 5,
                }}
                title="Public"
                descriptionStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  marginLeft: 5,
                }}
                description="Visible to Community"
                left={(props) => (
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                      marginTop: 12,
                    }}
                    source={require("../assets/images/offer-public.png")}
                  />
                )}
              />
            </TouchableOpacity>
            <TouchableWithoutFeedback
              style={{
                backgroundColor: "#F3F5FB",
                borderRadius: 10,
                height: 75,
                justifyContent: "center",
                paddingLeft: 20,
                opacity: 0.3,
              }}
            >
              <List.Item
                style={{}}
                titleStyle={{
                  fontSize: 17,
                  fontFamily: FontFamily.Medium,
                  color: color.blackColor,
                  marginLeft: 5,
                }}
                title="Private"
                descriptionStyle={{
                  fontSize: 14,
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  marginLeft: 5,
                }}
                description="Only invited users see this"
                left={(props) => (
                  <Image
                    style={{
                      width: 25,
                      height: 25,
                      resizeMode: "contain",
                      marginTop: 12,
                    }}
                    source={require("../assets/images/offer-private.png")}
                  />
                )}
              />
            </TouchableWithoutFeedback>
          </View>
          <View style={{ marginTop: 30 }}>
            <Text style={styles.dateRangeText}>Title</Text>
            <View
              style={{
                flex: 1,
                justifyContent: "space-between",
                flexDirection: "row",
              }}
            >
              <Text style={{ color: "red" }}>{this.state.position[0]}</Text>

              <Text style={{ color: color.grayColor }}>
                {this.state.number}/160
              </Text>
            </View>
            <View style={{ marginTop: 10 }}>
              <TextInput
                textAlignVertical={"top"}
                multiline
                style={[
                  styles.awardTextInput,
                  this.state.position[0]
                    ? { borderColor: "red", borderWidth: 1 }
                    : {},
                ]}
                placeholder="Enter (minimum 160 characters) a title 
                for your discussion-question"
                value={this.state.label}
                onChangeText={this.setLabel}
              />
            </View>
          </View>
        </KeyboardAwareScrollView>
        <Dialog
          dialogStyle={{ borderRadius: 24 }}
          width={0.7}
          visible={this.state.loaderVisible}
          dialogAnimation={new ScaleAnimation()}
          dialogTitle={
            <DialogTitle title={"Publishing..."} hasTitleBar={true} />
          }
        >
          <DialogContent>
            <View style={{ justifyContent: "center", alignItems: "center" }}>
              <ActivityIndicator color={color.primaryColor} />
            </View>
          </DialogContent>
        </Dialog>
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
        <Alertify
          ref={this.alertifyRef}
          onDismiss={this._onDismiss}
          title={"Your discussion is now live"}
        />
      </View>
    );
  }
}

AccessScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    height: 70,
    elevation: 0,
  },
  headerLeft: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("navigateToHome")}
      style={{
        padding: 10,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Ionicons name="ios-close" color={color.primaryColor} size={32} />
    </TouchableOpacity>
  ),
  headerTitle: () => <Text style={styles.headerPageTitle}>New Discussion</Text>,
  headerRight: () => (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={screenProps.navigation.getParam("nextScreen")}
    >
      <Text style={styles.headerRightText}>Next</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    paddingRight: 10,
    borderRadius: 3,
    borderColor: color.primaryColor,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
  },
  dateRangeText: {
    fontSize: 18,
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
  },
  awardTextInput: {
    borderColor: "#bfbfbf",
    padding: 13,
    color: color.blackColor,
    fontSize: 16,
    backgroundColor: "#F3F5FB",
    borderRadius: 6,
    height: 160,
  },
});

export default AccessScreen;
