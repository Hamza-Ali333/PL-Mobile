import React, { Component } from "react";
import { View,Text,Image, StyleSheet, ImageBackground,Modal,TouchableOpacity } from 'react-native';
import { List} from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Ionicons } from "@expo/vector-icons";
import { Video } from 'expo-av';
import { Avatar,Badge } from "react-native-paper";



class HowItWorks extends Component {
   render() {
    return (
        <View style={styles.HowItWorksTab} >
          <View style={{flex: .2,justifyContent: 'center'}} >
          <Text style={{
                fontSize: 23,
                fontFamily: FontFamily.Bold,
                color: color.blackColor}}>
            More good stuff</Text>
          </View>
          <View style={{flex: 1}} >
            <View style={styles.stuffContainer} >
              <View style={{flex: 1,justifyContent:  'center' }}>
              <Text style={{
                  fontSize: 15,
                  fontFamily: FontFamily.Bold,
                  color: color.blackColor}}>
              Celebrate on August 27 with a birthday treat from us</Text>
              </View>
              <View style={{flex: 1,alignItems:'center',justifyContent:  'center'}}>
                <Image
                    source={require("../assets/images/topics.png")}
                  />
              </View>
            </View>
             <View style={styles.stuffContainer} >
               <View style={{flex: 1,alignItems:'center',justifyContent:  'center'}}>
                  <Image
                      source={require("../assets/images/topics.png")}
                    />
                </View>
                <View style={{flex: 1,justifyContent:  'center' }}>
                <Text style={{
                    fontSize: 15,
                    fontFamily: FontFamily.Bold,
                    color: color.blackColor}}>
                Celebrate on August 27 with a birthday treat from us</Text>
                </View>
            </View>
            <View style={styles.stuffContainer} >
              <View style={{flex: 1,justifyContent:  'center' }}>
              <Text style={{
                  fontSize: 15,
                  fontFamily: FontFamily.Bold,
                  color: color.blackColor}}>
              Celebrate on August 27 with a birthday treat from us</Text>
              </View>
              <View style={{flex: 1,alignItems:'center',justifyContent:  'center'}}>
                <Image
                    source={require("../assets/images/topics.png")}
                  />
              </View>
            </View>
          </View>
        </View>
     );
  }
}



const styles = StyleSheet.create({
  HowItWorksTab:{
    flex: 1,
    backgroundColor: '#fff',
    padding:10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  stuffContainer: {
    flex: 1,
    justifyContent: 'space-between',
    flexDirection: 'row',
  },
});


export default HowItWorks;