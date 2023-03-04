import React, { useState, useEffect, useCallback } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ImageBackground,
  ActivityIndicator,
  Dimensions,
  FlatList,
} from "react-native";

import color from "../../constants/Colors.js";
import client from "../../constants/client";
import FontFamily from "../../constants/FontFamily.js";
import { Divider } from "react-native-paper";
import getPaymentPlans from "../../graphql/queries/getPaymentPlans";
import link from "../../constants/link";
import ReadMore from "@fawazahmed/react-native-read-more";

const { width, height } = Dimensions.get("window");

const PackagesPlanScreen = (props) => {
  const [plans, setPlans] = useState([]);
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);

  useEffect(() => {
    client
      .query({
        query: getPaymentPlans,
      })
      .then((result) => {
        setPlans(result.data.plans);
      })
      .catch((error) => {});
  }, []);

  const updateCurrentSlideIndex = (e) => {
    const contentOffsetX = e.nativeEvent.contentOffset.x;
    const currentIndex = Math.round(contentOffsetX / width);
    setCurrentSlideIndex(currentIndex);
  };

  const Slide = useCallback(
    ({ item }) => {
      return (
        <View style={{ paddingHorizontal: 10, width }}>
          <View style={[styles.boxShadow, styles.planWrap]}>
            <ImageBackground
              source={{ uri: link.url + item.path }}
              imageStyle={{
                borderRadius: 6,
                resizeMode: "contain",
              }}
              style={{
                height: 220,
                width: "100%",
              }}
            />
            <View style={{ padding: 10 }}>
              <Text style={styles.planName}>{item.name}</Text>
              <Divider style={styles.separator} />
              <Text style={styles.text}>You have to pay</Text>
              <Text style={[styles.heading, { fontSize: 30 }]}>
                {item.price}
                <Text style={styles.text}>
                  .00 USD
                  <Text style={styles.grayText}>
                    /{item.validity === "M" ? "Month" : "Year"}
                  </Text>
                </Text>
              </Text>
              <Divider style={styles.separator} />
              <Text style={styles.heading}>Description</Text>

              <ReadMore numberOfLines={3} style={styles.text}>
                {item.description}
              </ReadMore>

              <View style={styles.spacing} />
              <View style={styles.spacing} />
              <TouchableOpacity
                style={styles.fillbtn}
                onPress={() =>
                  props.navigation.navigate("PaymentPlan", {
                    item: item,
                  })
                }
              >
                <Text style={styles.fillbtnText}>Select Plan</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      );
    },
    [plans]
  );

  //rendering the bar to show user on what current page (slide) on he is write now
  const IndecatorFooter = () => {
    return (
      <View
        style={{
          justifyContent: "space-around",
          alignItems: "center",
          paddingHorizontal: 20,
          height: 20,
        }}
      >
        {/* Indicator container */}
        <View
          style={{
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 0,
            marginBottom: 10,
          }}
        >
          {/* Render indicator */}
          {plans.map((_, index) => (
            <View
              key={index}
              style={[
                styles.indicator,
                currentSlideIndex == index && {
                  backgroundColor: color.primaryColor,
                  width: 25,
                },
              ]}
            />
          ))}
        </View>
      </View>
    );
  };

  return (
    <View style={{ backgroundColor: color.whiteColor }}>
      <IndecatorFooter />
      <ScrollView showsVerticalScrollIndicator={false}>
        {plans ? (
          <>
            <FlatList
              onMomentumScrollEnd={updateCurrentSlideIndex}
              contentContainerStyle={{ height }}
              showsHorizontalScrollIndicator={false}
              horizontal
              keyExtractor={(item, index) => index.toString()}
              data={plans}
              pagingEnabled
              renderItem={({ item }) => <Slide item={item} />}
            />
          </>
        ) : (
          <View>
            <ActivityIndicator size="small" color={color.primaryColor} />
          </View>
        )}
      </ScrollView>
    </View>
  );
};

PackagesPlanScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => null,
});

const styles = StyleSheet.create({
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  text: {
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 16,
  },
  grayText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 16,
  },
  heading: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 18,
  },
  separator: {
    marginTop: 13,
    marginBottom: 13,
  },
  planName: {
    fontFamily: FontFamily.Bold,
    color: color.primaryColor,
    fontSize: 25,
    textAlign: "center",
    marginTop: 10,
  },
  planWrap: {
    borderRadius: 10,
    backgroundColor: color.lightGrayColor,
  },
  spacing: {
    height: 6,
  },
  fillbtn: {
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  fillbtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FontFamily.Medium,
  },
  indicator: {
    height: 2.5,
    width: 10,
    backgroundColor: "grey",
    marginHorizontal: 3,
    borderRadius: 2,
  },
});

export default PackagesPlanScreen;
