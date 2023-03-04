import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Share,
  Platform,
} from "react-native";
import link from "../constants/link";
import { Entypo } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";

let Buffer = require("buffer").Buffer;

const ShareComponent = (props) => {
  const item = props.item;

  const onShare = async () => {
    let routeName = "";

    if (item?.data_type === "EVENT" || item?.data_type === "PAST_EVENT") {
      routeName = "event";
    }

    if (item?.data_type === "PRODUCT") {
      routeName = "product";
    }
    if (
      item?.data_type === "COURSE" &&
      (item.is_training === "0" || item.is_training === "1")
    ) {
      routeName = "classes";
    }

    let encodedId = new Buffer(item.id).toString("base64");

    try {
      const result = await Share.share({
        message: `${link.shareUrl}/share/${routeName}/${item.id}`,
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <View
      style={styles.JobContainer}
      onLayout={(event) => {
        props.setTab3Height(event.nativeEvent.layout.height);
      }}
    >
      <View style={{ height: 30 }} />
      <TouchableOpacity onPress={onShare} style={styles.fillBtn}>
        <Entypo name="share" size={24} color={color.whiteColor} />
        <Text style={styles.fillBtnText}>Share</Text>
      </TouchableOpacity>
    </View>
  );
};
export default ShareComponent;

const styles = StyleSheet.create({
  JobContainer: {
    backgroundColor: "#fff",
    margin: 10,
    borderColor: "#CCCFD6",
  },

  fillBtn: {
    marginBottom: 13,
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  fillBtnText: {
    color: "#fff",
    fontFamily: FontFamily.Medium,
    fontSize: 18,
  },
});
