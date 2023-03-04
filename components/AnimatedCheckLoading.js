import React, { Component } from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import PercentageCircle from 'react-native-percentage-circle';

class AnimatedCheckLoading extends React.Component {
    render() {
      return (
         <View style={{backgroundColor: '#DFE4EB',borderRadius: 4,width:80,height:80,alignItems: 'center',justifyContent: 'center' }}>
          <PercentageCircle radius={35} percent={70} color={"#9DA4B4"}>
            <Image style={{width:25,height:25}} source={require("../assets/images/CrossLoader.png")} />
            {/*<Image style={{width:30,height:30}} source={require("../assets/images/CheckLoader.png")} />*/}
          </PercentageCircle>  
        </View>
      );
  }
};

const styles = StyleSheet.create({
});

export default AnimatedCheckLoading;

