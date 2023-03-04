import React from "react";
import {
  Alert,
  ActivityIndicator,
  Button,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Keyboard,
  TextInput,
  Platform,
  UIManager,
  ScrollView,
  SafeAreaView,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import moment from "moment";
import DateTimePicker from "@react-native-community/datetimepicker";
import color from "../../../constants/Colors.js";
import link from "../../../constants/link";
import FontFamily from "../../../constants/FontFamily.js";
import { Avatar } from "react-native-paper";
import firstChar from "../../../helper/firstChar";
import { List } from "react-native-paper";
import createOfferMutation from "../../../graphql/mutations/createOfferMutation";
import getOffer from "../../../graphql/queries/getOffer";
import client from "../../../constants/client";
import capitalize from "../../../helper/capitalize";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";

class index extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      title: "",
      description: "",
      award: "",
      message: "",
      snackEnable: false,
      visible: false,
      topic_ids: [],
      tag_ids: [],
      tag_data: [],
      user_ids: [],
      user_data: [],
      emails: [],
      me: {},
      status: 1,
      fromDate: this.formatDate(new Date(), "MMM, DD, YYYY"),
      fromObject: new Date(),
      toObject: new Date(),
      toDate: this.formatDate(null, "MMM, DD, YYYY"),
      fromDateShow: false,
      toDateShow: false,
      position: [],
      errorMessage: [],
      offer_id: null,
      scaleAnimationDialog: false,
      offer: {},
      company: {},
      visibility: false,
      show: true,
      flexDirection: "row",
      loading: false,
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  formatDate = (str, format) => {
    if (str) {
      return moment(str).format(format);
    }
    return format;
  };

  componentDidMount() {
    this.props.navigation.setParams({
      postNewOffer: this.postNewOffer,
    });

    this.props.navigation.setParams({
      navigateToHome: this.navigateToHome,
    });

    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
  }

  tapOnTabNavigator = () => {
    if (this.props.navigation.getParam("id")) {
      this.setState({ loading: true });
      this.getOffer(this.props.navigation.getParam("id"));
    }
    this.setState({ visibility: false });
  };

  updateTopics = (data) => {
    this.setState({ topic_ids: data });
  };

  updateCompany = (data) => {
    this.setState({ company: data });
  };

  updateTags = (data) => {
    this.setState({ tag_data: data });
    let tagIds = [];
    data.map((item, index) => {
      tagIds.push(parseInt(item.id));
    });
    this.setState({ tag_ids: tagIds });
  };

  updateUsers = (data) => {
    this.setState({ user_data: data });
    let usersIds = [];
    data.map((item, index) => {
      usersIds.push(parseInt(item.id));
    });
    this.setState({ user_ids: usersIds });
  };

  updateEmails = (data) => {
    this.setState({ emails: data });
  };

  setTitle = (title) => {
    this.setState({ title });
  };

  setAward = (award) => {
    this.setState({ award });
  };

  displayError = (error) => {
    try {
      if (error) {
        let { graphQLErrors } = error;
        if (graphQLErrors[0].extensions.category === "validation") {
          this.validationErrors = graphQLErrors[0].extensions.validation;
        }
      }
      let errorMessage = [];
      for (var key in this.validationErrors) {
        var value = this.validationErrors[key];
        errorMessage.push(value[0]);
      }

      this.setState({ errorMessage });
    } catch (e) {}
  };

  postNewOffer = () => {
    Keyboard.dismiss();
    if (this.state.visibility == "1") {
      Alert.alert(
        "",
        "Published offer cannot be edit",
        [{ text: "OK", onPress: () => console.log("OK Pressed") }],
        { cancelable: false }
      );
      return false;
    }
    let flag = true;
    let position = [];

    if (this.state.company.id === undefined) {
      this.props.navigation.navigate("MyCompany", {
        updateCompany: this.updateCompany,
      });
      return false;
    }

    if (this.state.title === "") {
      position[0] = "title field is required!";
      //this.setState({snackEnable: true,message: "Please enter description"});
      flag = false;
    }
    if (this.state.title.length > 100) {
      position[0] = "The text length cannot exceed the limit 100";
      flag = false;
    }
    if (this.state.award === "") {
      position[2] = "award field is required!";
      //this.setState({snackEnable: true,message: "Please enter description"});
      flag = false;
    }
    if (this.state.fromDate === "" || this.state.fromDate === "MMM, DD, YYYY") {
      position[1] = "select period";
      //this.setState({snackEnable: true,message: "Please enter description"});
      flag = false;
    }

    this.setState({ position });

    if (!flag) {
      return false;
    }

    this.setState({ scaleAnimationDialog: true, errorMessage: [] });

    this.submitQuestion();
  };

  submitQuestion = () => {
    client
      .mutate({
        mutation: createOfferMutation,
        variables: {
          company: this.state.company.id,
          offer_id: this.state.offer_id,
          status: this.state.status,
          title: this.state.title,
          description: this.state.description,
          award: this.state.award,
          //categories: this.state.topic_ids,
          //invites: this.state.user_ids,
          //tags: this.state.tag_ids,
          from: this.formatDate(this.state.fromDate, "YYYY-MM-DD"),
          to:
            this.state.toDate === "MMM, DD, YYYY"
              ? null
              : this.formatDate(this.state.toDate, "YYYY-MM-DD"),
          visibility: 0,
        },
      })
      .then((results) => {
        if (results.data.createOffer.id) {
          this.setState({
            offer_id: results.data.createOffer.id,
            scaleAnimationDialog: false,
          });
          this.props.navigation.navigate("YourAttachment", {
            data: results.data.createOffer,
            offer: this.state.offer,
          });
        }
        //this.props.navigation.setParams({ postLoading: false });
      })
      .catch((res) => {
        this.displayError(res);
        this.setState({
          scaleAnimationDialog: false,
        });
        // const errors = res.graphQLErrors.map((error) => {
        //   //return error.message;
        // });
      });
  };

  showModal() {
    this.setState({ visible: true });
  }
  hideModal() {
    this.setState({ visible: false });
  }

  _setStatus = (status) => {
    this.setState({ status: status });
    this.hideModal();
  };

  changeFromDate = (event, date) => {
    if (date !== undefined) {
      let state = {
        fromObject: date,
        fromDate: this.formatDate(date, "MMM, DD, YYYY"),
        toObject: date,
        toDate: this.formatDate(null, "MMM, DD, YYYY"),
      };
      if (Platform.OS === "android") {
        state.fromDateShow = false;
      }
      this.setState(state);
    } else {
      this.setState({
        fromDateShow: false,
      });
    }
  };

  changeToDate = (event, date) => {
    if (date !== undefined) {
      let state = {
        toObject: date,
        toDate: this.formatDate(date, "MMM, DD, YYYY"),
      };
      if (Platform.OS === "android") {
        state.toDateShow = false;
      }

      this.setState(state);
    } else {
      this.setState({
        toDateShow: false,
      });
    }
  };

  navigateToHome = () => {
    this.setState({ show: false });
    this.props.navigation.navigate("Ask");
  };

  getOffer = (id) => {
    client
      .query({
        query: getOffer,
        variables: { id: id },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let topic_ids = [];
        let tag_ids = [];
        let tag_data = [];
        let user_ids = [];
        let user_data = [];
        result.data.offer.categories.map((category) => {
          topic_ids.push(category.id);
        });
        result.data.offer.tags.map((tag) => {
          tag_ids.push(tag.id);
        });
        tag_data = result.data.offer.tags;

        result.data.offer.invites.map((invite) => {
          user_ids.push(invite.id);
        });
        user_data = result.data.offer.invites;

        if (!result.loading) {
          this.setState({
            offer: result.data.offer,
            offer_id: result.data.offer.id,
            visibility: result.data.offer.visibility,
            status: result.data.offer.status,
            title: result.data.offer.title,
            description: result.data.offer.description,
            fromDate: this.formatDate(result.data.offer.from, "MMM, DD, YYYY"),
            toDate: this.formatDate(result.data.offer.to, "MMM, DD, YYYY"),
            fromObject: new Date(
              Date.parse(moment(result.data.offer.from, "DD-MM-YYYY"))
            ),
            toObject: new Date(
              Date.parse(moment(result.data.offer.to, "DD-MM-YYYY"))
            ),
            award: result.data.offer.award,
            topic_ids: topic_ids,
            tag_ids: tag_ids,
            tag_data: tag_data,
            user_ids: user_ids,
            user_data: user_data,
            company: result.data.offer.company,
            loading: false,
          });
        }
      })
      .catch((error) => {});
  };
  render() {
    if (this.state.loading)
      return (
        <View style={{ flex: 1, justifyContent: "center" }}>
          <ActivityIndicator size="large" color={color.primaryColor} />
        </View>
      );

    let d = new Date(
      Date.parse(moment(this.state.fromObject, "DD-MM-YYYY").add("days", 1))
    );

    let url = link.url + "/" + this.state.company.logo;

    const { navigate } = this.props.navigation;
    return (
      <SafeAreaView style={[styles.postQuestionPage]}>
        <KeyboardAwareScrollView
          behavior={Platform.OS == "ios" ? "padding" : "height"}
          enabled
        >
          <View style={{ flex: 1, justifyContent: "flex-end" }}>
            <ScrollView
              style={{
                flex: 1,
                backgroundColor: "#fff",
                paddingLeft: 15,
                paddingRight: 15,
              }}
            >
              <TouchableWithoutFeedback>
                <View style={styles.postQuestionProfile}>
                  <View style={{ flexDirection: "row", flex: 3 }}>
                    {Object.keys(this.state.company).length > 0 ? (
                      <TouchableWithoutFeedback
                        onPress={() =>
                          this.props.navigation.navigate("MyCompany", {
                            updateCompany: this.updateCompany,
                          })
                        }
                      >
                        <View style={{ flexDirection: "row", flex: 1 }}>
                          {this.state.company.logo ? (
                            <Avatar.Image
                              style={{ marginRight: 15 }}
                              size={50}
                              source={{ uri: url }}
                            />
                          ) : (
                            <Avatar.Text
                              style={{ marginRight: 15 }}
                              size={50}
                              label={firstChar(this.state.company.title)}
                            />
                          )}

                          <View style={{ justifyContent: "center" }}>
                            <Text style={styles.userName}>
                              {capitalize(this.state.company.title)}
                            </Text>
                            <Text>{this.state.company.linked_in_profile}</Text>
                          </View>
                        </View>
                      </TouchableWithoutFeedback>
                    ) : (
                      <TouchableOpacity
                        style={styles.SignUpButton}
                        onPress={() =>
                          this.props.navigation.navigate("MyCompany", {
                            updateCompany: this.updateCompany,
                          })
                        }
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 16,
                            fontFamily: FontFamily.Regular,
                          }}
                        >
                          Choose your company
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>

                  {/* <View
                                     style={{
                                       flex: 1,
                                       flexDirection: "row",
                                       justifyContent: "space-between",
                                     }}
                                   >
                                     <View
                                       style={{
                                         alignItems: "flex-end",
                                         justifyContent: "center",
                                       }}
                                     >
                                       <TouchableOpacity
                                         activeOpacity={0.9}
                                         style={styles.questionStatus}
                                         onPress={() => this.showModal()}
                                       >
                                         <Text style={styles.questionStatusTitle}>
                                           {this.state.status === 1 ? "Public" : "Private"}
                                         </Text>
                                         <Image
                                           style={{ width: 7, height: 6, resizeMode: "contain" }}
                                           source={require("../../../assets/images/polygon-down.png")}
                                         />
                                       </TouchableOpacity>
                                     </View>
                                   </View>*/}
                </View>
              </TouchableWithoutFeedback>

              <View
                style={{
                  backgroundColor: "#F3F5FB",
                  borderRadius: 10,
                  marginTop: 30,
                }}
              >
                <View
                  style={{
                    backgroundColor: "#F3F5FB",
                    borderRadius: 10,
                    height: 50,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{
                      fontSize: 18,
                      fontFamily: FontFamily.Medium,
                      color: color.blackColor,
                    }}
                  >
                    Access
                  </Text>
                </View>
                <TouchableOpacity
                  onPress={() => this._setStatus(1)}
                  style={{
                    backgroundColor:
                      this.state.status === 1 ? "#E9EBF2" : "#F3F5FB",
                    height: 75,
                    justifyContent: "center",
                    paddingLeft: 20,
                  }}
                >
                  <List.Item
                    style={{}}
                    titleStyle={{
                      fontSize: 17,
                      fontFamily: FontFamily.Medium,
                      color: color.blackColor,
                      marginLeft: 5,
                    }}
                    title="Public"
                    descriptionStyle={{
                      fontSize: 14,
                      fontFamily: FontFamily.Regular,
                      color: color.blackColor,
                      marginLeft: 5,
                    }}
                    description="Visible to Community"
                    left={(props) => (
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          resizeMode: "contain",
                          marginTop: 12,
                        }}
                        source={require("../../../assets/images/offer-public.png")}
                      />
                    )}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => this._setStatus(0)}
                  style={{
                    backgroundColor:
                      this.state.status === 0 ? "#E9EBF2" : "#F3F5FB",
                    borderRadius: 10,
                    height: 75,
                    justifyContent: "center",
                    paddingLeft: 20,
                  }}
                >
                  <List.Item
                    style={{}}
                    titleStyle={{
                      fontSize: 17,
                      fontFamily: FontFamily.Medium,
                      color: color.blackColor,
                      marginLeft: 5,
                    }}
                    title="Private"
                    descriptionStyle={{
                      fontSize: 14,
                      fontFamily: FontFamily.Regular,
                      color: color.blackColor,
                      marginLeft: 5,
                    }}
                    description="Only invited users see this"
                    left={(props) => (
                      <Image
                        style={{
                          width: 25,
                          height: 25,
                          resizeMode: "contain",
                          marginTop: 12,
                        }}
                        source={require("../../../assets/images/offer-private.png")}
                      />
                    )}
                  />
                </TouchableOpacity>
              </View>

              <View style={{ marginTop: 30 }}>
                <Text style={styles.dateRangeText}>Title</Text>
                <View style={{ marginTop: 10 }}>
                  <TextInput
                    style={[
                      styles.awardTextInput,
                      this.state.position[0]
                        ? { borderColor: "red", borderWidth: 1 }
                        : {},
                    ]}
                    placeholder="Procurement League"
                    value={this.state.title}
                    onChangeText={this.setTitle}
                  />
                  {/* {this.state.position[0] ? (
                    <Text style={{ color: "red" }}>
                      {this.state.position[0]}
                    </Text>
                  ) : null} */}
                </View>
              </View>
              <View style={{ marginTop: 30 }}>
                <Text style={styles.dateRangeText}>Period</Text>
                <View style={{ flexDirection: "row", marginTop: 10 }}>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    {Platform.OS === "ios" ? (
                      <Dialog
                        dialogStyle={{ borderRadius: 24 }}
                        onTouchOutside={() => {
                          this.setState({ fromDateShow: false });
                        }}
                        width={0.9}
                        visible={this.state.fromDateShow}
                        dialogAnimation={new ScaleAnimation()}
                        dialogTitle={
                          <DialogTitle title="From date" hasTitleBar={false} />
                        }
                      >
                        <DialogContent>
                          <DateTimePicker
                            style={{ width: "100%", backgroundColor: "white" }}
                            testID="dateTimePickerFrom"
                            minimumDate={new Date()}
                            mode="date"
                            value={this.state.fromObject}
                            onChange={this.changeFromDate}
                          />
                          <Button
                            title="OK"
                            onPress={() =>
                              this.setState({ fromDateShow: false })
                            }
                          />
                        </DialogContent>
                      </Dialog>
                    ) : this.state.fromDateShow ? (
                      <DateTimePicker
                        style={{ width: "100%", backgroundColor: "white" }}
                        testID="dateTimePickerFrom"
                        minimumDate={new Date()}
                        mode="date"
                        value={this.state.fromObject}
                        onChange={this.changeFromDate}
                      />
                    ) : null}

                    <TouchableOpacity
                      onPress={() => this.setState({ fromDateShow: true })}
                    >
                      <Text style={styles.dateFromText}>
                        {this.state.fromDate}
                      </Text>
                    </TouchableOpacity>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-around",
                    }}
                  >
                    {Platform.OS === "ios" ? (
                      <Dialog
                        dialogStyle={{ borderRadius: 24 }}
                        onTouchOutside={() => {
                          this.setState({ toDateShow: false });
                        }}
                        width={0.9}
                        visible={this.state.toDateShow}
                        dialogAnimation={new ScaleAnimation()}
                        dialogTitle={
                          <DialogTitle title="To date" hasTitleBar={false} />
                        }
                      >
                        <DialogContent>
                          <DateTimePicker
                            style={{ width: "100%", backgroundColor: "white" }}
                            testID="dateTimePickerTo"
                            minimumDate={d}
                            mode="date"
                            value={this.state.toObject}
                            onChange={this.changeToDate}
                          />
                          <Button
                            title="OK"
                            onPress={() => this.setState({ toDateShow: false })}
                          />
                        </DialogContent>
                      </Dialog>
                    ) : this.state.toDateShow ? (
                      <DateTimePicker
                        testID="dateTimePickerTo"
                        minimumDate={d}
                        mode="date"
                        value={this.state.toObject}
                        onChange={this.changeToDate}
                      />
                    ) : null}

                    <TouchableOpacity
                      onPress={() => this.setState({ toDateShow: true })}
                    >
                      <Text style={styles.dateFromText}>
                        {this.state.toDate}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
                {this.state.position[1] ? (
                  <Text style={{ color: "red" }}>{this.state.position[1]}</Text>
                ) : null}
              </View>
              <View style={{ marginTop: 30, marginBottom: 20 }}>
                <Text style={styles.dateRangeText}>Enter award</Text>
                <View style={{ marginTop: 10 }}>
                  <TextInput
                    style={[
                      styles.awardTextInput,
                      this.state.position[2]
                        ? { borderColor: "red", borderWidth: 1 }
                        : {},
                    ]}
                    placeholder="Describe value of award"
                    value={this.state.award}
                    onChangeText={this.setAward}
                  />
                  {/* {this.state.position[2] ? (
                    <Text style={{ color: "red" }}>
                      {this.state.position[2]}
                    </Text>
                  ) : null} */}
                </View>
              </View>

              <View>
                {this.state.position[3] ? (
                  <Text style={{ color: "red" }}>{this.state.position[3]}</Text>
                ) : null}

                {this.state.errorMessage.map((error, index) => (
                  <Text key={index} style={{ color: "red" }}>
                    {error}
                  </Text>
                ))}
              </View>

              <Dialog
                dialogStyle={{ borderRadius: 24 }}
                onTouchOutside={() => {
                  this.setState({ scaleAnimationDialog: false });
                }}
                width={0.7}
                visible={this.state.scaleAnimationDialog}
                dialogAnimation={new ScaleAnimation()}
                dialogTitle={
                  <DialogTitle title="Save as draft" hasTitleBar={false} />
                }
              >
                <DialogContent>
                  <ActivityIndicator size="large" color={color.primaryColor} />
                </DialogContent>
              </Dialog>
            </ScrollView>
          </View>
          {/* <Modal
                animationType="fade"
                transparent={true}
                visible={this.state.visible}
              >
                <View style={styles.bottomModal}>
                  <View style={styles.modalContent}>
                    <TouchableOpacity
                      style={styles.modalCloseIcon}
                      onPress={() => this.hideModal()}
                    >
                      <Ionicons name="ios-close" size={32} color="red" />
                    </TouchableOpacity>
                    <Text
                      style={styles.modalCloseList}
                      onPress={() => this.hideModal()}
                    >
                      ACCESS
                    </Text>
                    <List.Item
                      onPress={() => this._setStatus(1)}
                      style={[
                        styles.BottomOptionListItems,
                        {
                          backgroundColor:
                            this.state.status === 1 ? "#F5F5F5" : "#ffffff",
                        },
                      ]}
                      titleStyle={{
                        fontSize: 16,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                      title="Public"
                      descriptionNumberOfLines={4}
                      descriptionStyle={{
                        fontSize: 14,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                      description="Everyone sees in their feed"
                      left={(props) => (
                        <Image
                          style={styles.modalListItemIcons}
                          source={require("../../../assets/images/offer-public.png")}
                        />
                      )}
                    />

                    <List.Item
                      onPress={() => this._setStatus(0)}
                      style={[styles.BottomOptionListItems,
                        {
                          backgroundColor:
                            this.state.status === 0 ? "#F5F5F5" : "#ffffff",
                        },
                        ]}
                      titleStyle={{
                        fontSize: 16,
                        fontFamily: FontFamily.Regular,
                        color: "#000",
                      }}
                      title="Private"
                      descriptionNumberOfLines={4}
                      descriptionStyle={{
                        fontSize: 14,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                      description="Users you invite and only your team(s) see this"
                      left={(props) => (
                        <Image
                          style={styles.modalListItemIcons}
                          source={require("../../../assets/images/offer-private.png")}
                        />
                      )}
                    />
                    
                  </View>
                </View>
              </Modal> */}
        </KeyboardAwareScrollView>
      </SafeAreaView>
    );
  }
}

