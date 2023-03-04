import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { TextInput } from "react-native-paper";
import me from "../graphql/queries/me";
import { ReactNativeFile } from "apollo-upload-client";
import photoUploadMutation from "../graphql/mutations/photoUploadMutation";
import updateUserMutation from "../graphql/mutations/updateUserMutation";
import updateCategoriesMutation from "../graphql/mutations/updateCategoriesMutation";
import client from "../constants/client";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import UploadImage from "../components/UploadImage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { LinearGradient } from "expo-linear-gradient";

const cache = new InMemoryCache({});

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage,
});

class EditProfileScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      LinkedInProfile: "",
      email: "",
      username: "",
      firstName: "",
      lastName: "",
      tagline: "",
      phoneNum: "",
      address: "",
      timezone: "",
      country: "",
      image: null,
      addressFocused: false,
      photoUpdated: Math.random(),
      uploadLoading: false,
      errorMessage: [],
      categories: [],
      errorMsg: "",
      errorPossition: 0,
    };
    this.categoryRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      this.setState({
        addressFocused: this.state.address === null || "" ? false : true,
      });
    });

    this.getPermissionAsync();

    this.props.navigation.setParams({
      updateProfile: this.handleFormSubmit,
      updateLoading: false,
    });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      let categories =
        typeof res.categories !== "undefined" ? res.categories : [];
      this.setState({
        email: res.email,
        firstName: res.firstname,
        lastName: res.lastname,
        username: res.username,
        tagline: res.tagline,
        address: res.address,
        timezone: res.timezone,
        country: res.country,
        phoneNum: res.description,
        image: res.profile_photo,
        photoUpdated: Math.random(),
        categories: categories,
      });
    });
  }

  saveCategory = () => {
    this.categoryRef.current.saveCategory();
  };

  setUserData = () => {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      let categories =
        typeof res.categories !== "undefined" ? res.categories : [];
      this.setState({
        email: res.email,
        firstName: res.firstname,
        lastName: res.lastname,
        tagline: res.tagline,
        address: res.address,
        image: res.profile_photo,
        phoneNum: res.description,
        photoUpdated: Math.random(),
        categories: categories,
      });
    });
  };

  getPermissionAsync = async () => {
    //if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    // }
  };

  _getRequestMe = () => {
    //this.resetCache();
    client
      .query({
        query: me,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        this.setState({ uploadLoading: false });
        if (result.loading === false) {
          AsyncStorage.setItem("me", JSON.stringify(result.data.me)).then(
            (res) => {
              this.props.navigation.setParams({ updateLoading: false });
              this.props.navigation.goBack();
              this.setUserData();
            }
          );
          this.setState({
            image: result.data.me.profile_photo,
            photoUpdated: Math.random(),
          });
        }
      });
  };

  resetCache = async () => {
    if (persistor) {
      persistor.pause();
      await persistor.purge();
      await client.resetStore();
      persistor.resume();
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 1,
    });

    if (!result.cancelled) {
      const file = new ReactNativeFile({
        uri: result.uri,
        name:
          Math.random().toString(36).substring(2, 15) +
          Math.random().toString(36).substring(2, 15) +
          ".jpg",
        type: "image/jpeg",
      });

      this.setState({ uploadLoading: true });

      client
        .mutate({
          mutation: photoUploadMutation,
          variables: {
            file: file,
          },
        })
        .then((results) => {
          setTimeout(() => {
            this._getRequestMe();
          }, 1000);
        })
        .catch((error) => {
          setTimeout(() => {
            this._getRequestMe();
          }, 1000);
        });
    }
  };

  displayError = (error) => {
    let errorMessage = [];
    try {
      if (error) {
        let { graphQLErrors } = error;
        if (graphQLErrors[0].extensions.category === "validation") {
          this.validationErrors = graphQLErrors[0].extensions.validation;
        }
      }

      for (var key in this.validationErrors) {
        var value = this.validationErrors[key];
        errorMessage.push(
          <Text key={key} style={{ color: "#721c24" }}>
            {"\u2022 "}
            {value[0]}
          </Text>
        );
      }
    } catch (e) {}
    this.setState({ errorMessage });
  };

  updateProfile = () => {
    this.props.navigation.setParams({ updateLoading: true });
    client
      .mutate({
        mutation: updateUserMutation,
        variables: {
          linkedin_profile: this.state.LinkedInProfile,
          firstname: this.state.firstName,
          lastname: this.state.lastName,
          username: this.state.username,
          tagline: this.state.tagline,
          address: this.state.address,
          description: this.state.phoneNum,
        },
      })
      .then((result) => {
        this._getRequestMe();

        // const type = this.props.navigation.getParam("type");
        // if (type == "Additional Resources") {
        //   this.props.navigation.navigate("PaymentPlan");
        // } else {
        //   this.props.navigation.goBack();
        // }
      })
      .catch((error) => {
        this.displayError(error);
        this.props.navigation.setParams({ updateLoading: false });
      });
  };

  setCategory = (categories) => {
    this.setState({ categories, isCategoryShow: false });
    let ids = categories.map(function (a) {
      return a.id;
    });
    client
      .mutate({
        mutation: updateCategoriesMutation,
        variables: {
          categories: ids,
        },
      })
      .then((result) => {
        this._getRequestMe();
      })
      .catch((error) => {});
  };

  handleFormSubmit = () => {
    if (this.state.firstName === "") {
      this.setState({
        errorMsg: "Please Enter Your First Name",
        errorPossition: 1,
      });
    } else if (this.state.lastName === "") {
      this.setState({
        errorMsg: "Please Enter Your Last Name",
        errorPossition: 2,
      });
    } else if (this.state.username === "") {
      this.setState({
        errorMsg: "Please Enter User Name",
        errorPossition: 3,
      });
    } else if (this.state.phoneNum === "") {
      this.setState({
        errorMsg: "Please Enter Phone No",
        errorPossition: 4,
      });
    } else if (this.state.address === "") {
      this.setState({
        errorMsg: "Please Enter Address",
        errorPossition: 5,
      });
    } else {
      this.setState({ errorMsg: "", errorPossition: 0 });
      this.updateProfile();
    }
  };

  renderErrorText = () => (
    <Text style={styles.error}>{this.state.errorMsg}</Text>
  );

  render() {
    let {
      image,
      timezone,
      country,
      phoneNum,
      address,
      addressFocused,
      errorPossition,
    } = this.state;
    const type = this.props.navigation.getParam("type");
    return (
      <KeyboardAwareScrollView
        behavior="padding"
        enabled
        style={{ backgroundColor: "#fff" }}
      >
        <View style={styles.EditProfilePage}>
          <View style={{ flexDirection: "row", marginBottom: 20 }}>
            <TouchableOpacity
              style={{
                justifyContent: "center",
                alignContent: "center",
                alignItems: "center",
              }}
              onPress={this._pickImage}
            >
              {this.state.uploadLoading ? (
                <ActivityIndicator
                  style={{ marginRight: 30, marginLeft: 30 }}
                  size="large"
                  color={color.primaryColor}
                />
              ) : (
                <UploadImage item={image} isUpdated={this.state.photoUpdated} />
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: color.lightGrayColor,
                  margin: 10,
                  borderRadius: 6,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <TextInput
                  style={[styles.TextInput, styles.firstlastName]}
                  theme={{ colors: { primary: color.primaryColor } }}
                  value={this.state.firstName}
                  onChangeText={(txt) => this.setState({ firstName: txt })}
                />
                <TextInput
                  underlineColor="transparent"
                  style={[styles.TextInput, styles.firstlastName]}
                  theme={{ colors: { primary: color.primaryColor } }}
                  value={this.state.lastName}
                  onChangeText={(txt) => this.setState({ lastName: txt })}
                />
              </View>
            </View>
          </View>
          {(errorPossition === 1 || errorPossition === 2) &&
            this.renderErrorText()}
          {this.state.errorMessage.length > 0 && (
            <View
              style={{
                alignItems: "flex-start",
                backgroundColor: "#f8d7da",
                borderRadius: 10,
                padding: 10,
              }}
            >
              {this.state.errorMessage.map((item, key) => {
                return <Text>{item}</Text>;
              })}
            </View>
          )}

          <View style={{ marginTop: 20 }}>
            <TextInput
              underlineColor="transparent"
              style={styles.TextInput}
              theme={{ colors: { primary: color.primaryColor } }}
              label="Email*"
              value={this.state.email}
              editable={false}
            />
          </View>
          <View style={{ marginTop: 20 }}>
            <TextInput
              underlineColor="transparent"
              style={styles.TextInput}
              theme={{ colors: { primary: color.primaryColor } }}
              label="Username*"
              value={this.state.username}
              onChangeText={(username) => this.setState({ username })}
              keyboardType="default"
            />
          </View>
          {errorPossition === 3 && this.renderErrorText()}

          <View style={{ marginTop: 20 }}>
            <TextInput
              underlineColor="transparent"
              style={styles.TextInput}
              theme={{ colors: { primary: color.primaryColor } }}
              multiline={true}
              label="Bio"
              value={this.state.tagline}
              onChangeText={(tagline) => this.setState({ tagline })}
            />
          </View>

          <View style={{ marginTop: 20 }}>
            <TextInput
              underlineColor={
                phoneNum === null && type === "Additional Resources"
                  ? "red"
                  : "transparent"
              }
              style={styles.TextInput}
              theme={{ colors: { primary: color.primaryColor } }}
              multiline={true}
              label="Contact Number*"
              value={this.state.phoneNum}
              keyboardType="number-pad"
              maxLength={15}
              onChangeText={(txt) =>
                this.setState({ phoneNum: txt.replace(/[^0-9]/g, "") })
              }
            />
          </View>
          {errorPossition === 4 && this.renderErrorText()}

          <View style={{ marginTop: 20 }}>
            <TextInput
              textAlignVertical={"top"}
              underlineColor={
                address === null && type === "Additional Resources"
                  ? "red"
                  : "transparent"
              }
              style={styles.TextInput}
              theme={{ colors: { primary: color.primaryColor } }}
              multiline={true}
              numberOfLines={5}
              label={
                addressFocused
                  ? "Address*"
                  : "Product will be shipped at the address provided here!"
              }
              value={this.state.address}
              onChangeText={(address) => this.setState({ address })}
              onFocus={() => this.setState({ addressFocused: true })}
              onBlur={() =>
                this.setState({ addressFocused: address == "" ? false : true })
              }
            />
          </View>
          {errorPossition === 5 && this.renderErrorText()}

          {!country == null && timezone == null && (
            <View
              style={{
                marginTop: 20,
                flexDirection: "row",
              }}
            >
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={styles.labelText}>Country:</Text>
                <Text style={styles.subLabelText}>{country}</Text>
              </View>
              <View style={{ flex: 1, flexDirection: "row" }}>
                <Text style={styles.labelText}>Time Zone:</Text>
                <Text style={styles.subLabelText}>{timezone}</Text>
              </View>
            </View>
          )}
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

EditProfileScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <Text style={styles.headerPageTitle}>Update your profile</Text>
  ),
  headerRight: () => (
    <View>
      {screenProps.navigation.getParam("updateLoading") && (
        <ActivityIndicator
          style={{ marginRight: 15 }}
          size="small"
          color={color.primaryColor}
        />
      )}
      {!screenProps.navigation.getParam("updateLoading") && (
        <TouchableOpacity
          style={styles.touchRightHeadText}
          onPress={screenProps.navigation.getParam("updateProfile")}
        >
          <Text style={styles.headerRightText}>Save</Text>
        </TouchableOpacity>
      )}
    </View>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    borderRadius: 3,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 10,
  },
  EditProfilePage: {
    flex: 1,
    backgroundColor: "#fff",
    paddingHorizontal: 15,
  },
  TextInput: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
  },
  firstlastName: {
    height: 40,
    backgroundColor: "transparent",
  },
  saveButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  labelText: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 16,
  },
  subLabelText: {
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 16,
    paddingRight: 5,
  },
  error: {
    margin: 8,
    fontSize: 14,
    color: "red",
    fontWeight: "bold",
  },
});

export default EditProfileScreen;
