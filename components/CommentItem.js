import { FontAwesome } from "@expo/vector-icons";
import React from "react";
import {
  Animated,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import Swipeable from "react-native-gesture-handler/Swipeable";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import capitalize from "../helper/capitalize";
import ProfilePhoto from "./ProfilePhoto";

class CommentItem extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = { renderChild: true };
  }

  deleteComment = (e) => {
    this.swipeableRef.close();
    this.props._deleteComment(this.props.item.id);
  };

  goToProfile = () => {
    this.props.goToProfile(this.props.item.users.id);
  };

  render() {
    const RightActions = ({ progress, dragX, onPress }) => {
      const scale = dragX.interpolate({
        inputRange: [-100, 0],
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
        <View style={styles.ReplyAnswerContainer}>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "center",
              alignItems: "center",
              marginLeft: 20,
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
                  {capitalize(this.props.item.users.lastname)}{" "}
                </Text>
              </TouchableOpacity>
            </View>
            {/*<TimeAgo
                style={styles.ReplyUserDate}
                created_at={this.props.item.created_at}
              />*/}
          </View>
          <View style={{ flex: 1, marginLeft: 50 }}>
            <Text style={styles.ReplyUserDescription}>
              {this.props.item.comment}
            </Text>
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
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderColor: "#E8E8E8",
    paddingTop: 15,
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
    paddingLeft: 20,
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
});

export default CommentItem;
