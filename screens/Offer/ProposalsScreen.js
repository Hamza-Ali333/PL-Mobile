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

import ProfilePhoto from "../../components/ProfilePhoto";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import OfferComponent from "../../components/OfferComponent";
import ProposalFilterComponent from "../../components/ProposalFilterComponent";
import getOfferInvites from "../../graphql/queries/getOfferInvites";
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

class ProposalsScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      hasMorePage: false,
      isFilterOpen: false,
      filterText: "Invitations",
      filter_id: 1,
    };

    this.refetch;
  }

  componentDidMount() {
    this.props.navigation.setParams({ openOfferFilter: this.openOfferFilter });
    this.props.navigation.setParams({ offerFilterText: this.state.filterText });
    this.refetch();
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
    this.setState({ isFilterOpen: !this.state.isFilterOpen });
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

  renderItem = ({ item, key }) => {
    let url = link.url + "/" + item.company.logo;
    return (
      <View key={key} style={styles.threadContainer}>
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {item.company.logo ? (
            <Avatar.Image
              style={{ marginRight: 15 }}
              size={50}
              source={{ uri: url }}
            />
          ) : (
            <Avatar.Text
              style={{ marginRight: 15 }}
              size={50}
              label={firstChar(item.company.title)}
            />
          )}

          <View style={{ flex: 1 }}>
            <TouchableOpacity onPress={() => this.goToOffer(item.id)}>
              <Text style={styles.userName}>{item.company.title ?? ""}</Text>
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
          {item.pivot.direction === "you" ? (
            <View
              style={{
                flexDirection: "row",
                justifyContent: "flex-end",
              }}
            >
              {item.pivot.status === "0" ? (
                <Text style={styles.notAcceptBtnText}>Pending</Text>
              ) : (
                <Text style={styles.notAcceptBtnText}>Accepted</Text>
              )}
            </View>
          ) : null}

          {item.pivot.direction === "me" ? (
            item.pivot.status === "0" ? null : (
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "flex-end",
                }}
              >
                <Text style={styles.notAcceptBtnText}>Accepted</Text>
              </View>
            )
          ) : null}
        </View>
        <TouchableOpacity
          style={{ flex: 1 }}
          onPress={() => this.goToOffer(item.id)}
        >
          <Text style={[styles.userName, { marginTop: 10, marginBottom: 10 }]}>
            {item.title ?? ""}
          </Text>
        </TouchableOpacity>
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
                  item.pivot.user_id
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
                  item.pivot.user_id
                )}
                style={styles.notAcceptBtn}
              >
                <Text style={styles.notAcceptBtnText}>Reject</Text>
              </TouchableOpacity>
            </View>
          ) : null
        ) : null}
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
    let variables = { me: true };
    if (this.state.filter_id === 1) {
      variables.isInvitation = true;
    } else if (this.state.filter_id === 2) {
      variables.isApplied = true;
    }

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
            <Query query={getOfferInvites} variables={variables}>
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
                return (
                  <OptimizedFlatList
                    ref={(r) => (this.flatlistRef = r)}
                    refreshing={data.networkStatus === 4}
                    extraData={this.state}
                    data={data.me.offerInvites.data}
                    renderItem={this.renderItem}
                    showsVerticalScrollIndicator={false}
                    initialListSize={10}
                    keyExtractor={this.keyExtractor}
                    initialNumToRender={10}
                    maxToRenderPerBatch={10}
                    onEndReachedThreshold={0.5}
                    viewabilityConfig={{
                      itemVisiblePercentThreshold: 50,
                    }}
                    ListFooterComponent={this.renderFooter.bind(this)}
                    ListEmptyComponent={this._listEmptyComponent}
                    contentContainerStyle={{ flexGrow: 1 }}
                    refreshControl={
                      <RefreshControl
                        tintColor={color.primaryColor}
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                          this.setState({ isLoaded: true });
                          refetch();
                          this._onRefresh.bind(this);
                        }}
                      />
                    }
                    onEndReached={() => {
                      fetchMore({
                        variables: {
                          cursor:
                            data.me.offerInvites.paginatorInfo.currentPage + 1,
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                          const newOffers =
                            fetchMoreResult.me.offerInvites.data;
                          const pageInfo =
                            fetchMoreResult.me.offerInvites.paginatorInfo;
                          if (
                            data.me.offerInvites.paginatorInfo.total !==
                            pageInfo.total
                          ) {
                            refetch();
                          }

                          //return [...previousResult, ...fetchMoreResult];
                          if (pageInfo.hasMorePages) {
                            this.setState({ hasMorePage: true });
                          } else {
                            this.setState({ hasMorePage: false });
                          }
                          return newOffers.length
                            ? {
                                // Put the new comments at the end of the list and update `pageInfo`
                                // so we have the new `endCursor` and `hasNextPage` values
                                me: {
                                  __typename: previousResult.me.__typename,
                                  offerInvites: {
                                    __typename:
                                      previousResult.me.offerInvites.__typename,
                                    data: [
                                      ...previousResult.me.offerInvites.data,
                                      ...newOffers,
                                    ],
                                    paginatorInfo: pageInfo,
                                  },
                                },
                              }
                            : previousResult;
                        },
                      });
                    }}
                  />
                );
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

ProposalsScreen.navigationOptions = (screenProps) => ({
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
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("openOfferFilter")}
      style={{
        flex: 1,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "center",
      }}
    >
      <Text style={styles.headerPageTitle}>
        {screenProps.navigation.getParam("offerFilterText")}
      </Text>
      <Image
        style={{ width: 15, height: 15, resizeMode: "contain" }}
        source={require("../../assets/images/ArrowDown.png")}
      />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginRight: 10,
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

export default ProposalsScreen;
