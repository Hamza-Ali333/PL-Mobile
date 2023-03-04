import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import { Query } from "react-apollo";
import * as Network from "expo-network";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import getDraftOffers from "../../graphql/queries/getDraftOffers";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const spacing = 10;
const width = (Dimensions.get("window").width - 4 * 10) / 2;

class DraftOfferScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      me: {},
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
  requestScreenEdit = (id) => {
    this.props.navigation.navigate("NewOffers", { id: id });
  };

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          height: SCREEN_HEIGHT - 100,
        }}
      >
        <Text>No offer found.</Text>
      </View>
    );
  };

  _shouldItemUpdate = (prev, next) => {
    return prev.state !== next.state;
  };

  renderItem = ({ item, index }) => {
    return (
      <TouchableOpacity
        onPress={() => this.requestScreenEdit(item.id)}
        style={{
          alignItems: "center",
          justifyContent: "center",
          width: width,
          height: 150,
          marginTop: 10,
          borderRadius: 4,
          backgroundColor: color.lightGrayColor,
        }}
      >
        <Text
          style={{
            color: "#BDBDBD",
            fontSize: 14,
            fontFamily: FontFamily.Medium,
          }}
        >
          {item.title}
        </Text>
      </TouchableOpacity>
    );
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <Query query={getDraftOffers}>
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
                  // style={{flex:1, borderWidth:1,flexDirection: 'column'}}
                  columnWrapperStyle={{
                    flex: 1,
                    justifyContent: "space-between",
                  }}
                  numColumns={2}
                  // columnWrapperStyle={'flexShrink: 1'}
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
                  onViewableItemsChanged={this.onViewableItemsChanged}
                  viewabilityConfig={{
                    itemVisiblePercentThreshold: 50,
                  }}
                  //ItemSeparatorComponent={() => <View style={{ marginBottom: 10 }} />}
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

DraftOfferScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Draft offer</Text>,
});

const styles = StyleSheet.create({
  postButton: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 15,
  },
});

export default DraftOfferScreen;
