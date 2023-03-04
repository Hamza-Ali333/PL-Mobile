import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import firstChar from "../helper/firstChar";
import link from "../constants/link";
import colorC from "../constants/Colors";

class ChatPhoto extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let timestamp = this.props.me
      ? this.props.me.timestamp
      : Date.parse(new Date());
    let color = this.props.item.color
      ? this.props.item.color.replace(/\s+/g, "")
      : colorC.primaryColor;
    if (this.props.item) {
      if (
        !this.props.item.profile_photo ||
        this.props.item.profile_photo === "false"
      ) {
        return (
          <Avatar.Text
            labelStyle={{ color: "#ffffff" }}
            style={[
              styles.userProfile,
              this.props.style,
              { backgroundColor: color },
            ]}
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
            style={[
              styles.userProfile,
              this.props.style,
              { backgroundColor: color },
            ]}
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
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  userProfile: {
    borderRadius: 90,
  },
});

export default ChatPhoto;
