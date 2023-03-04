import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";

class ViewAnswer extends React.Component {
  constructor(props) {
    super(props);
  }

  navigateDetailPro = () => {
    this.props.navigateDetail(this.props);
  };

  render() {
    return (
      <View
        style={{
          flex: 1 / 3,
          flexDirection: "row",
          marginLeft: 10,
          justifyContent: "space-between",
        }}
      >
        {/* <TouchableOpacity>
          <Text
            style={{
              color: color.grayColor,
              fontFamily: FontFamily.Regular,
              fontSize: 12,
            }}>
            {this.props.item.likes.paginatorInfo.total} likes
          </Text>
        </TouchableOpacity>
        <TouchableOpacity>
          <Text
            style={{
              color: color.blackColor,
              fontFamily: FontFamily.Regular,
              fontSize: 12,
      
            }}
          >
            {this.props.item.dislikes.paginatorInfo.total} dislikes
          </Text>
        </TouchableOpacity>
        
          <Text
            style={{
              color: color.grayColor,
              fontFamily: FontFamily.Regular,
              fontSize: 12,
            }}>
          {this.props.item.answers.paginatorInfo.total}
          {" "}{this.props.item.answers.paginatorInfo.total>1? "answers" : "answer"}
          </Text>
          */}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default ViewAnswer;
