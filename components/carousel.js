import * as WebBrowser from "expo-web-browser";
import React from "react";
import { Text, TouchableOpacity, View, Image, StyleSheet } from "react-native";
import Swiper from "react-native-web-swiper";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { LinearGradient } from "expo-linear-gradient";
//import AnimatedCheckLoading from "./AnimatedCheckLoading";

const Crousel = (props) => {
  return (
    <Swiper
      from={0}
      minDistanceForAction={0.1}
      controlsProps={{
        dotActiveStyle: { backgroundColor: color.primaryColor },
        dotsTouchable: true,
        prevPos: false,
        nextPos: false,
        nextTitle: ">",
        nextTitleStyle: { color: "red", fontSize: 24, fontWeight: "500" },
        PrevComponent: ({ onPress }) => (
          <TouchableOpacity onPress={onPress}>
            <Text style={{ color: "white", fontSize: 24, fontWeight: "500" }}>
              {"<"}
            </Text>
          </TouchableOpacity>
        ),
      }}
    >
      <View style={{ flex: 1, justifyContent: "center" }}>
        <View>
          <View>
            <Image
              style={{ height: 280, maxWidth: "100%", resizeMode: "contain" }}
              source={require("../assets/images/slider-2.png")}
            />
          </View>
          <Text style={styles.sliderTextHeading}>
            YOUR BRAND. YOUR OPPORTUNITIES.
          </Text>
          <Text style={styles.sliderText}>
            Build and grow your network of opportunities.
          </Text>
        </View>
        {/*  <AnimatedCheckLoading /> */}
      </View>

      <View style={{ flex: 1, justifyContent: "center" }}>
        <View>
          <View>
            <Image
              style={{ height: 300, maxWidth: "100%", resizeMode: "contain" }}
              source={require("../assets/images/slider-1.png")}
            />
          </View>
          <Text style={styles.sliderTextHeading}>ASK. SHARE. SUCCEED.</Text>
          <Text style={styles.sliderText}>
            Ask your questions at procurement league. Share with all, Do good &
            Succeed.
          </Text>
        </View>
      </View>

      {/*<View style={{ flex: 1, justifyContent: "center" }}>
        <View>
          <View>
            <Image
              style={{ height: 300, maxWidth: "100%", resizeMode: "contain" }}
              source={require("../assets/images/slider-3.png")}
            />
          </View>
          <Text style={styles.sliderTextHeading}>
            YOUR DREAM JOB. YOUR DREAM CANDIDATES.
          </Text>
          <Text style={styles.sliderText}>
            A job search algorithm designed for Procurement and supply chain.
          </Text>
        </View>
      </View>*/}

    </Swiper>
  );
};

const styles = StyleSheet.create({
  sliderTextHeading: {
    textAlign: "center",
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 15,
    fontSize: 17,
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
  },
  sliderText: {
    textAlign: "center",
    marginLeft: "5%",
    marginRight: "5%",
    fontSize: 17,
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
  },
  SignInButton: {
    padding: 15,
    borderRadius: 10,
  },
});

export default Crousel;
