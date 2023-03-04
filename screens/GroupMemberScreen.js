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
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Checkbox, Avatar, Divider } from "react-native-paper";
import OptimizedFlatList from "../components/OptimizedFlatList";
import searchUsers from "../graphql/queries/searchUsers";
import { Query } from "react-apollo";
import ProfilePhoto from "../components/ProfilePhoto";
import capitalize from "../helper/capitalize";
import { Feather } from "@expo/vector-icons";
import firstChar from "../helper/firstChar";
import link from "../constants/link";
import client from "../constants/client";
import addGroupMembersMutation from "../graphql/mutations/addGroupMembersMutation";
import getGroups from "../graphql/queries/getGroups";
import Colors from "../constants/Colors";
import ListItem from "../components/Skeleton/ListItem";
import NoWifi from "../components/NoWifi";

class GroupMemberScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      me: {},
      checked: false,
      selectedMembers: [],
      loading: false,
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

  selectMember = (member) => {
    const { selectedMembers } = this.state;

    var n = selectedMembers.includes(member);
    if (n === true) {
      var array = [...selectedMembers]; // make a separate copy of the array
      var index = array.indexOf(member);
      if (index !== -1) {
        array.splice(index, 1);
        this.setState({ selectedMembers: array });
      }
    } else {
      if (selectedMembers.length >= 10) {
        alert("you cannot add more than 10 members.");
      } else {
        var joined = this.state.selectedMembers.concat(member);
        this.setState({ selectedMembers: joined }, () => {});
      }
    }
  };

  addMembers = () => {
    this.props.navigation.navigate("CreateGroup", {
      members: this.state.selectedMembers,
    });
    this.setState({
      selectedMembers: [],
    });
  };

  submitMembers = () => {
    const group_id = this.props.navigation.getParam("group_id");
    this.setState({
      loading: true,
    });
    const ids = [];

    this.state.selectedMembers.map((m) => {
      ids.push(m.id);
    });

    client
      .mutate({
        mutation: addGroupMembersMutation,
        variables: {
          user_id: ids,
          group_id: group_id,
          member_type: "member",
        },
        optimisticResponse: {
          __typename: "Mutation",
          add_groupMembers: this.state.selectedMembers,
        },
        update: (cache, { data: { add_groupMembers } }) => {
          const data = cache.readQuery({
            query: getGroups,
          });

          Array.prototype.push.apply(
            data.general_groups.data,
            add_groupMembers
          );

          cache.writeQuery({ query: getGroups, data });
        },
      })
      .then((res) => {
        this.setState({ loading: false });
        Alert.alert("Added Successfully!");

        this.props.navigation.navigate("Message");
      })
      .catch((err) => {});
  };

  renderSelectedMembers = () => {
    const { selectedMembers } = this.state;

    if (selectedMembers.length > 0) {
      return (
        <ScrollView
          horizontal
          style={{ marginTop: 13 }}
          showsHorizontalScrollIndicator={false}
        >
          {selectedMembers.map((s, index) => (
            <View style={{ alignItems: "center", marginRight: 10 }} key={index}>
              <View>
                {s.profile_photo !== null ? (
                  <Avatar.Image
                    style={styles.avatar}
                    size={48}
                    source={{
                      uri:
                        link.url +
                        "/uploads/profile_images/" +
                        s.profile_photo +
                        "?" +
                        s
                          ? s.timestamp
                          : Date.parse(new Date()),
                    }}
                  />
                ) : (
                  <Avatar.Text
                    style={[
                      styles.userProfile,
                      this.props.style,
                      { backgroundColor: color.primaryColor },
                    ]}
                    size={45}
                    label={firstChar(s.firstname) + firstChar(s.lastname)}
                  />
                )}

                <TouchableOpacity
                  style={{
                    borderWidth: 2,
                    borderColor: color.whiteColor,
                    position: "absolute",
                    right: -5,
                    bottom: 0,
                    zIndex: 11,
                    backgroundColor: color.grayColor,
                    borderRadius: 40,
                    width: 20,
                    height: 20,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  onPress={() => this.selectMember(s)}
                >
                  <AntDesign name="close" size={12} color="black" />
                </TouchableOpacity>
              </View>
              <Text
                style={{
                  fontFamily: FontFamily.Regular,
                  color: color.blackColor,
                  fontSize: 12,
                  marginTop: 4,
                }}
              >
                {s.firstname}
              </Text>
            </View>
          ))}
        </ScrollView>
      );
    } else {
      return null;
    }
  };

  render() {
    let { text, checked, selectedMembers } = this.state;

    const flag = this.props.navigation.getParam("flag");

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
            {this.renderSelectedMembers()}
          </View>

          <Query
            query={searchUsers}
            variables={{ q: text + "%", groupSearch: true }}
          >
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

              if (data.UserSearch.data.length < 1) {
                return (
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      alignItems: "center",
                    }}
                  >
                    <View
                      style={{
                        alignItems: "center",
                      }}
                    >
                      <Text
                        style={{
                          color: Colors.grayColor,
                          fontFamily: FontFamily.Medium,
                          fontSize: 16,
                          marginBottom: 8,
                        }}
                      >
                        No User Found!
                      </Text>
                    </View>
                  </View>
                );
              }

              if (data) {
                return (
                  <OptimizedFlatList
                    data={data.UserSearch.data}
                    extraData={this.state}
                    renderItem={({ item, index }) => {
                      var n = selectedMembers.includes(item);
                      return (
                        <TouchableOpacity
                          style={styles.ListItems}
                          onPress={() => this.selectMember(item)}
                        >
                          <View style={{ flex: 1, flexDirection: "row" }}>
                            <ProfilePhoto
                              size={40}
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

                            {n === true ? (
                              <Checkbox.Android
                                status={(checked = "checked")}
                                color={color.primaryColor}
                                style={styles.TopicPageCheckboxes}
                                onPress={() => this.selectMember(item)}
                              />
                            ) : (
                              <Checkbox.Android
                                status={(checked = "unchecked")}
                                color={color.primaryColor}
                                style={styles.TopicPageCheckboxes}
                                onPress={() => this.selectMember(item)}
                              />
                            )}
                          </View>
                        </TouchableOpacity>
                      );
                    }}
                    keyExtractor={(item, index) => index.toString()}
                    initialNumToRender={10}
                    onEndReachedThreshold={0.5}
                  />
                );
              }
            }}
          </Query>
        </ScrollView>
        {selectedMembers.length > 0 ? (
          <TouchableOpacity
            onPress={
              flag !== "undefined" && flag === "add"
                ? this.submitMembers
                : this.addMembers
            }
            style={styles.floatingActionbtn}
          >
            {this.state.loading ? (
              <ActivityIndicator size="small" color={color.whiteColor} />
            ) : (
              <Feather name="check" size={24} color={color.whiteColor} />
            )}
          </TouchableOpacity>
        ) : null}
      </View>
    );
  }
}

GroupMemberScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Add Members</Text>,
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
  TopicPageCheckboxes: {
    marginRight: 20,
  },
  floatingActionbtn: {
    backgroundColor: color.primaryColor,
    width: 50,
    height: 50,
    position: "absolute",
    zIndex: 1,
    borderRadius: 40,
    alignItems: "center",
    justifyContent: "center",
    right: 20,
    bottom: 20,
  },
});

export default GroupMemberScreen;
