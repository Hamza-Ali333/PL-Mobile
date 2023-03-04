import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import ProfilePhoto from "./ProfilePhoto";
import capitalize from "../helper/capitalize";

class ProfileImageTitle extends React.Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {}

  _goToProfile = () => {
    this.props.goToProfile(this.props.item.users.id);
  };

  render() {
    if (this.props.item) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <TouchableOpacity onPress={this._goToProfile}>
            <ProfilePhoto
              size={42}
              item={this.props.item.users}
              me={this.props.me}
            />
          </TouchableOpacity>

          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={this._goToProfile}>
              <Text style={styles.userName}>
                {this.props.item.users
                  ? capitalize(this.props.item.users.firstname)
                  : ""}{" "}
                {this.props.item.users
                  ? capitalize(this.props.item.users.lastname)
                  : ""}
              </Text>
            </TouchableOpacity>
            {/* <TimeAgo
                style={styles.userDate}
                created_at={this.props.item.created_at}
              />
            */}
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  userProfile: {
    marginRight: 20,
    width: 42,
    height: 42,
    borderRadius: 90,
  },
  userName: {
    fontSize: 17,
    marginTop: 0,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
  },
  userDate: {
    fontSize: 11,
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
  },
});

export default ProfileImageTitle;
