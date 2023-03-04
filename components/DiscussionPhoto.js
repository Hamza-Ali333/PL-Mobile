import { head } from "ramda";
import React, { PropTypes } from "react";
import { View, Dimensions, Text, Image, StyleSheet } from "react-native";
import link from "../constants/link";
import VideoPlayer from "./VideoPlayer";
import AutoHeightImage from "react-native-auto-height-image";
import FbGrid from "react-native-fb-image-grid";

const windowWidth = Dimensions.get("window").width;

class DiscussionPhoto extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      height: 0,
      width: 0,
      progress: 0,
      photos: [
        // "uploads/chats//d2b77018-dc23-4cdb-8eca-d02ef365b3e9.jpeg",
        // "uploads/chats//bb18ff55-cdf9-4f58-86e8-42aa19fffcc1.jpeg",
        // "uploads/chats//19c8ab23-5dad-4a37-8306-60618774bdcd.jpeg",
        // "uploads/chats//257a72b3-26d2-4e0d-b9c3-454915db5196.jpeg",
      ],
    };
  }

  renderOne = (photos) => {
    return photos.map((item, index) => {
      return (
        <View key={index}>
          {item.type == "image" ? (
            <AutoHeightImage
              key={index}
              width={windowWidth}
              source={{ uri: link.s3 + item.url }}
            />
          ) : null}
          {item.type == "video" ? (
            <VideoPlayer item={item} uri={item.url} />
          ) : null}
        </View>
      );
    });
  };

  renderTwo = (photos) => {
    const urls = [];

    photos.filter((attach) => {
      if (attach.type === "image") {
        urls.push(link.s3 + attach.url);
      }
    });

    return photos.map((item, index) => {
      return (
        <View key={index} style={{ height: 300 }}>
          {item.type == "image" ? (
            <FbGrid
              images={urls}
              onPress={() => this.props.navigateDetailPro()}
            />
          ) : null}
          {/* {item.type == "video" ? (
            <VideoPlayer
              show={true}
              item={item}
              width={windowWidth / 2}
              uri={item.url}
            />
          ) : null} */}
        </View>
      );
    });
  };

  renderThree = (photos) => {
    const urls = [];

    photos.filter((attach) => {
      if (attach.type === "image") {
        urls.push(link.s3 + attach.url);
      }
    });

    let photoArray = [];
    photoArray.push(
      photos.slice(0, 1).map((item, index) => {
        return (
          <View key={index} style={{ height: 300 }}>
            {item.type == "image" ? (
              <FbGrid
                images={urls}
                onPress={() => this.props.navigateDetailPro()}
              />
            ) : null}
            {item.type == "video" ? (
              <VideoPlayer
                item={item}
                show={true}
                width={windowWidth / 2}
                uri={item.url}
              />
            ) : null}
          </View>
        );
      })
    );

    return photoArray;
  };

  renderFour = (photos) => {
    const urls = [];

    photos.filter((attach) => {
      if (attach.type === "image") {
        urls.push(link.s3 + attach.url);
      }
    });

    let photoArray = [];
    photoArray.push(
      <View style={{ flexDirection: "row" }}>
        {photos.slice(0, 2).map((item, index) => {
          return (
            <View key={index} style={{ height: 300 }}>
              {item.type == "image" ? (
                <FbGrid
                  images={urls}
                  onPress={() => this.props.navigateDetailPro()}
                />
              ) : null}
              {item.type == "video" ? (
                <VideoPlayer
                  item={item}
                  show={true}
                  width={windowWidth / 2}
                  uri={item.url}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    );

    photoArray.push(
      <View style={{ flexDirection: "row" }}>
        {photos.slice(2, 4).map((item, index) => {
          return (
            <View key={index}>
              {item.type == "image" ? (
                <AutoHeightImage
                  key={index}
                  width={windowWidth}
                  source={{ uri: link.s3 + item.url }}
                />
              ) : null}
              {item.type == "video" ? (
                <VideoPlayer
                  item={item}
                  show={true}
                  width={windowWidth / 2}
                  uri={item.url}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    );
    return photoArray;
  };

  renderMore = (photos) => {
    let photoArray = [];
    photoArray.push(
      <View style={{ flexDirection: "row" }}>
        {photos.slice(0, 2).map((item, index) => {
          return (
            <View key={index}>
              {item.type == "image" ? (
                <AutoHeightImage
                  key={index}
                  width={windowWidth}
                  source={{ uri: link.s3 + item.url }}
                />
              ) : null}
              {item.type == "video" ? (
                <VideoPlayer
                  item={item}
                  show={true}
                  width={windowWidth / 2}
                  uri={item.url}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    );

    photoArray.push(
      <View style={{ flexDirection: "row" }}>
        {photos.slice(2, 3).map((item, index) => {
          return (
            <View key={index}>
              {item.type == "image" ? (
                <AutoHeightImage
                  key={index}
                  width={windowWidth}
                  source={{ uri: link.s3 + item.url }}
                />
              ) : null}
              {item.type == "video" ? (
                <VideoPlayer
                  item={item}
                  show={true}
                  width={windowWidth / 2}
                  uri={item.url}
                />
              ) : null}
            </View>
          );
        })}
        {photos.slice(3, 4).map((item, index) => {
          return (
            <View key={index}>
              <View
                style={{
                  position: "absolute",
                  zIndex: 9,
                  backgroundColor: "rgba(128,128,128,0.8)",
                }}
              >
                <View
                  style={{
                    width: windowWidth / 2,
                    height: 200,
                    justifyContent: "center",
                  }}
                >
                  <Text
                    style={{ color: "#000", fontSize: 40, textAlign: "center" }}
                  >
                    +{photos.length - 4}
                  </Text>
                </View>
              </View>
              {item.type == "image" ? (
                <Image
                  key={index}
                  style={{
                    width: windowWidth / 2,
                    height: 200,
                    resizeMode: "cover",
                  }}
                  source={{ uri: link.s3 + item.url }}
                />
              ) : null}
              {item.type == "video" ? (
                <VideoPlayer
                  item={item}
                  show={true}
                  width={windowWidth / 2}
                  uri={item.url}
                />
              ) : null}
            </View>
          );
        })}
      </View>
    );
    return photoArray;
  };

  render() {
    let { attachments } = this.props;
    let photos = [];
    if (typeof attachments !== "undefined") {
      attachments.map((item, index) => {
        photos.push(item);
      });
    }

    switch (photos.length) {
      case 0:
        return null;
        break;
      case 1:
        return this.renderOne(photos);
        break;
      case 2:
        return (
          <View style={{ flexDirection: "row" }}>{this.renderTwo(photos)}</View>
        );
        break;
      case 3:
        return this.renderThree(photos);
        break;
      case 4:
        return this.renderFour(photos);
        break;
      default:
        return this.renderMore(photos);
    }
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
});

export default DiscussionPhoto;
