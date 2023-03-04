import React, { useEffect, useRef, useState, useCallback } from "react";
import { FontAwesome } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Calendar from "expo-calendar";
import * as Permissions from "expo-permissions";
import moment from "moment";
import {
  Alert,
  Dimensions,
  Platform,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import CustomTabs from "../../components/custom_tabs/CustomTabs";
import AboutComponent from "../../components/AboutComponent";
import DiscussionComponent from "../../components/DiscussionComponent";
import ShareComponent from "../../components/ShareComponent";
import ClassDetail from "../../components/Skeleton/ClassDetail.js";
import SlideViewer from "../../components/SlideViewer.js";
import client from "../../constants/client";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import link from "../../constants/link.js";
import enrollCourseMutation from "../../graphql/mutations/enrollCourseMutation";
import getClasses from "../../graphql/queries/getClasses";
import getCourse from "../../graphql/queries/getCourse.js";
import getEnroll from "../../graphql/queries/getEnroll";
import me from "../../graphql/queries/me";
import capitalize from "../../helper/capitalize";
import { FlatList } from "react-native-gesture-handler";
const initialLayout = { width: Dimensions.get("window").width };
const { width, height } = Dimensions.get("window");

const Buffer = require("buffer").Buffer;

const ClassDetailScreen = (props) => {
  let paramItem = props.navigation.getParam("item");

  const [item, setItem] = React.useState({});
  const [authUser, setAuthUser] = useState(null);
  const [enrolled, setEnrolled] = useState(false);
  const [index, setIndex] = React.useState(0);
  const [pro, setPro] = useState(false);
  const [height, setTabHeight] = useState(1);
  const { navigation } = props;
  const discussionRef = useRef(null);
  const [tab1Height, setTab1Height] = useState(0);
  const [tab2Height, setTab2Height] = useState(0);
  const [tab3Height, setTab3Height] = useState(0);

  const [routes] = React.useState([
    { key: "About", title: "About" },
    { key: "Discussion", title: "Discussion" },
    { key: "Share", title: "Share" },
  ]);

  useEffect(() => {
    if (paramItem?.id) {
      client
        .query({
          query: getCourse,
          variables: { id: paramItem.id },
        })
        .then((res) => {
          setItem(res?.data?.course);
          if (res.data.course?.data_type === "EVENT") {
            openCalendarRequest(); // Ask for Premission to access phone calendar
          }
        })
        .catch((err) => {
          console.log("ERRR", err);
        });
    }
  }, []);

  useEffect(() => {
    client
      .query({
        query: getEnroll,
        variables: { course_id: item.id },
      })
      .then((result) => {});
  }, [enrolled]);

  useEffect(() => {
    _getRequestMe();
    let res;
    AsyncStorage.getItem("me").then((result) => {
      res = JSON.parse(result);
      setAuthUser(res);
    });
  }, [navigation]);

  const openCalendarRequest = async () => {
    const { status } = await Permissions.askAsync(Permissions.CALENDAR);
    if (status === "granted") {
    }
  };

  const addEventToCalendar = async () => {
    const calendar = await Calendar.getCalendarsAsync("event");
    let sDate = new Date(item.publishing_on);
    let eventDetails = {};
    eventDetails.title = item.course_name;
    eventDetails.startDate = sDate;
    eventDetails.endDate = sDate;

    let calendarId = calendar.filter(
      (item) => item.allowsModifications === true
    )[0].id;

    const eventIdInCalendar = await Calendar.createEventAsync(
      calendarId,
      eventDetails
    );

    if (Platform.OS === "android") {
      Calendar.openEventInCalendar(eventIdInCalendar); // that will give the user the ability to access the event in phone calendar
    }
    Alert.alert("event added successfully!");
  };

  const goToProfile = (id) => {
    props.navigation.navigate("UserProfile", {
      user_id: id,
    });
  };

  const _getRequestMe = () => {
    //this.resetCache();
    client
      .query({
        query: me,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        if (result.loading === false) {
          AsyncStorage.setItem("me", JSON.stringify(result.data.me)).then(
            (res) => {
              // this.setUserData();
            }
          );

          setPro(result.data.me.is_pro);
        }
      });
  };

  const handleEnroll = () => {
    let type2 = "";
    if (item?.data_type === "EVENT") {
      type2 = "upcoming";
    } else if (item?.data_type === "COURSE" && item.is_training === "0") {
      type2 = "newest";
    } else if (item?.data_type === "COURSE" && item.is_training === "0") {
      type2 = "popular";
    } else if (item?.data_type === "COURSE" && item.is_training === "1") {
      type2 = "featured";
    }

    client
      .mutate({
        mutation: enrollCourseMutation,
        variables: { course_id: item.id },

        optimisticResponse: {
          __typename: "Mutation",
          course_enrollment: {
            __typename: "Response",
            message: "",
            error: "",
          },
        },
        update: (cache, { data: { getClass } }) => {
          const data = cache.readQuery({
            query: getClasses,
            variables: { typeInfo: type2 },
          });

          const course = data.courses.data.find((data) => data.id === item.id);
          course.is_enroll = true;
          item.is_enroll = true;

          props.navigation.setParams("item", item);

          cache.writeQuery({ query: getClasses, data });
        },
      })
      .then((results) => {})
      .catch((error) => {});
    setEnrolled(true);
  };

  const renderScene = (route) => {
    switch (route) {
      case 0:
        return (
          <AboutComponent
            style={{ width }}
            item={item}
            enrolled={enrolled}
            index={index}
            setHeight={setTab1Height}
            authUser={authUser}
            navigation={navigation}
          />
        );
      case 1:
        return (
          <DiscussionComponent
            style={{ width }}
            ref={discussionRef}
            navigation={navigation}
            item={item}
            index={index}
            setHeight={setTab2Height}
            is_pro={pro}
          />
        );
      case 2:
        return (
          <ShareComponent
            style={{ width }}
            setHeight={setTab3Height}
            item={item}
          />
        );
      default:
        return null;
    }
  };

  let stars = [];
  if (item?.data_type === "EVENT") {
    for (var i = 1; i <= 5; i++) {
      stars.push(
        <FontAwesome
          style={styles.stars}
          name="star-o"
          size={16}
          color={color.grayColor}
        />
      );
    }
  } else {
    let rating = item.course_feedback_avg;

    for (let i = 1; i <= 5; i++) {
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
  }

  const tempEnroll = () => {
    setEnrolled(true);
  };

  const onShare = async () => {
    let routeName = "";

    let encodedId = new Buffer(item.id).toString("base64");

    if (item?.data_type === "EVENT" || item?.data_type === "PAST_EVENT") {
      routeName = "event";
    }

    if (item?.data_type === "PRODUCT") {
      routeName = "product";
    }
    if (
      item?.data_type === "COURSE" &&
      (item.is_training === "0" || item.is_training === "1")
    ) {
      routeName = "classes";
    }
    try {
      const result = await Share.share({
        message: `${link.shareUrl}/share/${routeName}/${item.id}`,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  //Published Date
  const d = moment(item.publishing_on).format("DD-MM-YYYY hh:mm:ss");
  const res = d.split(" ");
  const date = res[0];
  console.log(tab1Height, tab2Height, tab3Height);
  console.log(index);

  return (
    <KeyboardAwareScrollView
      showsVerticalScrollIndicator={false}
      contentContainerStyle={{ flexGrow: 1, backgroundColor: "white" }}
      extraScrollHeight={Platform.OS === "ios" ? 60 : 0}
    >
      <View style={{ flex: 1 }}>
        {item?.course_name ? (
          <>
            <View style={styles.container}>
              <View style={{ marginHorizontal: 10 }}>
                {item.data_type === "PAST_EVENT" ? (
                  <View />
                ) : item.data_type === "EVENT" ? (
                  <>
                    <TouchableOpacity
                      style={styles.fillBtn}
                      onPress={() => addEventToCalendar()}
                    >
                      <Text style={styles.fillBtnText}>Add to calendar</Text>
                    </TouchableOpacity>
                  </>
                ) : item.data_type === "PRODUCT" ? (
                  item.is_enroll ? (
                    <TouchableOpacity
                      style={[
                        styles.fillBtn,
                        { backgroundColor: color.grayColor },
                      ]}
                    >
                      <Text style={styles.fillBtnText}>Already Purchased</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={styles.fillBtn}
                      onPress={() =>
                        props.navigation.navigate("PaymentPlan", {
                          item: {
                            id: item.id,
                            price: item.course_objective,
                            name: item.course_name,
                            __typename: "Product",
                            type: "Additional Resources",
                            course_id: item.id,
                            is_shippable: item.is_shippable,
                          },
                        })
                      }
                    >
                      <Text style={styles.fillBtnText}>
                        {"Price" + " " + "$" + item.course_objective}
                      </Text>
                    </TouchableOpacity>
                  )
                ) : (
                  <>
                    {authUser !== null && authUser.is_pro ? (
                      // pro
                      <>
                        {item.is_enroll ? (
                          <TouchableOpacity
                            style={styles.fillBtn}
                            onPress={() =>
                              props.navigation.navigate("GoToClass", {
                                item: item,
                                courseName: item.course_name,
                              })
                            }
                          >
                            <Text style={styles.fillBtnText}>Go To Course</Text>
                          </TouchableOpacity>
                        ) : (
                          <TouchableOpacity
                            style={styles.fillBtn}
                            onPress={handleEnroll}
                          >
                            <Text style={styles.fillBtnText}>Enroll now</Text>
                          </TouchableOpacity>
                        )}
                      </>
                    ) : (
                      <TouchableOpacity
                        style={styles.fillBtn}
                        onPress={() =>
                          props.navigation.navigate("PackagesPlan")
                        }
                      >
                        <Text style={styles.fillBtnText}>
                          To access, sign-up for Pro
                        </Text>
                      </TouchableOpacity>
                    )}
                  </>
                )}
                <Text style={styles.courseTitle}>{item.course_name}</Text>
                <View
                  style={[
                    styles.rating,
                    { marginTop: item.course_feedback_avg > 0 ? 13 : 0 },
                  ]}
                >
                  {item.data_type ===
                  "EVENT" ? null : item.course_feedback_avg > 0 ? (
                    <Text style={styles.text}>{item.course_feedback_avg}</Text>
                  ) : (
                    false
                  )}

                  {/* {item.course_feedback_avg > 0 && stars} */}

                  {item.data_type === "EVENT"
                    ? false
                    : // <Text style={styles.grayText}>(0)</Text>
                      item.course_feedback_count > 0 && (
                        <Text style={styles.grayText}>
                          ({item.course_feedback_count})
                        </Text>
                      )}
                </View>
                <View style={styles.list}>
                  <Text style={[styles.grayText, { width: 28 }]}>
                    {item.data_type === "PRODUCT" ? "By:" : "By:"}
                  </Text>
                  <ScrollView horizontal showsHorizontalScrollIndicator={false}>
                    {item.users.data.map((n, index) => (
                      <TouchableOpacity
                        onPress={() => {
                          goToProfile(n.id);
                        }}
                      >
                        {index == item.users.data.length - 1 ? (
                          <Text style={[styles.primaryText, {}]}>
                            {capitalize(n.firstname)} {capitalize(n.lastname)}
                          </Text>
                        ) : (
                          <Text style={[styles.primaryText, { flex: 1 }]}>
                            {capitalize(n.firstname)} {capitalize(n.lastname)},{" "}
                          </Text>
                        )}
                      </TouchableOpacity>
                    ))}
                  </ScrollView>
                </View>
                <View style={styles.list}>
                  <Text style={[styles.grayText]}>
                    {item.data_type === "EVENT"
                      ? "Event Date:"
                      : "Publish Date:"}{" "}
                  </Text>
                  <Text style={styles.text}>{date}</Text>
                </View>

                {item.data_type === "PAST_EVENT" && false}
                {item.data_type === "EVENT" &&
                  item.total_interseted_users_count > 0 && (
                    <View style={styles.list}>
                      <Text style={[styles.grayText]}>
                        Number of people attending:
                      </Text>
                      <Text style={styles.text}>
                        {item.total_interseted_users_count}
                      </Text>
                    </View>
                  )}

                {item.data_type === "PRODUCT" &&
                  item.total_purchased_by_users > 0 && (
                    <View style={styles.list}>
                      <Text style={[styles.grayText]}>Number of buyers: </Text>
                      <Text style={styles.text}>
                        {item.total_purchased_by_users}
                      </Text>
                    </View>
                  )}

                {item.is_training === "1" &&
                  item.total_purchased_by_users > 0 && (
                    <View style={styles.list}>
                      <Text style={[styles.grayText]}>
                        Number of people enrolled:
                      </Text>
                      <Text style={styles.text}>
                        {item.total_purchased_by_users}
                      </Text>
                    </View>
                  )}

                {item.data_type === "EVENT" ? (
                  <View
                    style={{
                      flexDirection: "row",
                      flexWrap: "wrap",
                      marginTop: 13,
                    }}
                  >
                    <TouchableOpacity
                      onPress={() =>
                        navigation.navigate("AttendUpcoming", { item: item })
                      }
                      style={{
                        backgroundColor: color.primaryColor,
                        borderRadius: 20,
                        height: 35,
                        justifyContent: "center",
                        alignItems: "center",
                        flex: 1,
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FontFamily.Medium,
                          color: color.whiteColor,
                        }}
                      >
                        Attend
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={{
                        borderColor: color.grayColor,
                        borderWidth: 2,
                        height: 35,
                        justifyContent: "center",
                        borderRadius: 20,
                        alignItems: "center",
                        flex: 1,
                        marginHorizontal: 10,
                      }}
                      onPress={onShare}
                    >
                      <Text
                        style={{
                          fontFamily: FontFamily.Medium,
                          color: color.grayColor,
                        }}
                      >
                        Share
                      </Text>
                    </TouchableOpacity>
                  </View>
                ) : null}

                <SlideViewer
                  album={item.trailers}
                  navigation={props.navigation}
                />
              </View>

              <CustomTabs
                item={item}
                enrolled={enrolled}
                index={index}
                tab1Height={tab1Height}
                tab2Height={tab2Height}
                tab3Height={tab3Height}
                setTab1Height={setTab1Height}
                setTab2Height={setTab2Height}
                setTab3Height={setTab3Height}
                authUser={authUser}
                navigation={navigation}
              />
            </View>
          </>
        ) : (
          <ClassDetail />
        )}
      </View>
    </KeyboardAwareScrollView>
  );
};

ClassDetailScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    shadowOpacity: 0,
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => null,
});

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
    // paddingLeft: 10,
    // paddingRight: 10,
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
  courseTitle: {
    fontFamily: FontFamily.Medium,
    fontSize: 22,
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
    fontFamily: FontFamily.Regular,
  },
  primaryText: {
    color: color.primaryColor,
    fontSize: 16,
    fontFamily: FontFamily.Medium,
  },
  fillBtn: {
    marginBottom: 13,
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  fillBtnText: {
    color: "#fff",
    fontFamily: FontFamily.Medium,
    fontSize: 18,
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
  swiperImageStyle: {
    height: "100%",
    width: "100%",
  },
  paginationStyle: {
    bottom: 194,
    left: 10,
  },
  paginationText: {
    color: color.primaryColor,
    fontSize: 16,
  },
  loadingView: {
    position: "absolute",
    justifyContent: "center",
    alignItems: "center",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,.5)",
  },

  loadingImage: { position: "absolute", zIndex: 100, width: 60, height: 60 },
  slide: {
    height: 200,
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    width,
    height: 200,
    backgroundColor: "transparent",
  },
  flexStyle: {
    flex: 1,
    justifyContent: "center",
    alignContent: "center",
  },
  hidden: { display: "none" },
});

export default ClassDetailScreen;
