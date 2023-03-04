import React from "react";
import { View, Text, StyleSheet, Button } from "react-native";
import { Feather } from "react-native-paper";

class ConnectionLost extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center"
        }}
      >
        <Feather size={32} name="wifi-off" />
        <Text>No connection</Text>
        <Button title="Retry"  />
      </View>
    );
  }
}

export default ConnectionLost;
