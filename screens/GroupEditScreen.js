import AsyncStorage from "@react-native-async-storage/async-storage";
import axios from "axios";
import * as ImagePicker from "expo-image-picker";
import * as Permissions from "expo-permissions";
import React from "react";
import {
  ActivityIndicator,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { TextInput } from "react-native-paper";
import UploadImage from "../components/UploadGroupImage";
import client from "../constants/client";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import link from "../constants/link";
import createGroupMutation from "../graphql/mutations/createGroupMutation.js";

class GroupEditScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: "",
      username: "",
      LinkedInProfile: "",
      FirstName: "",
      LastName: "",
      tagline: "",
      image: null,
      uploadLoading: false,
      errorMessage: [],
      categories: [],
      image_url: "",
      groupName: "",
      groupDescription: "",
      groupId: null,
      token: null,
      groupImage: "",
    };
    this.categoryRef = React.createRef();
  }

  _setUserSession = async () => {
    try {
      const save = await AsyncStorage.getItem("userSession");
      const item = JSON.parse(save);
      this.setState({ token: item.token });
    } catch (error) {
      console.log(
        "🚀 ~ file: GroupEditScreen.js:63 ~ GroupEditScreen ~ _setUserSession= ~ error",
        error
      );
    }
  };

  componentDidMount() {
    this.getPermissionAsync();
    this.setData();
    this.props.navigation.setParams({
      updateGroup: this.updateGroup,
      updateLoading: false,
    });
    this._setUserSession();
  }

  setData = () => {
    const data = this.props.navigation.getParam("data");
    this.setState({
      groupName: data.name,
      groupDescription: data.description,
      groupId: data.id,
      groupImage: data.image_path,
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

  createFormData = (photo, body) => {
    const data = new FormData();

    data.append("file", {
      name: "photo-file.jpg",
      type: "image/jpg",
      uri: photo,
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  uploadImageWithAxios = async (file, id) => {
    let body = this.createFormData(file, { group_id: id });
    this.setState({ uploadLoading: true });
    try {
      let res = await axios.post(
        link.url + "/api/attachment/upload-groupImage",
        body,
        {
          headers: {
            Accept: "application/json",
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${this.state.token}`,
          },
        }
      );

      if (res.data) {
        console.log(
          "🚀 ~ file: GroupEditScreen.js:124 ~ GroupEditScreen ~ uploadImageWithAxios= ~ res",
          res.data.path
        );
        this.setState({ groupImage: res.data.path });
      }
      this.setState({ uploadLoading: false });
    } catch (error) {
      console.log(
        "🚀 ~ file: GroupEditScreen.js:133 ~ GroupEditScreen ~ error",
        error
      );
      this.setState({ uploadLoading: false });
    }
  };

  _pickImage = async () => {
    const data = this.props.navigation.getParam("data");

    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 4],
      quality: 0.2,
    });

    if (!result.cancelled) {
      if (result.type !== "image") {
        alert("Only image can be upload. Please select again.");
      } else {
        this.uploadImageWithAxios(result.uri, data.id);
      }
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

  updateGroup = () => {
    this.props.navigation.setParams({ updateLoading: true });
    const { groupName, groupDescription } = this.state;
    const data = this.props.navigation.getParam("data");

    client
      .mutate({
        mutation: createGroupMutation,
        variables: {
          group_id: data.id,
          name: groupName,
          description: groupDescription,
        },
      })
      .then((result) => {
        if (result?.data?.createGroup?.id) {
          this.props.navigation.setParams({ updateLoading: false });
          this.props.navigation.navigate("Message");
        }
      })
      .catch((err) => {
        console.log(
          "🚀 ~ file: GroupEditScreen.js:210 ~ GroupEditScreen ~ err",
          err
        );

        this.props.navigation.setParams({ updateLoading: false });
      });
    this.props.navigation.setParams({ updateLoading: false });
  };

  render() {
    const data = this.props.navigation.getParam("data");

    return (
      <KeyboardAwareScrollView behavior="padding" enabled>
        <View style={styles.EditProfilePage}>
          <View style={{ flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity onPress={this._pickImage}>
              {this.state.uploadLoading ? (
                <ActivityIndicator
                  style={{ marginRight: 30, marginLeft: 30 }}
                  size="large"
                  color={color.primaryColor}
                />
              ) : (
                <UploadImage item={this.state.groupImage} groupId={data.id} />
              )}
            </TouchableOpacity>
            <View style={{ flex: 1 }}>
              <View
                style={{
                  backgroundColor: color.lightGrayColor,
                  marginLeft: 10,
                  borderRadius: 6,
                  paddingLeft: 10,
                  paddingRight: 10,
                }}
              >
                <TextInput
                  style={styles.TextInput}
                  theme={{ colors: { primary: color.primaryColor } }}
                  value={this.state.groupName}
                  onChangeText={(groupName) => this.setState({ groupName })}
                />
                <TextInput
                  placeholder="Description"
                  underlineColor="transparent"
                  style={styles.TextInput}
                  theme={{ colors: { primary: color.primaryColor } }}
                  value={this.state.groupDescription}
                  onChangeText={(groupDescription) =>
                    this.setState({ groupDescription })
                  }
                />
              </View>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

GroupEditScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => (
    <Text style={styles.headerPageTitle}>Update your group</Text>
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
          onPress={screenProps.navigation.getParam("updateGroup")}
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
    paddingRight: 8,
  },
  EditProfilePage: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 15,
    padding: 10,
    borderRadius: 8,
  },
  TextInput: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    height: 50,
  },
  saveButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
});

export default GroupEditScreen;
