import React, { Component } from "react";
import { View, TouchableOpacity, Text, StyleSheet, Image } from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { Colors } from "react-native/Libraries/NewAppScreen";

class GroupMenu extends React.Component {
  FeedSearchFilterScreen = (props) => {
    this.props.navigation.navigate("ComposeMessage");
  };
  render() {
    return (
      <TouchableOpacity
        style={{
          alignItems: "center",
          justifyContent: "center",
          backgroundColor: color.lightGrayColor,
          width: 35,
          height: 35,
          borderRadius: 120,
          marginRight: 10,
        }}
        onPress={this.props.openMenu}
      >
        {/* <Image
          style={{ width: 20, height: 20, resizeMode: "contain" }}
          source={require("../assets/images/editColor.png")}
        /> */}
        <MaterialCommunityIcons
          name="dots-vertical"
          size={24}
          color={color.blackColor}
        />
      </TouchableOpacity>
    );
  }
}

const styles = StyleSheet.create({});
export default GroupMenu;

// import * as React from "react";
// import { View } from "react-native";
// import { Button, Menu, Divider, Provider } from "react-native-paper";

// const GroupMenu = () => {
//   const [visible, setVisible] = React.useState(true);

//   const openMenu = () => setVisible(true);

//   const closeMenu = () => setVisible(false);

//   return (
//     <Provider>
//       <View
//         style={{
//           //   paddingTop: 50,
//           flexDirection: "row",
//           justifyContent: "center",
//           borderWidth: 1,
//           height: 100,
//         }}
//       >
//         <Menu
//           visible={visible}
//           onDismiss={closeMenu}
//           anchor={<Button onPress={openMenu}>Show menu</Button>}
//         >
//           <Menu.Item onPress={() => {}} title="Item 1" />
//           <Menu.Item onPress={() => {}} title="Item 2" />
//           <Divider />
//           <Menu.Item onPress={() => {}} title="Item 3" />
//         </Menu>
//       </View>
//     </Provider>
//   );
// };

// export default GroupMenu;
