import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import firstChar from "../../helper/firstChar";
import link from "../../constants/link";

class ProfilePhoto extends React.PureComponent {
  constructor(props) {
    super(props);
  }

  render() {
    let timestamp = this.props.me
      ? this.props.me.timestamp
      : Date.parse(new Date());
    let color = null;
    if (this.props.color && this.props.color !== null) {
      color = this.props.item.color.replace(/\s+/g, "");
    } else {
      color = "#2980B9";
    }

    if (this.props.item) {
      if (
        !this.props.item.profile_photo ||
        this.props.item.profile_photo === "false"
      ) {
        return (
          <Avatar.Text
            style={[
              styles.userProfile,
              this.props.style,
              { backgroundColor: color },
            ]}
            size={45}
            label={
              firstChar("this.props.item.firstname") +
              firstChar(this.props.item.lastname)
            }
          />
        );
      } else {
        return (
          <Avatar.Image
            size={45}
            style={[
              styles.userProfile,
              this.props.style,
              { backgroundColor: color },
            ]}
            source={{
              uri:
                link.mro_link +
                "/uploads/profile_images/" +
                this.props.item.profile_photo,
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
    marginRight: 10,
    borderRadius: 90,
  },
});

export default ProfilePhoto;
