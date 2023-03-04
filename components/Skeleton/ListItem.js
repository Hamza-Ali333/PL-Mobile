import React, { Component } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  PlaceholderContainer,
  Placeholder,
} from "react-native-loading-placeholder";
import { LinearGradient } from "expo-linear-gradient";
import SkeletonLinear from "./SkeletonLinear";
import gstyles from "../../constants/gstyles";

class ListItem extends Component {
  render() {
    return (
      <PlaceholderContainer
        style={styles.placeholderContainer}
        duration={1000}
        animatedComponent={<SkeletonLinear />}
        delay={100}
        replace={true}
      >
        <View style={[gstyles.row, gstyles.itemsCenter, gstyles.justifyCenter]}>
          <Placeholder
            style={[
              styles.placeholder,
              gstyles.rounded_full,
              {
                width: 60,
                height: 60,
              },
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
export default ListItem;
