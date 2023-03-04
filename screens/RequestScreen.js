import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Avatar } from "react-native-paper";

class RequestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  requestScreen = () => {
    this.props.navigation.navigate("RequestAccept");
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <ScrollView>
          <View style={{ flex: 1, flexDirection: "row" }}>
            <View
              style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
            >
              <Avatar.Image
                size={55}
                style={[
                  styles.userProfile,
                  this.props.style,
                  { backgroundColor: "red" },
                ]}
                source={require("../assets/images/answerProfile.png")}
              />
              <View style={{ flex: 1 }}>
                <TouchableOpacity>
                  <Text style={styles.userName}>Procurement League</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity style={{ justifyContent: "center" }}>
              <Text style={styles.editText}>Edit</Text>
            </TouchableOpacity>
          </View>
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 15,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity
              style={styles.offersBlock}
              onPress={this.requestScreen.bind(this)}
            >
              <Text style={styles.offersBlockText}>Offer 1</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </View>
    );
  }
}

RequestScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Requests</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  userName: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    fontSize: 17,
  },
  userProfile: {
    marginRight: 10,
  },
  editText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 16,
    paddingLeft: 10,
  },
  offersBlock: {
    height: 156,
    width: 156,
    backgroundColor: color.lightGrayColor,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
  },
  offersBlockText: {
    color: "#DCDEE0",
    fontFamily: FontFamily.Medium,
    fontSize: 17,
  },
});

export default RequestScreen;
