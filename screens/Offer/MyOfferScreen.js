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
  ColorPropType,
} from "react-native";
import { Avatar } from "react-native-paper";
import * as Network from "expo-network";
import { Query } from "react-apollo";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import OfferComponent from "../../components/OfferComponent";
import MyOfferFilterComponent from "../../components/MyOfferFilterComponent";
import getOffers from "../../graphql/queries/getOffers";
import firstChar from "../../helper/firstChar";
import ellipsis from "../../helper/ellipsis";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import link from "../../constants/link";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const spacing = 10;
const width = (Dimensions.get("window").width - 4 * 10) / 2;

class MyOfferScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      hasMorePage: false,
      isFilterOpen: false,
      filterText: "Published",
      filter_id: 1,
    };

    this.refetch;
  }

  componentDidMount() {
    this.props.navigation.setParams({ openOfferFilter: this.openOfferFilter });
    this.props.navigation.setParams({ offerFilterText: this.state.filterText });
    this.props.navigation.setParams({ postNewOffer: this.postNewOffer });
    this.props.navigation.addListener("didFocus", this.didFocus);
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

  didFocus = () => {
    if (this.props.navigation.getParam("status") === 0) {
      this.setState({ filter_id: 2, filterText: "Draft" });
      this.props.navigation.setParams({ offerFilterText: "Draft" });
      setTimeout(() => {
        this.tapOnTabNavigator();
      }, 1000);
    } else if (this.props.navigation.getParam("status") === 1) {
      this.setState({ filter_id: 1, filterText: "Published" });
      this.props.navigation.setParams({ offerFilterText: "Published" });
      setTimeout(() => {
        this.tapOnTabNavigator();
      }, 1000);
    }
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
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.emptyText}>No offer found</Text>
        <Text style={styles.emptyText}>Create a new one?</Text>
        <TouchableOpacity
          style={[
            styles.postButton,
            { justifyContent: "center", alignItems: "center" },
          ]}
          onPress={() => this.props.navigation.navigate("NewOffers")}
        >
          <Text style={styles.postText}>Create Offer</Text>
        </TouchableOpacity>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return <OfferComponent item={item} {...this.props} tags={[]} />;
  };

  postNewOffer = () => {
    this.props.navigation.navigate("NewOffers");
  };

  render() {
    let variables = { me: true };
    if (this.state.filter_id === 1) {
      variables.visibility = "1";
    } else if (this.state.filter_id === 2) {
      variables.visibility = "0";
    } else if (this.state.filter_id === 3) {
      variables.visibility = "2";
    } else if (this.state.filter_id === 4) {
      variables = { expired: true };
    } else if (this.state.filter_id === 5) {
      variables.visibility = "3";
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <Query query={getOffers} variables={variables}>
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
                  extraData={this.state}
                  data={data.offers.data}
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
                        cursor: data.offers.paginatorInfo.currentPage + 1,
                      },
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newOffers = fetchMoreResult.offers.data;
                        const pageInfo = fetchMoreResult.offers.paginatorInfo;
                        if (
                          data.offers.paginatorInfo.total !== pageInfo.total
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
                              offers: {
                                __typename: previousResult.offers.__typename,
                                data: [
                                  ...previousResult.offers.data,
                                  ...newOffers,
                                ],
                                paginatorInfo: pageInfo,
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
        </View>
        {this.state.isFilterOpen && (
          <MyOfferFilterComponent
            filter_id={this.state.filter_id}
            _applyOfferFilters={this.applyOfferFilters}
          />
        )}
      </View>
    );
  }
}

MyOfferScreen.navigationOptions = (screenProps) => ({
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
  headerRight: () => (
    <View>
      <TouchableOpacity
        style={styles.touchRightHeadText}
        onPress={screenProps.navigation.getParam("postNewOffer")}
      >
        <Text style={styles.postTextRight}>New Offer</Text>
      </TouchableOpacity>
    </View>
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
  postTextRight: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 22,
    textAlign: "center",
  },
  touchRightHeadText: {
    padding: 10,
    justifyContent: "center",
  },
});

export default MyOfferScreen;
