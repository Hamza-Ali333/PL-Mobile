import React, { PureComponent } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Linking,
  Image,
  ScrollView,
  ImageBackground,
  TouchableWithoutFeedback,
  Keyboard,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { TabView, TabBar } from "react-native-tab-view";
import { TextInput } from "react-native-paper";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import PickerComponent from "../components/pickerComponent";
import client from "../constants/client";
import contactUsMutation from "../graphql/mutations/contactUsMutation";
import MyProfileFaqs from "../components/faqs/myProfileFaqs";
import TechnicalIssueFaqs from "../components/faqs/technicalIssueFaqs";
import ProcureClassFaqs from "../components/faqs/procureClassFaqs";
import DiscussionForumFaqs from "../components/faqs/discussionForumFaqs";
import Intro from "../assets/images/t_intro.jpg";
import HomePage from "../assets/images/t_classHome.jpg";
import ProcureClass from "../assets/images/t_courses.jpg";
import Discussion from "../assets/images/t_discussion.jpg";
import Product from "../assets/images/t_product.jpg";
import Group from "../assets/images/t_group.jpg";

class HelpScreen extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      //First Tab
      index: 0,
      routes: [
        { key: "first", title: "Contact Us" },
        { key: "second", title: "Faq's" },
        { key: "third", title: "Tutorials" },
      ],
      firstName: "",
      lastName: "",
      email: "",
      position: [],
      number: 0,
      description: "",
      type: "",
      loading: false,
      expanded: false,
      // Second Tab
      myProfile: true,
      techIssue: false,
      procureClass: false,
      disForum: false,

      // Third Tab
      tutorials: [
        {
          id: 1,
          path: Intro,
          title: "Procurement League : Short Introduction",
          link: "https://youtu.be/0fBgeSJHPn8",
        },
        {
          id: 2,
          path: HomePage,
          title: "ProcureClass Main Page",
          link: "https://youtu.be/XpjbncO0N98",
        },
        {
          id: 3,
          path: ProcureClass,
          title: "Procurement Courses By Procure Class (Tutorial)",
          link: "https://youtu.be/CG0enQyaCl4",
        },
        {
          id: 4,
          path: Discussion,
          title: "Procurement Discussions On PL App.",
          link: "https://youtu.be/FTH0SWjKrKQ",
        },
        {
          id: 5,
          path: Product,
          title: "How To Buy A Single Item On PL App.",
          link: "https://youtu.be/56hacj5aNXs",
        },
        {
          id: 6,
          path: Group,
          title: "How To Create Group On PL App.",
          link: "https://youtu.be/fzMoFvDCTDk",
        },
      ],
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);

      this.setState({
        email: res.email,
        firstName: res.firstname,
        lastName: res.lastname,
      });
    });
  }

  //First Tab Related
  desLengthValidation = () => {
    const { description } = this.state;
    let position = [];
    if (description === "") {
      position[0] = " ";
    } else if (description.length < 32) {
      position[0] = "Minimum 32 characters required!";
    } else if (description.length > 500) {
      position[0] = "Maximum 500 characters allowed!";
    }
    this.setState({ position });
    if (position.length === 0) {
      return true;
    }
    return false;
  };

  setDescription = (text) => {
    this.setState({ description: text, number: text.length }, () =>
      this.desLengthValidation()
    );
  };

  onSubmit = () => {
    this.setState({ loading: true });
    const { firstName, lastName, email, type, description } = this.state;
    if (
      type === "" ||
      description === "" ||
      this.desLengthValidation() === false
    ) {
      this.setState({ loading: false });
      Alert.alert("Please fill in all the required fields.");
    } else {
      client
        .mutate({
          mutation: contactUsMutation,
          variables: {
            name: `${firstName} ${lastName}`,
            email: email,
            description: description,
            reason: "",
            type: type,
          },
        })
        .then((res) => {
          Alert.alert(
            "Thank you. Your form has been received and is being processed."
          );
          this.setState({ loading: false, type: "", description: "" });
        })
        .catch((err) => {
          Alert.alert("Unable to Submit Query: Please Try Again.");
          this.setState({ loading: false, type: "", description: "" });
        });
    }
  };

  // Second Tab Related

  _handleMyProfile = () => {
    this.setState({
      myProfile: true,
      techIssue: false,
      procureClass: false,
      disForum: false,
    });
  };

  _handleTechIssue = () => {
    this.setState({
      myProfile: false,
      techIssue: true,
      procureClass: false,
      disForum: false,
    });
  };

  _handleProcureClass = () => {
    this.setState({
      myProfile: false,
      techIssue: false,
      procureClass: true,
      disForum: false,
    });
  };

  _handleDiscussionForum = () => {
    this.setState({
      myProfile: false,
      techIssue: false,
      procureClass: false,
      disForum: true,
    });
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return (
          <TouchableWithoutFeedback
            onPress={Keyboard.dismiss}
            // showsVerticalScrollIndicator={false}
            // behavior="padding"
            // enabled
          >
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={{ flexGrow: 1 }}
            >
              <View style={styles.containerStyle}>
                <Text style={styles.titleTextStyles}>How Can We Help?</Text>
                <Text
                  style={[styles.titleTextStyles, styles.subTitleTextStyles]}
                >
                  Let's get this conversation started. We are looking for your
                  queries, feedback, and everything else you want to discuss.
                </Text>

                <View style={styles.iconsViewStyle}>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL(
                        "http://api.whatsapp.com/send?phone=+91" + 9901166886
                      )
                    }
                    activeOpacity={0.5}
                    style={styles.flexStyle}
                  >
                    <View>
                      <Image
                        source={require("../assets/images/whatsapp.png")}
                        style={{ height: 20, width: 20 }}
                      />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.textStyle}>Whatsapp</Text>
                    </View>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() =>
                      Linking.openURL("mailto:contactus@procurementleague.com")
                    }
                    activeOpacity={0.5}
                    style={styles.flexStyle}
                  >
                    <View>
                      <Image
                        source={require("../assets/images/gmail.png")}
                        style={{ height: 20, width: 20 }}
                      />
                    </View>
                    <View style={{ marginLeft: 12 }}>
                      <Text style={styles.textStyle}>Email</Text>
                    </View>
                  </TouchableOpacity>
                </View>
                <View style={{ marginTop: 10 }} />
                <TextInput
                  underlineColor="transparent"
                  style={styles.textInputStyles}
                  theme={{ colors: { primary: color.primaryColor } }}
                  label="Name*"
                  value={`${this.state.firstName} ${this.state.lastName}`}
                  editable={false}
                />
                <View style={{ marginTop: 20 }} />
                <TextInput
                  underlineColor="transparent"
                  style={styles.textInputStyles}
                  theme={{ colors: { primary: color.primaryColor } }}
                  label="Email*"
                  value={this.state.email}
                  editable={false}
                />
                <View style={{ marginTop: 20 }} />
                <PickerComponent
                  marginBottom={1}
                  nameText={"Type*"}
                  items={[
                    { label: "Type*", value: "Type*" },
                    { label: "Profile", value: "Profile" },
                    {
                      label: "Technical Issue",
                      value: "Technical Issue",
                    },
                    { label: "Procure Class", value: "Procure Class" },
                    { label: "Discussion Forum", value: "Discussion Forum" },
                    { label: "Others", value: "Others" },
                  ]}
                  onSelect={(pickerValue) => {
                    if (pickerValue === "Type*") {
                      this.setState({ type: "" });
                    } else {
                      this.setState({ type: pickerValue });
                    }
                  }}
                />

                <View
                  style={{ marginTop: Platform.OS === "android" ? 20 : 130 }}
                />
                <View style={styles.textLengthStyles}>
                  <Text style={{ color: "red" }}>{this.state.position[0]}</Text>
                  <Text style={{ color: color.grayColor }}>
                    {this.state.number}/500
                  </Text>
                </View>
                <View
                  style={{
                    flex: 1,
                    height: 150,
                  }}
                >
                  <TextInput
                    textAlignVertical={"top"}
                    underlineColor={"transparent"}
                    style={styles.desBoxStyles}
                    theme={{ colors: { primary: color.primaryColor } }}
                    multiline={true}
                    numberOfLines={5}
                    label={"Description*"}
                    placeholder={
                      "Would you please write your question or a description of the problem you're trying to solve here?"
                    }
                    value={this.state.description}
                    onChangeText={(description) =>
                      this.setDescription(description)
                    }
                  />
                </View>
                <View style={{ marginTop: 20 }} />

                {this.state.loading ? (
                  <View style={styles.submitButtonStyle}>
                    <ActivityIndicator size={24} color="white" />
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => this.onSubmit()}
                    disabled={false}
                    style={styles.submitButtonStyle}
                  >
                    <Text style={styles.buttonTextStyle}>Submit</Text>
                  </TouchableOpacity>
                )}
              </View>
            </ScrollView>
          </TouchableWithoutFeedback>
        );

      case "second":
        return (
          <View style={styles.containerStyle}>
            <View style={styles.buttonViewStyle}>
              <ScrollView
                horizontal={true}
                showsHorizontalScrollIndicator={false}
              >
                <TouchableOpacity
                  onPress={() => {
                    this._handleMyProfile();
                  }}
                  style={[
                    styles.buttonStyle,

                    {
                      backgroundColor: this.state.myProfile
                        ? color.primaryColor
                        : color.lightGrayColor,
                    },
                  ]}
                >
                  <Text
                    style={{ color: this.state.myProfile ? "white" : "black" }}
                  >
                    My Profile
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  rippleContainerBorderRadius={50}
                  onPress={() => this._handleTechIssue()}
                  style={[
                    styles.buttonStyle,
                    ,
                    {
                      backgroundColor: this.state.techIssue
                        ? color.primaryColor
                        : color.lightGrayColor,
                    },
                  ]}
                >
                  <Text
                    style={{ color: this.state.techIssue ? "white" : "black" }}
                  >
                    Technical Issue
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  rippleContainerBorderRadius={50}
                  onPress={() => this._handleProcureClass()}
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor: this.state.procureClass
                        ? color.primaryColor
                        : color.lightGrayColor,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: this.state.procureClass ? "white" : "black",
                    }}
                  >
                    Procure Class
                  </Text>
                </TouchableOpacity>
                <TouchableOpacity
                  rippleContainerBorderRadius={50}
                  onPress={() => this._handleDiscussionForum()}
                  style={[
                    styles.buttonStyle,
                    {
                      backgroundColor: this.state.disForum
                        ? color.primaryColor
                        : color.lightGrayColor,
                      marginRight: 20,
                    },
                  ]}
                >
                  <Text
                    style={{
                      color: this.state.disForum ? "white" : "black",
                    }}
                  >
                    Discussion Forum
                  </Text>
                </TouchableOpacity>
              </ScrollView>
            </View>

            {this.state.myProfile ? (
              <MyProfileFaqs />
            ) : this.state.techIssue ? (
              <TechnicalIssueFaqs />
            ) : this.state.procureClass ? (
              <ProcureClassFaqs />
            ) : this.state.disForum ? (
              <DiscussionForumFaqs />
            ) : (
              false
            )}
          </View>
        );
      case "third":
        return (
          <ScrollView
            showsVerticalScrollIndicator={false}
            style={styles.containerStyle}
          >
            {this.state.tutorials.map((tutorial) => (
              <TouchableOpacity
                activeOpacity={0.8}
                onPress={() => Linking.openURL(tutorial.link)}
                style={styles.tutorialImageViewStyle}
              >
                <ImageBackground
                  imageStyle={styles.tutorialImageStyle}
                  source={tutorial.path}
                  style={styles.tutorialBgImageStyle}
                  resizeMode="contain"
                >
                  <Image
                    source={require("../assets/images/play-button.png")}
                    style={{ height: 50, width: 50 }}
                  />
                </ImageBackground>

                <View style={styles.tutorialTitleViewStyle}>
                  <Text style={styles.tutorialTitleTextStyle}>
                    {tutorial.title}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        );
      default:
        return null;
    }
  };

  setIndex = (index) => {
    this.setState({ index });
  };

  render() {
    const { index, routes } = this.state;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <TabView
          tabBarPosition="top"
          navigationState={{ index, routes }}
          renderScene={this.renderScene}
          onIndexChange={this.setIndex}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: color.primaryColor }}
              indicatorContainerStyle={{
                backgroundColor: color.whiteColor,
              }}
              activeColor={color.primaryColor}
              inactiveColor={color.blackColor}
              labelStyle={{
                fontFamily: FontFamily.Regular,
                fontSize: 14,
              }}
            />
          )}
        />
      </View>
    );
  }
}

HelpScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Help Center</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  containerStyle: { flex: 1, backgroundColor: "#fff", padding: 15 },
  titleTextStyles: {
    textAlign: "center",
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 18,
  },
  iconsViewStyle: {
    height: 60,
    flexDirection: "row",
  },
  subTitleTextStyles: {
    fontSize: 13,
    paddingRight: 40,
    paddingLeft: 40,
    paddingTop: 7,
    paddingBottom: 17,
  },
  textStyle: {
    color: "grey",
    fontSize: 14,
  },
  flexStyle: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
  },
  textInputStyles: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    height: 60,
  },
  desBoxStyles: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    flex: 1,
  },
  submitButtonStyle: {
    backgroundColor: color.primaryColor,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
  },
  buttonTextStyle: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  textLengthStyles: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "row",
  },
  buttonStyle: {
    height: 40,
    width: 200,
    borderRadius: 10,
    justifyContent: "center",
    alignItems: "center",
    marginRight: 10,
  },
  buttonViewStyle: {
    height: 50,
    width: "100%",
  },
  tutorialImageViewStyle: {
    backgroundColor: "#fff",
    height: 300,
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 5,
    marginBottom: 20,
  },
  tutorialImageStyle: {
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
  },
  tutorialTitleViewStyle: {
    height: 50,
    justifyContent: "center",
    backgroundColor: "white",
    borderBottomRightRadius: 10,
    borderBottomLeftRadius: 10,
  },
  tutorialTitleTextStyle: {
    paddingLeft: 15,
    fontWeight: "bold",
  },
  tutorialBgImageStyle: {
    height: 250,
    justifyContent: "center",
    alignItems: "center",
  },
  circleStyle: {
    height: 40,
    width: 40,
    borderRadius: 50,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "white",
  },
});

export default HelpScreen;
