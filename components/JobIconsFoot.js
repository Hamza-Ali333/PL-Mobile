import React from "react";
import {
  InteractionManager,
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Share,
  Image,
} from "react-native";
import { Linking } from "expo";
import ViewAnswer from "./ViewAnswer";
import { FontAwesome, AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import getQuestions from "../graphql/queries/getQuestions";
import client from "../constants/client";
import SaveUnsaveQuestion from "./SaveUnsaveQuestion";
import gql from "graphql-tag";
import { Mutation } from "react-apollo";
import link from "../constants/link";

class JobIconsFoot extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      interactions: true,
    };

    this.delayLikeTimer;
  }

  componentDidMount() {
    InteractionManager.runAfterInteractions(() => {
      //this.setState({ interactions: false })
    });
  }

  onShare = async () => {
    try {
      const result = await Share.share({
        message: link.url + "/discussions/" + this.props.item.slug,
      });

      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      alert(error.message);
    }
  };

  _onRefresh() {
    if (typeof this.props.doneRefresh === "function") {
      this.props.doneRefresh();
    }
  }

  _handleLikePressed = () => {
    try {
      let voteStatus = this.props.item.voteStatus;
      let totalLike = this.props.item.likes.paginatorInfo.total;
      let totalDislike = this.props.item.dislikes.paginatorInfo.total;
      this.props.item.random = Math.floor(Math.random() * 10000 + 1);
      this.props.item.voteStatus = voteStatus === 1 ? -1 : 1;
      this.props.item.likes.paginatorInfo.total =
        voteStatus === 1
          ? this.props.item.likes.paginatorInfo.total - 1
          : this.props.item.likes.paginatorInfo.total + 1;
      if (voteStatus === 0) {
        this.props.item.dislikes.paginatorInfo.total =
          this.props.item.dislikes.paginatorInfo.total - 1;
      }
      this.forceUpdate();

      clearTimeout(this.delayLikeTimer);
      this.delayLikeTimer = setTimeout(() => {
        requestAnimationFrame(() => {
          this.props._handleLikePressed(
            this.props.item.id,
            this.props.item.likes.paginatorInfo.total,
            this.props.item.dislikes.paginatorInfo.total,
            voteStatus
          );
        });
      }, 5000);
    } catch (e) {}
  };

  _handleDislikePressed = () => {
    let voteStatus = this.props.item.voteStatus;
    this.props.item.random = Math.floor(Math.random() * 10000 + 1);
    this.props.item.voteStatus = voteStatus === 0 ? -1 : 0;
    this.props.item.dislikes.paginatorInfo.total =
      voteStatus === 0
        ? this.props.item.dislikes.paginatorInfo.total - 1
        : this.props.item.dislikes.paginatorInfo.total + 1;
    if (voteStatus === 1) {
      this.props.item.likes.paginatorInfo.total =
        this.props.item.likes.paginatorInfo.total - 1;
    }
    this.forceUpdate();

    clearTimeout(this.delayLikeTimer);
    this.delayLikeTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        this.props._handleDislikePressed(
          this.props.item.id,
          this.props.item.likes.paginatorInfo.total,
          this.props.item.dislikes.paginatorInfo.total,
          voteStatus
        );
      });
    }, 5000);
  };

  render() {
    let likeColor =
      this.props.item.voteStatus === 1
        ? require("../assets/images/heartColor.png")
        : require("../assets/images/heart.png");
    let unlikeColor =
      this.props.item.voteStatus === 0
        ? require("../assets/images/DislikeColor.png")
        : require("../assets/images/Dislike.png");

    return (
      <View>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            borderTopWidth: 1,
            borderColor: "#CCCFD6",
          }}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1 / 2,
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <View>
                <TouchableOpacity
                  style={{
                    paddingRight: 10,
                    flexDirection: "row",
                    paddingBottom: 13,
                    paddingTop: 13,
                  }}
                  onPress={this._handleLikePressed}
                >
                  <Image
                    source={likeColor}
                    style={{ width: 21, height: 18, resizeMode: "contain" }}
                  />
                  <Text
                    style={{
                      color: color.grayColor,
                      fontFamily: FontFamily.Regular,
                      fontSize: 13,
                      marginLeft: 5,
                    }}
                  >
                    {this.props.item.likes.paginatorInfo.total}
                  </Text>
                </TouchableOpacity>
              </View>

              {/*  <View>
                <TouchableOpacity
                  style={{padding: 10}}
                  onPress={this._handleDislikePressed}
                >
                  <Image source= {unlikeColor} style={{width:20,height:20}}/>
                </TouchableOpacity>
              </View> */}

              <View style={{}}>
                <TouchableOpacity
                  onPress={
                    this.props.navigateDetailPro
                      ? this.props.navigateDetailPro
                      : null
                  }
                  style={{
                    flexDirection: "row",
                    paddingBottom: 13,
                    paddingTop: 13,
                  }}
                >
                  <Image
                    source={require("../assets/images/messages.png")}
                    style={{ width: 20, height: 18, resizeMode: "contain" }}
                  />
                  <Text
                    style={{
                      color: color.grayColor,
                      fontFamily: FontFamily.Regular,
                      fontSize: 13,
                      marginLeft: 5,
                    }}
                  >
                    {this.props.item.answers.paginatorInfo.total}
                    {/*  {" "}{this.props.item.answers.paginatorInfo.total>1? "" : ""} */}
                  </Text>
                </TouchableOpacity>
              </View>
              {/* <View style={{}}>
                <TouchableOpacity
                  style={{padding: 10, flexDirection:'row'}}
                  onPress={this.onShare}
                >

                  <Image source= {require('../assets/images/Share.png')} style={{width:20,height:18,resizeMode: 'contain'}}/>
                </TouchableOpacity>
              </View> */}
            </View>
            <View style={{ alignItems: "flex-end", flex: 1 }}>
              <SaveUnsaveQuestion
                tapOnTabNavigator={this.props.tapOnTabNavigator}
                _handleSavedPressed={this.props._handleSavedPressed}
                _handleUnsavedPressed={this.props._handleUnsavedPressed}
                item={this.props.item}
              />
            </View>
          </View>
        </View>
        <View style={{ flex: 1, flexDirection: "row" }}>
          <ViewAnswer item={this.props.item} />
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  userLike: {
    textAlign: "center",
    fontSize: 20,
    marginBottom: 5,
  },
  userComment: {
    color: color.grayColor,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 5,
  },
  userShare: {
    color: color.grayColor,
    textAlign: "center",
    fontSize: 20,
    marginBottom: 5,
  },
});

export default JobIconsFoot;
