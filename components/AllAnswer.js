import React from "react";
import {
  Animated,
  Button,
  Platform,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  Modal,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import { EU } from "../components/react-native-mentions-editor";
import Constants from "expo-constants";
import { ExpoConfigView } from "@expo/samples";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import TimeAgo from "../components/TimeAgo";
import LikeDislikeAnswer from "../components/LikeDislikeAnswer";
import { Avatar } from "react-native-paper";
import Swipeable from "react-native-gesture-handler/Swipeable";
import firstChar from "../helper/firstChar";
import capitalize from "../helper/capitalize";
import getNotificationAnswer from "../graphql/queries/getNotificationAnswer";
import client from "../constants/client";
import ProfilePhoto from "./ProfilePhoto";
import ActionSheet from "react-native-actionsheet";

class AllAnswer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      visible: true,
      renderChild: true,
    };
  }
  componentDidMount() {
    this.setState({
      isLoading: false,
    });
  }
  componentDidUpdate() {}

  showModal() {
    this.setState({ visible: true });
  }
  hideModal() {
    this.setState({ visible: false });
  }

  navigateDetail = () => {
    this.props.navigateDetail(this.props);
  };

  _showActionSheet = () => {
    this.ActionSheet.show();
  };

  _onActionSheetAction = (index) => {
    if (index === 0) {
      this.deleteItem();
    }
  };

  deleteItem = () => {
    this.props._deleteItem(this.props.item.id);
  };

  goToProfile = () => {
    this.props.goToProfile(this.props.item.users.id);
  };

  navigateProfile = (str) => {
    const ids = str.split("-");
    this.props.navigation.navigate("UserProfile", {
      user_id: ids[1],
    });
  };

  formatMentionNode = (txt, key) => {
    return (
      <Text
        onPress={this.navigateProfile.bind(this, key)}
        key={key}
        style={styles.mention}
      >
        {txt}
      </Text>
    );
  };

  onLayout = (event) => {
    this.props.item.itemHeight = event.nativeEvent.layout.height;
  };

  render() {
    if (this.state.renderChild) {
      const RightActions = ({ progress, dragX, onPress }) => {
        const scale = dragX.interpolate({
          inputRange: [-5, 0],
          outputRange: [1, 0],
          extrapolate: "clamp",
        });
        if (this.props.item.users.id === this.props.me.id) {
          return (
            <TouchableOpacity onPress={onPress}>
              <View style={styles.rightAction}>
                <Animated.Text
                  style={[styles.actionText, { transform: [{ scale }] }]}
                >
                  <FontAwesome size={24} name="trash-o" />
                </Animated.Text>
              </View>
            </TouchableOpacity>
          );
        } else {
          return null;
        }
      };
      if (this.state.isLoading) {
        return (
          <View>
            <Text></Text>
          </View>
        );
      }
      return (
        <View
          style={[
            styles.ReplyAnswerContainer,
            this.props.selectedAnswerId == this.props.item.id
              ? { backgroundColor: "#EDEDED" }
              : {},
          ]}
          onLayout={this.onLayout}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <ProfilePhoto
              size={42}
              item={this.props.item.users}
              me={this.props.me}
            />

            <View style={{ flex: 1 }}>
              <TouchableOpacity onPress={this.goToProfile}>
                <Text style={styles.ReplyUserName}>
                  {capitalize(this.props.item.users.firstname)}{" "}
                  {capitalize(this.props.item.users.lastname)}
                </Text>
              </TouchableOpacity>
            </View>
            {this.props.item.users.id === this.props.me.id && (
              <View
                style={{
                  flex: 1 / 2,
                  flexDirection: "row-reverse",
                }}
              >
                <TouchableOpacity
                  style={{ padding: 10 }}
                  onPress={this._showActionSheet}
                >
                  <Image
                    source={require("../assets/images/options.png")}
                    style={{ width: 16, height: 16 }}
                  />
                </TouchableOpacity>
              </View>
            )}
          </View>
          {/*<TimeAgo
                  style={styles.ReplyUserDate}
                  created_at={this.props.item.created_at}
                />*/}
          <View style={{ flex: 1, marginLeft: 50 }}>
            <Text style={styles.ReplyUserDescription}>
              {EU.displayTextWithMentions(
                this.props.item.answer,
                this.formatMentionNode
              )}
            </Text>

            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: 250,
              }}
            >
              <Text style={styles.ReplyUserDate}>{this.props.item.date}</Text>
              {this.props.item.id > 0 && (
                <LikeDislikeAnswer
                  _handleAnswerLikePressed={this.props.handleAnswerLikePressed}
                  _handleAnswerDislikePressed={
                    this.props.handleAnswerDislikePressed
                  }
                  question_id={this.props.question_id}
                  navigateDetail={this.navigateDetail}
                  item={this.props.item}
                />
              )}
            </View>
          </View>
          <ActionSheet
            ref={(o) => (this.ActionSheet = o)}
            title={"Delete answer."}
            options={["Delete", "cancel"]}
            cancelButtonIndex={1}
            destructiveButtonIndex={0}
            onPress={this._onActionSheetAction}
          />
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  ReplyAnswerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    paddingLeft: 15,
    paddingTop: 5,
  },
  ReplyUserProfileImage: {
    marginRight: 15,
    width: 42,
    height: 42,
    borderRadius: 90,
  },
  ReplyUserName: {
    fontSize: 15,
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    letterSpacing: 0.5,
    paddingRight: 10,
  },
  ReplyUserDescription: {
    lineHeight: 21,
    fontSize: 15,
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    marginRight: 15,
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
    marginTop: 10,
  },
  ReplyUserLike: {
    fontSize: 22,
  },
  ReplyUserDislike: {
    fontSize: 22,
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
    position: "relative",
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
    right: 20,
    top: 12,
    width: 55,
  },
  rightAction: {
    backgroundColor: "#dd2c00",
    justifyContent: "center",
    flex: 1,
    alignItems: "flex-end",
  },
  actionText: {
    color: "#fff",
    fontWeight: "600",
    padding: 20,
  },
  mention: {
    fontSize: 16,
    fontWeight: "400",
    backgroundColor: "rgba(36, 77, 201, 0.05)",
    color: color.primaryColor,
  },
});

export default AllAnswer;
