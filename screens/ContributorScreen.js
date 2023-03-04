import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import OptimizedFlatList from "../components/OptimizedFlatList";
import searchUsers from "../graphql/queries/searchUsers";
import { Query } from "react-apollo";
import ProfilePhoto from "../components/ProfilePhoto";
import * as Network from "expo-network";
import capitalize from "../helper/capitalize";

class ContributorScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      checked: [],
      me: {},
    };
    this.refetch;
  }

  componentDidMount() {
    let user_ids = this.props.navigation.getParam("user_ids");
    this.setState({ checked: user_ids });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
    this.props.navigation.setParams({
      goBack: this.goBack,
    });
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  goBack = () => {
    if (this.props.navigation.getParam("updateMentions")) {
      this.props.navigation.state.params.updateMentions(this.state.checked);
    }

    this.props.navigation.goBack();
  };

  handleChange = (item) => {
    let { checked } = this.state;
    let found = checked.find((data) => data.id === item.id);
    if (!found) {
      if (this.props.navigation.getParam("limit")) {
        if (checked.length > 2) {
          Alert.alert(
            "Limit executives",
            "You can't select more then 3 executives",
            [{ text: "OK" }],
            { cancelable: false }
          );
          return false;
        }
      }

      checked.push(item);
    } else {
      checked = checked.filter((data) => data.id !== item.id);
      //checked.splice(idx, 1);
    }

    this.setState({ checked });
    if (this.props.navigation.getParam("updateUsers")) {
      this.props.navigation.state.params.updateUsers(checked);
    }
  };

  goToProfile = (id) => {
    this.props.navigation.navigate("UserProfile", {
      user_id: id,
    });
  };

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        this.refetch();
      }
    }
  };

  render() {
    let { text, checked } = this.state;
    return (
      <KeyboardAwareScrollView>
        <ScrollView style={styles.contributorsPage}>
          <View style={styles.HotPagesSearchInputContainer}>
            <AntDesign
              style={styles.HotPagesearchIcon}
              name="search1"
            ></AntDesign>
            <TextInput
              style={styles.HotPagesTextInput}
              value={this.state.text}
              placeholder="Search members by name"
              onChangeText={(text) => this.setState({ text })}
            />
          </View>
          {checked.length > 0 && (
            <View
              style={{
                borderRadius: 1,
                borderBottomWidth: 1,
                borderColor: color.primaryColor,
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.Bold,
                  fontSize: 18,
                  margin: 10,
                }}
              >
                Added members
              </Text>
              {checked.map((item, index) => (
                <View key={index} style={styles.ListItems}>
                  <View style={{ flex: 1, flexDirection: "row" }}>
                    <ProfilePhoto size={40} item={item} me={this.state.me} />

                    <View
                      style={{
                        flex: 1,
                        justifyContent: "center",
                        alignItems: "flex-start",
                      }}
                    >
                      <View>
                        <Text style={styles.UserName}>
                          {item.firstname} {item.lastname}
                        </Text>
                        <Text style={{ color: color.grayColor, fontSize: 14 }}>
                          @{item.username}
                        </Text>
                        {item.tagline && (
                          <Text style={styles.UserDescription}>
                            {" "}
                            {item.tagline}
                          </Text>
                        )}
                      </View>
                    </View>
                    <TouchableOpacity
                      style={styles.toggleIcon}
                      onPress={() => this.handleChange(item)}
                    >
                      <Text>
                        {" "}
                        <AntDesign
                          style={styles.plusIcon}
                          name="check"
                        ></AntDesign>
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              ))}
            </View>
          )}
          <Query query={searchUsers} variables={{ q: text + "%" }}>
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

              if (error) return <Text>error</Text>;

              return (
                <OptimizedFlatList
                  data={data.UserSearch.data}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    if (checked.find((data) => data.id === item.id)) {
                      return null;
                    }
                    return (
                      <View style={styles.ListItems}>
                        <View style={{ flex: 1, flexDirection: "row" }}>
                          <ProfilePhoto
                            size={42}
                            item={item}
                            me={this.state.me}
                          />

                          <View
                            style={{
                              flex: 1,
                              justifyContent: "center",
                              alignItems: "flex-start",
                            }}
                          >
                            <View>
                              <Text style={styles.UserName}>
                                {capitalize(item.firstname)}{" "}
                                {capitalize(item.lastname)}
                              </Text>
                              <Text
                                style={{ color: color.grayColor, fontSize: 14 }}
                              >
                                @{item.username}
                              </Text>
                              {item.tagline && (
                                <Text style={styles.UserDescription}>
                                  {" "}
                                  {item.tagline}
                                </Text>
                              )}
                            </View>
                            {/* <View
                              style={{
                                flex: 1,
                                flexDirection: "row",
                                marginTop: 10
                              }}
                            >
                              
                            </View>*/}
                          </View>
                          <TouchableOpacity
                            style={styles.toggleIcon}
                            onPress={() => this.handleChange(item)}
                          >
                            <Text>
                              {" "}
                              {checked.find((data) => data.id === item.id) ? (
                                <AntDesign
                                  style={styles.plusIcon}
                                  name="checkcircleo"
                                ></AntDesign>
                              ) : (
                                <AntDesign
                                  style={styles.checkIcon}
                                  name="pluscircleo"
                                ></AntDesign>
                              )}
                            </Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  initialNumToRender={10}
                  onEndReachedThreshold={0.5}
                  /*
                    ListFooterComponent={this.renderFooter.bind(this)}
                    onEndReached={() => {
                      fetchMore({
                        variables: {
                          cursor: data.tagSearch.paginatorInfo.currentPage + 1
                        },
                        updateQuery: (previousResult, { fetchMoreResult }) => {
                          const newQuestions = fetchMoreResult.tagSearch.data;
                          const pageInfo =
                            fetchMoreResult.tagSearch.paginatorInfo;

                          if (!pageInfo.hasMorePages)
                            this.setState({ isLoading: false });

                          //return [...previousResult, ...fetchMoreResult];

                          return newQuestions.length
                            ? {
                                // Put the new comments at the end of the list and update `pageInfo`
                                // so we have the new `endCursor` and `hasNextPage` values
                                tagSearch: {
                                  __typename:
                                    previousResult.tagSearch.__typename,
                                  data: [
                                    ...previousResult.tagSearch.data,
                                    ...newQuestions
                                  ],
                                  paginatorInfo: pageInfo
                                }
                              }
                            : previousResult;
                        }
                      });
                      
                    }}
                    */
                />
              );
            }}
          </Query>
        </ScrollView>
      </KeyboardAwareScrollView>
    );
  }
}

ContributorScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Add Member</Text>,
  headerRight: () => (
    <TouchableOpacity
      onPress={screenProps.navigation.getParam("goBack")}
      style={styles.touchRightHeadText}
    >
      <Text style={styles.headerRightText}>Next</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    borderRadius: 3,
    borderColor: color.primaryColor,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  contributorsPage: {
    flex: 1,
    backgroundColor: "#fff",
  },
  HotPagesSearchInputContainer: {
    position: "relative",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 15,
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  HotPagesearchIcon: {
    position: "absolute",
    left: 25,
    top: 10,
    fontSize: 20,
    zIndex: 1,
    color: "#8C8C8C",
  },
  HotPagesTextInput: {
    width: "100%",
    height: 40,
    backgroundColor: "#F8F8F8",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 40,
    fontSize: 16,
    paddingTop: 1,
    paddingBottom: 1,
    fontFamily: FontFamily.Regular,
  },
  ListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
  },
  UserProfileImage: {
    marginRight: 12,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  UserName: {
    fontSize: 16,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.5,
  },
  UserDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    fontSize: 16,
  },
  totalAnswers: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 13,
    letterSpacing: 0.8,
  },
  toggleIcon: {
    width: 40,
    flexDirection: "column",
    flex: 1 / 8,
    justifyContent: "center",
    alignItems: "center",
  },
  plusIcon: {
    color: color.primaryColor,
    fontSize: 22,
    marginTop: 33,
  },
  checkIcon: {
    color: color.grayColor,
    fontSize: 22,
  },
});

export default ContributorScreen;
