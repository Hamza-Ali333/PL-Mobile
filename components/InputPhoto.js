import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import firstChar from "../helper/firstChar";
import link from "../constants/link";

class InputPhoto extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidUpdate() {}

  render() {
    let timestamp = this.props.item.timestamp
      ? this.props.item.timestamp
      : Date.parse(new Date());
    let color = this.props.item.color
      ? this.props.item.color.replace(/\s+/g, "")
      : "#2980B9";
    if (!this.props.item) {
      return null;
    } else if (!this.props.item.profile_photo) {
      return (
        <Avatar.Text
          style={[styles.userProfile, { backgroundColor: color }]}
          size={35}
          label={
            firstChar(this.props.item.firstname) +
            firstChar(this.props.item.lastname)
          }
        />
      );
    } else {
      return (
        <Avatar.Image
          size={35}
          style={styles.userProfile}
          source={{
            uri:
              link.url +
              "/uploads/profile_images/" +
              this.props.item.profile_photo +
              "?" +
              timestamp,
          }}
        />
      );
    }
  }
}

const styles = StyleSheet.create({
  userProfile: {
    position: "absolute",
    left: 2,
    top: 2,
    zIndex: 1,
    borderRadius: 90,
    backgroundColor: "grey",
  },
});

export default InputPhoto;
