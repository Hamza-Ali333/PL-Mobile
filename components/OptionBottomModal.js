import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  View,
  Modal,
  Button,
  Dimensions,
  Image
} from "react-native";
import { List } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";

const OptionBottomModal = props => {
  return (
    <Modal animationType="fade" transparent={true} visible={props.visible}>
      <View style={styles.bottomModal}>
        <View style={styles.modalContent}>
          <TouchableOpacity>
            <Ionicons
              style={styles.modalCloseIcon}
              name="ios-close"
              size={32}
              color="red"
            />
          </TouchableOpacity>
          <Text
            style={[styles.modalContentList, styles.modalCloseList]}
            onPress={props.actionHide}
          >
            Cancel
          </Text>
        
          <List.Item
            onPress={props.confirmDelete}
            style={styles.modalContentList}
            titleStyle={{
              fontSize: 16,
              fontFamily: FontFamily.Regular,
              color: color.blackColor
            }}
            title="Delete"
            left={props => <Ionicons name="ios-trash" color="red" size={24} />}
          />
          
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.4)",
    alignItems: "stretch"
  },
  modalContent: {
    backgroundColor: "#fff"
    // height:Dimensions.get('window').height/2.5,
  },
  modalContentList: {
    padding: 5,
    borderTopWidth: 1,
    borderColor: "#e8e8e8",
    textAlign: "center"
  },
  modalCloseList: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10
  },
  modalCloseIcon: {
    alignContent: "flex-end",
    position: "absolute",
    right: 15,
    top: 2
  },
  modalListImage: {
    margin: 10,
    width: 26,
    height: 26
  }
});

export default OptionBottomModal;
