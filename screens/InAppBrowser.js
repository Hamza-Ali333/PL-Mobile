import React from "react";
import {
  StyleSheet,
} from "react-native";
import ReaderView from "react-native-reader";

class InAppBrowser extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
        <ReaderView url={this.props.navigation.getParam("url")} title={this.props.navigation.getParam("title")} />
    );
  }
}

const styles = StyleSheet.create({});

export default InAppBrowser;