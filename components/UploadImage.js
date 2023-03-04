import React, { Component } from "react";
import { View, Image, ImageBackground } from "react-native";
import link from "../constants/link";

class UploadImage extends React.Component {
  constructor(props) {
    super(props);
  }

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.isUpdated !== this.props.isUpdated) {
      return true;
    } else {
      return false;
    }
  }

  render() {
    let url =
      link.url +
      "/uploads/profile_images/" +
      this.props.item +
      "?id=" +
      Math.random();
    return (
      <View style={{ borderRadius: 50, overflow: "hidden" }}>
        <ImageBackground
          style={{ width: 100, height: 100 }}
          source={require("../assets/images/camera_icon.png")}
        >
          <Image
            style={{ width: 100, height: 100, borderRadius: 50 }}
            source={{
              uri: url,
            }}
          />
        </ImageBackground>
      </View>
    );
  }
}

export default UploadImage;
