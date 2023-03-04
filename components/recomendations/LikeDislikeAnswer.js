import React from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import { AntDesign } from "@expo/vector-icons";
import getNotificationAnswer from "../../graphql/queries/getNotificationAnswer";

class LikeDislikeAnswer extends React.Component {
  constructor(props) {
    super(props);
  }

  navigateDetail = () => {
    if (typeof this.props.navigateDetail !== "undefined") {
      this.props.navigateDetail(this.props);
    }
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        {this.props.navigateDetail && (
          <TouchableOpacity onPress={this.navigateDetail}>
            <Text style={styles.ReplyText}>Comment</Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  ReplyText: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    marginTop: 15,
  },
});

export default LikeDislikeAnswer;
