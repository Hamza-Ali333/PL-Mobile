import { StyleSheet } from "react-native";
import colors from "../../constants/Colors";
import { Dimensions } from "react-native";

const windowWidth = Dimensions.get("window").width;

const styles = StyleSheet.create({
  ImagesGrid: {
    flexDirection: "row",
    marginLeft: -10,
    marginRight: -10,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  arrayImagesGrid: {
    flex: 1,
    minWidth: "49%",
    paddingRight: 2,
    paddingBottom: 2,
  },
  ImagesGridphoto: {
    flex: 1,
    width: "100%",
    aspectRatio: 2 / 2,
    borderRadius: 4,
    resizeMode: "cover",
  },
  Lightbox: {
    flex: 1,
    marginRight: 5,
    backgroundColor: colors.lightGray,
    borderRadius: 6,
  },
  close: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
});

export default styles;
