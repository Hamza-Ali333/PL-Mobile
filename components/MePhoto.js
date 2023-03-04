import React from "react";
import { StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import firstChar from "../helper/firstChar";
import link from "../constants/link";
import AsyncStorage from "@react-native-async-storage/async-storage";

class MePhoto extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: {},
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.random !== this.props.random) {
      AsyncStorage.getItem("me").then((result) => {
        let res = JSON.parse(result);
        this.setState({ me: res });
      });
    }
  }

  render() {
    if (this.state.me) {
      let timestamp = this.state.me
        ? this.state.me.timestamp
        : Date.parse(new Date());
      let color = this.state.me.color
        ? this.state.me.color.replace(/\s+/g, "")
        : "#2980B9";
      if (
        !this.state.me.profile_photo ||
        this.state.me.profile_photo === "false"
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
              firstChar(this.state.me.firstname) +
              firstChar(this.state.me.lastname)
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
                link.url +
                "/uploads/profile_images/" +
                this.state.me.profile_photo +
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
    marginRight: 10,
    borderRadius: 90,
  },
});

export default MePhoto;
