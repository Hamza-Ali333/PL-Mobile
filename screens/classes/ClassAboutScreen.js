import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  ImageBackground,
  Platform,
} from "react-native";
import { Feather, Ionicons, Entypo } from "@expo/vector-icons";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import DateTimePicker from "@react-native-community/datetimepicker";

class ClassAboutScreen extends React.Component {
  state = {
    date: new Date("2020-06-12T14:42:42"),
    mode: "date",
    show: false,
  };

  setDate = (event, date) => {
    date = date || this.state.date;

    this.setState({
      show: Platform.OS === "ios" ? true : false,
      date,
    });
  };

  show = (mode) => {
    this.setState({
      show: true,
      mode,
    });
  };

  datepicker = () => {
    this.show("date");
  };

  timepicker = () => {
    this.show("time");
  };

  render() {
    const { show, date, mode } = this.state;
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.container}>
          <TouchableOpacity style={styles.probutton}>
            <Text style={styles.probuttontext}>Become a Pro</Text>
            <Text style={styles.probuttontextfee}>
              Pay once and attend all classes for free
            </Text>
          </TouchableOpacity>
          <View style={{ marginTop: 13, marginLeft: -10, marginRight: -10 }}>
            <ImageBackground
              style={styles.ImageBackground}
              source={require("../../assets/images/swipe2.png")}
            >
              <Text style={styles.username}>Class Name</Text>
            </ImageBackground>
          </View>
          <View
            style={{
              marginTop: 13,
              marginBottom: 13,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.heading}>About</Text>
            <TouchableOpacity style={styles.shareopacity}>
              <Text style={styles.graytext}>Share</Text>
              <Feather name="share" size={16} color={color.grayColor} />
            </TouchableOpacity>
          </View>
          <View style={{ marginBottom: 13 }}>
            <Text style={[styles.heading, { fontSize: 16 }]}>Description</Text>
            <Text style={styles.paragraph}>
              Cras ultricies ligula sed magna dictum porta. Curabitur non nulla
              sit amet nisl tempus convallis quis ac lectus. Vivamus magna
              justo, lacinia eget consectetur sed, convallis at tellus. Lorem
              ipsum dolor sit amet, consectetur adipiscing elit. Vestibulum ante
              ipsum primis in faucibus orci luctus et ultrices posuere cubilia
              Curae; Donec velit neque, auctor sit amet aliquam vel, ullamcorper
              sit amet ligula. Proin eget tortor risus. Curabitur non nulla sit
              amet nisl tempus convallis quis ac lectus.
            </Text>
          </View>
          <View style={styles.classdetails}>
            <View style={{ flex: 1 }}>
              <View style={styles.infolist}>
                <Ionicons
                  name="ios-information"
                  size={24}
                  color={color.grayColor}
                  style={styles.infoicon}
                />
                <View>
                  <Text style={[styles.text, { fontSize: 14 }]}>Date</Text>
                  <Text
                    style={[styles.text, { fontFamily: FontFamily.Medium }]}
                  >
                    31 Dec 2020
                  </Text>
                </View>
              </View>
              <View style={styles.infolist}>
                <Ionicons
                  name="ios-information"
                  size={24}
                  color={color.grayColor}
                  style={styles.infoicon}
                />
                <View>
                  <Text style={[styles.text, { fontSize: 14 }]}>Time</Text>
                  <Text
                    style={[styles.text, { fontFamily: FontFamily.Medium }]}
                  >
                    11:00 AM
                  </Text>
                </View>
              </View>
              <View style={styles.infolist}>
                <Ionicons
                  name="ios-information"
                  size={24}
                  color={color.grayColor}
                  style={styles.infoicon}
                />
                <View>
                  <Text style={[styles.text, { fontSize: 14 }]}>Duration</Text>
                  <Text
                    style={[styles.text, { fontFamily: FontFamily.Medium }]}
                  >
                    90 Minutes
                  </Text>
                </View>
              </View>
              <View style={styles.infolist}>
                <Ionicons
                  name="ios-information"
                  size={24}
                  color={color.grayColor}
                  style={styles.infoicon}
                />
                <View>
                  <Text style={[styles.text, { fontSize: 14 }]}>
                    Requirement
                  </Text>
                  <Text
                    style={[styles.text, { fontFamily: FontFamily.Medium }]}
                  >
                    PRO status
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 1 }}>
              <Text style={[styles.heading, { fontSize: 16 }]}>Speakers</Text>
              <View style={styles.allspearker}>
                <TouchableOpacity style={{ marginRight: 10, marginBottom: 13 }}>
                  <Image
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                    source={require("../../assets/images/userProfileImage.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10, marginBottom: 13 }}>
                  <Image
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                    source={require("../../assets/images/userProfileImage.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10, marginBottom: 13 }}>
                  <Image
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                    source={require("../../assets/images/userProfileImage.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10, marginBottom: 13 }}>
                  <Image
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                    source={require("../../assets/images/userProfileImage.png")}
                  />
                </TouchableOpacity>
                <TouchableOpacity style={{ marginRight: 10, marginBottom: 13 }}>
                  <Image
                    style={{ width: 42, height: 42, resizeMode: "contain" }}
                    source={require("../../assets/images/userProfileImage.png")}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
          <View
            style={{
              flexDirection: "row",
              alignItems: "flex-end",
              alignItems: "stretch",
              marginBottom: 13,
            }}
          >
            <TouchableOpacity
              style={[styles.probutton, { flex: 1 }]}
              onPress={() => this.props.navigation.navigate("ClassAbout")}
            >
              <Text style={styles.probuttontext}>Join a class</Text>
              <Text style={styles.probuttontextfee}>Only for PRO</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.probuttonblack}
              onPress={() => this.datepicker}
            >
              <Entypo name="calendar" size={28} color={color.whiteColor} />
            </TouchableOpacity>
          </View>
        </View>
        {show && (
          <DateTimePicker
            value={date}
            mode={mode}
            is24Hour={true}
            display="default"
            onChange={this.setDate}
          />
        )}
      </ScrollView>
    );
  }
}

ClassAboutScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>About</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
  },
  probutton: {
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 8,
    marginRight: 10,
  },
  probuttontextfee: {
    color: color.whiteColor,
    fontFamily: FontFamily.Regular,
    fontSize: 14,
    textAlign: "center",
    marginTop: 3,
  },
  probuttontext: {
    color: color.whiteColor,
    fontFamily: FontFamily.Medium,
    fontSize: 18,
    textAlign: "center",
  },
  probuttonblack: {
    backgroundColor: color.blackColor,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  ImageBackground: {
    height: 300,
    justifyContent: "flex-end",
    padding: 25,
  },
  username: {
    color: color.whiteColor,
    fontFamily: FontFamily.Medium,
    fontSize: 18,
  },
  heading: {
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    fontSize: 20,
  },
  paragraph: {
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    marginTop: 10,
  },
  text: {
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
  },
  shareopacity: {
    backgroundColor: color.lightGrayColor,
    padding: 7,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 10,
    flexDirection: "row",
    alignItems: "center",
  },
  graytext: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 15,
    marginRight: 3,
  },
  classdetails: {
    marginBottom: 13,
    flexDirection: "row",
  },
  infolist: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  infoicon: {
    width: 30,
    height: 30,
    textAlign: "center",
    borderWidth: 1,
    borderColor: color.grayColor,
    borderRadius: 6,
    marginRight: 6,
  },
  allspearker: {
    marginTop: 13,
    flexWrap: "wrap",
    flexDirection: "row",
  },
});

export default ClassAboutScreen;
