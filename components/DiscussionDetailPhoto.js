import React from "react";
import {
  View,
  Dimensions,
  Image,
  StyleSheet,
  Modal,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import link from "../constants/link";
import VideoPlayer from "./VideoPlayer";
import ImageViewer from "react-native-image-zoom-viewer";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class DiscussionDetailPhoto extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      progress: 0,
      visible: false,
      index: 0,
    };
  }

  renderContent = (item) => {
    return (
      <Image
        key={item.id}
        style={{
          width: windowWidth,
          height: item.height ? parseInt(item.height) : 100,
          resizeMode: "contain",
        }}
        source={{ uri: link.s3 + item.url }}
      />
    );
  };

  renderImages = (photos) => {
    const urls = [];

    photos.filter((attach) => {
      if (attach.type === "image") {
        urls.push({
          url: link.s3 + attach.url,
        });
      }
    });

    if (photos) {
      return photos.map((item, index) => {
        return (
          <View key={index} style={styles.arrayImagesGrid}>
            <Modal visible={this.state.visible} transparent={true}>
              <View
                style={{
                  height: "100%",
                }}
              >
                <TouchableOpacity
                  onPress={() => this.setState({ visible: false })}
                  style={styles.close}
                >
                  <AntDesign name="close" size={24} color="white" />
                </TouchableOpacity>

                <ImageViewer
                  useNativeDriver={true}
                  imageUrls={urls}
                  index={this.state.index}
                />
              </View>
            </Modal>
            {item.type == "image" ? (
              <>
                <TouchableOpacity
                  onPress={() => this.setState({ visible: true, index: index })}
                >
                  <View>
                    <Image
                      style={styles.ImagesGridphoto}
                      source={{
                        uri: link.s3 + item.url,
                      }}
                    />
                  </View>
                </TouchableOpacity>
              </>
            ) : null}
            {item.type == "video" ? (
              <VideoPlayer
                style={{ marginTop: 5 }}
                item={item}
                uri={item.url}
              />
            ) : null}
          </View>
        );
      });
    } else {
      return null;
    }
  };

  render() {
    let { attachments } = this.props;
    let photos = [];
    if (attachments) {
      if (attachments.length > 0) {
        attachments.map((item, index) => {
          photos.push(item);
        });
      }
    }
    if (photos.length > 0) {
      return <View style={styles.ImagesGrid}>{this.renderImages(photos)}</View>;
    }
    return null;
  }
}

const styles = StyleSheet.create({
  ImagesGrid: {
    flexDirection: "row",
    marginLeft: -10,
    marginRight: -10,
    justifyContent: "space-between",
    flexWrap: "wrap",
  },
  arrayImagesGrid: {
    flex: 1,
    minWidth: "49%",
    paddingRight: 2,
    paddingBottom: 2,
  },
  ImagesGridphoto: {
    flex: 1,
    width: "100%",
    aspectRatio: 2 / 2,
    borderRadius: 4,
    resizeMode: "cover",
  },
  close: {
    position: "absolute",
    top: 25,
    left: 10,
    zIndex: 1,
    padding: 10,
  },
});

export default DiscussionDetailPhoto;
