import React, { Component } from "react";
import {
  Text,
  StyleSheet,
  View,
  ImageBackground,
  ScrollView,
  Platform,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  AntDesign,
  Ionicons,
  Feather,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import firstChar from "../helper/firstChar";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Avatar } from "react-native-paper";
import capitalize from "../helper/capitalize";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import client from "../constants/client";
import readGroupMutation from "../graphql/mutations/readGroupMutation";
import deleteGroupMemberMutation from "../graphql/mutations/deleteGroupMemberMutation";
import link from "../constants/link";
import addGroupMembersMutation from "../graphql/mutations/addGroupMembersMutation";
import getGroups from "../graphql/queries/getGroups";
import deleteGroupMutation from "../graphql/mutations/deleteGroupMutation";

class GroupDetailScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: null,
      admin: [],
      me: {},
      member: {},
      memberType: "",
      isLoggedInUserAdmin: false,
      exitLoading: false,
    };
    this.actionSheetRef = React.createRef();
  }

  componentDidMount() {
    let user = {};
    AsyncStorage.getItem("me").then((result) => {
      user = JSON.parse(result);
      this.getLoggedInUserType(user.id);
      this.setState({ me: user });
    });
  }

  getGroupData = () => {
    client
      .mutate({
        mutation: readGroupMutation,
        variables: {
          id: notify.id,
        },
      })
      .then((results) => {})
      .catch((error) => {});
  };

  getLoggedInUserType = (userId) => {
    const data = this.props.navigation.getParam("data");
    const temp = [];

    data.members.map((m) => {
      if (m.member_type === "admin") {
        m.user_id == userId && this.setState({ isLoggedInUserAdmin: true });
        temp.push(m.user.id);
      }
    });

    this.setState({
      admin: temp,
    });
  };

  onPartisapentActions = (id, member) => {
    if (id !== this.state.me.id) {
      this.setState({
        userId: id,
        member: member,
        memberType: member.member_type,
      });
      this.actionSheetRef.current?.open();
    }
  };

  cancelPartisapentActions = () => {
    this.actionSheetRef.current?.close();
  };

  deleteGroup = () => {
    const data = this.props.navigation.getParam("data");

    Alert.alert(
      "Alert!",
      "Do you want to " + this.state.isLoggedInUserAdmin &&
        this.state.admin.length === 1
        ? "Detele Group"
        : "Exit group" + "?",
      [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        {
          text: "OK",
          onPress: () => {
            this.setState({
              exitLoading: true,
            });
            client
              .mutate({
                mutation: deleteGroupMutation,
                variables: {
                  id: data.id,
                },
              })
              .then((res) => {
                this.setState({
                  exitLoading: false,
                });
                this.props.navigation.navigate("Message");

                Alert.alert("Successful!");
              })
              .catch((err) => {});
          },
        },
      ]
    );
  };

  removeParticipant = (type) => {
    const data = this.props.navigation.getParam("data");

    const { userId } = this.state;
    let Id = null;
    let alertMsg = null;
    if (type === "leave") {
      Id = this.state.me.id;

      if (this.state.admin.length === 1 && this.state.admin.includes(Id)) {
        alertMsg = "Do you really want to delete this group";
      } else {
        alertMsg = "Do you really want to leave this group";
      }
    } else if (type === "remove") {
      alertMsg = "Do you want to remove this user";
      Id = userId;
    }

    Alert.alert("Alert!", alertMsg + "?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          this.cancelPartisapentActions();
          if (Id !== null) {
            client
              .mutate({
                mutation: deleteGroupMemberMutation,
                variables: {
                  user_id: Id,
                  group_id: data.id,
                },
              })
              .then((res) => {
                type === "remove" && Alert.alert("User removed from group.");
                this.cancelPartisapentActions();
                this.props.navigation.navigate("Message");
              })
              .catch((err) => {
                console.log(
                  "🚀 ~ file: GroupDetailScreen.js:152 ~ GroupDetailScreen ~ err",
                  err
                );
              });
          }
        },
      },
    ]);
  };

  addGroupAdmin = () => {
    const data = this.props.navigation.getParam("data");
    const { member, memberType } = this.state;
    let type = "";
    if (memberType === "admin") {
      type = "member";
    } else if (memberType === "member") {
      type = "admin";
    }
    const ids = [];
    if (member) {
      ids.push(member.user.id);
    }

    client
      .mutate({
        mutation: addGroupMembersMutation,
        variables: {
          user_id: ids,
          group_id: data.id,
          member_type: type,
        },
        optimisticResponse: {
          __typename: "Mutation",
          add_groupMembers: member,
        },
        update: (cache, { data: { add_groupMembers } }) => {
          const data = cache.readQuery({
            query: getGroups,
          });

          Array.prototype.push.apply(
            data.general_groups.data,
            add_groupMembers
          );

          this.cancelPartisapentActions();
          cache.writeQuery({ query: getGroups, data });
        },
      })
      .then((res) => {
        this.setState({ loading: false });
        Alert.alert(
          memberType === "admin"
            ? "Group admin has been removed Successfully."
            : "Group admin has been added Successfully."
        );
        this.props.navigation.navigate("Message");
      })
      .catch((err) => {});
  };

  render() {
    const { me, admin } = this.state;
    const data = this.props.navigation.getParam("data");

    let avatar = require("../assets/images/group.png");
    let imageUrl = "";

    if (data.image_path) {
      imageUrl =
        link.url +
        "/uploads/group_images/" +
        data.id +
        "/" +
        data.image_path +
        "?id=" +
        Math.random();
    }

    return (
      <View style={styles.container}>
        <ScrollView style={{ flex: 1 }}>
          <ImageBackground
            source={imageUrl ? { uri: imageUrl } : avatar}
            resizeMode="cover"
            style={styles.banner}
          >
            <View style={styles.overlay}>
              <View style={{ marginHorizontal: -13 }}>
                {Platform.OS === "android" ? (
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <AntDesign
                      name="arrowleft"
                      size={24}
                      color={color.whiteColor}
                    />
                  </TouchableOpacity>
                ) : (
                  <TouchableOpacity
                    onPress={() => this.props.navigation.goBack()}
                  >
                    <Feather
                      name="chevron-left"
                      size={32}
                      color={color.whiteColor}
                    />
                  </TouchableOpacity>
                )}
              </View>
              <View style={styles.list}>
                <Text style={styles.groupTitle}>{capitalize(data.name)}</Text>
                {admin.length > 0 && admin.includes(me.id) ? (
                  <TouchableOpacity
                    onPress={() =>
                      this.props.navigation.navigate("GroupEdit", {
                        data: data,
                        avatar: avatar,
                      })
                    }
                  >
                    <Feather name="edit" size={20} color={color.whiteColor} />
                  </TouchableOpacity>
                ) : null}
              </View>
            </View>
          </ImageBackground>
          <View style={{ padding: 10 }}>
            <View
              style={[
                styles.boxShadow,
                {
                  backgroundColor: color.whiteColor,
                  borderRadius: 8,
                },
              ]}
            >
              <TouchableOpacity style={{ padding: 13 }}>
                <Text style={styles.textBold}>Description: </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              <TouchableOpacity style={{ padding: 13 }}>
                <Text style={styles.text}>{data.description}</Text>
              </TouchableOpacity>
            </View>
            <View
              style={[
                styles.boxShadow,
                {
                  backgroundColor: color.whiteColor,
                  borderRadius: 8,
                  marginTop: 13,
                  padding: 13,
                },
              ]}
            >
              {/* <View style={{ marginBottom: 13 }}>
                <Text style={styles.primaryText}>18 participants</Text>
              </View> */}

              {admin.length > 0 ? (
                <>
                  {admin.includes(me.id) ? (
                    <TouchableOpacity
                      style={[styles.listInline, { marginBottom: 10 }]}
                      onPress={() =>
                        this.props.navigation.navigate("GroupMember", {
                          flag: "add",
                          group_id: data.id,
                        })
                      }
                    >
                      <View
                        style={{
                          backgroundColor: color.primaryColor,
                          width: 42,
                          height: 42,
                          borderRadius: 40,
                          justifyContent: "center",
                          alignItems: "center",
                          marginRight: 10,
                        }}
                      >
                        <Ionicons
                          name="md-person-add"
                          size={18}
                          color={color.whiteColor}
                        />
                      </View>
                      <Text style={styles.primaryText}>Add participants</Text>
                    </TouchableOpacity>
                  ) : null}
                </>
              ) : null}
              <View style={styles.divider} />

              {data.members.map((m) => (
                <>
                  <TouchableOpacity
                    onLongPress={
                      admin.length > 0 && admin.includes(me.id)
                        ? () => this.onPartisapentActions(m.user.id, m)
                        : () => console.log("nothing")
                    }
                    style={[styles.list, { paddingVertical: 10 }]}
                  >
                    <View
                      style={[
                        styles.listInline,
                        {
                          justifyContent: "space-between",
                          flex: 1,
                        },
                      ]}
                    >
                      <View style={styles.listInline}>
                        {m?.user?.profile_photo ? (
                          <Avatar.Image
                            style={styles.avatar}
                            size={42}
                            source={{
                              uri:
                                link.url +
                                "/uploads/profile_images/" +
                                m?.user?.profile_photo,
                            }}
                          />
                        ) : (
                          <Avatar.Text
                            style={styles.avatar}
                            labelStyle={styles.avatarLabel}
                            size={42}
                            label={
                              firstChar(m?.user?.firstname) +
                              firstChar(m?.user?.lastname)
                            }
                          />
                        )}

                        <Text style={styles.textBold}>
                          {capitalize(m?.user?.firstname)}{" "}
                          {capitalize(m?.user?.lastname)}
                        </Text>
                      </View>
                      {m?.member_type === "admin" ? (
                        <Text
                          style={[
                            styles.text,
                            {
                              fontSize: 10,
                              borderWidth: 1,
                              paddingVertical: 1,
                              paddingHorizontal: 2,
                              borderRadius: 3,
                              borderColor: color.grayColor,
                              color: color.grayColor,
                            },
                          ]}
                        >
                          Group Admin
                        </Text>
                      ) : null}
                    </View>
                  </TouchableOpacity>
                  <View style={styles.divider} />
                </>
              ))}
            </View>

            <View
              style={[
                styles.boxShadow,
                {
                  backgroundColor: color.whiteColor,
                  borderRadius: 8,
                  marginTop: 10,
                  position: "relative",
                  overflow: "hidden",
                },
              ]}
            >
              {this.state.exitLoading ? (
                <View
                  style={{
                    position: "absolute",
                    zIndex: 11,
                    backgroundColor: "rgba(0,0,0,.2)",
                    width: "100%",
                    height: "100%",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <ActivityIndicator size="small" color={color.blackColor} />
                </View>
              ) : null}
              <TouchableOpacity
                style={{
                  padding: 13,
                  flexDirection: "row",
                  alignItems: "center",
                }}
                onPress={() => this.removeParticipant("leave")}
              >
                <MaterialCommunityIcons
                  name="location-exit"
                  size={24}
                  color="red"
                />

                <Text style={[styles.text, { marginLeft: 10, color: "red" }]}>
                  {this.state.isLoggedInUserAdmin &&
                  this.state.admin.length === 1
                    ? "Detele Group"
                    : "Exit group"}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </ScrollView>
        <Portal>
          <Modalize
            ref={this.actionSheetRef}
            adjustToContentHeight={true}
            childrenStyle={{ padding: 10 }}
          >
            <View style={styles.modalBody}>
              <TouchableOpacity>
                <Text
                  style={[
                    styles.actionListText,
                    { paddingBottom: 10, paddingTop: 5, fontSize: 13 },
                  ]}
                >
                  Quick Actions
                </Text>
              </TouchableOpacity>
              <View style={styles.divider} />
              {admin.length > 0 && admin.includes(me.id) ? (
                <>
                  <TouchableOpacity onPress={this.addGroupAdmin}>
                    {this.state.memberType === "admin" ? (
                      <Text style={styles.actionListText}>
                        Remove group admin
                      </Text>
                    ) : (
                      <Text style={styles.actionListText}>
                        Make group admin
                      </Text>
                    )}
                  </TouchableOpacity>

                  <View style={styles.divider} />
                  <TouchableOpacity
                    onPress={() => this.removeParticipant("remove")}
                  >
                    <Text style={styles.actionListText}>Remove</Text>
                  </TouchableOpacity>
                </>
              ) : null}

              <View style={styles.divider} />
              <TouchableOpacity onPress={this.cancelPartisapentActions}>
                <Text
                  style={[
                    styles.actionListText,
                    { color: "red", fontSize: 18 },
                  ]}
                >
                  Cancel
                </Text>
              </TouchableOpacity>
            </View>
          </Modalize>
        </Portal>
      </View>
    );
  }
}

GroupDetailScreen.navigationOptions = (screenProps) => ({
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
  header: null,
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: color.lightGrayColor,
  },
  banner: {
    width: "100%",
    height: 250,
  },
  overlay: {
    backgroundColor: "rgba(0, 0, 0, .4)",
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 15,
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  listInline: {
    flexDirection: "row",
    alignItems: "center",
  },
  groupTitle: {
    color: color.whiteColor,
    fontSize: 22,
    fontFamily: FontFamily.Medium,
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
  divider: {
    height: 1,
    backgroundColor: color.lightGrayColor,
  },
  text: {
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    color: color.blackColor,
  },
  textBold: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
    color: color.blackColor,
  },
  primaryText: {
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    color: color.primaryColor,
  },
  avatar: {
    borderRadius: 40,
    marginRight: 10,
    backgroundColor: color.primaryColor,
  },
  avatarLabel: {
    fontFamily: FontFamily.Regular,
    fontSize: 18,
    color: color.whiteColor,
  },
  modalBody: {
    paddingBottom: 5,
  },
  actionListText: {
    paddingVertical: 18,
    textAlign: "center",
    fontSize: 17,
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
  },
});

export default GroupDetailScreen;
