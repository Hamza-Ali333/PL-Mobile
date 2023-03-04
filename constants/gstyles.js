import { StyleSheet } from "react-native";
import Colors from "./Colors";
import FontFamily from "./FontFamily";

const gstyles = StyleSheet.create({
  primaryBtn: {
    backgroundColor: Colors.primaryColor,
    paddingVertical: 10,
    paddingHorizontal: 50,
    borderRadius: 8,
  },
  primaryBtnTxt: {
    color: Colors.whiteColor,
    fontFamily: FontFamily.Regular,
  },
  flex_1: {
    flex: 1,
  },
  row: {
    flexDirection: "row",
  },
  itemsCenter: {
    alignItems: "center",
  },
  justifyCenter: {
    justifyContent: "center",
  },
  justifyBetween: {
    justifyContent: "space-between",
  },
  w_full: {
    width: "100%",
  },
  w_full_50: {
    width: "50%",
  },
  w_5: {
    width: 5,
  },
  w_10: {
    width: 10,
  },
  w_30: {
    width: 30,
  },
  h_5: {
    height: 5,
  },
  h_10: {
    height: 10,
  },
  h_20: {
    height: 20,
  },
  h_40: {
    height: 40,
  },
  rounded_full: {
    borderRadius: 999,
  },
  rounded_10: {
    borderRadius: 10,
  },
});

export default gstyles;
