import React from "react";
import { Text, View, TouchableOpacity, Image } from "react-native";

import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import {
  _handleOfferSavePressed,
  _handleOfferUnSavePressed,
  requestMiddleware
} from "../components/CombineFunction";

class OfferBookmark extends React.Component {
  constructor(props) {
    super(props);
    this.delayLikeTimer;
  }

  offerRemoveBookmark = async () => {
    let res = await requestMiddleware(this.props.item.id);
    if(res){
      this.props.item.isBookmarked = false;
      this.forceUpdate();
      clearTimeout(this.delayLikeTimer);
      this.delayLikeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
            _handleOfferUnSavePressed(this.props.item.id);
        });
      }, 2000);
    }
  }

  offerAddBookmark = async () => {
    let res = await requestMiddleware(this.props.item.id);
    if(res){
      this.props.item.isBookmarked = true;
      this.forceUpdate();
      clearTimeout(this.delayLikeTimer);
      this.delayLikeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
            _handleOfferSavePressed(this.props.item.id);
        });
      }, 2000);
    }
  }
  render() {
    return (
      <View>
        {this.props.item.isBookmarked ? (
          <TouchableOpacity
            onPress={this.offerRemoveBookmark}
            style={{
              paddingLeft: 10,
              paddingTop: 13,
              paddingBottom: 13,
            }}
          >
            <Image
              source={require("../assets/images/BookmarkColor.png")}
              style={{
                width: 14.41,
                height: 18.76,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity
            onPress={this.offerAddBookmark}
            style={{
              paddingLeft: 10,
              paddingTop: 13,
              paddingBottom: 13,
            }}
          >
            <Image
              source={require("../assets/images/bookmarks.png")}
              style={{
                width: 14.41,
                height: 18.76,
                resizeMode: "contain",
              }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default OfferBookmark;
