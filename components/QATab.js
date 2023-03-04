import React, { Component } from "react";
import { View,Text, StyleSheet, TouchableOpacity } from 'react-native';
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import QuestionDescription from "./QuestionDescription";
import JobIconsFoot from "./JobIconsFoot";
import InputPhoto from "./InputPhoto";


class QATab extends Component {
   render() {
    return (
        <View style={styles.QATab}>
          <Text style={{textAlign:'center'}}>Q & A Tabs</Text>
        </View>
     );
  }
}



const styles = StyleSheet.create({
  QATab:{
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:10,
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
});


export default QATab;