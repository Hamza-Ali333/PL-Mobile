import React, { Component } from "react";
import { LinearGradient } from "expo-linear-gradient";

class SkeletonLinear extends Component {
  render() {
    return (
      <LinearGradient
        colors={["#eeeeee", "#dddddd", "#eeeeee"]}
        start={{ x: 1.0, y: 0.0 }}
        end={{ x: 0.0, y: 0.0 }}
        style={{
          flex: 1,
          width: 120,
        }}
      />
    );
  }
}

export default SkeletonLinear;
