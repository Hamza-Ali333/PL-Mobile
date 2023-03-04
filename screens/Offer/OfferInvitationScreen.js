import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Query } from "react-apollo";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";

import ProfilePhoto from "../../components/ProfilePhoto";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import { Avatar, Badge } from "react-native-paper";
import getOfferInvites from "../../graphql/queries/getOfferInvites";
import offerInviteAcceptMutation from "../../graphql/mutations/offerInviteAcceptMutation";
import offerInviteRejectMutation from "../../graphql/mutations/offerInviteRejectMutation";
import client from "../../constants/client";

class OfferInvitationScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scaleAnimationDialog: false,
      action: {},
    };
    this.refetch;
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  tapOnTabNavigator = () => {
    if (typeof this.refetch === "function") this.refetch();
  };

  _handlePress = (type, id, user_id) => {
    this.setState({
      scaleAnimationDialog: true,
      action: { type: type, id: id, user_id: user_id },
    });
  };

  _actionPopup = (type) => {
    if (type === "yes") {
      let action = this.state.action;
      if (action.type === "accept") {
        this.offerInviteAccept(action.id, action.user_id);
      } else if (action.type === "reject") {
        this.offerInviteReject(action.id, action.user_id);
      }
    }
    this.setState({ scaleAnimationDialog: false, action: {} });
  };

  offerInviteAccept = (offer_id, user_id) => {
    client
      .mutate({
        mutation: offerInviteAcceptMutation,
        variables: {
          offer_id: parseInt(offer_id),
          user_id: user_id,
        },
      })
      .then((results) => {
        this.refetch();
      })
      .catch((res) => {});
  };

  offerInviteReject = (offer_id, user_id) => {
    client
      .mutate({
        mutation: offerInviteRejectMutation,
        variables: {
          offer_id: parseInt(offer_id),
          user_id: user_id,
        },
      })
      .then((results) => {
        this.refetch();
      })
      .catch((res) => {});
  };

  goToOffer = (id) => {
    this.props.navigation.navigate("OfferScreen", { id: id });
  };

  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <ScrollView>
          <Query query={getOfferInvites}>
            {({ loading, error, data, fetchMore, refetch }) => {
              this.refetch = refetch;
              if (loading)
                return (
                  <View>
                    <ActivityIndicator
                      size="small"
                      color={color.primaryColor}
                    />
                  </View>
                );

              if (error)
                return (
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Image source={require("../../assets/images/wifi.png")} />
                    <View
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <Text style={{ fontSize: 19 }}>
                        No Internet Connection
                      </Text>
                      <Text>Could not connected to the network </Text>
                      <Text>Please check and try again.</Text>
                      <Button title="Retry" onPress={() => refetch()} />
                    </View>
                  </View>
                );
              return data.me.offerInvites.data.map((item, key) => {
                return (
                  <View key={key} style={styles.threadContainer}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                      }}
                    >
                      <ProfilePhoto
                        size={42}
                        item={{
                          profile_photo: item.company.logo,
                          firstname: item.company.title,
                        }}
                      />
                      <View style={{ flex: 1 }}>
                        <TouchableOpacity
                          onPress={() => this.goToOffer(item.id)}
                        >
                          <Text style={styles.userName}>
                            {item.title ?? ""}
                          </Text>
                        </TouchableOpacity>
                        <Text
                          style={{
                            color: "#9DA4B4",
                            fontSize: 12,
                            marginTop: 5,
                            fontFamily: FontFamily.Regular,
                          }}
                        ></Text>
                      </View>
                    </View>
                    {item.pivot.direction === "me" ? (
                      item.pivot.status === "0" ? (
                        <View
                          style={{
                            flex: 1,
                            flexDirection: "row",
                            justifyContent: "space-between",
                            marginTop: 10,
                          }}
                        >
                          <TouchableOpacity
                            onPress={this._handlePress.bind(
                              this,
                              "accept",
                              item.id,
                              data.me.id
                            )}
                            style={styles.notAcceptBtn}
                          >
                            <Text style={styles.notAcceptBtnText}>Accept</Text>
                          </TouchableOpacity>
                          <TouchableOpacity
                            onPress={this._handlePress.bind(
                              this,
                              "reject",
                              item.id,
                              data.me.id
                            )}
                            style={styles.notAcceptBtn}
                          >
                            <Text style={styles.notAcceptBtnText}>Reject</Text>
                          </TouchableOpacity>
                        </View>
                      ) : (
                        <TouchableOpacity style={styles.notAcceptBtn}>
                          <Text style={styles.notAcceptBtnText}>Accepted</Text>
                        </TouchableOpacity>
                      )
                    ) : null}
                  </View>
                );
              });
            }}
          </Query>

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              marginTop: 15,
              marginBottom: 20,
            }}
          >
            <TouchableOpacity></TouchableOpacity>
          </View>
        </ScrollView>
        <Dialog
          dialogStyle={{ borderRadius: 24 }}
          onTouchOutside={() => {
            this.setState({ scaleAnimationDialog: false });
          }}
          width={0.7}
          visible={this.state.scaleAnimationDialog}
          dialogAnimation={new ScaleAnimation()}
          dialogTitle={<DialogTitle title="Alert" hasTitleBar={true} />}
        >
          <DialogContent>
            <Text style={{ textAlign: "center", margin: 10 }}>
              Are you sure you want to proceed?
            </Text>
            <View
              style={{ justifyContent: "space-around", flexDirection: "row" }}
            >
              <Button
                color={color.grayColor}
                title="Cancel"
                onPress={this._actionPopup.bind(this, "cancel")}
              />
              <Button
                color={color.primaryColor}
                title="Yes"
                onPress={this._actionPopup.bind(this, "yes")}
              />
            </View>
          </DialogContent>
        </Dialog>
      </View>
    );
  }
}

OfferInvitationScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Invites</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 15,
    padding: 10,
  },
  threadContainer: {
    flex: 1,
    borderBottomWidth: 1,
    borderColor: "#C4C4C4",
    paddingTop: 10,
    paddingBottom: 10,
  },
  userName: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    fontSize: 17,
  },
  userProfile: {
    marginRight: 10,
  },
  acceptBtn: {
    backgroundColor: color.primaryColor,
    borderRadius: 7,
    height: 26,
    width: 85,
    alignItems: "center",
    justifyContent: "center",
  },
  notAcceptBtn: {
    backgroundColor: "#F5F6F6",
    borderRadius: 7,
    height: 35,
    width: "45%",
    alignItems: "center",
    justifyContent: "center",
  },
  notAcceptBtnText: {
    color: color.primaryColor,
  },
  acceptBtnText: {
    fontFamily: FontFamily.Regular,
    color: "#fff",
    fontSize: 12,
  },
});

export default OfferInvitationScreen;
