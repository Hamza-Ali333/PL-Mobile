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
import OptimizedFlatList from "../components/OptimizedFlatList";
import OfferComponent from "../components/OfferComponent";
import CategoryComponent from "../components/CategoryComponent";
import FindOfferFilterComponent from "../components/FindOfferFilterComponent";
import FindOfferPopupComponent from "../components/FindOfferPopupComponent";
import getRecommendations from "../graphql/queries/getRecommendations";
import firstChar from "../helper/firstChar";
import ellipsis from "../helper/ellipsis";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import { _handleOfferUnpublished } from "../components/CombineFunction";

const SCREEN_HEIGHT = Dimensions.get("window").height;

const spacing = 10;
const width = (Dimensions.get("window").width - 4 * 10) / 2;

class Recommendations extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      hasMorePage: false,
      tagsData: [],
      categories: [],
      isFilterOpen: false,
      filterText: "RFQs",
      topic_id: null,
      isSearchBar: false,
      search: "",
      is_edit: true,
      offer_id: null,
      isCategoryShow: false,
    };

    this.refetch;
    this.categoryRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.setParams({ showCategory: this.showCategory });
    this.props.navigation.setParams({ isSearchBar: this.state.isSearchBar });
    this.props.navigation.setParams({
      isCategoryShow: this.state.isCategoryShow,
    });
    this.props.navigation.setParams({
      navigateToSearch: this.navigateToSearch,
    });
    this.props.navigation.setParams({
      searchText: this.searchText,
    });
    this.props.navigation.setParams({ offerFilterText: this.state.filterText });
    this.props.navigation.setParams({
      saveCategory: this.saveCategory,
    });
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
    this.setState({ categories: [] });
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
      <ActivityIndicator color="black" style={{ margin: 15 }} />
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
        <Text style={styles.emptyText}>No Private Discussion</Text>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    return (
      <OfferComponent
        key={index}
        _applyTagFilter={this.applyTagFilter}
        _onActionSheet={this.onActionSheet}
        tags={this.state.tagsData}
        categories={this.state.categories}
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

  saveCategory = () => {
    this.categoryRef.current.saveCategory();
  };

  setCategory = (categories) => {
    this.setState({ categories });
    this.showCategory();
  };

  showCategory = () => {
    let { isCategoryShow } = this.state;
    this.setState({ isCategoryShow: !isCategoryShow });
    this.props.navigation.setParams({ isCategoryShow: !isCategoryShow });
  };

  keyExtractor = (item, index) => index.toString();

  render() {
    let variables = {};
    let ids = [];
    if (this.state.categories) {
      this.state.categories.map((item, key) => {
        ids.push(item.id);
      });
    }
    if (ids.length > 0) {
      variables.categories = ids;
    }

    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <View style={{ backgroundColor: "#fff", flex: 1 }}>
          <Query query={getRecommendations} variables={variables}>
            {({ loading, error, data, fetchMore, refetch }) => {
              this.refetch = refetch;
              refetch();
              if (loading)
                return (
                  <View>
                    <ActivityIndicator size="small" color={color.primaryColor} />
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
                      source={require("../assets/images/wifi.png")}
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
                    categories={this.state.categories}
                    _clearFilters={this.clearFilters}
                  />

                  <OptimizedFlatList
                    ref={(r) => (this.flatlistRef = r)}
                    //refreshing={data.networkStatus === 4}
                    extraData={this.state}
                    data={data.recommendations.data}
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
                        tintColor="#2980B9"
                        refreshing={this.state.refreshing}
                        onRefresh={() => {
                          refetch();
                          this.setState({ isLoaded: true });

                          this._onRefresh.bind(this);
                        }}
                      />
                    }
                    onEndReached={() => {
                      var variablesMore = {
                        cursor:
                          data.recommendations.paginatorInfo.currentPage + 1,
                      };

                      fetchMore({
                        variables: variablesMore,
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                          const newOffers =
                            fetchMoreResult.recommendations.data;
                          const pageInfo =
                            fetchMoreResult.recommendations.paginatorInfo;
                          if (
                            data.recommendations.paginatorInfo.total !==
                            pageInfo.total
                          ) {
                            //refetch();
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
                                recommendations: {
                                  __typename:
                                    previousResult.recommendations.__typename,
                                  data: [
                                    ...previousResult.recommendations.data,
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

        {this.state.isCategoryShow && (
          <CategoryComponent
            ref={this.categoryRef}
            _setCategory={this.setCategory}
            categories={this.state.categories}
          />
        )}
      </View>
    );
  }
}

Recommendations.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("showCategory")}
      style={{ flex: 1, flexDirection: "row" }}
    >
      <Text style={styles.headerPageTitle}>Private Discussion</Text>
      {screenProps.navigation.getParam("isCategoryShow") ? (
        <Image
          style={{
            width: 15,
            height: 15,
            resizeMode: "contain",
            marginTop: 2,
          }}
          source={require("../assets/images/colorarrwdown.png")}
        />
      ) : (
        <Image
          style={{
            width: 15,
            height: 15,
            resizeMode: "contain",
            marginTop: 2,
          }}
          source={require("../assets/images/arrow-right-side.png")}
        />
      )}
    </TouchableOpacity>
  ),
  headerRight: () => screenProps.navigation.getParam("isCategoryShow") ? (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={screenProps.navigation.getParam("saveCategory")}
    >
      <Text style={styles.postText}>Save</Text>
    </TouchableOpacity>
  ) : null,
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
  headerRight: () => {
    flex: 1,
    marginRight: 15,
    alignItems: "flex-end",
    justifyContent: "center",
  },
  touchRightHeadText: {
    padding: 10,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    fontSize: 17,
    marginLeft: 15,
    marginRight: 5,
    textAlign: "center",
  },
});

export default Recommendations;
