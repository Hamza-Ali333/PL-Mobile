import React,{Component} from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";

class NewOfferHeadRight extends React.Component {
  FeedSearchFilterScreen =(props) =>{
    this.props.navigation.navigate("YourVideoScreen");
  }
  render() {
    return (
        <TouchableOpacity style={{flex:1,padding:10,alignItems: 'center',justifyContent: 'center'}}
         onPress={this.FeedSearchFilterScreen}>
            <Text style={styles.postText}>Next</Text>
        </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
});
export default NewOfferHeadRight;
