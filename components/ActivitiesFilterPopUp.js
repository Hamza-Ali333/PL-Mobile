import React, { Component, useState } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  SafeAreaView,
  Modal,
  Dimensions,
  Button
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Ionicons } from "@expo/vector-icons";
import { List,  Checkbox } from "react-native-paper";

class ActivitiesFilterPopUp extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setModalVisible: false,
      checked: 1
    };
  }

  componentDidMount() {
    this.setState({ checked: this.props._notify_type });
  }

  handleChange = value => {
    let { checked } = this.state;
    checked = value;

    this.setState({ checked });
    this.props._applyFilter(checked);
  };

  render() {

    const { setModalVisible,checked  } = this.state;
    return (
      <View>
        
        <Modal
            animationType="slide"
            transparent={true}
            visible={this.props._show}>
            <View style={styles.leadboardModal}>
              <TouchableOpacity style={styles.modalCloseIcon}
               onPress={this.props._showHideComponent}>
                <Ionicons
                  name="ios-close"
                  size={48}
                  color={color.primaryColor}/>
              </TouchableOpacity>
              <View style={styles.leadboardModalContent}>
                 <View style={{margin:15}}>
                    <Text style={styles.popUpHeading}>Activities</Text>
                    <List.Item
                    onPress={() => this.handleChange(1)}
                    style={styles.BottomOptionListItems}
                    titleStyle={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: "#7B7B7B"
                      }}
                    title="All"
                    right={props => (
                      <Checkbox
                        status={checked === 1 ? "checked" : ""}
                        color={color.primaryColor}
                        style={styles.TopicPageCheckboxes}
                      />
                    )}
                  />
                  <List.Item
                    onPress={() => this.handleChange(2)}
                    style={styles.BottomOptionListItems}
                    titleStyle={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: "#7B7B7B"
                      }}
                    title="Likes"
                    right={props => (
                      <Checkbox
                        status={checked === 2 ? "checked" : ""}
                        color={color.primaryColor}
                        style={styles.TopicPageCheckboxes}
                      />
                    )}
                  />
                  <List.Item
                    onPress={() => this.handleChange(3)}
                    style={styles.BottomOptionListItems}
                    titleStyle={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: "#7B7B7B"
                      }}
                    title="Answers"
                    right={props => (
                      <Checkbox
                        status={checked === 3 ? "checked" : ""}
                        color={color.primaryColor}
                        style={styles.TopicPageCheckboxes}
                      />
                    )}
                  />
                  <List.Item
                    onPress={() => this.handleChange(4)}
                    style={styles.BottomOptionListItems}
                    titleStyle={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: "#7B7B7B"
                      }}
                    title="Comments"
                    right={props => (
                      <Checkbox
                        status={checked === 4 ? "checked" : ""}
                        color={color.primaryColor}
                        style={styles.TopicPageCheckboxes}
                      />
                    )}
                  />
                  <List.Item
                    onPress={() => this.handleChange(5)}
                    style={styles.BottomOptionListItems}
                    titleStyle={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: "#7B7B7B"
                      }}
                    title="Followers"
                    right={props => (
                      <Checkbox
                        status={checked === 5 ? "checked" : ""}
                        color={color.primaryColor}
                        style={styles.TopicPageCheckboxes}
                      />
                    )}
                  />



                  </View>
              </View>
            </View>
          </Modal>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerPageTitle:{
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 17,
    marginLeft: 15
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
  popUpHeading:{
    fontSize: 20,
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    marginBottom:20,
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    margin: 0,
    paddingTop: 3,
    paddingBottom: 3,
    paddingLeft: 0,
    paddingRight: 0,
  },
  TopicPageCheckboxes: {
    marginRight: 20
  },
  modalCloseIcon: {
    lineHeight: 28,
    position: "absolute",
    right: 5,
    top: 20,
    zIndex: 111,
    width: 40,
    alignItems: "center",
  }
});
export default ActivitiesFilterPopUp;
