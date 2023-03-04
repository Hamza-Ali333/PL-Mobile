import React from "react";
import {
  Button,
  Platform,
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import InputPhoto from "./InputPhoto";

class FeedTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      me: [],
      status: true,
    };
  }

  navigateDetail = () => {
    requestAnimationFrame(() => {
      if (this.props.tab == 1) {
        this.props.navigation.navigate("NotificationAnswer", {
          id: this.props.item.id,
        });
      } else {
        this.props.navigation.navigate("NotificationAnswer", {
          answer_id: this.props.item.id,
          id: this.props.item.questions.id,
        });
      }
    });
  };

  render() {
    if (this.state.status) {
      return (
        <View
          style={{ backgroundColor: "#fff", paddingLeft: 15, paddingRight: 15 }}
        >
          <View style={[styles.tabQuestionContainer, this.props.style]}>
            <TouchableOpacity onPress={this.navigateDetail}>
              <Text style={styles.tabQuestion}>
                {this.props.tab == 1
                  ? this.props.item.question
                  : this.props.item.answer}
              </Text>
            </TouchableOpacity>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                marginTop: 10,
              }}
            >
              <View style={{ flexDirection: "row" }}>
                <TouchableOpacity onPress={this.navigateDetail}>
                  <Text
                    style={{
                      marginRight: 20,
                      color: color.blackColor,
                      fontSize: 14,
                      fontFamily: FontFamily.Regular,
                    }}
                  >
                    {this.props.tab == 1
                      ? this.props.item.answers.paginatorInfo.total
                      : this.props.item.comments.paginatorInfo.total}
                    {this.props.tab == 1 ? " answers" : " comments"}
                  </Text>
                </TouchableOpacity>
                <Text
                  style={{
                    marginRight: 20,
                    color: color.grayColor,
                    fontSize: 14,
                    fontFamily: FontFamily.Regular,
                  }}
                ></Text>
              </View>
            </View>
            <TouchableOpacity customeType={true} onPress={this.navigateDetail}>
              <View
                style={{
                  flexDirection: "row",
                  alignContent: "stretch",
                  height: 40,
                  marginTop: 10,
                }}
              >
                <View style={{ flex: 1, alignSelf: "center" }}>
                  <View style={{ position: "relative" }}>
                    <View style={styles.footAnswerInput}>
                      <InputPhoto item={this.props.me} />
                      <View style={styles.submitButton}>
                        <Image
                          style={{
                            width: 28,
                            height: 28,
                            resizeMode: "contain",
                          }}
                          source={require("../assets/images/send.png")}
                        />
                      </View>
                    </View>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>
      );
    } else {
      return null;
    }
  }
}

const styles = StyleSheet.create({
  tabQuestionContainer: {
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderColor: "#C4C4C4",
    paddingTop: 13,
    paddingBottom: 13,
  },
  tabQuestion: {
    fontSize: 14,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
  },
  footAnswerInput: {
    backgroundColor: "#f6f6f6",
    paddingTop: 7,
    paddingBottom: 7,
    borderRadius: 20,
    paddingLeft: 50,
    height: 40,
    borderWidth: 1,
    borderColor: "#CCD0D9",
  },
  submitButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 2,
    top: 1,
    width: 36,
    height: 36,
    borderRadius: 30,
    backgroundColor: color.primaryColor,
  },
});

export default FeedTab;
