import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  RefreshControl,
  ActivityIndicator,
  Button,
} from "react-native";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import getClasses from "../../graphql/queries/getClasses";
import SeeAllClassesComponent from "../../components/SeeAllClassesComponent";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import { Query } from "react-apollo";

class UpcommingClassesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      hasMorePage: false,
      tagsData: [],
      categories: [],
      myCategories: [],
      isFilterOpen: false,
      filterText: "RFQs",
      topic_id: null,
      isSearchBar: false,
      search: "",
      is_edit: true,
      offer_id: null,
      isCategoryShow: false,
      me: {},
      selectedCategories: [],
      showSearch: true,
    };

    this.refetch;
    this.categoryRef = React.createRef();
  }

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    let type = this.props.navigation.getParam("type");
    return (
      <SeeAllClassesComponent
        key={index}
        navigation={navigation}
        maxWidth={300}
        item={item}
        type={type}
      />
    );
  };

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color="black" style={{ margin: 15 }} />
    ) : null;
  }
  _onRefresh = () => {
    this.setState({ refreshing: true });
  };

  render() {
    let type = this.props.navigation.getParam("type");
    let variables = {};

    let type2 = "";
    if (type === "Upcoming") {
      type2 = "upcoming";
    } else if (type === "Expired") {
      type2 = "expired";
    } else if (type === "Newest") {
      type2 = "all_courses_execpt_item";
    } else if (type === "Popular") {
      type2 = "popular";
    } else if (type === "Featured") {
      type2 = "featured";
    } else if (type === "Additional Resources") {
      type2 = "item_based";
    }
    variables.typeInfo = type2;

    return (
      <Query query={getClasses} variables={variables}>
        {({ loading, error, data, fetchMore, refetch }) => {
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
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text style={{ fontSize: 19 }}>No Internet Connection</Text>
                  <Text>Could not connected to the network </Text>
                  <Text>Please check and try again.</Text>
                  <Button title="Retry" onPress={() => refetch()} />
                </View>
              </View>
            );
          if (data !== undefined) {
            return (
              <OptimizedFlatList
                ref={(r) => (this.flatlistRef = r)}
                //refreshing={data.networkStatus === 4}
                extraData={this.state}
                data={data.courses.data}
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
                      refetch();
                      this.setState({ isLoaded: true });

                      this._onRefresh.bind(this);
                    }}
                  />
                }
                onEndReached={() => {
                  var variablesMore = {
                    cursor: data.courses.paginatorInfo.currentPage + 1,
                  };

                  fetchMore({
                    variables: variablesMore,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newOffers = fetchMoreResult.courses.data;
                      const pageInfo = fetchMoreResult.courses.paginatorInfo;
                      if (data.courses.paginatorInfo.total !== pageInfo.total) {
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
                            courses: {
                              __typename: previousResult.courses.__typename,
                              data: [
                                ...previousResult.courses.data,
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
          }
        }}
      </Query>
    );
  }
}
UpcommingClassesScreen.navigationOptions = (screenProps) => {
  return {
    headerTintColor: color.primaryColor,
    headerBackTitleStyle: { fontSize: 18 },
    headerBackTitle: null,
    headerTruncatedBackTitle: null,
    headerForceInset: { top: "never", bottom: "never" },
    headerStyle: {
      borderBottomColor: "transparent",
      borderWidth: 0,
      height: 70,
      shadowOpacity: 0,
      elevation: 0,
    },
    headerTitle: () => (
      <Text style={styles.headerPageTitle}>
        {screenProps.navigation.getParam("type")}{" "}
        {screenProps.navigation.getParam("type") == "Additional Resources"
          ? ""
          : screenProps.navigation.getParam("type") === "Upcoming"
          ? "Events"
          : screenProps.navigation.getParam("type") === "Expired"
          ? "Events"
          : "Classes"}
      </Text>
    ),
  };
};

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    marginBottom: 20,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  heading: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  authors: {
    flexDirection: "row",
    alignItems: "center",
    flexWrap: "wrap",
    width: "100%",
  },
  bgImage: {
    width: "100%",
    height: 80,
  },
  innerBg: {
    padding: 20,
    backgroundColor: "rgba(0,0,0,.5)",
    height: "100%",
    justifyContent: "flex-end",
    borderRadius: 6,
  },
  list: {
    backgroundColor: "#fff",
    borderRadius: 6,
    margin: 10,
  },
  halfList: {
    maxWidth: 200,
    marginRight: 5,
  },
  listBody: {
    padding: 10,
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
  },
  titleList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 30,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 5,
  },
  stars: {
    marginRight: 3,
  },
  grayText: {
    color: color.grayColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  text: {
    color: color.blackColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  primaryText: {
    color: color.primaryColor,
    fontSize: 14,
    fontFamily: FontFamily.Regular,
  },
  chip: {
    backgroundColor: "#F3F5FB",
    marginRight: 8,
    marginTop: 8,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    paddingLeft: 15,
    paddingRight: 15,
    height: 34,
  },
});

export default UpcommingClassesScreen;
