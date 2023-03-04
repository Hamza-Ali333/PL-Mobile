import React from "react";
import { Text, View, TouchableOpacity, Image, Alert } from "react-native";

import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import {
  _handleOfferLikePressed,
  _handleOfferUnLikePressed,
  requestMiddleware,
} from "../components/CombineFunction";

class OfferLikeUnlike extends React.Component {
  constructor(props) {
    super(props);
    this.delayLikeTimer;
  }

  actionUnlike = async () => {
    let res = await requestMiddleware(this.props.item.id);
    if (res) {
      this.props.item.isLiked = false;
      this.props.item.totalLikes = this.props.item.totalLikes - 1;
      this.forceUpdate();
      clearTimeout(this.delayLikeTimer);
      this.delayLikeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          _handleOfferUnLikePressed(this.props.item.id);
        });
      }, 2000);
    }
  };

  actionLike = async () => {
    let res = await requestMiddleware(this.props.item.id);
    if (res) {
      this.props.item.isLiked = true;
      this.props.item.totalLikes = this.props.item.totalLikes + 1;
      this.forceUpdate();
      clearTimeout(this.delayLikeTimer);
      this.delayLikeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          _handleOfferLikePressed(this.props.item.id);
        });
      }, 2000);
    }
  };

  render() {
    return (
      <View>
        {this.props.item.isLiked ? (
          <TouchableOpacity
            onPress={this.actionUnlike}
            style={{
              paddingRight: 10,
              paddingTop: 13,
              paddingBottom: 13,
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../assets/images/heartColor.png")}
              style={{
                width: 20,
                height: 18,
                resizeMode: "contain",
              }}
            />
            <Text
              style={{
                color: color.grayColor,
                fontFamily: FontFamily.Regular,
                fontSize: 13,
                marginLeft: 5,
              }}
            >
              {this.props.item.totalLikes}
            </Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={this.actionLike}
            style={{
              paddingRight: 10,
              paddingTop: 13,
              paddingBottom: 13,
              flexDirection: "row",
            }}
          >
            <Image
              source={require("../assets/images/heart.png")}
              style={{
                width: 20,
                height: 18,
                resizeMode: "contain",
              }}
            />
            <Text
              style={{
                color: color.grayColor,
                fontFamily: FontFamily.Regular,
                fontSize: 13,
                marginLeft: 5,
              }}
            >
              {this.props.item.totalLikes}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default OfferLikeUnlike;
