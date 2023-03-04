import React from "react";
import {
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  TouchableWithoutFeedback,
  StyleSheet,
  Image,
  Share,
} from "react-native";
import { Avatar, Chip } from "react-native-paper";
import firstChar from "../helper/firstChar";
import ellipsis from "../helper/ellipsis";
import capitalize from "../helper/capitalize";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import OfferLock from "./OfferLock";
import VideoPlayer from "./VideoPlayer";
import OfferLikeUnlike from "./OfferLikeUnlike";
import OfferBookmark from "./OfferBookmark";
import DownloadFile from "./DownloadFile";
import ImageFile from "./ImageFile";
import { requestMiddleware } from "./CombineFunction";
import ProfilePhoto from "./ProfilePhoto";
import TimeAgo from "./TimeAgo";

const width = (Dimensions.get("window").width - 4 * 10) / 2;

class OfferComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  // shouldComponentUpdate(nextProps, nextState) {
  //   if (this.props.item.isLiked !== this.props.item.isLiked) {
  //     return true;
  //   }
  //   if (this.props.item.isBookmarked !== this.props.item.isBookmarked) {
  //     return true;
  //   }
  //   if (this.props.item.visibility !== this.props.item.visibility) {
  //     return true;
  //   }
  //   if (this.props.item.isAccess !== this.props.item.isAccess) {
  //     return true;
  //   }
  //   if (nextProps.tags.length !== this.props.tags.length) {
  //     return true;
  //   }
  //   if (nextProps.item.comments.paginatorInfo.total !== this.props.item.comments.paginatorInfo.total) {
  //     return true;
  //   }
  //   return false;
  // }

  _filterTag = (tag) => {
    let tags = { id: tag.id, name: tag.tag_title };
    if (this.props._applyTagFilter) {
      this.props._applyTagFilter(tags);
    }
  };

  _renderOfferComponent = (data) => {
    switch (data.type) {
      case "image":
        return <ImageFile item={data} />;
      case "application":
        return <DownloadFile item={data} />;
      case "video":
        return (
          <VideoPlayer
            offer_id={data.id}
            uri={data.attachment.url}
            isWatched={data.isWatched}
          />
        );
      default:
        return null;
    }
  };

  listCategories = () => {
    if (this.props.item.categories.length > 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 13,
            position: "relative",
            marginBottom: 7,
          }}
        >
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
            {this.props.item.categories.map((category, index) => (
              <TouchableWithoutFeedback key={index}>
                <Chip
                  style={{
                    backgroundColor: this.props.categories.find(
                      (data) => data.id == category.id
                    )
                      ? color.primaryColor
                      : color.lightGrayColor,
                    marginRight: 4,
                    borderRadius: 10,
                  }}
                  textStyle={{
                    color: this.props.categories.find(
                      (data) => data.id == category.id
                    )
                      ? color.whiteColor
                      : color.grayColor,
                    fontFamily: FontFamily.Regular,
                  }}
                >
                  {category.name}
                </Chip>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>
      );
    } else {
      return null;
    }
  };

  listTags = () => {
    if (this.props.item.tags.length > 0) {
      return (
        <ScrollView
          ref={(ref) => (this.scrollView = ref)}
          horizontal={true}
          scrollEnabled={true}
          showsHorizontalScrollIndicator={false}
        >
          {this.props.item.tags.map((cat, index) => (
            <TouchableWithoutFeedback key={index}>
              <Chip
                style={{
                  backgroundColor: this.props.tags.find(
                    (data) => data.id === cat.id
                  )
                    ? color.primaryColor
                    : "#F3F5FB",
                  marginRight: 4,
                  borderRadius: 10,
                }}
                textStyle={{
                  color: this.props.tags.find((data) => data.id === cat.id)
                    ? "#fff"
                    : "#9F9F9F",
                  fontFamily: FontFamily.Regular,
                }}
              >
                {cat.name}
              </Chip>
            </TouchableWithoutFeedback>
          ))}
        </ScrollView>
      );
    } else {
      return null;
    }
  };

  navigateOffer = () => {
    this.props.navigation.navigate("Recommendation", {
      id: this.props.item.id,
    });
  };

  actionSheet = () => {
    this.props._onActionSheet(this.props.item.id, this.props.item.visibility);
  };

  render() {
    let item = this.props.item;

    let url = "";
    if (item.user) {
      url = link.url + "/" + item.user.profile_photo;
    }

    return (
      <View
        style={styles.JobContainer}
        ref={(component) => (this._component = component)}
      >
        {/* {this.listCategories()} */}
        <View style={{ flex: 1, flexDirection: "row" }}>
          {item.user ? (
            <View style={{ flexDirection: "row", flex: 2 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <ProfilePhoto size={42} item={item.user} />

                <View style={{ flex: 1 }}>
                  {item.is_closed && (
                    <Text
                      style={{
                        position: "absolute",
                        right: 0,
                        color: "red",
                        fontFamily: FontFamily.Bold,
                      }}
                    >
                      Closed
                    </Text>
                  )}
                  <TouchableOpacity onPress={this.navigateOffer}>
                    <Text style={styles.userName}>
                      {item.user.firstname} {item.user.lastname}
                    </Text>
                  </TouchableOpacity>
                  <Text style={{ color: color.grayColor, fontSize: 14 }}>
                    @{item.user.username}
                  </Text>
                </View>
              </View>
            </View>
          ) : null}
        </View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            position: "relative",
            marginBottom: 13,
            marginTop: 13,
          }}
        >
          {this.listTags()}
        </View>
        <View style={{ marginBottom: 13 }}>
          <TouchableWithoutFeedback onPress={this.navigateOffer}>
            <Text
              style={{
                color: color.blackColor,
                fontFamily: FontFamily.Medium,
                fontSize: 16,
                marginTop: 5,
                marginBottom: 5,
              }}
            >
              {item.title}
            </Text>
          </TouchableWithoutFeedback>
        </View>
        <TouchableOpacity onPress={this.navigateOffer}>
          <View>
            <View
              style={{
                flexDirection: "row",
                justifyContent: "space-between",
                borderTopWidth: 1,
                borderColor: "#CCCFD6",
              }}
            >
              <View
                style={{
                  flexDirection: "row",
                  flex: 1 / 3,
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ paddingTop: 13, paddingBottom: 13 }}>
                  <TouchableOpacity
                    onPress={this.navigateOffer}
                    style={{ paddingRight: 10, flexDirection: "row" }}
                  >
                    <Image
                      source={require("../assets/images/messages.png")}
                      style={{
                        width: 20,
                        height: 18,
                        resizeMode: "contain",
                      }}
                    />
                    <Text
                      style={{
                        color: color.grayColor,
                        fontFamily: FontFamily.Regular,
                        fontSize: 13,
                        marginLeft: 5,
                      }}
                    >
                      {item.total_comment}
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </TouchableOpacity>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  JobContainer: {
    backgroundColor: "#fff",
    paddingTop: 13,
    borderBottomWidth: 1,
    borderColor: "#CCCFD6",
    paddingLeft: 15,
    paddingRight: 15,
  },
  userName: {
    fontSize: 17,
    marginTop: 0,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
  },
  userDate: {
    fontSize: 12,
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
  },
});

export default OfferComponent;
