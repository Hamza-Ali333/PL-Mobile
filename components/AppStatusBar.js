import React from "react";
import { View, StyleSheet, Platform, StatusBar } from "react-native";

class AppStatusBar extends React.Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={[{height:this.props.height, backgroundColor:this.props.backgroundColor }]}>
        <StatusBar
          translucent={true}
          {...this.props}
        />
      </View>
    );
  }
}


export default AppStatusBar;