index.navigationOptions = (screenProps) => ({
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
  headerLeft: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("navigateToHome")}
      style={{ padding: 15, justifyContent: "center", alignItems: "center" }}
    >
      <Ionicons name="ios-close" color={color.primaryColor} size={42} />
    </TouchableOpacity>
  ),
  headerTitle: () => (
    <Text style={styles.postQuestionPageTitle}>New offer</Text>
  ),
  headerRight: () => (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={screenProps.navigation.getParam("postNewOffer")}
    >
      <Text style={styles.postText}>Next</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  touchRightHeadText: {
    padding: 10,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  postQuestionPage: {
    flex: 1,
    backgroundColor: "#fff",
  },
  postQuestionProfile: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  userProfile: {
    marginRight: 10,
    width: 38,
    height: 38,
    overflow: "visible",
    borderRadius: 90,
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
  questionStatus: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    width: 80,
    height: 28,
    borderWidth: 1,
    borderColor: color.primaryColor,
    borderRadius: 6,
  },
  earthIcon: {
    color: "#878787",
    fontSize: 14,
  },
  questionStatusTitle: {
    color: color.blackColor,
    fontSize: 12,
    fontFamily: FontFamily.Regular,
  },
  questionStatusArrow: {
    color: color.blackColor,
    fontSize: 15,
  },
  postQuestionTextareaConatiner: {
    flex: 1 / 1.4,
    marginLeft: 15,
    marginRight: 15,
    flexDirection: "row",
  },
  postQuestionTextInput: {
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    width: "100%",
    textAlignVertical: "top",
    backgroundColor: color.lightGrayColor,
    borderRadius: 8,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
  postQuestionBottomOption: {
    flex: 1,
    justifyContent: "flex-end",
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
  },
  BottomOptionImage: {
    width: 24,
    height: 24,
    marginTop: 5,
    marginRight: 8,
    marginLeft: 8,
  },
  bottomModal: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "stretch",
  },
  modalContent: {
    backgroundColor: "#fff",
    paddingBottom: 20,
    // height:Dimensions.get('window').height/2.5,
  },
  modalListItemIcons: {
    width: 20,
    height: 20,
    marginTop: 8,
    marginRight: 5,
    marginLeft: 5,
  },
  modalCloseList: {
    color: color.blackColor,
    textAlign: "center",
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalCloseIcon: {
    alignContent: "flex-end",
    position: "absolute",
    right: 15,
    top: 5,
    zIndex: 1,
  },
  chipFilters: {
    borderRadius: 6,
    marginRight: 2,
    backgroundColor: "#fff",
    flex: 1,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    height: 30,
    borderWidth: 1,
    borderColor: color.primaryColor,
  },

  dateRangeText: {
    fontSize: 24,
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
  },
  dateFromText: {
    fontSize: 17,
    fontFamily: FontFamily.Regular,
    color: "#929292",
  },
  awardTextInput: {
    borderColor: "#bfbfbf",
    padding: 13,
    color: color.blackColor,
    fontSize: 16,
    backgroundColor: "#F3F5FB",
    borderRadius: 6,
    height: 43,
  },
  SignUpButton: {
    paddingTop: 10,
    paddingBottom: 10,
    borderRadius: 10,
    paddingLeft: 20,
    paddingRight: 20,
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#FF8635",
    borderRadius: 10,
    height: 46,
  },
});

export default index;
