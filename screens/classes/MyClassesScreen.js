import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  ActivityIndicator,
  RefreshControl,
} from "react-native";
import { Query } from "react-apollo";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { Feather } from "@expo/vector-icons";
import SeeAllClassesComponent from "../../components/SeeAllClassesComponent";
import getMyClasses from "../../graphql/queries/getMyClasses";
import getClasses from "../../graphql/queries/getClasses";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import Classes from "../../components/Skeleton/Classes.js";
import gstyles from "../../constants/gstyles.js";
import NoWifi from "../../components/NoWifi/index.js";

class MyClassesScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      refreshing: false,
      search: "",
    };
  }

  onChangeSearch = (text) => {
    this.setState({
      search: text,
    });
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;

    let type = "";
    if (item.course_objective) {
      type = "Additional Resources";
    } else if (item.course_objective == null) {
      type = "Newest";
    } else if (item.is_training == "1") {
      type = "Featured";
    } else if (item.reviews.paginatorInfo.total > 0) {
      type = "Popular";
    }
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

  _onRefresh = () => {
    this.setState({ refreshing: true });
  };
  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color="black" style={{ margin: 15 }} />
    ) : null;
  }

  renderEmptyContainer = () => {
    return (
      <View
        style={{
          flex: 1,
          alignSelf: "center",
          marginTop: 5,
          paddingHorizontal: 13,
        }}
      >
        <Text
          numberOfLines={2}
          style={{
            fontFamily: FontFamily.Regular,
            color: color.grayColor,
            fontSize: 12,
            lineHeight: 18,
          }}
        >
          You do not have access to any classes yet. Please sign-up for Pro
          level to enroll in any course you like.
        </Text>
      </View>
    );
  };

  render() {
    let variables = {};

    if (this.state.search !== "") {
      variables.search = this.state.search;
    }
    return (
      <View style={styles.container}>
        <View style={styles.roundedTextInput}>
          <Feather name="search" size={24} color={color.grayColor} />
          <TextInput
            style={styles.textInput}
            placeholder="Search Classes"
            onChangeText={(text) => this.onChangeSearch(text)}
          />
        </View>
        <Query query={getMyClasses} variables={variables}>
          {({ loading, error, data, fetchMore, refetch }) => {
            if (loading)
              return (
                <>
                  <Classes />
                  <View style={gstyles.h_10} />
                  <Classes />
                  <View style={gstyles.h_10} />
                  <Classes />
                </>
              );

            if (error) {
              return <NoWifi onPress={() => refetch()} />;
            }

            if (data !== undefined) {
              return (
                <OptimizedFlatList
                  ref={(r) => (this.flatlistRef = r)}
                  extraData={this.state}
                  data={data.me.courses.data}
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
                  ListEmptyComponent={this.renderEmptyContainer}
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
                      cursor: data.me.courses.paginatorInfo.currentPage + 1,
                    };

                    fetchMore({
                      variables: variablesMore,
                      updateQuery: (previousResult, { fetchMoreResult }) => {
                        const newOffers = fetchMoreResult.me.courses.data;
                        const pageInfo =
                          fetchMoreResult.me.courses.paginatorInfo;
                        if (
                          data.me.courses.paginatorInfo.total !== pageInfo.total
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
            return null;
          }}
        </Query>
      </View>
    );
  }
}

MyClassesScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>My Classes</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
    height: 100,
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
  roundedTextInput: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 5,
    marginHorizontal: 10,
  },
  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
});

export default MyClassesScreen;
