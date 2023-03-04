import React from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ScrollView,
  Share,
  Dimensions,
  RefreshControl,
  Alert,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { Query } from "react-apollo";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";

import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import { Avatar, List, Chip, Menu, Provider } from "react-native-paper";
import getOffer from "../../graphql/queries/getOffer";
import getTabRoutes from "../../graphql/queries/getTabRoutes";
import getOfferStatus from "../../graphql/queries/getOfferStatus";
import firstChar from "../../helper/firstChar";
import link from "../../constants/link";
import OfferLikeUnlike from "../../components/OfferLikeUnlike";
import OfferBookmark from "../../components/OfferBookmark";
import VideoPlayer from "../../components/VideoPlayer";
import DownloadFile from "../../components/DownloadFile";
import ImageFile from "../../components/ImageFile";
import OfferLock from "../../components/OfferLock";
import OfferApplicationTab from "../../screens/Offer/OfferApplicationTab";
import OfferRequestTab from "../../screens/Offer/OfferRequestTab";
import OfferWorkInProgressTab from "../../screens/Offer/OfferWorkInProgressTab";
import OfferSubmissionTab from "../../screens/Offer/OfferSubmissionTab";
import OfferWinnerTab from "../../screens/Offer/OfferWinnerTab";
import {
  _handleOfferInviteRequest,
  _handleofferUpdateStatus,
  requestMiddleware,
} from "../../components/CombineFunction";
import client from "../../constants/client";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { FontAwesome5 } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
const halfScreenHeight = Dimensions.get("window").width / 2;
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

