import { StyleSheet } from "react-native";

export default StyleSheet.create({
  container: {
    //backgroundColor: "#fff",
    //width: 300
  },
  textContainer: {
    alignSelf: "stretch",
    position: "relative",
    minHeight: 40,
    maxHeight: 140
  },
  input: {
    fontSize: 16,
    color: "#000",
    fontWeight: "400",
    paddingHorizontal: 20,
    minHeight: 40,
    position: "absolute",
    top: 0,
    color: "transparent",
    alignSelf: "stretch",
    width: "100%"
  },
  formmatedTextWrapper: {
    minHeight: 40,
    position: "absolute",
    top: 0,
    paddingHorizontal: 20,
    paddingVertical: 5,
    width: "100%"
  },
  formmatedText: {
    fontSize: 16,
    fontWeight: "400"
  },
  mention: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#FF8635",
    backgroundColor:'#FFFFFF',
  },
  placeholderText: {
    color: "#9DA4B4",
    fontSize: 16
  },
});