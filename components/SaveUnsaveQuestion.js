import React from "react";
import {
  Alert,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
} from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { FontAwesome } from "@expo/vector-icons";
import getQuestions from "../graphql/queries/getQuestions";

import { Mutation } from "react-apollo";

class SaveUnsaveQuestion extends React.PureComponent {
  constructor(props) {
    super(props);

    this.delaySaveTimer;
  }

  navigateDetail = () => {
    this.props.navigateDetail(this.props);
  };

  _handleSavedPressed = () => {
    Alert.alert(
      "Bookmarks Saved!",
      "",
      [{ text: "OK", onPress: () => console.log("OK Pressed") }],
      { cancelable: false }
    );
    this.props.item.saveForCurrentUser = true;
    this.forceUpdate();
    clearTimeout(this.delaySaveTimer);
    this.delaySaveTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        this.props._handleSavedPressed(this.props.item.id);
      });
    }, 2000);
  };

  _handleUnsavedPressed = () => {
    this.props.item.saveForCurrentUser = false;
    this.forceUpdate();
    clearTimeout(this.delaySaveTimer);
    this.delaySaveTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        this.props._handleUnsavedPressed(this.props.item.id);
        if (typeof this.props.tapOnTabNavigator === "function") {
          this.props.tapOnTabNavigator();
        }
      });
    }, 2000);
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
        }}
      >
        {!this.props.item.saveForCurrentUser && (
          <TouchableOpacity
            style={{ paddingLeft: 10, paddingTop: 13, paddingBottom: 13 }}
            onPress={this._handleSavedPressed}
          >
            <Image
              source={require("../assets/images/bookmarks.png")}
              style={{ width: 14.41, height: 18.76, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        )}
        {this.props.item.saveForCurrentUser && (
          <TouchableOpacity
            style={{ paddingLeft: 13, paddingTop: 13, paddingBottom: 13 }}
            onPress={this._handleUnsavedPressed}
          >
            <Image
              source={require("../assets/images/BookmarkColor.png")}
              style={{ width: 14.41, height: 18.76, resizeMode: "contain" }}
            />
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

export default SaveUnsaveQuestion;
