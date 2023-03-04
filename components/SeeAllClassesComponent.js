import React, { Component } from "react";
import {
  Text,
  Alert,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import capitalize from "../helper/capitalize";
import { FontAwesome } from "@expo/vector-icons";

const SeeAllClassesComponent = (props) => {
  const { item, type } = props;

  let imageUrl;
  if (item.course_cover_pic === undefined) {
    imageUrl = "https://procurementleague.com/images/showcase-img-4.png";
  } else {
    imageUrl = item.course_cover_pic;
  }

  let goToProfile = (id) => {
    props.navigation.navigate("UserProfile", {
      user_id: id,
    });
  };

  let rating = item.course_feedback_avg;
  let stars = [];
  for (var i = 1; i <= 5; i++) {
    let name = "";
    if (i <= rating) {
      name = "star";
    } else if (i > rating && rating > i - 1) {
      name = "star-half-empty";
    } else if (i > rating) {
      name = "star-o";
    }
    stars.push(
      <FontAwesome style={styles.stars} name={name} size={16} color="#eb8a2f" />
    );
  }

  return (
    <View showsVerticallScrollIndicator={false}>
      <TouchableOpacity
        style={[styles.list, styles.boxShadow]}
        onPress={() =>
          props.navigation.navigate("ClassDetail", {
            item: {
              id: item.id,
              // type: type,
              // data: item,
            },
          })
        }
      >
        <Image
          style={{
            width: "100%",
            height: 220,
            borderRadius: 6,
          }}
          resizeMode={"stretch"}
          source={{ uri: imageUrl }}
        />
        <View style={styles.listBody}>
          <Text style={styles.title}>{item.course_name}</Text>
          <View style={styles.authors}>
            {item.users.data.map((n, index) => (
              <TouchableOpacity
                onPress={() => {
                  goToProfile(n.id);
                }}
              >
                {index == item.users.data.length - 1 ? (
                  <Text style={styles.primaryText} numberOfLines={1}>
                    {capitalize(n.firstname)} {capitalize(n.lastname)}
                  </Text>
                ) : (
                  <Text style={styles.primaryText} numberOfLines={1}>
                    {capitalize(n.firstname)} {capitalize(n.lastname)},{" "}
                  </Text>
                )}
              </TouchableOpacity>
            ))}
          </View>
          <View style={styles.rating}>
            {item.course_feedback_count > 0 && stars}
            {item.course_feedback_count > 0 && (
              <Text style={styles.grayText}>
                ({item.course_feedback_count})
              </Text>
            )}

            {type == "Additional Resources" ? (
              <View style={styles.priceView}>
                <TouchableOpacity
                  onPress={() => {
                    item.is_enroll
                      ? Alert.alert("Product has been already purchased!!")
                      : props.navigation.navigate("PaymentPlan", {
                          item: {
                            id: item.id,
                            price: item.course_objective,
                            name: item.course_name,
                            __typename: "Product",
                            type: "Additional Resources",
                            course_id: item.id,
                            is_shippable: item.is_shippable,
                          },
                        });
                  }}
                >
                  <Text
                    style={[
                      styles.primaryText,
                      {
                        color: item.is_enroll
                          ? color.grayColor
                          : color.primaryColor,
                      },
                    ]}
                  >
                    {"$" + item.course_objective}
                  </Text>
                </TouchableOpacity>
              </View>
            ) : (
              false
            )}
          </View>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SeeAllClassesComponent;

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
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
  heading: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  authors: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    paddingTop: 4,
  },
  bgImage: {
    width: "100%",
    height: 80,
  },
  innerBg: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,.5)",
    height: "100%",
    justifyContent: "flex-end",
    borderRadius: 6,
  },
  list: {
    backgroundColor: "#fff",
    borderRadius: 6,
    margin: 10,
  },
  halfList: {
    maxWidth: 200,
    marginRight: 5,
  },
  listBody: {
    padding: 10,
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
  },
  titleList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 30,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  stars: {
    marginRight: 3,
  },
  grayText: {
    color: color.grayColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  text: {
    color: color.blackColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  primaryText: {
    color: color.primaryColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  chip: {
    backgroundColor: "#F3F5FB",
    marginRight: 8,
    marginTop: 8,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    height: 34,
  },
  priceView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
