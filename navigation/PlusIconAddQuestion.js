import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Modal,
  Button,
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Ionicons } from "@expo/vector-icons";
import { List, Checkbox } from "react-native-paper";

class PlusIconAddQuestion extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      ModalVisible: false,
      checked: true,
    };
  }
  navigate = () => {
    this.props.navigationProps.navigate("PostQuestion");
  };

  _FeedSearchFilterScreen = () => {
    this.props.navigationProps.navigate("FeedSearchFilterScreen");
  };

  showModal = () => this.setState({ ModalVisible: true });
  hideModal = () => this.setState({ ModalVisible: false });
  render() {
    const { ModalVisible, checked } = this.state;
    return (
      <View>
        <View>
          <TouchableOpacity
            style={{
              marginRight: 15,
              alignItems: "flex-end",
              justifyContent: "center",
            }}
            onPress={this._FeedSearchFilterScreen}
          >
            <Image
              style={{ width: 20, height: 20, resizeMode: "contain" }}
              source={require("../assets/images/searchColor.png")}
            />
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 17,
    marginLeft: 15,
  },
  leadboardModal: {
    backgroundColor: "rgba(226, 226, 226, .75)",
    flex: 1,
    flexDirection: "column",
    paddingTop: "6%",
    paddingLeft: "3%",
    paddingRight: "3%",
    zIndex: 11111,
    // height:Dimensions.get('window').height,
  },
  leadboardModalContent: {
    flex: 1,
    backgroundColor: "#fff",
    width: "85%",
    borderRadius: 24,
    padding: 15,
    zIndex: 111,
  },
  popUpHeading: {
    fontSize: 20,
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    marginBottom: 20,
  },
  BottomOptionListItems: {
    margin: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 0,
    paddingRight: 0,
  },
  TopicPageCheckboxes: {
    marginRight: 20,
  },
  modalCloseIcon: {
    lineHeight: 28,
    position: "absolute",
    right: 5,
    top: 20,
    zIndex: 111,
    width: 40,
    alignItems: "center",
  },
});
export default PlusIconAddQuestion;
