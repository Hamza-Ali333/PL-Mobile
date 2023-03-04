import React from "react";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { Video } from "expo-av";

import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import { _handleOfferWatched } from "./CombineFunction";


class OfferLock extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    }
  }

  render() {

    return (
        <View style={{backgroundColor: color.lightGrayColor,height: 250,marginTop: 13,alignItems: 'center',justifyContent: 'center'}}>
          
                 <Image  style={{width: 60,resizeMode: 'contain'}} source={require("../assets/images/offer-lock.png")} />
             
            </View>
    );
  }
}

const styles = StyleSheet.create({});

export default OfferLock;
