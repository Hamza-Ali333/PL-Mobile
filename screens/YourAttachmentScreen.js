import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Checkbox } from "react-native-paper";
import VideoAttachmentHeader from "../components/VideoAttachmentHeader";
import YourAttachmentVideoHeadRight from "../components/YourAttachmentVideoHeadRight";

class YourAttachmentScreen extends React.Component {
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
          alignItems: "center",
        }}
      >
        <View style={{ flex: 1 / 6, justifyContent: "center" }}>
          <Text
            style={{
              fontFamily: FontFamily.Medium,
              color: "#3C3C43",
              fontSize: 18,
            }}
          >
            Attach a file to your offer
          </Text>
        </View>
        <TouchableOpacity
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          <Image
            style={{ width: 55, height: 55, resizeMode: "contain" }}
            source={require("../assets/images/AddQuestionColor.png")}
          />
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: "#A0A0A0",
              fontSize: 13,
              marginTop: 10,
            }}
          >
            .doc; .xls; .ppt;
          </Text>
        </TouchableOpacity>
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            flex: 1 / 5,
          }}
        >
          <View
            style={{
              borderWidth: 1,
              borderColor: color.primaryColor,
              height: 35,
              width: 35,
              borderRadius: 4,
            }}
          >
            <Checkbox
              color={color.primaryColor}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                this.setState({ checked: !checked });
              }}
            />
          </View>
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: "#3C3C43",
              fontSize: 13,
              marginLeft: 10,
            }}
          >
            I forbid to use my attacment
          </Text>
        </View>
      </View>
    );
  }
}

YourAttachmentScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <VideoAttachmentHeader {...screenProps} />,
  headerRight: () => <YourAttachmentVideoHeadRight {...screenProps} />,
});

const styles = StyleSheet.create({
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginLeft: 15,
    marginRight: 5,
  },
  touchRightHeadText: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  postText: {
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
});

export default YourAttachmentScreen;