class OfferScreen extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false,
      index: 0,
      routes: [],
      menuVisible: false,
      tabloading: true,
      refreshing: false,
    };

    this.refetch, this.delayLikeTimer, this.ref, this.scrollView;
  }

  _handlePress = () =>
    this.setState({
      expanded: !this.state.expanded,
    });

  componentDidMount() {
    this.refetch();
    this.getTabRoutes(this.props.navigation.getParam("id"));
  }

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
        return <OfferSubmissionTab index={this.state.index} {...this.props} />;
      case "winner":
        return <OfferWinnerTab index={this.state.index} {...this.props} />;
      default:
        return null;
    }
  };

  _scrollToBottom = () => {
    this.setState({ expanded: true });
    setTimeout(() => {
      this.ref.scrollToEnd({ animated: true });
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
          message: link.url + "/offer/" + id,
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
    this.getTabRoutes(this.props.navigation.getParam("id"));
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
            //onContentSizeChange={this.onContentSizeChange}
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
                  {cat.tag_title}
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
            this.ref.scrollToEnd({ animated: true });
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

  render() {
    const { index, routes } = this.state;

    return (
      <Provider>
        <ScrollView
          ref={(r) => (this.ref = r)}
          style={{ flex: 1, backgroundColor: "#fff" }}
          refreshControl={
            <RefreshControl
              tintColor={color.primaryColor}
              refreshing={this.state.refreshing}
              onRefresh={this._onRefresh}
            />
          }
        >
          <Query
            query={getOffer}
            variables={{ id: parseInt(this.props.navigation.getParam("id")) }}
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
                  <View style={{ alignItems: "center" }}>
                    <Image source={require("../../assets/images/wifi.png")} />
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
              let url = link.url + "/" + data.offer.company.logo;
              if (
                data.offer.isAuthor === false &&
                data.offer.visibility === "0"
              ) {
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                      marginTop: halfScreenHeight - 50,
                    }}
                  >
                    <Text style={{ fontSize: 80, color: "#D6D6D6" }}>404</Text>
                    <Text style={{ fontSize: 20, color: "#D6D6D6" }}>
                      Offer not found :(
                    </Text>
                    <Text
                      style={{ fontSize: 12, color: "#D6D6D6", marginTop: 10 }}
                    >
                      Offer not found or unpublished by author
                    </Text>
                  </View>
                );
              }
              return (
                <View style={{ flex: 1 }}>
                  <View style={{ flex: 1, paddingLeft: 15, paddingRight: 15 }}>
                    <View style={styles.postQuestionProfile}>
                      {data.offer.company.logo ? (
                        <Avatar.Image
                          style={styles.userProfile}
                          size={50}
                          source={{ uri: url }}
                        />
                      ) : (
                        <Avatar.Text
                          style={styles.userProfile}
                          size={50}
                          label={firstChar(data.offer.company.title)}
                        />
                      )}

                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          justifyContent: "space-between",
                        }}
                      >
                        <View style={{ flex: 2, justifyContent: "center" }}>
                          <Text style={styles.userName}>
                            {data.offer.company.title}
                          </Text>
                          <Text
                            style={{ color: color.grayColor, fontSize: 14 }}
                          >
                            @{data.offer.user.username}
                          </Text>
                        </View>

                        {data.offer.isAuthor ? (
                          <Menu
                            //contentStyle={{marginTop:-50}}
                            visible={this.state.menuVisible}
                            onDismiss={this.closeMenu}
                            anchor={
                              <TouchableOpacity
                                onPress={this.openMenu}
                                style={{
                                  alignItems: "flex-end",
                                  justifyContent: "center",
                                  paddingLeft: 10,
                                  paddingTop: 10,
                                  paddingBottom: 10,
                                }}
                              >
                                <Image
                                  style={{
                                    width: 20,
                                    height: 15,
                                    resizeMode: "contain",
                                  }}
                                  source={require("../../assets/images/options.png")}
                                />
                              </TouchableOpacity>
                            }
                          >
                            {data.offer.visibility === "1" ? (
                              <View>
                                <Menu.Item
                                  onPress={() => {
                                    this.offerUpdateStatus(data.offer.id, 0);
                                  }}
                                  title="Unpublish"
                                />
                                <Menu.Item
                                  onPress={() => {
                                    this.offerUpdateStatus(data.offer.id, 2);
                                  }}
                                  title="Complete"
                                />
                                <Menu.Item
                                  onPress={() => {
                                    this.offerUpdateStatus(data.offer.id, 3);
                                  }}
                                  title="Cancel"
                                />
                              </View>
                            ) : null}
                            {data.offer.visibility === "0" ? (
                              <View>
                                <Menu.Item
                                  onPress={() => {
                                    this.editOffer(data.offer.id);
                                  }}
                                  title="Edit"
                                />
                                <Menu.Item
                                  onPress={() => {
                                    this.offerUpdateStatus(data.offer.id, 1);
                                  }}
                                  title="Publish"
                                />
                              </View>
                            ) : null}

                            {data.offer.visibility === "3" ? (
                              <View>
                                <Menu.Item
                                  titleStyle={{ color: "red" }}
                                  title="Cancelled"
                                />
                              </View>
                            ) : null}

                            {data.offer.visibility === "2" ? (
                              <View>
                                <Menu.Item
                                  titleStyle={{ color: "green" }}
                                  title="Completed"
                                />
                              </View>
                            ) : null}
                          </Menu>
                        ) : null}
                      </View>
                    </View>

                    {data.offer.isAccess ? (
                      data.offer.type === "video" ? (
                        <VideoPlayer
                          _scrollToBottom={this._scrollToBottom}
                          offer_id={data.offer.id}
                          uri={data.offer.attachment.url}
                          isWatched={data.offer.isWatched}
                        />
                      ) : null
                    ) : (
                      <View style={{ marginLeft: -15, marginRight: -15 }}>
                        <OfferLock />
                      </View>
                    )}
                    {data.offer.isAccess
                      ? this._renderOfferComponent(data)
                      : null}

                    <View>
                      <View style={{ paddingBottom: 15 }}>
                        <View style={{ paddingBottom: 5 }}>
                          {this.listTags(data.offer.tags)}
                        </View>
                        <Text
                          style={{
                            color: color.blackColor,
                            fontFamily: FontFamily.Medium,
                            fontSize: 18,
                            marginBottom: 5,
                          }}
                        >
                          {data.offer.title}
                        </Text>
                        <Text style={styles.DescriptionText}>
                          {data.offer.description}
                        </Text>
                      </View>
                      <View
                        style={{
                          flexDirection: "row",
                          justifyContent: "space-between",
                          borderTopWidth: 1,
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
                          <View>
                            <OfferLikeUnlike item={data.offer} />
                          </View>
                          <View>
                            <TouchableOpacity
                              onPress={() => this.onShare(data.offer.id)}
                              style={{ padding: 10, flexDirection: "row" }}
                            >
                              <Image
                                source={require("../../assets/images/Share.png")}
                                style={{
                                  width: 20,
                                  height: 18,
                                  resizeMode: "contain",
                                }}
                              />
                            </TouchableOpacity>
                          </View>
                        </View>
                        <View style={{ alignItems: "flex-end", flex: 1 }}>
                          <OfferBookmark item={data.offer} />
                        </View>
                      </View>

                      <View style={{}}>
                        {data.offer.isAuthor ? null : data.offer
                            .isRequestSent ? null : data.offer.isPublic ? (
                          <TouchableOpacity
                            onPress={this.sendInvitationRequest}
                            style={{
                              backgroundColor: color.primaryColor,
                              marginTop: 10,
                              height: 45,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: "#fff",
                                fontFamily: FontFamily.Medium,
                                fontSize: 15,
                              }}
                            >
                              Apply
                            </Text>
                          </TouchableOpacity>
                        ) : null}
                        {data.offer.isAuthor ? null : data.offer
                            .isRequestSent && data.offer.isAccess === false ? (
                          <TouchableWithoutFeedback
                            style={{
                              backgroundColor: color.lightGrayColor,
                              marginTop: 10,
                              height: 45,
                              alignItems: "center",
                              justifyContent: "center",
                              borderRadius: 10,
                            }}
                          >
                            <Text
                              style={{
                                color: color.primaryColor,
                                fontFamily: FontFamily.Medium,
                                fontSize: 15,
                              }}
                            >
                              Applied
                            </Text>
                          </TouchableWithoutFeedback>
                        ) : data.offer.isPublic ? null : null}
                      </View>
                    </View>
                  </View>

                  {data.offer.isAccess ? (
                    data.offer.type === "video" &&
                    data.offer.isWatched === false &&
                    data.offer.isAuthor === false ? null : (
                      <List.Section style={{ marginTop: 0, marginBottom: 0 }}>
                        <List.Accordion
                          expanded={this.state.expanded}
                          onPress={this._handlePress}
                          style={{
                            padding: 5,
                            borderTopWidth: 1,
                            borderBottomWidth: 1,
                            borderColor: "#E5E5E5",
                          }}
                          titleStyle={{
                            fontSize: 20,
                            fontFamily: FontFamily.Bold,
                            color: color.blackColor,
                          }}
                          title="Questions"
                        >
                          <View
                            style={{
                              borderBottomWidth: 1,
                              borderColor: "#CCCFD6",
                            }}
                          >
                            {data.offer.questions.map((item, index) => {
                              return (
                                <View
                                  key={index}
                                  style={{
                                    paddingLeft: 15,
                                    paddingRight: 15,
                                    paddingBottom: 13,
                                    paddingTop: 13,
                                    borderBottomWidth: 1,
                                    borderColor: "#CCCFD6",
                                  }}
                                >
                                  <Text style={styles.dateRangeText}>
                                    Question {index + 1}
                                  </Text>
                                  <Text style={styles.accordionParagraph}>
                                    {item.question}
                                  </Text>
                                </View>
                              );
                            })}
                            {data.offer.isAuthor
                              ? null
                              : this.renderAnswerButton(data.offer)}
                          </View>
                        </List.Accordion>
                      </List.Section>
                    )
                  ) : null}

                  {data.offer.isAuthor ? this.renderTab() : null}
                </View>
              );
            }}
          </Query>
        </ScrollView>
      </Provider>
    );
  }
}

OfferScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Offer</Text>,
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
});

export default OfferScreen;
