import React, { Component } from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";
import color from "../constants/Colors.js";

class HumburgerIcon extends React.Component {
  toggleDrawer = () => {
    this.props.navigationProps.toggleDrawer();
  };
  render() {
    return (
      <TouchableOpacity
        style={{
          flexDirection: "column",
          height: 40,
          justifyContent: "center",
        }}
        onPress={this.toggleDrawer.bind(this)}
      >
        <Image
          style={styles.HumburgerIcon}
          source={require("../assets/images/Hamburger.png")}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  HumburgerIcon: {
    marginLeft: 20,
    width: 22,
    height: 22,
  },
});
export default HumburgerIcon;
