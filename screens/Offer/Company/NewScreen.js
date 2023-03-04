import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import color from "../../../constants/Colors.js";
import link from "../../../constants/link";
import FontFamily from "../../../constants/FontFamily.js";
import { Avatar } from "react-native-paper";
import firstChar from "../../../helper/firstChar";
import client from "../../../constants/client";
import getCompany from "../../../graphql/queries/getCompany";
import ProfilePhoto from "../../../components/ProfilePhoto";
import createCompanyMutation from "../../../graphql/mutations/createCompanyMutation";

class NewScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      AvatarText: "PL",
      title: "",
      link: "",
      url: "",
      company_id: null,
      errorMessage: [],
      position: [],
      user_ids: [],
      executives: [],
      loading: false,
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      postNewCompany: this.submitCompany,
    });
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      const file = await this.handleUploadPhoto(result.uri);
      this.setState({ logo: result.uri, url: file.path });
    }
  };

  changeText = (text) => {
    let arrayString = text.split(" ");
    if (arrayString.length === 1) {
      this.setState({ AvatarText: firstChar(arrayString[0]), title: text });
    } else {
      this.setState({
        AvatarText: firstChar(arrayString[0]) + firstChar(arrayString[1]),
        title: text,
      });
    }
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

  tapOnTabNavigator = () => {
    if (this.props.navigation.getParam("id")) {
      if (!this.state.company_id) {
        this.setState({ loading: true });
        this.getCompany(this.props.navigation.getParam("id"));
      }
    }
  };

  submitCompany = () => {
    let flag = true;
    let position = [];

    if (this.state.title === "" || this.state.title === null) {
      position[0] = "Please enter campany title";
      flag = false;
    }
    if (this.state.link === "" || this.state.link === null) {
      position[1] = "Please enter campany website";
      flag = false;
    }
    if (this.state.url === "" || this.state.url === null) {
      position[2] = "Please select campany logo";
      flag = false;
    }

    this.setState({ position });

    if (!flag) {
      return false;
    }
    this.setState({ errorMessage: [] });
    client
      .mutate({
        mutation: createCompanyMutation,
        variables: {
          company_id: this.state.company_id,
          title: this.state.title,
          link: this.state.link,
          logo: this.state.url,
          executives: this.state.user_ids,
        },
      })
      .then((results) => {
        if (results.data.createCompany.id) {
          if (this.props.navigation.getParam("_selectNewCmpany")) {
            this.props.navigation.state.params._selectNewCmpany(
              results.data.createCompany
            );
          }
          if (this.props.navigation.getParam("refetch")) {
            this.props.navigation.state.params.refetch();
          }
          this.props.navigation.goBack();
        }
        //this.props.navigation.setParams({ postLoading: false });
      })
      .catch((res) => {
        this.displayError(res);
      });
  };

  createFormData = (photo, body) => {
    const data = new FormData();

    data.append("file", {
      name: "photo-file.jpg",
      type: "image/jpg",
      uri: Platform.OS === "android" ? photo : photo.replace("", ""),
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  handleUploadPhoto = (file) => {
    return fetch(link.url + "/api/attachment/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        //Authorization: `Bearer ${this.state.token}` || null,
      },
      body: this.createFormData(file, { userId: "123" }),
    })
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  updateUsers = (data) => {
    this.setState({ executives: data });
    let usersIds = [];
    data.map((item, index) => {
      usersIds.push(parseInt(item.id));
    });
    this.setState({ user_ids: usersIds });
  };

  getCompany = (id) => {
    client
      .query({
        query: getCompany,
        variables: { id: id },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let user_ids = [];

        if (!result.loading) {
          result.data.company.executives.map((executive) => {
            user_ids.push(executive.id);
          });
          let logo = result.data.company.logo
            ? link.url + "/" + result.data.company.logo
            : null;
          let arrayString = result.data.company.title.split(" ");
          let AvatarText = "";
          if (arrayString.length === 1) {
            AvatarText = firstChar(arrayString[0]);
          } else {
            AvatarText = firstChar(arrayString[0]) + firstChar(arrayString[1]);
          }

          this.setState({
            company_id: result.data.company.id,
            title: result.data.company.title,
            link: result.data.company.linked_in_profile,
            url: result.data.company.logo,
            logo: logo,
            executives: result.data.company.executives,
            AvatarText: AvatarText,
            user_ids: user_ids,
            loading: false,
          });
        }
      })
      .catch((error) => {});
  };

  render() {
    const { navigate } = this.props.navigation;
    const { title, link, logo, loading } = this.state;
    if (loading)
      return (
        <ActivityIndicator
          style={{ justifyContent: "center" }}
          color={color.primaryColor}
          size="large"
        />
      );

    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View style={styles.postQuestionProfile}>
          <TouchableOpacity
            onPress={this._pickImage}
            style={[styles.addCompanyLogo]}
          >
            {logo ? (
              <Avatar.Image size={70} source={{ uri: logo }} />
            ) : (
              <Avatar.Text
                style={[
                  this.state.position[2]
                    ? { borderWidth: 2, borderColor: "red" }
                    : {},
                ]}
                size={70}
                label={this.state.AvatarText}
              />
            )}
            <View style={styles.addCompanyPlusIcon}>
              <AntDesign name="plus" size={15} color="#fff" />
            </View>
          </TouchableOpacity>
          <View style={{ flex: 1, justifyContent: "center" }}>
            <TextInput
              style={[
                styles.companyTextInputs,
                this.state.position[0]
                  ? { borderColor: "red", borderWidth: 1 }
                  : {},
              ]}
              placeholder="Enter company name"
              onChangeText={(text) => this.changeText(text)}
            >
              {title}
            </TextInput>
          </View>
        </View>
        <View style={{ marginTop: 35 }}>
          <Text style={[styles.headingTittle, { marginBottom: 5 }]}>
            Web Sites
          </Text>
          <TextInput
            dataDetectorTypes="link"
            style={[
              styles.companyTextInputs,
              this.state.position[1]
                ? { borderColor: "red", borderWidth: 1 }
                : {},
            ]}
            placeholder="Enter website link"
            onChangeText={(text) => this.setState({ link: text })}
          >
            {link}
          </TextInput>
        </View>
        <View style={{ marginTop: 35 }}>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <Text style={styles.headingTittle}>Executives</Text>
          </View>

          {this.state.executives.map((executive, index) => (
            <View key={index} style={styles.ListItems}>
              <View
                style={{ flex: 1, flexDirection: "row", alignItems: "center" }}
              >
                <ProfilePhoto size={42} item={executive} />

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <Text style={styles.UserName}>
                      {executive.firstname} {executive.lastname}
                    </Text>
                    {executive.tagline && (
                      <Text style={styles.UserDescription}>
                        {" "}
                        {executive.tagline}
                      </Text>
                    )}
                  </View>
                </View>

                {/* <TouchableOpacity
                style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: '#E9EBF2',
                height: 22,
                borderRadius: 15,
                paddingRight: 10,
                paddingLeft: 10
              }}
              >
              <Text
                style={{
                  color: color.primaryColor,
                  fontSize: 11,
                  fontFamily: FontFamily.Regular,
                }}
              >
                Remove
              </Text>
            </TouchableOpacity> */}
              </View>
            </View>
          ))}

          <View style={{}}>
            <TouchableOpacity
              onPress={() =>
                navigate("ContributorScreen", {
                  updateUsers: this.updateUsers,
                  user_ids: this.state.executives,
                  limit: true,
                })
              }
              style={{
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "center",
                marginTop: 35,
                backgroundColor: "#F3F5FB",
                height: 45,
                borderRadius: 10,
              }}
            >
              <AntDesign
                name={this.state.executives.length > 0 ? "edit" : "plus"}
                size={24}
                color={color.primaryColor}
              />
              <Text
                style={{
                  color: color.primaryColor,
                  fontSize: 17,
                  fontFamily: FontFamily.Regular,
                }}
              >
                {this.state.executives.length > 0
                  ? " Edit executives"
                  : " Add executives"}
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    );
  }
}

NewScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <Text style={styles.postQuestionPageTitle}>New company</Text>
  ),
  headerRight: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("postNewCompany")}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.pageTittleRight}>Save</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  pageTittleRight: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    padding: 15,
  },
  postQuestionProfile: {
    marginTop: 20,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
  addCompanyLogo: {
    position: "relative",
    marginRight: 15,
    justifyContent: "center",
  },
  addCompanyPlusIcon: {
    position: "absolute",
    right: 0,
    bottom: 0,
    backgroundColor: color.primaryColor,
    padding: 3,
    borderRadius: 20,
  },
  companyTextInputs: {
    backgroundColor: "#E9EBF2",
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    height: 42,
    borderRadius: 7,
    paddingLeft: 15,
    paddingRight: 15,
  },
  headingTittle: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    fontSize: 17,
  },
  ListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    paddingBottom: 10,
    paddingTop: 10,
  },
  UserProfileImage: {
    marginRight: 12,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  UserName: {
    fontSize: 16,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.5,
  },
  UserDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    fontSize: 16,
  },
});

export default NewScreen;
