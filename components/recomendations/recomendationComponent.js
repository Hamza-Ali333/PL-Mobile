import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import ProfileImageTitle from "../recomendations/ProfileImageTitle";
import QuestionDescription from "../recomendations/QuestionDescription";
import MenuQuestion from "../MenuQuestion";
import DiscussionPhoto from "../recomendations/DiscussionPhoto";
import ViewAnswer from "../ViewAnswer";

class RecomendationComponent extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      status: true,
      refreshing: false,
      isLoaded: false,
    };

    this.goToProfile = this.goToProfile.bind(this);
  }

  navigateDetailPro = () => {
    this.props.navigateRecDetail(this.props);
  };

  goToProfile = () => {
    this.props.navigate.navigate("UserProfile", {
      user_id: this.props.item.user.id,
    });
  };

  render() {
    if (this.props.currntStatus === this.props.item.id) {
      return null;
    }
    if (!this.props.item.user) {
      return null;
    }
    if (
      this.props.item.user.id !== this.props.me.id &&
      this.props.item.status === 0
    ) {
      return null;
    } else {
      return (
        <View
          style={styles.JobContainer}
          ref={(component) => (this._component = component)}
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginBottom: 13,
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <View style={{ flexDirection: "row", flex: 2 }}>
              <ProfileImageTitle
                goToProfile={this.goToProfile}
                {...this.props}
              />
            </View>

            {/* <View
              style={{
                flex: 1 / 2,
                flexDirection: "row-reverse",
              }}
            >
              <MenuQuestion {...this.props} />
            </View> */}
          </View>
          <View
            style={{
              paddingLeft: 15,
              paddingRight: 15,
            }}
          >
            <QuestionDescription
              enableQuestion
              item={this.props.item}
              navigateDetailPro={this.navigateDetailPro}
              navigation={this.props.navigate}
              isTag={this.props.isTag}
              tag={this.props.item.tags}
              hideText={true}
            />
          </View>
          <TouchableOpacity
            onPress={this.navigateDetailPro}
            style={{ marginTop: 13 }}
          >
            <DiscussionPhoto
              attachments={
                this.props.item?.attachments
                  ? this.props.item.attachments
                  : null
              }
              navigateDetailPro={this.navigateDetailPro}
            />
          </TouchableOpacity>

          {/* Comments */}
          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
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
                <TouchableOpacity
                  onPress={
                    this.navigateDetailPro ? this.navigateDetailPro : null
                  }
                  style={{
                    flexDirection: "row",
                    paddingBottom: 13,
                    paddingTop: 13,
                  }}
                >
                  <Image
                    source={require("../../assets/images/messages.png")}
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
                    {this.props.item.total_comment}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
            <View style={{ flex: 1, flexDirection: "row" }}>
              <ViewAnswer item={this.props.item} />
            </View>
          </View>
        </View>
      );
    }
  }
}

const styles = StyleSheet.create({
  JobContainer: {
    backgroundColor: "#fff",
    paddingTop: 13,
    borderBottomWidth: 1,
    borderColor: "#CCCFD6",
  },
  userDeatilDotIcon: {
    fontSize: 22,
    color: color.blackColor,
  },
  modalContent: {
    backgroundColor: "white",
    padding: 22,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 4,
    borderColor: "rgba(0, 0, 0, 0.1)",
    fontFamily: "Lato-Regular",
  },
  bottomModal: {
    justifyContent: "flex-end",
    margin: 0,
  },
  footAnswerInput: {
    backgroundColor: "#f6f6f6",
    position: "relative",
    borderRadius: 20,
    paddingLeft: 50,
    paddingTop: 10,
    height: 40,
    lineHeight: 2,
  },
  footUserProfile: {
    position: "absolute",
    left: 8,
    top: 5,
    width: 32,
    height: 32,
    borderRadius: 90,
  },
  footAddAnswer: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 12,
    padding: 3,
  },
});

export default RecomendationComponent;
