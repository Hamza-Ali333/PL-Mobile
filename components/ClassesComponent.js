import React, { Component } from "react";
import {
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ImageBackground,
  Alert,
  Platform,
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { FontAwesome } from "@expo/vector-icons";
import capitalize from "../helper/capitalize";
import submitCourseClickCountMutation from "../graphql/mutations/submitCourseClickCountMutation";
import client from "../constants/client";
import * as Linking from "expo-linking";

const Buffer = require("buffer").Buffer;

class ClassesComponent extends Component {
  constructor(props) {
    super(props);
    this.goToProfile = this.goToProfile.bind(this);
  }

  componentDidMount() {
    Linking.getInitialURL().then((url) => {
      this.navigate(url);
    });

    Linking.addEventListener("url", this.handleOpenURL);
  }

  componentWillUnmount() {
    Linking.removeEventListener("url", this.handleOpenURL);
  }

  goToProfile = (id) => {
    this.props.navigation.navigate("UserProfile", {
      user_id: id,
    });
  };

  submitClassClickCount(id) {
    client
      .mutate({
        mutation: submitCourseClickCountMutation,
        variables: {
          course_id: id,
        },
      })
      .then((result) => {
        if (result) {
        }
      })
      .catch((error) => {});
  }

  render() {
    const { item, type, authUser } = this.props;
    const isVideoAvailable =
      item?.trailers[0]?.extension === "mp4" ||
      item?.trailers[0]?.extension === "mp4" ||
      item?.trailers[0]?.extension === "mov" ||
      item?.trailers[0]?.youtube_link;

    let imageUrl;
    if (item.course_cover_pic === undefined) {
      imageUrl = "https://procurementleague.com/images/showcase-img-4.png";
    } else {
      imageUrl = item.course_cover_pic;
    }

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
        <FontAwesome
          style={styles.stars}
          name={name}
          size={16}
          color={color.primaryColor}
        />
      );
    }

    return (
      <View horizontal={true} showsHorizontalScrollIndicator={false}>
        <TouchableOpacity
          style={[
            [styles.list, { maxWidth: this.props.maxWidth }],
            styles.boxShadow,
          ]}
          onPress={() => {
            this.submitClassClickCount(item.id);

            this.props.navigation.navigate("ClassDetail", {
              item: {
                id: item.id,
                // type: type,
                // data: item,
              },
              // type: type,
              // item: item,
              // authUser: authUser,
            });
          }}
        >
          <ImageBackground
            source={{ uri: imageUrl }}
            imageStyle={{ borderTopLeftRadius: 6, borderTopRightRadius: 6 }}
            style={{
              height: 160,
              width: "100%",
              alignItems: "center",
              justifyContent: "center",
            }}
            resizeMode={"stretch"}
          >
            {isVideoAvailable && (
              <Image
                style={{
                  width: 40,
                  height: 40,
                  resizeMode: "contain",
                }}
                source={require("../assets/images/playButton.png")}
              />
            )}
          </ImageBackground>

          <View style={styles.listBody}>
            <Text numberOfLines={1} style={styles.title}>
              {item.course_name}
            </Text>
            <View style={styles.authors}>
              {item.users.data.map((n, index) => (
                <TouchableOpacity
                  onPress={() => {
                    this.goToProfile(n.id);
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
                        : this.props.navigation.navigate("PaymentPlan", {
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
  }
}
export default ClassesComponent;

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
  authors: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
    paddingTop: 4,
  },
  list: {
    backgroundColor: "#fff",
    borderRadius: 6,
    maxWidth: 300,
    width: 300,
    margin: 10,
    marginRight: 0,
  },
  listBody: {
    padding: 10,
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
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
  priceView: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
});
