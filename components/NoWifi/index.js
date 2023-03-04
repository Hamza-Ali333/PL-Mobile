import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import LottieView from "lottie-react-native";
import { TouchableOpacity } from "react-native-gesture-handler";
import Colors from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import gstyles from "../../constants/gstyles";

class NoWifi extends Component {
  render() {
    return (
      <View
        style={[gstyles.flex_1, gstyles.itemsCenter, gstyles.justifyCenter]}
      >
        <LottieView
          style={{
            width: "50%",
          }}
          source={require("../../assets/lottie/no_wifi.json")}
          autoPlay
          loop
        />

        <Text style={styles.BoldText}>No Internet Connection</Text>
        <Text style={styles.Text}>Could not connected to the network </Text>
        <Text style={styles.Text}>Please check and try again.</Text>
        <View style={gstyles.h_10} />
        <View style={gstyles.h_10} />
        <TouchableOpacity style={gstyles.primaryBtn} onPress={this.onPress}>
          <Text style={gstyles.primaryBtnTxt}>Retry</Text>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  primaryBtnTxt: {
    color: Colors.whiteColor,
    fontFamily: FontFamily.Regular,
  },
  BoldText: {
    color: Colors.blackColor,
    fontFamily: FontFamily.Medium,
    fontSize: 18,
  },
  Text: {
    color: Colors.grayColor,
    fontFamily: FontFamily.Regular,
  },
});
export default NoWifi;
