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
import { FontAwesome } from "@expo/vector-icons";
import getCourseReview from "../../graphql/queries/getCourseReview";
import OptimizedFlatList from "../../components/OptimizedFlatList";
import { Query } from "react-apollo";
import { Avatar } from "react-native-paper";
import capitalize from "../../helper/capitalize";
import firstChar from "../../helper/firstChar";
import link from "../../constants/link.js";
class AllReviewsScreen extends Component {
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
    this.refetch = [];
    this.categoryRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this._onRefresh);
  }

  stars = (rating) => {
    let stars = [];
    for (var i = 1; i <= 5; i++) {
      let name = "";
      if (i <= rating) {
        name = "star";
      } else if (i > rating && rating > i - 1) {
        name = "star-half-empty";
      } else if (i > rating) {
        name = "star-o";
      }
      stars.push(
        <FontAwesome
          style={styles.stars}
          name={name}
          size={16}
          color="#eb8a2f"
        />
      );
    }
    return <>{stars}</>;
  };

  renderItem = ({ item, index }) => {
    const { navigation } = this.props;
    return (
      <View style={styles.feedbackContainer} key={index}>
        <View style={styles.userCommentInfo}>
          <View style={styles.userInfo}>
            {item.user.profile_photo ? (
              <Avatar.Image
                style={styles.avatar}
                size={48}
                source={{
                  uri:
                    link.url +
                    "/uploads/profile_images/" +
                    item.user.profile_photo,
                }}
              />
            ) : (
              <Avatar.Text
                style={{ backgroundColor: "#2980B9", marginRight: 10 }}
                size={42}
                label={
                  firstChar(item.user.firstname) + firstChar(item.user.lastname)
                }
              />
            )}

            <View>
              <Text style={styles.userName}>
                {capitalize(item.user.firstname)}{" "}
                {capitalize(item.user.lastname)}
              </Text>
              <View style={[styles.rating, { marginTop: 2 }]}>
                {this.stars(item.rating)}
                <Text style={styles.grayText}> {item.readable_created_at}</Text>
              </View>
            </View>
          </View>
          <Text style={styles.text}>{item.review}</Text>
        </View>
      </View>
    );
  };

  renderFooter() {
    return this.state.hasMorePage ? (
      <ActivityIndicator color="black" style={{ margin: 15 }} />
    ) : null;
  }
  _onRefresh = () => {
    this.refetch.map((item, _) => {
      item();
    });
    this.setState({ refreshing: false });
  };

  render() {
    let course_id = this.props.navigation.getParam("course_id");

    let variables = {};

    variables.course_id = course_id;

    return (
      <Query query={getCourseReview} variables={variables}>
        {({ loading, error, data, fetchMore, refetch }) => {
          this.refetch.push(refetch);
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
                data={data.course_review.data}
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
                      this._onRefresh();
                    }}
                  />
                }
                onEndReached={() => {
                  var variablesMore = {
                    cursor: data.course_review.paginatorInfo.currentPage + 1,
                  };

                  fetchMore({
                    variables: variablesMore,
                    updateQuery: (previousResult, { fetchMoreResult }) => {
                      const newOffers = fetchMoreResult.course_review.data;
                      const pageInfo =
                        fetchMoreResult.course_review.paginatorInfo;
                      if (
                        data.course_review.paginatorInfo.total !==
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
                            course_review: {
                              __typename:
                                previousResult.course_review.__typename,
                              data: [
                                ...previousResult.course_review.data,
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

AllReviewsScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Reviews</Text>,
});

export default AllReviewsScreen;

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 5,
    marginBottom: 15,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  listIcon: {
    marginRight: 10,
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 18,
  },
  rating: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },
  video: {
    marginTop: 13,
  },
  stars: {
    marginLeft: 1,
    marginRight: 1,
  },
  text: {
    color: color.black,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
  grayText: {
    color: color.grayColor,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
  separator: {
    marginTop: 13,
    marginBottom: 13,
  },
  info: {
    flexDirection: "row",
    alignItems: "center",
  },
  dot: {
    width: 2,
    height: 2,
    borderRadius: 20,
    backgroundColor: color.grayColor,
    marginLeft: 5,
    marginRight: 5,
  },
  leacutreList: {
    flexDirection: "row",
    alignItems: "center",
    marginLeft: 10,
    marginRight: 10,
  },
  leacutreNumber: {
    width: 20,
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackContainer: {
    marginTop: 13,
    paddingHorizontal: 13,
  },
  avatar: {
    backgroundColor: "#fff",
    marginRight: 10,
  },
  userName: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
  },
  userInfo: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  addCommentContainer: {
    backgroundColor: color.lightGrayColor,
    padding: 13,
    borderTopWidth: 1,
    borderColor: "#ddd",
    marginTop: 13,
  },
  TextInput: {
    flex: 1,
    minHeight: 100,
    textAlignVertical: "top",
    padding: 10,
  },
  TextInputContainer: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    borderRadius: 10,
    paddingRight: 5,
  },
});
