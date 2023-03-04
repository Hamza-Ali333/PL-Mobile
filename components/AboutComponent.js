import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily.js";
import {
  FontAwesome,
  FontAwesome5,
  AntDesign,
  Ionicons,
  Entypo,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { Divider, List, ProgressBar, Avatar } from "react-native-paper";
import submitCourseReviewMutation from "../graphql/mutations/submitCourseReviewMutation";
import client from "../constants/client";
import link from "../constants/link";
import firstChar from "../helper/firstChar";
import RenderHtml from "react-native-render-html";

const AboutComponent = (props) => {
  const [maxRating, setMaxRating] = useState([1, 2, 3, 4, 5]);
  const [defaultRating, setDefaultRating] = useState(2);
  const [comment, setComment] = useState("");
  const { item, navigation } = props;

  let imageUrl;
  if (item.course_cover_pic === undefined) {
    imageUrl =
      "https://www.kindpng.com/picc/m/10-107231_music-video-play-function-play-button-icon-transparent.png";
  } else {
    imageUrl = item.course_cover_pic;
  }

  const progressBar = (rating) => {
    const value = rating / 5;
    return (
      <ProgressBar
        progress={value}
        color={color.primaryColor}
        style={{ height: 8, borderRadius: 30 }}
      />
    );
  };

  const stars = (rating) => {
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
          color="#eb8a2f"
        />
      );
    }
    return <>{stars}</>;
  };

  const secondsToHMS = (seconds) => {
    var Hms = new Date(seconds * 1000).toISOString().substr(11, 8);
    // var minutes = Math.floor(millis / 60000);
    // var seconds = ((millis % 60000) / 1000).toFixed(0);
    // if (isNaN(minutes) || isNaN(seconds)) {
    //   return null;
    // }
    // return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
    return Hms;
  };

  const onPressLecture = () => {
    if (item.is_enroll) {
      navigation.navigate("GoToClass", { item: item });
    } else {
      Alert.alert("Note", "Please sign-up for Pro level.", [
        {
          text: "Become a pro",
          onPress: () => navigation.navigate("PackagesPlan"),
        },
      ]);
    }
  };

  const onPressSupportFile = () => {
    if (item.course_status === "Draft") {
      Alert.alert("This Course is not published yet");
    } else {
      props.navigation.navigate("SupportFiles", {
        item: item,
        id: item.id,
        is_pro: props.authUser.is_pro,
      });
    }
  };

  const renderCurriculum = (s) => {
    return (
      <List.Section>
        <List.Accordion
          title={s.content_name}
          style={{ padding: 0, marginLeft: -5, marginRight: -5 }}
          titleStyle={{
            fontFamily: FontFamily.Medium,
            fontSize: 16,
            color: color.blackColor,
          }}
        >
          {s.content_modules &&
            s.content_modules.length > 0 &&
            s.content_modules.map((c) => (
              <List.Item
                onPress={onPressLecture}
                title={c.title}
                left={(props) => (
                  // <Entypo name="dot-single" size={25} color={color.grayColor} />
                  <Avatar.Image
                    style={styles.avatar}
                    size={40}
                    source={{
                      uri: imageUrl,
                    }}
                  />
                )}
              />
            ))}
        </List.Accordion>
      </List.Section>
    );
  };

  const renderFeedback = () => {
    var size = 1;
    let arr = [];
    let rating = [];
    item.reviews.data.slice(0, size).map((i) => {
      arr.push(i);
    });
    item.reviews.data.map((i) => {
      rating.push(i.rating);
    });

    let totalRating = 5;
    let minRating = Math.min(...rating);

    return (
      <>
        {arr.length > 0 ? (
          <>
            {arr.map((i) => (
              <View style={[styles.rating, { marginTop: 5 }]}>
                <View style={{ flex: 1, marginRight: 10 }}>
                  {progressBar(item.course_feedback_avg)}
                </View>
                {stars(item.course_feedback_avg)}

                <Text style={styles.grayText}>
                  {" "}
                  {item.course_feedback_avg * 2 * 10}%
                </Text>
              </View>
            ))}
          </>
        ) : (
          <View style={[styles.rating, { marginTop: 5 }]}>
            <View style={{ flex: 1, marginRight: 10 }}>{progressBar(0)}</View>
            {stars(0)}
            <Text style={styles.grayText}> 0%</Text>
          </View>
        )}
      </>
    );
  };

  const renderReviews = () => {
    var size = 2;
    let arr = [];
    item.reviews.data.slice(0, size).map((i) => {
      arr.push(i);
    });
    return (
      <View>
        {arr.map((r) => (
          <View style={styles.feedbackContainer}>
            <View style={styles.userCommentInfo}>
              <View style={styles.userInfo}>
                {r.user.profile_photo ? (
                  <Avatar.Image
                    style={styles.avatar}
                    size={48}
                    source={{
                      uri:
                        link.url +
                        "/uploads/profile_images/" +
                        r.user.profile_photo,
                    }}
                  />
                ) : (
                  <Avatar.Text
                    style={{ backgroundColor: "#2980B9", marginRight: 10 }}
                    size={42}
                    label={
                      firstChar(r.user.firstname) + firstChar(r.user.lastname)
                    }
                  />
                )}

                <View>
                  <Text style={styles.userName}>
                    {`${r.user.firstname} ${r.user.lastname}`}
                  </Text>
                  <View style={[styles.rating, { marginTop: 2 }]}>
                    {stars(r.rating)}
                    <Text style={styles.grayText}>
                      {" "}
                      {r.readable_created_at}
                    </Text>
                  </View>
                </View>
              </View>
              <Text style={styles.text}>{r.review}</Text>
            </View>
          </View>
        ))}
        <TouchableOpacity
          style={{ alignSelf: "center", marginTop: 13 }}
          onPress={() =>
            props.navigation.navigate("AllReviews", { course_id: item.id })
          }
        >
          <Text style={[styles.text, { color: color.primaryColor }]}>
            See All
          </Text>
        </TouchableOpacity>
      </View>
    );
  };

  const CustomRatingBar = () => {
    return (
      <>
        {maxRating.map((item, key) => {
          return (
            <TouchableOpacity
              activeOpacity={0.7}
              key={item}
              onPress={() => setDefaultRating(item)}
            >
              {item <= defaultRating ? (
                <FontAwesome
                  style={styles.stars}
                  name="star"
                  size={22}
                  color="#eb8a2f"
                />
              ) : (
                <FontAwesome
                  style={styles.stars}
                  name="star-o"
                  size={22}
                  color="#eb8a2f"
                />
              )}
            </TouchableOpacity>
          );
        })}
      </>
    );
  };

  const onChangeComment = (text) => {
    setComment(text);
  };

  const resetData = () => {
    setDefaultRating(2);
    setComment("");
  };
  const submitReview = () => {
    resetData();
    client
      .mutate({
        mutation: submitCourseReviewMutation,
        variables: {
          course_id: item.id,
          rating: defaultRating,
          review: comment,
        },
      })
      .then((result) => {
        if (result.data.add_course_review.is_published === true) {
          Alert.alert("Feedback received!", "Thank you for your feedback.", [
            { text: "OK", onPress: () => resetData() },
          ]);
        }
      })
      .catch((error) => {});
  };

  let lectureCount = 0;
  if (item.lecture_count !== null && item.lecture_count > 0) {
    lectureCount = item.lecture_count;
  } else {
    lectureCount = 0;
  }

  let chapterCount = 0;
  if (item.chapter_count !== null && item.chapter_count > 0) {
    chapterCount = item.chapter_count;
  } else {
    chapterCount = 0;
  }

  return (
    <View
      style={{ margin: 10, ...props.style }}
      onLayout={(event) => {
        props.setTab1Height(event.nativeEvent.layout.height + 80);
        console.log("Heights ", event.nativeEvent.layout.height);
      }}
    >
      <View>
        {item.total_duration > 0 ||
        item.course_support_files.length > 0 ||
        item.course_session.length > 0 ||
        item?.data_type === "PRODUCT" ? (
          <Text style={styles.title}>
            This {item?.data_type === "PRODUCT" ? "Product" : "Course"} Includes
          </Text>
        ) : (
          false
        )}
        {item?.data_type === "PRODUCT" ? (
          false
        ) : item.total_duration > 0 ? (
          <View style={styles.list}>
            <AntDesign
              style={styles.listIcon}
              name="earth"
              size={16}
              color={color.grayColor}
            />
            <Text style={styles.grayText}>
              {secondsToHMS(item.total_duration)} total hours on-demand video
            </Text>
          </View>
        ) : (
          false
        )}

        {item.course_support_files.length > 0 ? (
          <TouchableOpacity
            style={styles.list}
            onPress={() => onPressSupportFile()}
          >
            <AntDesign
              style={styles.listIcon}
              name="filetext1"
              size={16}
              color={color.grayColor}
            />
            <Text
              style={[
                styles.grayText,
                { color: color.primaryColor, textDecorationLine: "underline" },
              ]}
            >
              Downloadable Support Files
            </Text>
          </TouchableOpacity>
        ) : (
          false
        )}

        {item.course_session.length > 0 ? (
          <TouchableOpacity
            style={styles.list}
            onPress={() =>
              props.navigation.navigate("ClassSession", {
                id: item.id,
                item: item,
              })
            }
          >
            <FontAwesome5
              style={styles.listIcon}
              name="diagnoses"
              size={16}
              color={color.grayColor}
            />
            <Text
              style={[
                styles.grayText,
                { color: color.primaryColor, textDecorationLine: "underline" },
              ]}
            >
              Sessions
            </Text>
          </TouchableOpacity>
        ) : (
          false
        )}

        {item?.data_type === "PRODUCT" ? (
          <>
            <View style={styles.list}>
              <Ionicons
                style={styles.listIcon}
                name="ios-infinite"
                size={16}
                color={color.grayColor}
              />
              <Text style={styles.grayText}>Lifetime access</Text>
            </View>
            <Divider style={styles.separator} />
          </>
        ) : (
          false
        )}
      </View>

      {item.course_description && (
        <>
          <View>
            <Text style={styles.title}>Description</Text>
            <View style={[styles.list, { marginRight: 20 }]}>
              <RenderHtml source={{ html: item.course_description }} />
              {/* <Text style={[styles.text, { marginLeft: 5 }]}>
                {htmlToNative(item.course_description)}
              </Text> */}
            </View>
          </View>
          <Divider style={styles.separator} />
        </>
      )}
      <View>
        <Text style={styles.title}>{`About the ${
          item?.data_type === "PRODUCT" ? "Owner" : "Trainer"
        }`}</Text>
        {item.course_requirement.data.map((r) => (
          <View
            style={[styles.list, { alignItems: "flex-start", marginLeft: -5 }]}
          >
            <Entypo name="dot-single" size={17} color={color.blackColor} />
            <Text style={[styles.blackText, { flex: 1 }]}>
              {r.requirements}
            </Text>
          </View>
        ))}
      </View>
      {chapterCount && lectureCount > 0 ? (
        <>
          <Divider style={styles.separator} />
          <View>
            <Text style={styles.title}>Resources</Text>
            <View style={styles.info}>
              <Text style={styles.text}>{chapterCount} Chapters</Text>
              <View style={styles.dot}></View>
              <Text style={styles.text}>{lectureCount} Lectures</Text>
            </View>

            {item.contents.data.map((s) => renderCurriculum(s))}
          </View>
        </>
      ) : (
        false
      )}

      {item.is_enroll ? (
        <>
          <Divider style={styles.separator} />
          <View>
            <Text style={styles.title}>Feedback</Text>
            <Text style={[styles.title, { marginTop: 10, fontSize: 19 }]}>
              {item.course_feedback_avg}
              <Text style={styles.grayText}>{` ${
                item?.data_type === "PRODUCT" ? "Product" : "Course"
              } Rating`}</Text>
            </Text>

            {renderFeedback()}
          </View>

          <View style={[styles.addCommentContainer, styles.boxShadow]}>
            <View style={[styles.rating, { marginTop: 0, marginBottom: 10 }]}>
              {CustomRatingBar()}
              <Text style={styles.grayText}> {defaultRating}</Text>
            </View>
            <View style={styles.TextInputContainer}>
              <TextInput
                multiline
                numberOfLines={5}
                style={styles.TextInput}
                placeholder="Post your comment"
                value={comment}
                onChangeText={(text) => onChangeComment(text)}
              />
              <TouchableOpacity onPress={submitReview}>
                <MaterialCommunityIcons
                  name="send-circle"
                  size={42}
                  color={color.primaryColor}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View>{renderReviews()}</View>
        </>
      ) : null}
    </View>
  );
};
export default AboutComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  listIcon: {
    marginRight: 10,
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 18,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },
  video: {
    marginTop: 13,
  },
  stars: {
    marginLeft: 1,
    marginRight: 1,
  },
  text: {
    color: color.black,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
  grayText: {
    color: color.grayColor,
    fontSize: 16,
    lineHeight: 20,
    fontFamily: FontFamily.Regular,
  },
  separator: {
    marginTop: 13,
    marginBottom: 13,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 20,
    backgroundColor: color.grayColor,
    marginLeft: 5,
    marginRight: 5,
  },
  leacutreList: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  leacutreNumber: {
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackContainer: {
    marginTop: 13,
  },
  avatar: {
    backgroundColor: "#fff",
    marginRight: 10,
  },
  userName: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addCommentContainer: {
    backgroundColor: color.lightGrayColor,
    padding: 13,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 13,
  },
  TextInput: {
    flex: 1,
    minHeight: 100,
    textAlignVertical: "top",
    padding: 10,
  },
  TextInputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingRight: 5,
  },
});
