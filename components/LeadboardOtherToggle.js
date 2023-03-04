import React from "react";
import {
  Image,
  ScrollView,
  View,
  TouchableOpacity,
  Text,
  FlatList,
  SafeAreaView,
  StyleSheet,
  TextInput,
  ImageBackground,
} from "react-native";
import ViewsBottomPopup from "./ViewsBottomPopup";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import ProfilePhoto from "./ProfilePhoto";
import { Avatar } from "react-native-paper";
import firstChar from "../helper/firstChar";
import capitalize from "../helper/capitalize";
import TimeAgo from "./TimeAgo";

class LeadboardOtherToggle extends React.PureComponent {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            margin: 10,
          }}
        >
          <View style={{ flex: 1, flexDirection: "row" }}>
            <Avatar.Text style={styles.userProfile} size={45} label="DA" />
            <View style={{ flex: 1, justifyContent: "center" }}>
              <TouchableOpacity onPress={this.props.goToProfile}>
                <Text style={styles.userName}>Demo</Text>
              </TouchableOpacity>
              <Text style={styles.userStatusText}>
                Share your knowledge & win
              </Text>
              {/* <TimeAgo
                    style={styles.userDate}
                    created_at={this.props.item.created_at}
                  />
                */}
            </View>
          </View>
          <TouchableOpacity
            style={{ justifyContent: "center" }}
            onPress={() =>
              this.props.navigate.navigate("LeadTopNavigationScreen")
            }
          >
            <Text style={styles.shopEnterText}>Enter</Text>
          </TouchableOpacity>
        </View>
        <View style={{ flex: 1, flexDirection: "row", borderWidth: 1 }}>
          <ImageBackground
            source={require("../assets/images/forest.jpg")}
            style={{ height: 135, width: "100%", flex: 1 }}
          >
            <Text
              style={{
                padding: 6,
                color: "white",
                flex: 1,
                textAlign: "right",
              }}
            >
              Inside
            </Text>
          </ImageBackground>
          <ImageBackground
            source={require("../assets/images/paris.jpg")}
            style={{ height: 135, width: "100%", flex: 1 }}
          >
            <Text
              style={{
                padding: 6,
                color: "white",
                flex: 1,
                textAlign: "right",
              }}
            >
              Inside
            </Text>
          </ImageBackground>
          <ImageBackground
            source={require("../assets/images/forest.jpg")}
            style={{ height: 135, width: "100%", flex: 1 }}
          >
            <Text
              style={{
                padding: 6,
                color: "white",
                flex: 1,
                textAlign: "right",
              }}
            >
              Inside
            </Text>
          </ImageBackground>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userProfile: {
    marginRight: 10,
    width: 42,
    height: 42,
    borderRadius: 90,
  },
  userName: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
    fontSize: 16,
  },
  userStatusText: {
    marginTop: 2,
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 11,
  },
  userDate: {
    fontSize: 11,
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
  },
  shopEnterText: {
    padding: 6,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 3,
  },
});

export default LeadboardOtherToggle;
