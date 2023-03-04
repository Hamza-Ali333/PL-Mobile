import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  PlaceholderContainer,
  Placeholder,
} from "react-native-loading-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import SkeletonLinear from "./SkeletonLinear";
import gstyles from "../../constants/gstyles";

class ClassDetail extends Component {
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
          style={[styles.placeholder, gstyles.h_40, gstyles.w_full]}
        />
        <View style={gstyles.h_10} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full_50]} />
        <View style={gstyles.h_10} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full_50]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, { width: 220 }]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, { width: 250 }]} />
        <View style={gstyles.h_10} />
        <View style={gstyles.row}>
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.h_40,
              gstyles.flex_1,
              gstyles.rounded_full,
            ]}
          />
          <View style={gstyles.w_10} />
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.h_40,
              gstyles.flex_1,
              gstyles.rounded_full,
            ]}
          />
        </View>
        <View style={gstyles.h_10} />
        <Placeholder
          style={[
            styles.placeholder,
            gstyles.flex_1,
            gstyles.rounded_10,
            gstyles.w_full,
            ,
            { height: 150 },
          ]}
        />
        <View style={gstyles.h_10} />
        <View style={gstyles.row}>
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.h_10,
              gstyles.flex_1,
              gstyles.rounded_full,
            ]}
          />
          <View style={gstyles.w_10} />
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.h_10,
              gstyles.flex_1,
              gstyles.rounded_full,
            ]}
          />
          <View style={gstyles.w_10} />
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.h_10,
              gstyles.flex_1,
              gstyles.rounded_full,
            ]}
          />
        </View>
        <View style={gstyles.h_10} />
        <View style={gstyles.h_10} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full_50]} />
        <View style={gstyles.h_10} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full_50]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, { width: 220 }]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, { width: 250 }]} />
        <View style={gstyles.h_10} />
        <View style={gstyles.h_10} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full_50]} />
        <View style={gstyles.h_10} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, gstyles.w_full_50]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, { width: 220 }]} />
        <View style={gstyles.h_5} />
        <Placeholder style={[styles.placeholder, { width: 250 }]} />
        <View style={gstyles.h_10} />
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
export default ClassDetail;
