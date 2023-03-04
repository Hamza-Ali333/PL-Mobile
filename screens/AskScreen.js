import React, { Component } from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { NavigationActions } from "react-navigation";
import { Ionicons } from "@expo/vector-icons";

class AskScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this.enableVisible);
    this.props.navigation.setParams({
      navigateToHome: this.navigateToHome,
    });
  }

  navigateToHome = () => {
    this.props.navigation.navigate("Home");
  };

  enableVisible = () => {
    this.setState({ visible: true });
  };

  newPost = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("NewPost");
  };

  RichEditorScreen = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("RichEditorScreen");
  };

  newOffer = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate(
      "Menu",
      {},
      NavigationActions.navigate({
        routeName: "NewOffers",
      })
    );
  };

  cancel = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("Home");
  };

  render() {
    return (
      <View style={{ flex: 1, alignItems: "center" }}>
        <View style={{ marginTop: 30 }}>
          <Text
            style={{
              fontSize: 24,
              fontFamily: FontFamily.Bold,
              color: color.blackColor,
              marginBottom: 10,
            }}
          >
            What would you like to post?
          </Text>
          <TouchableOpacity
            onPress={this.newPost}
            style={styles.profileGridItems}
          >
            <Image
              style={{ width: 28, height: 22, resizeMode: "contain" }}
              source={require("../assets/images/discussion.png")}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: FontFamily.Bold,
                color: color.blackColor,
                marginLeft: 10,
              }}
            >
              New discussion
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={this.newOffer}
            style={styles.profileGridItems}
          >
            <Image
              style={{ width: 28, height: 22, resizeMode: "contain" }}
              source={require("../assets/images/AllOffers.png")}
            />
            <Text
              style={{
                fontSize: 20,
                fontFamily: FontFamily.Bold,
                color: color.blackColor,
                marginLeft: 10,
              }}
            >
              New offer
            </Text>
          </TouchableOpacity>
        </View>

        {/* <Dialog
             dialogStyle={{ borderRadius: 24 }}
             onTouchOutside={() => {
               this.setState({ scaleAnimationDialog: false });
             }}
             onHardwareBackPress = {()=>{
               this.setState({ visible: false });
             }}
             width={0.7}
             visible={this.state.visible}
             dialogAnimation={new ScaleAnimation()}
             dialogTitle={<DialogTitle title={"What would you like to post? "} hasTitleBar={true} />}
           >
             <DialogContent>
               <List.Item style={{borderBottomWidth:1, borderBottomColor:color.lightGrayColor}} onPress={this.newPost} title="New discussion"  />
               <List.Item style={{borderBottomWidth:1, borderBottomColor:color.lightGrayColor}} onPress={this.newOffer} title="New offer" />
               <List.Item titleStyle={{color:'red', textAlign:'center'}} onPress={this.cancel} title="Cancel" />
             </DialogContent>
           </Dialog>*/}
      </View>
    );
  }
}
AskScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    shadowOpacity: 0,
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerLeft: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("navigateToHome")}
      style={{
        padding: 15,
        justifyContent: "center",
        alignItems: "center",
        flex: 1,
      }}
    >
      <Ionicons name="ios-close" color={color.primaryColor} size={42} />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
  },
  profileGridItems: {
    flexDirection: "row",
    backgroundColor: "#F3F5FB",
    height: 50,
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    alignItems: "center",
  },
});

export default AskScreen;
