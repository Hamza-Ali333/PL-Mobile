import PropTypes from "prop-types";
import React from "react";
import {
  View,
  WebView,
  Image,
  Linking,
  Platform,
  StyleSheet,
  TouchableOpacity,
  ViewPropTypes,
} from "react-native";
// import { Actions } from "react-native-router-flux";
import Lightbox from "react-native-lightbox";
import Colors from "../constants/Colors";

export default class CustomView extends React.Component {
  renderPdf() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        onPress={() => {
          Linking.openURL(
            `https://docs.google.com/viewerng/viewer?url=${this.props.currentMessage.pdf}`
          );
        }}
      >
        <Image
          {...this.props.imageProps}
          style={[styles.image, this.props.imageStyle]}
          source={{
            uri: this.props.filePath,
          }}
        />
      </TouchableOpacity>
    );
  }

  renderHtml() {
    return (
      <TouchableOpacity
        style={[styles.container, this.props.containerStyle]}
        // onPress={() => {
        //   Actions.chat_html({ properties: this.props.currentMessage });
        // }}
      >
        <Image
          {...this.props.imageProps}
          style={[styles.image, this.props.imageStyle]}
          source={{ uri: this.props.currentMessage.template_image }}
        />
      </TouchableOpacity>
    );
  }

  render() {
    if (this.props.currentMessage.file_type == "pdf") {
      return this.renderPdf();
    } else if (
      this.props.currentMessage.template &&
      this.props.currentMessage.template != "none"
    ) {
      return this.renderHtml();
    }
    return null;
  }
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.primaryColor,
  },
  mapView: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
  },
  image: {
    width: 150,
    height: 100,
    borderRadius: 13,
    margin: 3,
    resizeMode: "cover",
  },
  webview: {
    flex: 1,
  },
  imageActive: {
    flex: 1,
    resizeMode: "contain",
  },
});

CustomView.defaultProps = {
  mapViewStyle: {},
  currentMessage: {
    image: null,
    file_type: null,
    template: null,
    template_html: null,
  },
  containerStyle: {},
  imageStyle: {},
};

CustomView.propTypes = {
  currentMessage: PropTypes.object,
  containerStyle: ViewPropTypes.style,
  mapViewStyle: ViewPropTypes.style,
  imageStyle: Image.propTypes.style,
  imageProps: PropTypes.object,
};
