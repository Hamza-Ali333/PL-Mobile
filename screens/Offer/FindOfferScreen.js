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
import ActionSheet from "react-native-actionsheet";
import { Query } from "react-apollo";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import OfferComponent from "../../components/OfferComponent";
import FindOfferFilterComponent from "../../components/FindOfferFilterComponent";
import FindOfferPopupComponent from "../../components/FindOfferPopupComponent";
import FindOfferSearchBarComponent from "../../components/FindOfferSearchBarComponent";
import getOffers from "../../graphql/queries/getOffers";
import firstChar from "../../helper/firstChar";
import ellipsis from "../../helper/ellipsis";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import link from "../../constants/link";
import { _handleOfferUnpublished } from "../../components/CombineFunction";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const spacing = 10;
const width = (Dimensions.get("window").width - 4 * 10) / 2;

class FindOfferScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      hasMorePage: false,
      tagsData: [],
      isFilterOpen: false,
      filterText: "All Topics",
      topic_id: null,
      isSearchBar: false,
      search: "",
      is_edit: true,
      offer_id: null,
    };

    this.refetch;
  }

  componentDidMount() {
    this.props.navigation.setParams({ openOfferFilter: this.openOfferFilter });
    this.props.navigation.setParams({ isSearchBar: this.state.isSearchBar });
    this.props.navigation.setParams({
      navigateToSearch: this.navigateToSearch,
    });
    this.props.navigation.setParams({
      searchText: this.searchText,
    });
    this.props.navigation.setParams({ offerFilterText: this.state.filterText });
    this.refetch();
  }

  applyTagFilter = (tag) => {
    let tagsData = this.state.tagsData;

    if (!tagsData.find((data) => data.id === tag.id)) {
      tagsData = [...tagsData, tag];
    } else {
      tagsData = tagsData.filter((item) => item.id !== tag.id);
    }

    this.setState({ tagsData });
  };

  searchText = (search) => {
    this.setState({ search });
  };

  clearFilters = () => {
    this.setState({ tagsData: [] });
  };

  applyCategoryFilter = (item) => {
    this.props.navigation.setParams({ offerFilterText: item.name });
    this.setState({ isFilterOpen: false, topic_id: item.id });
  };

  openOfferFilter = () => {
    this.setState({ isFilterOpen: !this.state.isFilterOpen });
  };

  navigateToSearch = () => {
    this.props.navigation.setParams({ isSearchBar: !this.state.isSearchBar });
    this.setState({ isSearchBar: !this.state.isSearchBar });
  };

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
        <Text style={styles.emptyText}>No Public Offer</Text>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <OfferComponent
        _applyTagFilter={this.applyTagFilter}
        _onActionSheet={this.onActionSheet}
        tags={this.state.tagsData}
        item={item}
        {...this.props}
      />
    );
  };

  onActionSheet = (id, visibility) => {
    if (visibility === 0) {
      this.setState({ is_edit: true, offer_id: id });
    } else {
      this.setState({ is_edit: false, offer_id: id });
    }
    this.ActionSheet.show();
  };

  _onActionSheetAction = (index) => {
    if (index === 0) {
      if (this.state.is_edit === false) {
        _handleOfferUnpublished(this.state.offer_id);
        this.setState({ is_edit: true });
        this.ActionSheet.show();
      } else {
        this.props.navigation.navigate("NewOffers", {
          id: this.state.offer_id,
        });
      }
    }
  };

  render() {
    let { tagsData, topic_id, search } = this.state;
    let tags = tagsData.map((tag) => tag.id);
    let variables = { public: true };
    if (tags.length > 0) variables.tags = tags;
    if (topic_id) variables.category = topic_id;
    if (search !== "" || search !== null) variables.search = search;

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <Query
            query={getOffers}
            fetchPolicy={"no-cache"}
            variables={variables}
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
                      flex: 1,
                      flexDirection: "column",
                    }}
                  >
                    <Image
                      style={{
                        width: "80%",
                        height: 300,
                        resizeMode: "contain",
                      }}
                      source={require("../../assets/images/wifi.png")}
                    />
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
                <View style={{ flex: 1 }}>
                  <FindOfferFilterComponent
                    tags={this.state.tagsData}
                    _clearFilters={this.clearFilters}
                  />

                  <OptimizedFlatList
                    ref={(r) => (this.flatlistRef = r)}
                    //refreshing={data.networkStatus === 4}
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
                </View>
              );
            }}
          </Query>
        </View>
        {this.state.isFilterOpen && (
          <FindOfferPopupComponent
            _applyCategoryFilter={this.applyCategoryFilter}
            category={this.state.topic_id}
          />
        )}
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={"Actions"}
          options={[this.state.is_edit ? "Edit" : "Unpublish", "Cancel"]}
          cancelButtonIndex={1}
          onPress={this._onActionSheetAction}
        />
      </View>
    );
  }
}

FindOfferScreen.navigationOptions = (screenProps) => ({
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

  headerTitle: () => <FindOfferSearchBarComponent screenProps={screenProps} />,
  headerRight: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("navigateToSearch")}
      style={styles.headerRight}
    >
      {screenProps.navigation.getParam("isSearchBar") ? (
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain" }}
          source={require("../../assets/images/filter-drag.png")}
        />
      ) : (
        <Image
          style={{ width: 20, height: 20, resizeMode: "contain" }}
          source={require("../../assets/images/searchColor.png")}
        />
      )}
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  postButton: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 22,
    textAlign: "center",
  },
  headerRight: {
    flex: 1,
    marginRight: 15,
    alignItems: "flex-end",
    justifyContent: "center",
  },
});

export default FindOfferScreen;
