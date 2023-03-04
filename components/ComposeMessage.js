import React from "react";
import { TouchableOpacity, StyleSheet, Image } from "react-native";

class ComposeMessage extends React.Component {
  FeedSearchFilterScreen = (props) => {
    this.props.navigation.navigate("ComposeMessage");
  };
  render() {
    return (
      <TouchableOpacity
        style={{
          flex: 1,
          padding: 15,
          alignItems: "center",
          justifyContent: "center",
        }}
        onPress={this.FeedSearchFilterScreen}
      >
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain" }}
          source={require("../assets/images/editColor.png")}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});
export default ComposeMessage;
