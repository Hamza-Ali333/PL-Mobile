import React from "react";
import {
  Animated,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import { Avatar } from "react-native-paper";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import TimeAgo from "./TimeAgo";
import FontFamily from "../constants/FontFamily";
import color from "../constants/Colors";
import capitalize from "../helper/capitalize";
import firstChar from "../helper/firstChar";
import gql from "graphql-tag";
import ProfilePhoto from "./ProfilePhoto";

class OfferComment extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { renderChild: true };
  }

  deleteComment = () => {
    let owner_id = this.props.recommendationData.recommendation.user.id;
    let offer_id = this.props.recommendationData.recommendation.offer_id;
    this.swipeableRef.close();
    this.props._deleteComment(this.props.item.id, offer_id, owner_id);
  };

  render() {
    const RightActions = ({ progress, dragX, onPress }) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
        outputRange: [1, 0],
        extrapolate: "clamp",
      });
      if (this.props.item.user.id == this.props.me.id) {
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

    return (
      <Swipeable
        ref={(ref) => (this.swipeableRef = ref)}
        renderRightActions={(progress, dragX) => (
          <RightActions
            progress={progress}
            dragX={dragX}
            onPress={this.deleteComment}
          />
        )}
      >
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
            <ProfilePhoto item={this.props.item.user} me={this.props.me} />

            <View style={{ flex: 1 }}>
              <TouchableOpacity disabled={true}>
                <Text style={styles.ReplyUserName}>
                  {capitalize(this.props.item.user.firstname)}{" "}
                  {capitalize(this.props.item.user.lastname)}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <TimeAgo
                  style={styles.ReplyUserDate}
                  created_at={this.props.item.created_at}
                /> */}
          <View style={{ flex: 1, marginLeft: 50 }}>
            <Text style={styles.ReplyUserDescription}>
              {this.props.item.comment_body}
            </Text>
            <View
              style={{
                flex: 1,
                flexDirection: "row",
                justifyContent: "space-between",
                width: 250,
              }}
            >
              <TimeAgo
                style={styles.ReplyUserDate}
                created_at={this.props.item.created_at}
              />
            </View>
          </View>
        </View>
      </Swipeable>
    );
  }
}

const styles = StyleSheet.create({
  ReplyAnswerContainer: {
    flex: 1,
    backgroundColor: "#fff",
    paddingBottom: 5,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    paddingLeft: 5,
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

export default OfferComment;
