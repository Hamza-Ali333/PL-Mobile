import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  PlaceholderContainer,
  Placeholder,
} from "react-native-loading-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import SkeletonLinear from "./SkeletonLinear";
import gstyles from "../../constants/gstyles";

class Classes extends Component {
  render() {
    return (
      <PlaceholderContainer
        style={styles.placeholderContainer}
        duration={1000}
        animatedComponent={<SkeletonLinear />}
        delay={100}
        replace={true}
      >
        <View style={[gstyles.row, gstyles.justifyBetween]}>
          <Placeholder
            style={[
              styles.placeholder,
              {
                width: 150,
              },
            ]}
          ></Placeholder>
          <Placeholder
            style={[
              styles.placeholder,
              {
                width: 50,
              },
            ]}
          ></Placeholder>
        </View>
        <View style={styles.h_10} />
        <Placeholder
          style={[styles.placeholder, gstyles.w_full, { height: 150 }]}
        />
        <View style={gstyles.h_10} />
        <Placeholder style={[styles.placeholder, gstyles.w_full]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, { width: 150 }]} />
      </PlaceholderContainer>
    );
  }
}

const styles = StyleSheet.create({
  placeholderContainer: {
    padding: 10,
  },
  placeholder: {
    height: 8,
    marginTop: 6,
    alignSelf: "flex-start",
    justifyContent: "center",
    backgroundColor: "#eeeeee",
    borderRadius: 10,
  },
});
export default Classes;
