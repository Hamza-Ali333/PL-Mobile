import { FontAwesome5, MaterialCommunityIcons } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";
import React from "react";
import { Mutation, Query } from "react-apollo";
import {
  ActivityIndicator,
  Alert,
  Animated,
  Button,
  Easing,
  FlatList,
  Image,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  RefreshControl,
  ScrollView,
  Share,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { Chip } from "react-native-paper";
import { TabBar, TabView } from "react-native-tab-view";
import {
  requestMiddleware,
  _handleOfferInviteRequest,
  _handleofferUpdateStatus,
} from "../components/CombineFunction";
import DownloadFile from "../components/DownloadFile";
import ImageFile from "../components/ImageFile";
import OfferComment from "../components/OfferComment";
import ProfilePhoto from "../components/ProfilePhoto";
import client from "../constants/client";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import createOfferCommentMutation from "../graphql/mutations/createOfferCommentMutation";
import deleteOfferCommentMutation from "../graphql/mutations/deleteOfferCommentMutation";
import getRecommendation from "../graphql/queries/getRecommendation";
import getRecommendationComments from "../graphql/queries/getRecommendationComments";
import getTabRoutes from "../graphql/queries/getTabRoutes";
import htmlToNative from "../helper/htmlHelper";
import OfferApplicationTab from "../screens/Offer/OfferApplicationTab";
import OfferRequestTab from "../screens/Offer/OfferRequestTab";
import OfferSubmissionTab from "../screens/Offer/OfferSubmissionTab";
import OfferWinnerTab from "../screens/Offer/OfferWinnerTab";
import OfferWorkInProgressTab from "../screens/Offer/OfferWorkInProgressTab";

const getTabBarIcon = (props, index, routes) => {
  const { route } = props;
  if (route.key === "application") {
    let tabIndex = routes.findIndex((data) => data.key === "application");
    return (
      <FontAwesome5
        name="user"
        size={20}
        style={{
          color: index === tabIndex ? color.primaryColor : color.grayColor,
          fontFamily: FontFamily.Regular,
        }}
      />
    );
  } else if (route.key === "request") {
    let tabIndex = routes.findIndex((data) => data.key === "request");
    return (
      <FontAwesome5
        name="user-plus"
        size={20}
        style={{
          color: index === tabIndex ? color.primaryColor : color.grayColor,
          fontFamily: FontFamily.Regular,
        }}
      />
    );
  } else if (route.key === "workInProgress") {
    let tabIndex = routes.findIndex((data) => data.key === "workInProgress");
    return (
      <MaterialCommunityIcons
        name="file-question"
        size={20}
        style={{
          color: index === tabIndex ? color.primaryColor : color.grayColor,
        }}
      />
    );
  } else if (route.key === "submission") {
    let tabIndex = routes.findIndex((data) => data.key === "submission");
    return (
      <MaterialCommunityIcons
        name="clipboard-check-outline"
        size={20}
        style={{
          color: index === tabIndex ? color.primaryColor : color.grayColor,
        }}
      />
    );
  } else if (route.key === "winner") {
    let tabIndex = routes.findIndex((data) => data.key === "winner");
    return (
      <FontAwesome5
        name="award"
        size={20}
        style={{
          color: index === tabIndex ? color.primaryColor : color.grayColor,
        }}
      />
    );
  }
};

class Recommendation extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      index: 0,
      routes: [],
      menuVisible: false,
      tabloading: true,
      refreshing: false,
      me: {},
      comment: "",
    };

    this.refetch, this.delayLikeTimer, this.ref, this.scrollView;
    this.comment = "";
    this.actionSheetRef = React.createRef();
    this.keyboardHeight = new Animated.Value(0);
  }

  _handlePress = () =>
    this.setState({
      expanded: !this.state.expanded,
    });

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
    if (typeof this.refetch === "function") {
      this.refetch();
    }
  }

  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  componentWillUnmount() {
    this.keyboardWillShowSub.remove();
    this.keyboardWillHideSub.remove();
  }

  keyboardWillShow = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: event.endCoordinates.height,
      easing: Easing.out(Easing.elastic(1)),
    }).start();
  };

  keyboardWillHide = (event) => {
    Animated.timing(this.keyboardHeight, {
      duration: event.duration,
      toValue: 0,
      easing: Easing.in(Easing.elastic(1)),
    }).start();
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case "application":
        return <OfferApplicationTab index={this.state.index} {...this.props} />;
      case "request":
        return <OfferRequestTab index={this.state.index} {...this.props} />;
      case "workInProgress":
        return (
          <OfferWorkInProgressTab index={this.state.index} {...this.props} />
        );
      case "submission":
        return (
          <OfferSubmissionTab
            onRefresh={this._onRefresh}
            index={this.state.index}
            {...this.props}
          />
        );
      case "winner":
        return <OfferWinnerTab index={this.state.index} {...this.props} />;
      default:
        return null;
    }
  };

  _scrollToBottom = () => {
    this.setState({ expanded: true });
    setTimeout(() => {
      //this.ref.scrollToEnd({ animated: true });
    }, 2000);
  };

  setIndex = (index) => {
    this.setState({ index });
  };
  onShare = async (id) => {
    let res = await requestMiddleware(id);
    if (res) {
      try {
        const result = await Share.share({
          message: link.shareUrl + "/share/recommendation/" + id,
        });

        if (result.action === Share.sharedAction) {
          if (result.activityType) {
            // shared with activity type of result.activityType
          } else {
            // shared
          }
        } else if (result.action === Share.dismissedAction) {
          // dismissed
        }
      } catch (error) {}
    }
  };

  _renderOfferComponent = (data) => {
    switch (data.offer.type) {
      case "image":
        return <ImageFile item={data.offer} />;
      case "application":
        return <DownloadFile item={data.offer} />;
      default:
        return null;
    }
  };

  requestAccess = () => {};

  _onRefresh = () => {
    this.refetch();
    this.setState({ refreshing: false });
  };

  openMenu = () => {
    this.setState({ menuVisible: true });
  };

  closeMenu = () => {
    this.setState({ menuVisible: false });
  };

  editOffer = (id) => {
    this.closeMenu();
    this.props.navigation.navigate("NewOffers", { id: id });
  };

  offerUpdateStatus = (id, status) => {
    if (status === 2 || status === 3) {
      Alert.alert(
        "Confirm",
        "Are you sure you want to perform this action",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "Yes", onPress: () => _handleofferUpdateStatus(id, status) },
        ],
        { cancelable: false }
      );
    } else {
      _handleofferUpdateStatus(id, status);
    }
  };

  deleteComment = (id, offer_id, owner_id) => {
    client
      .mutate({
        mutation: deleteOfferCommentMutation,
        variables: {
          id: id,
        },
        optimisticResponse: {
          __typename: "Mutation",
          deleteRecommendationComment: {
            __typename: "deleteRecommendationComment",
            id: id,
          },
        },

        update: (cache, { data: { DeleteRecommendationComment } }) => {
          try {
            const data = cache.readQuery({
              query: getRecommendationComments,
              variables: {
                offer_id: offer_id,
                me: owner_id,
              },
            });

            const index = data.recommendation_comments.data.findIndex(
              (data) => data.id === id
            );
            if (index > -1) {
              data.recommendation_comments.data.splice(index, 1);
            }

            data.recommendation_comments.paginatorInfo.total =
              data.recommendation_comments.paginatorInfo.total - 1;

            cache.writeQuery({
              query: getRecommendationComments,
              variables: {
                offer_id: offer_id,
                me: owner_id,
              },
              data,
            });
          } catch (e) {}

          try {
            const data = cache.readQuery({
              query: getRecommendation,
              variables: {
                id: parseInt(this.props.navigation.getParam("id")),
              },
            });

            const commentData = data.recommendation;
            if (commentData.total_comment > 0) {
              commentData.total_comment -= 1;
            }

            cache.writeQuery({
              query: getRecommendation,
              variables: {
                id: parseInt(this.props.navigation.getParam("id")),
              },
              data,
            });
          } catch (e) {}
        },
      })
      .then((results) => {})
      .catch((error) => {});
  };

  listTags = (tags) => {
    if (tags.length > 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 13,
            position: "relative",
            marginBottom: 7,
          }}
        >
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
            {tags.map((cat, index) => (
              <TouchableWithoutFeedback key={index}>
                <Chip
                  style={{
                    backgroundColor: "#F3F5FB",
                    marginRight: 4,
                    borderRadius: 10,
                  }}
                  textStyle={{
                    color: "#9F9F9F",
                    fontFamily: FontFamily.Regular,
                  }}
                >
                  {cat.name}
                </Chip>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>
      );
    } else {
      return null;
    }
  };

  listCategories = (categories) => {
    if (categories.length > 0) {
      return (
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "center",
            marginTop: 13,
            position: "relative",
            marginBottom: 7,
          }}
        >
          <ScrollView
            ref={(ref) => (this.scrollView = ref)}
            horizontal={true}
            scrollEnabled={true}
            showsHorizontalScrollIndicator={false}
          >
            {categories.map((category, index) => (
              <TouchableWithoutFeedback key={index}>
                <Chip
                  style={{
                    backgroundColor: color.primaryColor,
                    marginRight: 4,
                    borderRadius: 10,
                  }}
                  textStyle={{
                    color: color.whiteColor,
                    fontFamily: FontFamily.Regular,
                  }}
                >
                  {category.name}
                </Chip>
              </TouchableWithoutFeedback>
            ))}
          </ScrollView>
        </View>
      );
    } else {
      return null;
    }
  };

  renderTab = () => {
    const { index, routes, tabloading } = this.state;
    if (tabloading)
      return (
        <ActivityIndicator
          style={{ marginBottom: 10, marginTop: 10 }}
          size="small"
          color={color.primaryColor}
        />
      );

    return (
      <TabView
        style={{ marginBottom: 30 }}
        navigationState={{ index, routes }}
        renderScene={this.renderScene}
        onIndexChange={this.setIndex}
        renderTabBar={(props) => (
          <TabBar
            style={styles.TabBar}
            {...props}
            navigation={this.props.navigation}
            indicatorStyle={{
              backgroundColor: color.primaryColor,
            }}
            renderIcon={(props) => getTabBarIcon(props, index, routes)}
          />
        )}
      />
    );
  };

  getTabRoutes = (id) => {
    client
      .query({
        query: getTabRoutes,
        variables: { id: id },
        fetchPolicy: "cache-first",
      })
      .then((result) => {
        let routes = [];

        result.data.offer.tabRoutes.map((route) => {
          routes.push({ key: route.name });
        });
        if (!result.loading) {
          this.setState({
            routes,
            tabloading: false,
          });

          setTimeout(() => {
            //this.ref.scrollToEnd({ animated: true });
          }, 500);
          this.getTabRoutesNetwork(id);
        }
      })
      .catch((error) => {});
  };

  getTabRoutesNetwork = (id) => {
    client
      .query({
        query: getTabRoutes,
        variables: { id: id },
        fetchPolicy: "network-only",
      })
      .then((result) => {
        let routes = [];

        result.data.offer.tabRoutes.map((route) => {
          routes.push({ key: route.name });
        });
        if (!result.loading) {
          this.setState({
            routes,
            tabloading: false,
          });
        }
      })
      .catch((error) => {});
  };

  refresh = () => {
    this.refetch();
  };

  sendInvitationRequest = async () => {
    let res = await requestMiddleware(this.props.navigation.getParam("id"));
    if (res) {
      _handleOfferInviteRequest(this.props.navigation.getParam("id"));
    }
  };

  offerAddAnswerScreen = async (item) => {
    let res = await requestMiddleware(this.props.navigation.getParam("id"));
    if (res) {
      this.props.navigation.navigate("OfferAddAnswerScreen", {
        id: this.props.navigation.getParam("id"),
        total: item.questions.length,
        refresh: this.refresh,
      });
    }
  };

  renderAnswerButton = (item) => {
    if (item.offerAnswerType === "new") {
      if (item.questions.length > 0) {
        return (
          <TouchableOpacity
            style={styles.answerButton}
            onPress={() => this.offerAddAnswerScreen(item)}
          >
            <Text
              style={{
                color: color.primaryColor,
                fontSize: 16,
                fontFamily: FontFamily.Medium,
              }}
            >
              Write your answer
            </Text>
          </TouchableOpacity>
        );
      }
      return null;
    }
    if (item.offerAnswerType === "revise") {
      if (item.questions.length > 0) {
        return (
          <TouchableOpacity
            style={styles.answerButton}
            onPress={() => this.offerAddAnswerScreen(item)}
          >
            <Text
              style={{
                color: color.primaryColor,
                fontSize: 16,
                fontFamily: FontFamily.Medium,
              }}
            >
              Please revise your answer
            </Text>
          </TouchableOpacity>
        );
      }
      return null;
    }
    if (item.offerAnswerType === "submit") {
      return (
        <TouchableWithoutFeedback style={styles.answerButton}>
          <Text
            style={{
              color: color.primaryColor,
              fontSize: 16,
              fontFamily: FontFamily.Medium,
            }}
          >
            Submitted
          </Text>
        </TouchableWithoutFeedback>
      );
    }
  };

  renderHeader = (data) => {
    return (
      <View>
        <View style={styles.postQuestionProfile}>
          <ProfilePhoto size={42} item={data.recommendation.user} />

          <View
            style={{
              flex: 1,
              flexDirection: "row",
              justifyContent: "space-between",
            }}
          >
            {data.recommendation.is_closed && (
              <Text
                style={{
                  position: "absolute",
                  right: 0,
                  color: "red",
                  fontFamily: FontFamily.Bold,
                }}
              >
                Closed
              </Text>
            )}
            <View style={{ flex: 2, justifyContent: "center" }}>
              <Text style={styles.userName}>
                {data.recommendation.user.firstname}{" "}
                {data.recommendation.user.lastname}
              </Text>

              <Text style={{ color: color.grayColor, fontSize: 14 }}>
                @{data.recommendation.user.username}
              </Text>
            </View>
          </View>
        </View>

        <View>
          <View style={{ paddingBottom: 15 }}>
            <View style={{ paddingBottom: 5 }}>
              {this.listCategories(data.recommendation.categories)}
            </View>
            <Text
              style={{
                color: color.blackColor,
                fontFamily: FontFamily.Medium,
                fontSize: 18,
                marginBottom: 5,
              }}
            >
              {data.recommendation.title}
            </Text>

            <Text style={styles.DescriptionText}>
              {htmlToNative(data.recommendation.description)}
            </Text>
            {this.listTags(data.recommendation.tags)}
          </View>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-between",
              borderTopWidth: 1,
              borderBottomWidth: 1,
              borderColor: "#CCCFD6",
            }}
          >
            <View
              style={{
                flexDirection: "row",
                flex: 1 / 3,
                justifyContent: "space-between",

                alignItems: "center",
              }}
            >
              <View style={{ paddingTop: 13, paddingBottom: 13 }}>
                <TouchableOpacity
                  style={{ paddingRight: 10, flexDirection: "row" }}
                >
                  <Image
                    source={require("../assets/images/messages.png")}
                    style={{
                      width: 20,
                      height: 18,
                      resizeMode: "contain",
                    }}
                  />
                  <Text
                    style={{
                      color: color.grayColor,
                      fontFamily: FontFamily.Regular,
                      fontSize: 13,
                      marginLeft: 5,
                    }}
                  >
                    {data.recommendation.total_comment}
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>
    );
  };

  render() {
    const { index, routes } = this.state;

    return (
      <KeyboardAvoidingView style={{ flex: 1 }} enabled>
        <Query
          query={getRecommendation}
          variables={{ id: parseInt(this.props.navigation.getParam("id")) }}
        >
          {({ loading, error, data, fetchMore, refetch }) => {
            if (loading) return null;

            if (error)
              return (
                <View style={{ alignItems: "center" }}>
                  <Image source={require("../assets/images/wifi.png")} />
                  <View style={{ alignItems: "center" }}>
                    <Text
                      style={{
                        fontSize: 18,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                    >
                      No Internet Connection
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: color.grayColor,
                      }}
                    >
                      Could not connected to the network{" "}
                    </Text>
                    <Text
                      style={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: color.grayColor,
                      }}
                    >
                      Please check and try again.
                    </Text>
                    <Button title="Retry" onPress={() => refetch()} />
                  </View>
                </View>
              );
            let url = link.url + "/" + data.recommendation.user.profile_photo;

            let recommendationData = data;
            return (
              <Query
                query={getRecommendationComments}
                variables={{
                  offer_id: data.recommendation.offer_id,
                  me: data.recommendation.user.id,
                }}
              >
                {({ loading, error, data, fetchMore, refetch }) => {
                  this.refetch = refetch;

                  if (loading) return null;
                  return (
                    <FlatList
                      style={{ margin: 10 }}
                      data={data.recommendation_comments.data}
                      renderItem={({ item }) => {
                        return (
                          <OfferComment
                            item={item}
                            _deleteComment={this.deleteComment}
                            me={this.state.me}
                            recommendationData={recommendationData}
                          />
                        );
                      }}
                      keyExtractor={(item, index) => index.toString()}
                      ListHeaderComponent={() =>
                        this.renderHeader(recommendationData)
                      }
                      initialNumToRender={10}
                      maxToRenderPerBatch={10}
                      onEndReachedThreshold={0.5}
                      showsVerticalScrollIndicator={false}
                      refreshControl={
                        <RefreshControl
                          tintColor={color.primaryColor}
                          refreshing={this.state.refreshing}
                          onRefresh={this._onRefresh}
                        />
                      }
                      onEndReached={() => {
                        fetchMore({
                          variables: {
                            cursor:
                              data.recommendation_comments.paginatorInfo
                                .currentPage + 1,
                          },
                          updateQuery: (
                            previousResult,
                            { fetchMoreResult }
                          ) => {
                            const newQuestions =
                              fetchMoreResult.recommendation_comments.data;
                            const pageInfo =
                              fetchMoreResult.recommendation_comments
                                .paginatorInfo;

                            //return [...previousResult, ...fetchMoreResult];

                            return newQuestions.length
                              ? {
                                  // Put the new comments at the end of the list and update `pageInfo`
                                  // so we have the new `endCursor` and `hasNextPage` values

                                  recommendation_comments: {
                                    __typename:
                                      previousResult.recommendation_comments
                                        .__typename,
                                    data: [
                                      ...previousResult.recommendation_comments
                                        .data,
                                      ...newQuestions,
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
            );
          }}
        </Query>

        <Query
          query={getRecommendation}
          variables={{ id: parseInt(this.props.navigation.getParam("id")) }}
        >
          {({ loading, error, data, fetchMore, refetch }) => {
            if (loading)
              return (
                <View>
                  <ActivityIndicator size="small" color={color.primaryColor} />
                </View>
              );

            refetch();
            let recommendation_data = data;
            return (
              <View>
                {!recommendation_data.recommendation.is_closed && (
                  <Animated.View
                    style={[{ paddingBottom: this.keyboardHeight }]}
                  >
                    <Mutation
                      mutation={createOfferCommentMutation}
                      optimisticResponse={{
                        __typename: "Mutation",
                        createRecommendationComment: {
                          __typename: "RecommendationComment",
                          id: -1,
                          comment_body: this.state.comment,
                          is_verified: false,
                          user: this.state.me,
                          created_at: new Date(),
                        },
                      }}
                      update={(
                        cache,
                        { data: { createRecommendationComment } }
                      ) => {
                        try {
                          const data = cache.readQuery({
                            query: getRecommendationComments,
                            variables: {
                              offer_id:
                                recommendation_data.recommendation.offer_id,
                              me: recommendation_data.recommendation.user.id,
                            },
                          });

                          const commentData = data.recommendation_comments;

                          commentData.data.unshift(createRecommendationComment);

                          cache.writeQuery({
                            query: getRecommendationComments,
                            variables: {
                              offer_id:
                                recommendation_data.recommendation.offer_id,
                              me: recommendation_data.recommendation.user.id,
                            },
                            data,
                          });
                        } catch (e) {}

                        try {
                          const data = cache.readQuery({
                            query: getRecommendation,
                            variables: {
                              id: parseInt(
                                this.props.navigation.getParam("id")
                              ),
                            },
                          });

                          const commentData = data.recommendation;

                          commentData.total_comment += 1;

                          cache.writeQuery({
                            query: getRecommendation,
                            variables: {
                              id: parseInt(
                                this.props.navigation.getParam("id")
                              ),
                            },
                            data,
                          });
                        } catch (e) {}
                      }}
                    >
                      {(
                        createRecommendationComment,
                        { loading, error, data }
                      ) => {
                        if (loading) return null;
                        return (
                          <View style={styles.footAnswerInput}>
                            <TextInput
                              //value={this.state.comment}
                              onChangeText={(text) =>
                                this.setState({ comment: text })
                              }
                            />
                            <TouchableOpacity
                              onPress={() => {
                                if (this.state.comment) {
                                  createRecommendationComment({
                                    variables: {
                                      recommendation_id: parseInt(
                                        this.props.navigation.getParam("id")
                                      ),
                                      comment: this.state.comment,
                                    },
                                  });
                                  this.setState({ comment: "" });
                                }
                              }}
                              style={styles.submitButton}
                            >
                              <Image
                                style={{
                                  width: 28,
                                  height: 28,
                                  resizeMode: "contain",
                                }}
                                source={require("../assets/images/send.png")}
                              />
                            </TouchableOpacity>
                          </View>
                        );
                      }}
                    </Mutation>
                  </Animated.View>
                )}
              </View>
            );
          }}
        </Query>
      </KeyboardAvoidingView>
    );
  }
}

Recommendation.navigationOptions = (screenProps) => ({
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
    <Text style={styles.headerPageTitle}>Discussion Detail recomendation</Text>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  postQuestionProfile: {
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  userProfile: {
    marginRight: 10,
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
  DescriptionTitle: {
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    fontSize: 20,
  },
  DescriptionText: {
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    lineHeight: 22,
  },
  dateRangeText: {
    fontSize: 16,
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    marginBottom: 5,
  },
  accordionParagraph: {
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    color: color.blackColor,
    lineHeight: 20,
  },
  answerButton: {
    backgroundColor: "#F5F6F6",
    alignItems: "center",
    height: 46,
    justifyContent: "center",
    borderRadius: 10,
  },
  scene: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  TabBar: {
    backgroundColor: "#fff",
    elevation: 0,
    borderBottomWidth: 0,
    borderColor: "#CCCFD6",
  },
  footAnswerInput: {
    marginBottom: Platform.OS === "ios" ? 15 : 5,
    marginHorizontal: Platform.OS === "ios" ? 15 : 0,
    paddingTop: 5,
    paddingBottom: 5,
    backgroundColor: "#f5f5f5",
    borderRadius: 20,
    paddingLeft: 10,
    paddingRight: 40,
    borderWidth: 1,
    borderColor: "#CCD0D9",
    height: 38,
    justifyContent: "center",
  },
  submitButton: {
    justifyContent: "center",
    alignItems: "center",
    position: "absolute",
    right: 1,
    top: 0,
    width: 36,
    height: 36,
    borderRadius: 30,
    backgroundColor: color.primaryColor,
  },
  userName: {
    fontSize: 17,
    marginTop: 0,
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
  },
  userDate: {
    fontSize: 12,
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
  },
});

export default Recommendation;
