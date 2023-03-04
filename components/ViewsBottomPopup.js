import React, { Component, useState } from "react";
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

const ViewsBottomPopup = props => {
  const [background, setBackground] = useState("rgba(255,255,255,0)");

  const onClose = () => {
    setTimeout(function() {
      props.actionHide();
    }, 100);
    setBackground("rgba(255,255,255,0)");
  };

  return (
    <Modal
      animationType="slide"
      transparent={true}
      visible={props.visible}
      onShow={() => {
        setTimeout(function() {
          setBackground("rgba(0,0,0,0.2)");
        }, 100);
      }}
      onDismiss={() => {
        setBackground("rgba(255,255,255,0)");
      }}
    >
      <TouchableOpacity
        style={[styles.bottomModal, { backgroundColor: background }]}
        activeOpacity={1}
        onPressOut={onClose}
      >
        <View>
          <View style={styles.modalContent}>
            <TouchableOpacity onPress={onClose}>
              <Ionicons
                style={styles.modalCloseIcon}
                name="ios-close"
                size={32}
                color="red"
              />
              <Text style={[styles.modalContentList, styles.modalCloseList]}>
                FILTER
              </Text>
            </TouchableOpacity>

            <List.Item
              onPress={() => {
                onClose();
                requestAnimationFrame(() => {
                  props.filter(1);
                });
              }}
              style={styles.modalContentList}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Regular,
                color: color.blackColor
              }}
              title="What's hot"
              left={props => (
                <Image
                  resizeMode="contain"
                  style={styles.modalListImage}
                  source={require("../assets/images/hot.png")}
                />
              )}
            />
            <List.Item
              onPress={() => {
                onClose();
                requestAnimationFrame(() => {
                  props.filter(2);
                });
              }}
              style={[styles.modalContentList, styles.firstListItem]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Regular,
                color: color.blackColor
              }}
              title="What's new"
              left={props => (
                <Image
                  style={styles.modalListImage}
                  source={require("../assets/images/new.png")}
                />
              )}
            />
            <List.Item
              onPress={() => {
                onClose();
                requestAnimationFrame(() => {
                  props.filter(3);
                });
              }}
              style={[styles.modalContentList, styles.firstListItem]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Regular,
                color: color.blackColor
              }}
              title="Unanswered"
              left={props => (
                <Image
                  resizeMode="cover"
                  style={styles.modalListImage}
                  source={require("../assets/images/unanswered.png")}
                />
              )}
            />
            <List.Item
              onPress={() => {
                onClose();
                requestAnimationFrame(() => {
                  props.filter(4);
                });
              }}
              style={[styles.modalContentList, styles.firstListItem]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Regular,
                color: color.blackColor
              }}
              title="My discussions"
              left={props => (
                <Image
                  resizeMode="center"
                  style={styles.modalListImage}
                  source={require("../assets/images/mydiscussion.png")}
                />
              )}
            />
          </View>
        </View>
      </TouchableOpacity>
    </Modal>
  );
};

const styles = StyleSheet.create({
  bottomModal: {
    justifyContent: "flex-end",
    flex: 1,
    alignItems: "stretch"
  },
  modalContent: {
    backgroundColor: "#fff"
    // height:Dimensions.get('window').height/2.5,
  },
  modalContentList: {
    padding: 5,
    borderTopWidth: 1,
    borderColor: "#e8e8e8"
  },
  modalCloseList: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    fontSize: 12,
    paddingTop: 10,
    paddingBottom: 10,
    textAlign: "center"
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

export default ViewsBottomPopup;
