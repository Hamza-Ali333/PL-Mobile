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

import { Query } from "react-apollo";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import OfferComponent from "../../components/OfferComponent";
import getOffers from "../../graphql/queries/getOffers";
import firstChar from "../../helper/firstChar";
import ellipsis from "../../helper/ellipsis";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import link from "../../constants/link";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const spacing = 10;
const width = (Dimensions.get("window").width - 4 * 10) / 2;

class SavedOfferScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      hasMorePage: false,
    };

    this.refetch;
  }

  componentDidMount() {
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

  _listEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: "center" }}>
        <Text style={styles.emptyText}>Keep what you like here.</Text>
        <Text style={styles.emptyText}>Just click on this icon.</Text>
        <View style={{ alignItems: "center", marginTop: 10 }}>
          <Image
            style={{ width: 28, height: 38, resizeMode: "contain" }}
            source={require("../../assets/images/bookmarks.png")}
          />
        </View>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return <OfferComponent item={item} {...this.props} tags={[]} />;
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <Query query={getOffers} variables={{ saved: true }}>
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
      </View>
    );
  }
}

SavedOfferScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Saved Offers</Text>,
});

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
    fontSize: 15,
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 22,
    textAlign: "center",
  },
});

export default SavedOfferScreen;
