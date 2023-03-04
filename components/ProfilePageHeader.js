import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons, FontAwesome } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";

class ProfilePageHeader extends React.Component {
  navigate = () => {
    this.props.navigation.navigate("EditProfile", { type: "" });
  };
  render() {
    return (
      <TouchableOpacity
        style={{ marginRight: 15, textAlign: "center" }}
        onPress={this.navigate.bind(this)}
      >
        {/*<FontAwesome style={{color: color.primaryColor,fontSize:17,textAlign:'center'}} name="edit"></FontAwesome>*/}
        <Text
          style={{
            color: color.primaryColor,
            fontSize: 18,
            fontFamily: FontFamily.Regular,
          }}
        >
          Edit
        </Text>
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});
export default ProfilePageHeader;
