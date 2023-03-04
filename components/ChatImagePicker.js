import React, { Component } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  View,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Entypo } from "@expo/vector-icons";
import * as ImagePicker from "expo-image-picker";
import * as DocumentPicker from "expo-document-picker";
import color from "../constants/Colors";
import link from "../constants/link";
import * as Permissions from "expo-permissions";
import uuid from "react-native-uuid";

export default class ChatImagePicker extends Component {
  constructor(props) {
    super(props);
    this.state = {
      token: null,
      loading: false,
    };
  }

  componentDidMount() {
    this._setUserSession();
  }

  getPermissionAsync = async () => {
    //if (Constants.platform.ios) {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status !== "granted") {
      alert("Sorry, we need camera roll permissions to make this work!");
    }
    // }
  };

  _setUserSession = async () => {
    const save = await AsyncStorage.getItem("userSession");
    const item = JSON.parse(save);
    this.setState({ token: item.token });
  };

  _pickDocument = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });
    console.log(
      "🚀 ~ file: ChatImagePicker.js:52 ~ ChatImagePicker ~ _pickDocument= ~ result",
      result
    );

    if (!result.cancelled && result.type !== "cancel") {
      this.setState({ loading: true });
      const file = await this.handleUploadPhoto(result.uri);
      const _id = uuid.v4();
      const _date = new Date();
      if (file.type == "mp3") {
        this.props.socket.emit("chat_message", [
          {
            _id: _id,
            createdAt: _date,
            audio: link.url + "/" + file.path,
            text: "",
            user: this.props._user(),
          },
        ]);
      } else if (
        file.type == "docx" ||
        file.type == "pdf" ||
        file.type == "pptx" ||
        file.type == "xlsx"
      ) {
        this.props.socket.emit("chat_message", [
          {
            _id: _id,
            createdAt: _date,
            file: link.url + "/" + file.path,
            text: "",
            user: this.props._user(),
          },
        ]);
      } else {
        this.props.socket.emit("chat_message", [
          {
            _id: _id,
            createdAt: _date,
            image: link.url + "/" + file.path,
            text: "",
            user: this.props._user(),
          },
        ]);
      }

      this.setState({ loading: false });
    }
  };

  _pickImage = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      aspect: [4, 3],
      quality: 1,
    });

    if (!result.cancelled && result.type !== "cancel") {
      this.setState({ loading: true });
      const file = await this.handleUploadPhoto(result.uri);
      const _id = uuid.v4();
      const _date = new Date();
      this.props.socket.emit("chat_message", [
        {
          _id: _id,
          createdAt: _date,
          image: link.url + "/" + file.path,
          text: "",
          user: this.props._user(),
        },
      ]);
      this.setState({ loading: false });
    }
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
        Authorization: `Bearer ${this.state.token}` || null,
      },
      body: this.createFormData(file, { userId: "123" }),
    })
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  _attachmentLoader() {
    const { loading } = this.state;
    if (loading) {
      return <ActivityIndicator size="small" color={color.primaryColor} />;
    } else {
      return (
        <TouchableOpacity onPress={this._pickDocument}>
          <Entypo name="attachment" size={25} style={{ marginHorizontal: 5 }} />
        </TouchableOpacity>
      );
    }
  }

  render() {
    return <View>{this._attachmentLoader()}</View>;
  }
}

const styles = StyleSheet.create({
  recordingTimestamp: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
