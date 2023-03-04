import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { SimpleLineIcons, FontAwesome } from "@expo/vector-icons";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { List, Divider, Badge } from "react-native-paper";
import Swiper from "react-native-web-swiper";

class ClassesScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <Swiper
          from={0}
          minDistanceForAction={0.1}
          controlsProps={{
            dotActiveStyle: { backgroundColor: color.primaryColor },
            dotsTouchable: true,
            prevPos: false,
            nextPos: false,
            dotsWrapperStyle: { marginBottom: -10 },
          }}
        >
          <View style={styles.slideWrapperStyle}>
            <View style={styles.swiperheader}>
              <Image
                style={{ width: 52, height: 52, resizeMode: "contain" }}
                source={require("../../assets/images/userProfileImage.png")}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontFamily: FontFamily.Medium, fontSize: 16 }}>
                  Some long text title for this offer lorem ipsum
                </Text>
              </View>
            </View>
            <View style={styles.starRatingcontainer}>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome
                  name="star-o"
                  size={24}
                  color={color.primaryColor}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: -10, marginRight: -10 }}>
              <Image
                style={{
                  height: "100%",
                  maxWidth: "100%",
                  resizeMode: "contain",
                }}
                source={require("../../assets/images/swipe2.png")}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <TouchableOpacity
                style={styles.probutton}
                onPress={() => this.props.navigation.navigate("ClassAbout")}
              >
                <Text style={styles.probuttontext}>Explore</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.probuttonblack}>
                <Text style={styles.probuttonblacktext}>Pro</Text>
              </TouchableOpacity>
            </View>
          </View>

          <View style={styles.slideWrapperStyle}>
            <View style={styles.swiperheader}>
              <Image
                style={{ width: 52, height: 52, resizeMode: "contain" }}
                source={require("../../assets/images/userProfileImage.png")}
              />
              <View style={{ flex: 1, marginLeft: 10 }}>
                <Text style={{ fontFamily: FontFamily.Medium, fontSize: 16 }}>
                  Some long text title for this offer lorem ipsum
                </Text>
              </View>
            </View>
            <View style={styles.starRatingcontainer}>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome name="star" size={24} color={color.primaryColor} />
              </TouchableOpacity>
              <TouchableOpacity style={styles.starRatingicon}>
                <FontAwesome
                  name="star-o"
                  size={24}
                  color={color.primaryColor}
                />
              </TouchableOpacity>
            </View>
            <View style={{ flex: 1, marginLeft: -10, marginRight: -10 }}>
              <Image
                style={{
                  height: "100%",
                  maxWidth: "100%",
                  resizeMode: "contain",
                }}
                source={require("../../assets/images/swipe2.png")}
              />
            </View>
            <View style={{ flexDirection: "row", alignItems: "flex-end" }}>
              <TouchableOpacity
                style={styles.probutton}
                onPress={() => this.props.navigation.navigate("ClassAbout")}
              >
                <Text style={styles.probuttontext}>Explore</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.probuttonblack}>
                <Text style={styles.probuttonblacktext}>Pro</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Swiper>
      </View>
    );
  }
}

ClassesScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Classes Screen</Text>,
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
    flex: 1,
    marginRight: 10,
  },
  probuttontext: {
    color: color.whiteColor,
    fontFamily: FontFamily.Medium,
    fontSize: 18,
    textAlign: "center",
  },
  slideWrapperStyle: {
    flex: 1,
    borderWidth: 1,
    borderColor: color.grayColor,
    padding: 10,
    marginBottom: 30,
    borderRadius: 8,
  },
  swiperheader: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  starRatingcontainer: {
    flexDirection: "row",
  },
  starRatingicon: {
    marginRight: 5,
  },
  probuttonblack: {
    backgroundColor: color.blackColor,
    padding: 10,
    paddingLeft: 15,
    paddingRight: 15,
    borderRadius: 8,
  },
  probuttonblacktext: {
    color: color.whiteColor,
    fontFamily: FontFamily.Medium,
    fontSize: 18,
    textAlign: "center",
  },
});

export default ClassesScreen;
