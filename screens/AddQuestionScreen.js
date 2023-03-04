import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import AddQuestionHeadRight from "../components/AddQuestionHeadRight";

class AddQuestionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
    };
  }

  render() {
    const { checked } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View style={{ marginBottom: 30 }}>
          <Text style={styles.dateRangeText}>Description</Text>
          <View style={{}}>
            <TextInput
              style={styles.awardTextInput}
              placeholder="20 USD GIFT CA"
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.dateRangeText}>Question 1</Text>
          <View style={{}}>
            <TextInput
              multiline
              style={styles.awardTextInput}
              value="Whatever throwing we on resolved entrance together graceful.Estate was tended ten boy nearer seemed?"
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.dateRangeText}>Question 2</Text>
          <View style={{}}>
            <TextInput
              multiline
              style={styles.awardTextInput}
              value="Whatever throwing we on resolved entrance together graceful."
            />
          </View>
        </View>
        <View style={{ marginTop: 20 }}>
          <Text style={styles.dateRangeText}>Question 3</Text>
          <View style={{}}>
            <TextInput
              style={styles.awardTextInput}
              placeholder="Type your question here..."
            />
          </View>
        </View>
        <TouchableOpacity style={{ marginTop: 25, alignItems: "center" }}>
          <Text style={styles.addQuestionText}>
            <AntDesign name="plus" size={18} color={color.primaryColor} />
            Add question
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

AddQuestionScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    shadowOpacity: 0,
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <Text style={styles.postQuestionPageTitle}>Add questions</Text>
  ),
  headerRight: () => <AddQuestionHeadRight {...screenProps} />,
});

const styles = StyleSheet.create({
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  postText: {
    padding: 10,
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 15,
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
  },
  BottomOptionImage: {
    width: 24,
    height: 24,
    marginTop: 5,
    marginRight: 8,
    marginLeft: 8,
  },
  bottomModal: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "stretch",
  },
  modalContent: {
    backgroundColor: "#fff",
    // height:Dimensions.get('window').height/2.5,
  },
  modalListItemIcons: {
    width: 20,
    height: 20,
    marginTop: 8,
    marginRight: 5,
    marginLeft: 5,
  },
  modalCloseList: {
    color: color.blackColor,
    textAlign: "center",
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalCloseIcon: {
    alignContent: "flex-end",
    position: "absolute",
    right: 15,
    top: 5,
    zIndex: 1,
  },
  dateRangeText: {
    fontSize: 20,
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    marginBottom: 10,
  },
  dateFromText: {
    fontSize: 17,
    fontFamily: FontFamily.Regular,
    color: "#929292",
  },
  awardTextInput: {
    borderColor: "#bfbfbf",
    padding: 13,
    color: color.blackColor,
    fontSize: 16,
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
  },
  addQuestionText: {
    color: color.primaryColor,
    fontSize: 18,
  },
});

export default AddQuestionScreen;
