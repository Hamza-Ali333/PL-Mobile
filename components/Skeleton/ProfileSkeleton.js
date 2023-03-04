import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  PlaceholderContainer,
  Placeholder,
} from "react-native-loading-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import SkeletonLinear from "./SkeletonLinear";
import gstyles from "../../constants/gstyles";

class ProfileSkeleton extends Component {
  render() {
    return (
      <PlaceholderContainer
        style={styles.placeholderContainer}
        duration={1000}
        animatedComponent={<SkeletonLinear />}
        delay={100}
        replace={true}
      >
        <Placeholder
          style={[
            styles.placeholder,
            gstyles.rounded_10,
            gstyles.w_full,
            {
              height: 220,
            },
          ]}
        />
        <View
          style={[{ marginTop: -50, marginLeft: 20 }, gstyles.justifyCenter]}
        >
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.rounded_full,
              {
                width: 120,
                height: 8,
                backgroundColor: "white",
              },
            ]}
          />
          <View style={gstyles.h_10} />
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.rounded_full,
              {
                width: 70,
                height: 6,
                backgroundColor: "white",
              },
            ]}
          />
          <View style={gstyles.h_10} />
        </View>
      </PlaceholderContainer>
    );
  }
}

const styles = StyleSheet.create({
  placeholderContainer: {
    paddingHorizontal: 10,
    paddingVertical: 5,
  },
  placeholder: {
    height: 10,
    backgroundColor: "#eeeeee",
    borderRadius: 10,
  },
});
export default ProfileSkeleton;
