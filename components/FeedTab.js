import React from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import ProfileImageTitle from "./ProfileImageTitle";
import JobIconsFoot from "./JobIconsFoot";
import QuestionDescription from "./QuestionDescription";
import MenuQuestion from "./MenuQuestion";
import DiscussionPhoto from "./DiscussionPhoto";
import DiscussionDetailPhoto from "./DiscussionDetailPhoto";

class FeedTab extends React.PureComponent {
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
    this.props.navigateDetail(this.props);
  };

  goToProfile = () => {
    this.props.navigate.navigate("UserProfile", {
      user_id: this.props.item.users.id,
    });
  };

  render() {
    if (this.props.currntStatus === this.props.item.id) {
      return null;
    }
    if (!this.props.item.users) {
      return null;
    }
    if (
      this.props.item.users.id !== this.props.me.id &&
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

            <View
              style={{
                flex: 1 / 2,
                flexDirection: "row-reverse",
              }}
            >
              <MenuQuestion {...this.props} />
            </View>
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
              tag={this.props.tag}
              hideText={true}
            />
          </View>
          <TouchableOpacity
            onPress={this.navigateDetailPro}
            style={{ marginTop: 13 }}
          >
            {/* <DiscussionPhoto
              attachments={this.props.item.attachments}
              navigateDetailPro={this.navigateDetailPro}
            /> */}
            <DiscussionDetailPhoto
              attachments={this.props.item.attachments}
              controlModal={this.navigateDetailPro}
            />
          </TouchableOpacity>

          <View style={{ paddingLeft: 15, paddingRight: 15 }}>
            <JobIconsFoot
              _handleSavedPressed={this.props.handleSavedPressed}
              _handleUnsavedPressed={this.props.handleUnsavedPressed}
              _handleDislikePressed={this.props.handleDislikePressed}
              _handleLikePressed={this.props.handleLikePressed}
              item={this.props.item}
              navigateDetailPro={this.navigateDetailPro}
              tapOnTabNavigator={this.props.tapOnTabNavigator}
            />
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

export default FeedTab;
