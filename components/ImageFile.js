import React from "react";
import { View, Dimensions, Image, StyleSheet } from "react-native";
import { Video } from "expo-av";
import Lightbox from "react-native-lightbox";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import { _handleOfferWatched } from "./CombineFunction";
const windowWidth = Dimensions.get("window").width;

class ImageFile extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    let uri = link.url + "/" + this.props.item.attachment.url;

    return (
      <View
        style={{
          backgroundColor: color.lightGrayColor,
          height: 350,
          marginTop: 13,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Lightbox style={{ flex: 1 }} underlayColor={color.lightGrayColor}>
          <Image
            style={{ width: windowWidth, height: "100%" }}
            source={{ uri: uri }}
          />
        </Lightbox>
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default ImageFile;
