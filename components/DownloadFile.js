import React from "react";
import { View, TouchableOpacity, Text, Image, StyleSheet } from "react-native";
import * as Permissions from "expo-permissions";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as WebBrowser from "expo-web-browser";
import { ProgressBar } from "react-native-paper";

import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import { _handleOfferWatched } from "./CombineFunction";

class DownloadFile extends React.Component {
  constructor(props) {
    super(props);
    this.images = {
      "3ds": require("../assets/icon/3ds.png"),
      aac: require("../assets/icon/aac.png"),
      ai: require("../assets/icon/ai.png"),
      avi: require("../assets/icon/avi.png"),
      bmp: require("../assets/icon/bmp.png"),
      cad: require("../assets/icon/cad.png"),
      cdr: require("../assets/icon/cdr.png"),
      css: require("../assets/icon/css.png"),
      dat: require("../assets/icon/dat.png"),
      dll: require("../assets/icon/dll.png"),
      dmg: require("../assets/icon/dmg.png"),
      doc: require("../assets/icon/doc.png"),
      eps: require("../assets/icon/eps.png"),
      fla: require("../assets/icon/fla.png"),
      flv: require("../assets/icon/flv.png"),
      gif: require("../assets/icon/gif.png"),
      html: require("../assets/icon/html.png"),
      indd: require("../assets/icon/indd.png"),
      iso: require("../assets/icon/iso.png"),
      jpg: require("../assets/icon/jpg.png"),
      jpeg: require("../assets/icon/jpeg.png"),
      js: require("../assets/icon/js.png"),
      midi: require("../assets/icon/midi.png"),
      mov: require("../assets/icon/mov.png"),
      mp3: require("../assets/icon/mp3.png"),
      mpg: require("../assets/icon/mpg.png"),
      pdf: require("../assets/icon/pdf.png"),
      php: require("../assets/icon/php.png"),
      png: require("../assets/icon/png.png"),
      ppt: require("../assets/icon/ppt.png"),
      pptx: require("../assets/icon/pptx.png"),
      ps: require("../assets/icon/ps.png"),
      psd: require("../assets/icon/psd.png"),
      raw: require("../assets/icon/raw.png"),
      sql: require("../assets/icon/sql.png"),
      svg: require("../assets/icon/svg.png"),
      tif: require("../assets/icon/tif.png"),
      txt: require("../assets/icon/txt.png"),
      text: require("../assets/icon/txt.png"),
      wmv: require("../assets/icon/wmv.png"),
      xls: require("../assets/icon/xls.png"),
      xml: require("../assets/icon/xml.png"),
      zip: require("../assets/icon/zip.png"),
      unkown: require("../assets/icon/unkown.png"),
    };
    this.state = {
      imageResource: this.images["unkown"],
      progress: 0,
      loadingRestore: false,
    };
  }

  callback = (downloadProgress) => {
    const progress =
      downloadProgress.totalBytesWritten /
      downloadProgress.totalBytesExpectedToWrite;
    this.setState({ progress: progress });
  };

  setDownloadResumable = () => {
    return FileSystem.createDownloadResumable(
      link.url + "/" + this.props.item.attachment.url,
      FileSystem.documentDirectory +
        "/" +
        this.props.item.title.replace(/\s+/g, "-").toLowerCase() +
        "." +
        this.props.item.attachment.type,
      {},
      this.callback
    );
  };

  handleDownloadFile = async () => {
    try {
      if (Platform.OS === "android") {
        this.setState({ loadingRestore: true });
        const { uri } = await this.setDownloadResumable().downloadAsync();
        const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
        if (status === "granted") {
          const asset = await MediaLibrary.createAssetAsync(uri);
          await MediaLibrary.createAlbumAsync("Download", asset, true);
        }
        this.setState({ loadingRestore: false });
      } else {
        let result = await WebBrowser.openBrowserAsync(
          link.url +
            "/api/forceDownload?file=" +
            this.props.item.attachment.url +
            "&name=" +
            this.props.item.title.replace(/\s+/g, "-").toLowerCase() +
            "&ext=" +
            this.props.item.attachment.type
        );
      }
    } catch (e) {}
  };

  readableBytes = (bytes) => {
    const i = Math.floor(Math.log(bytes) / Math.log(1024)),
      sizes = ["B", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

    return (bytes / Math.pow(1024, i)).toFixed(2) * 1 + " " + sizes[i];
  };

  render() {
    let image = "unkown";
    if (this.images[this.props.item.attachment.type]) {
      image = this.props.item.attachment.type;
    }

    return (
      <View
        style={{
          backgroundColor: color.lightGrayColor,
          height: 250,
          marginTop: 13,
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <Image
          style={{ width: 60, height: 60, resizeMode: "contain" }}
          source={this.images[image]}
        />

        <View style={{ margin: 10 }}>
          <TouchableOpacity
            style={{
              backgroundColor: color.primaryColor,
              alignItems: "center",
              justifyContent: "center",
              borderRadius: 10,
            }}
            onPress={this.handleDownloadFile}
          >
            <Text
              style={{
                margin: 10,
                color: "#fff",
                fontFamily: FontFamily.Medium,
                fontSize: 15,
              }}
            >
              Download
            </Text>
          </TouchableOpacity>
        </View>
        {this.state.loadingRestore ? (
          <ProgressBar
            style={{ marginTop: 10, marginRight: 5 }}
            progress={this.state.progress}
            color={color.primaryColor}
          />
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({});

export default DownloadFile;
