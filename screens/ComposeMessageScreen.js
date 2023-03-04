import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import OptimizedFlatList from "../components/OptimizedFlatList";
import searchUsers from "../graphql/queries/searchUsers";
import { Query } from "react-apollo";
import ProfilePhoto from "../components/ProfilePhoto";
import capitalize from "../helper/capitalize";
import ListItem from "../components/Skeleton/ListItem";
import { Divider } from "react-native-paper";
import NoWifi from "../components/NoWifi";

class ComposeMessageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      me: {},
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
  }

  goToChat = (user) => {
    this.props.navigation.navigate("Chat", { data: user });
  };

  render() {
    let { text, checked } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
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
          <Query query={searchUsers} variables={{ q: text + "%" }}>
            {({ loading, error, data, fetchMore }) => {
              if (loading)
                return (
                  <>
                    <ListItem />
                    <Divider />
                    <ListItem />
                    <Divider />
                    <ListItem />
                    <Divider />
                    <ListItem />
                    <Divider />
                    <ListItem />
                    <Divider />
                    <ListItem />
                    <Divider />
                    <ListItem />
                    <Divider />
                  </>
                );

              if (error) return <NoWifi />;

              return (
                <OptimizedFlatList
                  data={data.UserSearch.data}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    return (
                      <TouchableOpacity
                        style={styles.ListItems}
                        onPress={() => this.goToChat(item)}
                      >
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

                              <Text style={styles.UserDescription}>
                                @{item.username}
                              </Text>
                            </View>
                          </View>
                        </View>
                      </TouchableOpacity>
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
      </View>
    );
  }
}

ComposeMessageScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Members</Text>,
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
    marginRight: 15,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 15,
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
    paddingBottom: 8,
    paddingTop: 8,
  },
  UserProfileImage: {
    marginRight: 12,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  UserName: {
    fontSize: 14,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.5,
  },
  UserDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 12,
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
    color: color.grayColor,
    fontSize: 22,
    marginTop: 33,
  },
  checkIcon: {
    color: color.grayColor,
    fontSize: 22,
  },
});

export default ComposeMessageScreen;
