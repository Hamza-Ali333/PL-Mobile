import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { AntDesign } from "@expo/vector-icons";
import getNotificationAnswer from "../graphql/queries/getNotificationAnswer";

class LikeDislikeAnswer extends React.Component {
  constructor(props) {
    super(props);
  }

  navigateDetail = () => {
    if (typeof this.props.navigateDetail !== "undefined") {
      this.props.navigateDetail(this.props);
    }
  };

  _handleAnswerLikePressed = () => {
    requestAnimationFrame(() => {
      this.props._handleAnswerLikePressed(
        this.props.question_id,
        this.props.item.id,
        this.props.item.likes.paginatorInfo.total,
        this.props.item.dislikes.paginatorInfo.total,
        this.props.item.voteStatus
      );
    });
  };

  _handleAnswerDislikePressed = () => {
    requestAnimationFrame(() => {
      this.props._handleAnswerDislikePressed(
        this.props.question_id,
        this.props.item.id,
        this.props.item.likes.paginatorInfo.total,
        this.props.item.dislikes.paginatorInfo.total,
        this.props.item.voteStatus
      );
    });
  };

  render() {
    let likeColor =
      this.props.item.voteStatus === 1
        ? require("../assets/images/heartColor.png")
        : require("../assets/images/heartFilled.png");
    let unlikeColor =
      this.props.item.voteStatus === 0
        ? require("../assets/images/DislikeColor.png")
        : require("../assets/images/Dislike.png");
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <TouchableOpacity
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
          }}
          onPress={this._handleAnswerLikePressed}
        >
          <Image
            source={likeColor}
            style={{ width: 18, height: 18, resizeMode: "contain" }}
          />
          <Text
            style={{
              marginLeft: 5,
              color: color.grayColor,
              fontFamily: FontFamily.Regular,
            }}
          >
            {this.props.item.likes.paginatorInfo.total}
          </Text>
        </TouchableOpacity>

        {/* <TouchableOpacity
          onPress={this.navigateDetail}
          style={{
            flexDirection: "row",
            paddingBottom: 13,
            paddingTop: 13,
          }}
        >
          <Image
            source={require("../assets/images/comment.png")}
            style={{ width: 20, height: 18, resizeMode: "contain" }}
          />
          <Text
            style={{
              color: color.grayColor,
              fontFamily: FontFamily.Regular,
              fontSize: 13,
              marginLeft: 5,
            }}
          >
            {this.props.item.comments.paginatorInfo.total}
          </Text>
        </TouchableOpacity> */}

        {this.props.navigateDetail && (
          <TouchableOpacity onPress={this.navigateDetail}>
            <Text style={styles.ReplyText}>Comment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ReplyText: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    marginLeft: 20,
  },
  ReplyUserLike: {
    fontSize: 22,
  },
  ReplyUserDislike: {
    fontSize: 22,
  },
});

export default LikeDislikeAnswer;
