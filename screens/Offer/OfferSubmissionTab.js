import React from "react";
import {
  ActivityIndicator,
  Button,
  Dimensions,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Share,
  RefreshControl,
} from "react-native";
import { Avatar } from "react-native-paper";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";
import { Query } from "react-apollo";
import * as Network from "expo-network";

import ProfilePhoto from "../../components/ProfilePhoto";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import OfferComponent from "../../components/OfferComponent";
import ProposalFilterComponent from "../../components/ProposalFilterComponent";
import getOfferSubmission from "../../graphql/queries/getOfferSubmission";
import firstChar from "../../helper/firstChar";
import ellipsis from "../../helper/ellipsis";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import offerInviteAcceptMutation from "../../graphql/mutations/offerInviteAcceptMutation";
import offerInviteRejectMutation from "../../graphql/mutations/offerInviteRejectMutation";
import link from "../../constants/link";
import client from "../../constants/client";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const spacing = 10;
const width = (Dimensions.get("window").width - 4 * 10) / 2;

class OfferSubmissionTab extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      hasMorePage: false,
      isFilterOpen: false,
      filterText: "Invitation",
      filter_id: 1,
    };

    this.refetch;
  }

  componentDidMount() {}

  shouldComponentUpdate(nextProps, nextState) {
    if (nextProps.index === this.props.index) {
      return true;
    }
    return false;
  }

  componentDidUpdate() {
    this.tapOnTabNavigator();
  }

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  _onRefresh = () => {
    this.setState({ refreshing: true });
  };

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        this.refetch();
      }
    }
  };

  applyOfferFilters = (filters, filterText) => {
    this.setState(filters);
    this.props.navigation.setParams({ offerFilterText: filterText });
  };

  openOfferFilter = () => {
    this.setState({ isFilterOpen: true });
  };

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          height: SCREEN_HEIGHT / 2 + 70,
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Text style={styles.emptyText}>
          {this.state.filter_id === 1
            ? "No Invitation Offer"
            : "No Applied Offer"}
        </Text>
      </View>
    );
  };

  goToProfile = (user_id) => {
    this.props.navigation.navigate("UserProfile", {
      user_id: user_id,
    });
  };

  renderItem = (item, key) => {
    if (!item.user) return null;

    let url = link.url + "/uploads/profile_images/" + item.user.profile_photo;
    return (
      <View key={key} style={styles.threadContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {item.user.profile_photo ? (
            <Avatar.Image
              style={{ marginRight: 15 }}
              size={50}
              source={{ uri: url }}
            />
          ) : (
            <Avatar.Text
              style={{ marginRight: 15 }}
              size={50}
              label={
                firstChar(item.user.firstname) + firstChar(item.user.lastname)
              }
            />
          )}

          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.goToProfile(item.user.id)}>
              <Text style={styles.userName}>
                {item.user.firstname ?? ""} {item.user.lastname ?? ""}
              </Text>
            </TouchableOpacity>
            <Text
              style={{
                color: "#9DA4B4",
                fontSize: 12,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
              }}
            >
              @{item.user.username}
            </Text>
          </View>
          <View>
            <TouchableOpacity
              onPress={() =>
                this.props.navigation.navigate("OfferAnswerScreen", {
                  id: item.id,
                })
              }
              style={{
                backgroundColor: "#F3F5FB",
                alignItems: "center",
                justifyContent: "center",
                borderRadius: 15,
                paddingTop: 5,
                paddingBottom: 5,
                paddingLeft: 10,
                paddingRight: 10,
              }}
            >
              <Text
                style={{
                  color: color.primaryColor,
                  fontFamily: FontFamily.Medium,
                  fontSize: 12,
                }}
              >
                Review
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
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
      <View style={{ flex: 1 }}>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingLeft: 15,
            paddingRight: 15,
          }}
        >
          <ScrollView>
            <Text
              style={{
                marginTop: 10,
                fontFamily: FontFamily.Bold,
                fontSize: 18,
              }}
            >
              Submissions
            </Text>
            <Text
              style={{
                marginBottom: 10,
                fontFamily: FontFamily.Regular,
                fontSize: 14,
                color: color.grayColor,
              }}
            >
              Following is the Submissions
            </Text>
            <Query
              query={getOfferSubmission}
              variables={{ id: this.props.navigation.getParam("id") }}
            >
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

                if (data.offer.participants.length > 0) {
                  return data.offer.participants.map((item, key) => {
                    return this.renderItem(item, key);
                  });
                } else {
                  return (
                    <View
                      style={{
                        justifyContent: "center",
                        alignItems: "center",
                        marginTop: 20,
                      }}
                    >
                      <Text>No submission</Text>
                    </View>
                  );
                }
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
        {this.state.isFilterOpen && (
          <ProposalFilterComponent
            filter_id={this.state.filter_id}
            _applyOfferFilters={this.applyOfferFilters}
          />
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  postButton: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 20,
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 22,
    textAlign: "center",
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

export default OfferSubmissionTab;
