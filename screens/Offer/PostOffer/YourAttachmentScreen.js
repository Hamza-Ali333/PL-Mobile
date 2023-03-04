import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../../../constants/Colors.js";
import FontFamily from "../../../constants/FontFamily.js";
import link from "../../../constants/link";
import * as DocumentPicker from "expo-document-picker";
import { Checkbox } from "react-native-paper";
import createOfferAttachmentMutation from "../../../graphql/mutations/createOfferAttachmentMutation";
import client from "../../../constants/client";

class YourAttachmentScreen extends React.Component {
  constructor(props) {
    super(props);
    this.images = {
      add: require("../../../assets/images/attachment.png"),
      "3ds": require("../../../assets/icon/3ds.png"),
      aac: require("../../../assets/icon/aac.png"),
      ai: require("../../../assets/icon/ai.png"),
      avi: require("../../../assets/icon/avi.png"),
      bmp: require("../../../assets/icon/bmp.png"),
      cad: require("../../../assets/icon/cad.png"),
      cdr: require("../../../assets/icon/cdr.png"),
      css: require("../../../assets/icon/css.png"),
      dat: require("../../../assets/icon/dat.png"),
      dll: require("../../../assets/icon/dll.png"),
      dmg: require("../../../assets/icon/dmg.png"),
      doc: require("../../../assets/icon/doc.png"),
      docx: require("../../../assets/icon/docx.png"),
      eps: require("../../../assets/icon/eps.png"),
      fla: require("../../../assets/icon/fla.png"),
      flv: require("../../../assets/icon/flv.png"),
      gif: require("../../../assets/icon/gif.png"),
      html: require("../../../assets/icon/html.png"),
      indd: require("../../../assets/icon/indd.png"),
      iso: require("../../../assets/icon/iso.png"),
      jpg: require("../../../assets/icon/jpg.png"),
      jpeg: require("../../../assets/icon/jpeg.png"),
      js: require("../../../assets/icon/js.png"),
      midi: require("../../../assets/icon/midi.png"),
      mov: require("../../../assets/icon/mov.png"),
      mp3: require("../../../assets/icon/mp3.png"),
      mp4: require("../../../assets/icon/mp4.png"),
      mpg: require("../../../assets/icon/mpg.png"),
      pdf: require("../../../assets/icon/pdf.png"),
      php: require("../../../assets/icon/php.png"),
      png: require("../../../assets/icon/png.png"),
      ppt: require("../../../assets/icon/ppt.png"),
      pptx: require("../../../assets/icon/pptx.png"),
      ps: require("../../../assets/icon/ps.png"),
      psd: require("../../../assets/icon/psd.png"),
      raw: require("../../../assets/icon/raw.png"),
      sql: require("../../../assets/icon/sql.png"),
      svg: require("../../../assets/icon/svg.png"),
      tif: require("../../../assets/icon/tif.png"),
      txt: require("../../../assets/icon/txt.png"),
      wmv: require("../../../assets/icon/wmv.png"),
      xls: require("../../../assets/icon/xls.png"),
      xml: require("../../../assets/icon/xml.png"),
      zip: require("../../../assets/icon/zip.png"),
      unkown: require("../../../assets/icon/unkown.png"),
    };
    this.state = {
      checked: true,
      imageResource: this.images["add"],
      url: "",
      type: "",
      size: "",
      mime: "",
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      addNextQuestion: this.addNextQuestion,
    });
    this._setUserSession();
    if (Object.keys(this.props.navigation.getParam("offer")).length > 0) {
      let attachment = this.props.navigation.getParam("offer").attachment;
      let image = "unkown";
      if (attachment) {
        if (this.images[attachment.type]) {
          image = attachment.type;
        }
        this.setState({
          imageResource: this.images[image],
          url: attachment.url,
          type: attachment.type,
          size: attachment.size,
        });
      }
    }
  }

  addNextQuestion = () => {
    this.props.navigation.navigate("AddQuestionScreen", {
      data: this.props.navigation.getParam("data"),
      offer: this.props.navigation.getParam("offer"),
    });
  };

  _setUserSession = async () => {
    const save = await AsyncStorage.getItem("userSession");
    const item = JSON.parse(save);
    this.setState({ token: item.token });
  };

  createFormData = (file, body) => {
    const data = new FormData();

    data.append("file", {
      name: file.name,
      type: "*/*",
      uri: file.uri,
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  handleUploadFile = (file) => {
    return fetch(link.url + "/api/offer/upload", {
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

  _pickFile = async () => {
    let result = await DocumentPicker.getDocumentAsync({
      type: "*/*",
    });

    let val = result.uri.toLowerCase(),
      regex = new RegExp(
        "(.*?).(docx|doc|txt|pdf|mp4|png|jpg|jpeg|mp3|ppt|xls)$"
      );

    if (!regex.test(val)) {
      alert("Please select correct file format");
      return false;
    }

    if (result.size > 10000000) {
      alert("File must be less or equal to 10 MB");
      return;
    }
    if (result.type === "success") {
      this.setState({ imageResource: null, size: result.size });
      let res = await this.handleUploadFile(result);
      if (res) {
        let image = "unkown";
        if (this.images[res.type]) {
          image = res.type;
        }
        this.setState({
          imageResource: this.images[image],
          type: res.type,
          mime: res.mime,
          url: res.path,
        });
        this.submitAttachement(res);
      }
    }
  };

  submitAttachement = (res) => {
    client
      .mutate({
        mutation: createOfferAttachmentMutation,
        variables: {
          offer_id: this.props.navigation.getParam("data").id,
          url: res.path,
          type: res.type,
          mime: res.mime,
          size: this.state.size,
        },
      })
      .then((results) => {})
      .catch((res) => {});
  };

  render() {
    const { checked } = this.state;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View style={{ flex: 1 / 6, alignItems: "flex-start" }}>
          <Text
            style={{
              fontFamily: FontFamily.Medium,
              color: color.blackColor,
              fontSize: 18,
            }}
          >
            Add your attachment in which you tell about your offer
          </Text>
          <View style={{ flexDirection: "row" }}>
            <Text
              style={{
                fontFamily: FontFamily.Regular,
                color: color.grayColor,
                fontSize: 14,
              }}
            >
              Attachment size should not exceed
            </Text>
            <Text
              style={{
                marginLeft: 4,
                fontFamily: FontFamily.Regular,
                color: color.primaryColor,
                fontSize: 14,
              }}
            >
              4 MB
            </Text>
          </View>
        </View>
        <TouchableOpacity
          onPress={this._pickFile}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        >
          {this.state.imageResource ? (
            <Image
              style={{ width: 120, height: 160, resizeMode: "contain" }}
              source={this.state.imageResource}
            />
          ) : (
            <ActivityIndicator size="large" color={color.primaryColor} />
          )}
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
            }}
          >
            <Checkbox.Android
              color={color.primaryColor}
              status={checked ? "checked" : "unchecked"}
              onPress={() => {
                this.setState({ checked: !checked });
              }}
            />

            <Text
              style={{
                fontFamily: FontFamily.Regular,
                color: "#3C3C43",
                fontSize: 13,
              }}
            >
              I forbid to use my attacment
            </Text>
          </View>
        </TouchableOpacity>
        <View style={{ alignItems: "center", flex: 1 / 4 }}>
          <Text
            style={{
              fontFamily: FontFamily.Regular,
              color: "#A0A0A0",
              fontSize: 13,
              marginTop: 10,
            }}
          >
            docx, doc, txt, pdf, mp4, png, jpg, jpeg, mp3, ppt, xls
          </Text>
          <TouchableOpacity
            onPress={this._pickFile}
            style={{
              backgroundColor: color.primaryColor,
              width: "100%",
              height: 46,
              borderRadius: 10,
              alignItems: "center",
              justifyContent: "center",
              marginTop: 15,
            }}
          >
            <Text
              style={{
                fontFamily: FontFamily.Regular,
                color: "#fff",
                fontSize: 16,
              }}
            >
              Add your attachment
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }
}

YourAttachmentScreen.navigationOptions = (screenProps) => ({
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
    <Text style={styles.postQuestionPageTitle}>Attacment</Text>
  ),
  headerRight: () => (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={screenProps.navigation.getParam("addNextQuestion")}
    >
      <Text style={styles.postText}>Next</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    padding: 10,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
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
});

export default YourAttachmentScreen;
