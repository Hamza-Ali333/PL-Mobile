import * as React from "react";
import { View, TouchableOpacity, StyleSheet, Image } from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Button, Paragraph, Menu, Divider, Provider } from "react-native-paper";
import color from "../constants/Colors";

export default class MenuQuestion extends React.Component {
  constructor(props) {
    super(props);
  }

  _actionSheet = () => {
    if (this.props.me.id === this.props.item.users.id) {
      this.props.actionShow(this.props.item, this.props.item.users);
    } else {
      this.props.actionShowMore(this.props.item, this.props.item.users);
    }
  };
  render() {
    if (this.props.me) {
      return (
        <TouchableOpacity
          style={{ paddingLeft: 10, paddingTop: 10, paddingBottom: 10 }}
          onPress={this._actionSheet}
        >
          <Image
            source={require("../assets/images/options.png")}
            style={{ width: 16, height: 16 }}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  userDeatilDotIcon: {
    fontSize: 22,
    color: color.blackColor,
  },
});
