import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  FlatList,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Feather } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Divider, Avatar, Badge } from "react-native-paper";
import client from "../constants/client";
import { Query } from "react-apollo";
import capitalize from "../helper/capitalize";
import ProfilePhoto from "../components/ProfilePhoto";
import ComposeMessage from "../components/ComposeMessage";
import GroupMenu from "../components/GroupMenu";
import readMessageMutation from "../graphql/mutations/readMessageMutation";
import getMessageList from "../graphql/queries/getMessageList";
import getTotalMessage from "../graphql/queries/getTotalMessage";
import getGroups from "../graphql/queries/getGroups";
import * as Network from "expo-network";
import { TabView, TabBar } from "react-native-tab-view";
import { Modalize } from "react-native-modalize";
import { Portal } from "react-native-portalize";
import link from "../constants/link";
import deleteGroupMutation from "../graphql/mutations/deleteGroupMutation";
import deleteGroupMemberMutation from "../graphql/mutations/deleteGroupMemberMutation";
import deleteChatMutation from "../graphql/mutations/deleteChatMutation";
import readGroupMutation from "../graphql/mutations/readGroupMutation";
import groupMsgReadMutation from "../graphql/mutations/groupMsgReadMutation";
import ListItem from "../components/Skeleton/ListItem";
import gstyles from "../constants/gstyles";
import NoWifi from "../components/NoWifi";

class MessageScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      footerLoading: false,
      refreshing: false,
      me: {},
      componentLoad: false,
      fetchPolicy: null,
      groupImage: "",
      index: 0,
      routes: [
        { key: "first", title: "Chat" },
        { key: "second", title: "Groups" },
      ],
      groupsCount: 0,
    };

    this.getNetworkInfo();
    this.actionSheetRef = React.createRef();
    this.refetch = [];
  }

  _getGroupDetail = () => {
    client
      .query({
        query: getGroups,
      })
      .then((res) => {
        let groupsCount = res.data.general_groups.data.length;
        this.setState({ groupsCount });
      })
      .catch((err) => {});
  };

  _onRefresh = () => {
    this.refetch.map((item, _) => {
      item();
    });
    setTimeout(() => {
      this.setState({ refreshing: false });
      this._getGroupDetail();
    }, 1000);
  };

  openMenu = () => {
    this.actionSheetRef.current?.open();
  };
  closeMenu = () => {
    this.actionSheetRef.current?.close();
  };

  newGroup = () => {
    this.props.navigation.navigate("GroupMember");
    this.actionSheetRef.current?.close();
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        if (this.state.me.id) {
          return (
            <View style={{ flex: 1, backgroundColor: "#fff" }}>
              <View
                style={{
                  flex: 1,
                  backgroundColor: "#fff",
                  marginBottom: 10,
                }}
              >
                {/* <Text style={styles.msgDayPeriods}>Today</Text> */}

                <Query query={getMessageList}>
                  {({ loading, error, data, fetchMore, refetch }) => {
                    // this.refetch = refetch;
                    this.refetch.push(refetch);

                    if (loading)
                      return (
                        <>
                          <ListItem />
                          <ListItem />
                          <ListItem />
                          <ListItem />
                          <ListItem />
                          <ListItem />
                          <ListItem />
                          <ListItem />
                        </>
                      );

                    if (error) return <NoWifi onPress={() => refetch()} />;

                    let Messages = [];
                    if (data !== undefined) {
                      if (data.me.messages_list.data.length > 0) {
                        data.me.messages_list.data.map((m) => {
                          if (m.is_deleted !== this.state.me.id) {
                            Messages.push(m);
                          }
                        });
                      }
                    }
                    return (
                      <FlatList
                        showsVerticalScrollIndicator={false}
                        extraData={this.state}
                        data={Messages}
                        renderItem={({ item }) => {
                          return (
                            <View>
                              <TouchableOpacity
                                style={[
                                  styles.ListItems,
                                  {
                                    backgroundColor: item.read_at
                                      ? "#ffffff"
                                      : color.lightGrayColor,
                                  },
                                ]}
                                onPress={() => this._routeToDetailScreen(item)}
                                onLongPress={() => this.deleteChat(item)}
                              >
                                <View
                                  style={{
                                    flex: 1,
                                    flexDirection: "row",
                                  }}
                                >
                                  <ProfilePhoto
                                    size={45}
                                    item={item.user}
                                    me={this.state.me}
                                  />
                                  <View style={{ flex: 1 }}>
                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                        justifyContent: "space-between",
                                      }}
                                    >
                                      <View style={{ position: "relative" }}>
                                        {item.user ? (
                                          <Text style={styles.msgUserName}>
                                            {capitalize(item.user.firstname)}{" "}
                                            {capitalize(item.user.lastname)}
                                          </Text>
                                        ) : null}
                                      </View>
                                      {/* <View>
                                        <TimeAgo
                                          style={styles.msgTime}
                                          created_at={item.updated_at}
                                        />
                                      </View> */}
                                    </View>

                                    <View
                                      style={{
                                        flex: 1,
                                        flexDirection: "row",
                                      }}
                                    >
                                      <View style={{ flex: 1 }}>
                                        <Text
                                          numberOfLines={1}
                                          style={styles.myUnreadMsgDescription}
                                        >
                                          {item.message}
                                        </Text>
                                      </View>
                                      <View style={{ flex: 0.1 }}>
                                        {item.total > 0 ? (
                                          <View>
                                            <Badge
                                              size={15}
                                              style={{
                                                top: 1,
                                                backgroundColor: "#FF4141",
                                              }}
                                            >
                                              {item.total}
                                            </Badge>
                                          </View>
                                        ) : null}
                                      </View>
                                    </View>
                                  </View>
                                </View>
                              </TouchableOpacity>
                              <Divider
                                style={{
                                  marginLeft: 35,
                                  height: 1,
                                  backgroundColor: color.lightGrayColor,
                                }}
                              />
                            </View>
                          );
                        }}
                        keyExtractor={(item, index) => index.toString()}
                        initialNumToRender={10}
                        maxToRenderPerBatch={10}
                        onEndReachedThreshold={0.5}
                        ListFooterComponent={this.renderFooter.bind(this)}
                        ListEmptyComponent={this._listEmptyComponent}
                        refreshControl={
                          <RefreshControl
                            refreshing={this.state.refreshing}
                            tintColor={color.primaryColor}
                            onRefresh={this._onRefresh}
                          />
                        }
                        onEndReached={() => {
                          fetchMore({
                            variables: {
                              cursor:
                                data.me.messages_list.paginatorInfo
                                  .currentPage + 1,
                            },
                            updateQuery: (
                              previousResult,
                              { fetchMoreResult }
                            ) => {
                              const newNotifications =
                                fetchMoreResult.me.messages_list.data;
                              const pageInfo =
                                fetchMoreResult.me.messages_list.paginatorInfo;

                              if (!pageInfo.hasMorePages) {
                                this.setState({ footerLoading: false });
                              } else {
                                this.setState({ footerLoading: true });
                              }

                              //return [...previousResult, ...fetchMoreResult];

                              return newNotifications.length
                                ? {
                                    // Put the new comments at the end of the list and update `pageInfo`
                                    // so we have the new `endCursor` and `hasNextPage` values
                                    me: {
                                      id: previousResult.me.id,
                                      __typename: previousResult.me.__typename,
                                      messages_list: {
                                        __typename:
                                          previousResult.me.messages_list
                                            .__typename,
                                        data: [
                                          ...previousResult.me.messages_list
                                            .data,
                                          ...newNotifications,
                                        ],
                                        paginatorInfo: pageInfo,
                                      },
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
              </View>
            </View>
          );
        } else {
          return null;
        }
      case "second":
        return (
          <View style={{ flex: 1, backgroundColor: "#fff" }}>
            <View
              style={{
                flex: 1,
                backgroundColor: "#fff",
                marginBottom: 10,
              }}
            >
              <Portal>
                <Modalize
                  ref={this.actionSheetRef}
                  adjustToContentHeight={true}
                  childrenStyle={{ padding: 0 }}
                >
                  <View style={styles.modalBody}>
                    <TouchableOpacity onPress={this.newGroup}>
                      <Text style={styles.actionListText}>New group</Text>
                    </TouchableOpacity>

                    <View style={styles.divider} />
                    <TouchableOpacity onPress={this.closeMenu}>
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

              <Query query={getGroups}>
                {({ loading, error, data, fetchMore, refetch }) => {
                  // this.refetch = refetch;
                  this.refetch.push(refetch);

                  if (loading)
                    return (
                      <>
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                        <ListItem />
                      </>
                    );

                  if (error) return <NoWifi onPress={() => refetch()} />;

                  return (
                    <FlatList
                      extraData={this.state}
                      data={data.general_groups.data}
                      renderItem={this.renderGroupItem}
                      keyExtractor={(item, index) => index.toString()}
                      initialNumToRender={10}
                      maxToRenderPerBatch={10}
                      onEndReachedThreshold={0.5}
                      ListEmptyComponent={this._groupListEmptyComponent}
                      refreshControl={
                        <RefreshControl
                          refreshing={this.state.refreshing}
                          tintColor={color.primaryColor}
                          onRefresh={this._onRefresh}
                        />
                      }
                    />
                  );
                }}
              </Query>
            </View>
            {this.state.groupsCount >= 5 ? (
              false
            ) : (
              <TouchableOpacity
                onPress={this.newGroup}
                style={{
                  backgroundColor: color.primaryColor,
                  width: 45,
                  height: 45,
                  borderRadius: 40,
                  alignItems: "center",
                  justifyContent: "center",
                  position: "absolute",
                  bottom: 20,
                  right: 20,
                }}
              >
                <Feather name="edit" size={16} color={color.whiteColor} />
              </TouchableOpacity>
            )}
          </View>
        );
      default:
        return null;
    }
  };

  renderFooter() {
    return this.state.footerLoading ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  _convertData = (data) => {};

  _routeToDetailScreen = (notify) => {
    if (notify.read_at === null) {
      client
        .mutate({
          mutation: readMessageMutation,
          variables: {
            id: notify.id,
          },
          optimisticResponse: {
            __typename: "Mutation",
            readMessage: {
              __typename: "Message",
              read_at: "read",
            },
          },

          update: (cache, { data: { readMessage } }) => {
            try {
              const data = cache.readQuery({
                query: getMessageList,
              });

              const readLink = data.me.messages_list.data.find(
                (data) => data.id === notify.id
              );

              readLink.read_at = readMessage.read_at;
              readLink.total = 0;

              cache.writeQuery({
                query: getMessageList,
                data: data,
              });
            } catch (e) {}

            try {
              const data = cache.readQuery({
                query: getTotalMessage,
              });

              if (data.me.getTotalMessage > 0) {
                //data.me.getTotalMessage = data.me.getTotalMessage - 1;
              }

              cache.writeQuery({
                query: getTotalMessage,
                data: data,
              });
            } catch (e) {}
          },
        })
        .then((results) => {})
        .catch((error) => {});
    }
    this.props.navigation.navigate("Chat", { data: notify.user });
  };
  submitGroupMsgRead(id) {
    client
      .mutate({
        mutation: groupMsgReadMutation,
        variables: { group_id: id },
      })
      .then((result) => {
        if (result) {
        }
      })
      .catch((error) => {});
  }

  _routeToGroupDetailScreen = (notify) => {
    if (notify.read_at === null) {
      client
        .mutate({
          mutation: readGroupMutation,
          variables: {
            id: notify.id,
          },
        })
        .then((results) => {})
        .catch((error) => {});
    }
    this.props.navigation.navigate("GroupChat", {
      data: notify,
    });

    this.submitGroupMsgRead(notify.id);
  };

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });

    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
    this.props.navigation.setParams({
      getTotalMessages: this._getTotalMessages,
    });

    this.props.navigation.setParams({
      openMenu: this.openMenu,
    });

    this.props.navigation.addListener("didFocus", this._getGroupDetail);
  }

  _getTotalMessages = () => {
    return 2;
  };

  tapOnTabNavigator = async () => {
    let tabIndex = this.props.navigation.getParam("navigateIndex");
    if (tabIndex === 0 || tabIndex === 1) {
      this.setState({ index: tabIndex });
    }
    const netInfo = await Network.getNetworkStateAsync();

    // if (typeof this.refetch === "function") {
    if (netInfo.isConnected) {
      this.refetch.map((item, _) => {
        item();
      });
    }
    // }
  };

  getNetworkInfo = async () => {
    const netInfo = await Network.getNetworkStateAsync();
    const fetchPolicy = netInfo.isConnected ? "network-only" : "cache-only";
    this.setState({ fetchPolicy: fetchPolicy });
  };

  _listEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ width: 192, height: 286, resizeMode: "contain" }}
            source={require("../assets/images/inboxArrow.png")}
          />
        </View>
        <Text style={styles.emptyText}>It's too quiet here :(</Text>
        <Text style={styles.emptyText}>Time to chat!</Text>
      </View>
    );
  };
  renderGroupItem = ({ item }) => {
    let groupMsgData = [];
    if (typeof item.group_massages.data[0] != "undefined") {
      groupMsgData = JSON.parse(item.group_massages.data[0].message);
    }

    const { me } = this.state;
    const admins = [];
    item.members.map((m) => {
      if (m.member_type === "admin") {
        admins.push(m.user.id);
      }
    });

    let url = "";

    if (item.image_path) {
      url =
        link.url +
        "/uploads/group_images/" +
        item.id +
        "/" +
        item.image_path +
        "?id=" +
        Math.random();
    }

    return (
      <View>
        <TouchableOpacity
          style={[
            styles.ListItems,
            {
              backgroundColor: color.whiteColor,
            },
          ]}
          onPress={() => this._routeToGroupDetailScreen(item)}
          // delayLongPress={5}
          onLongPress={
            admins.length > 0 && admins.includes(me.id)
              ? () => this.deleteGroup(item)
              : () => this.removeParticipant("leave", item)
          }
        >
          <View
            style={{
              flex: 1,
              flexDirection: "row",
            }}
          >
            <View
              style={{
                width: 48,
                height: 48,
                marginRight: 15,
              }}
            >
              {item.image_path && url ? (
                <Avatar.Image
                  style={styles.avatar}
                  size={48}
                  source={{
                    uri: url,
                  }}
                />
              ) : (
                <Avatar.Image
                  style={{
                    backgroundColor: color.lightGrayColor,
                  }}
                  size={48}
                  source={require("../assets/images/group.png")}
                />
              )}
            </View>

            {item.count > 0 && (
              <View
                style={{ position: "absolute", zIndex: 99, left: 39, top: 2.5 }}
              >
                <Badge
                  size={10}
                  style={{
                    // top: 2,
                    right: 2,
                    backgroundColor: "#FF4141",
                  }}
                ></Badge>
              </View>
            )}
            <View style={{ flex: 1 }}>
              <View
                style={{
                  flex: 1,
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                  marginTop: 8,
                }}
              >
                <View style={{ position: "relative" }}>
                  <Text style={styles.msgUserName}>{item.name}</Text>
                </View>
                {/* <View>
                  {groupMsgData && groupMsgData[0] && (
                    <TimeAgo
                      style={styles.msgTime}
                      created_at={
                        groupMsgData &&
                        groupMsgData[0] &&
                        groupMsgData[0].createdAt
                      }
                    />
                  )}
                </View> */}
              </View>

              {groupMsgData && groupMsgData[0] && groupMsgData[0].text ? (
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        alignItems: "center",
                        marginTop: 4,
                      }}
                    >
                      <Text
                        style={[
                          styles.myUnreadMsgDescription,
                          {
                            color: color.blackColor,
                            fontFamily: FontFamily.Bold,
                          },
                        ]}
                        numberOfLines={1}
                      >
                        {`${
                          groupMsgData && groupMsgData[0]
                            ? groupMsgData[0].user._name
                            : ""
                        }`}
                      </Text>
                      <Text
                        style={{
                          color: color.blackColor,
                          fontFamily: FontFamily.Bold,
                          fontSize: 13,
                        }}
                      >
                        {groupMsgData && groupMsgData[0] ? `: ` : false}
                      </Text>

                      <Text
                        style={{
                          ...styles.myUnreadMsgDescription,
                          paddingRight: 12,
                        }}
                        numberOfLines={1}
                      >
                        {groupMsgData && groupMsgData[0]
                          ? groupMsgData[0].text
                          : ""}
                      </Text>
                    </View>
                  </View>
                  <View style={{ flex: 0.1 }}>
                    {/* {item.count > 0 && (
                      <Badge
                        size={20}
                        style={{
                          top: 2,
                          right: 2,
                          backgroundColor: "#FF4141",
                        }}
                      >
                        {item.count}
                      </Badge>
                    )} */}
                  </View>
                </View>
              ) : (
                false
              )}
            </View>
          </View>
        </TouchableOpacity>
        <Divider
          style={{
            marginLeft: 35,
            height: 1,
            backgroundColor: color.lightGrayColor,
          }}
        />
      </View>
    );
  };

  removeParticipant = (type, item) => {
    let Id = null;

    if (type === "leave") {
      Id = this.state.me.id;
    }

    Alert.alert("Exit!", "Do you want to exit group?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          if (Id !== null) {
            client
              .mutate({
                mutation: deleteGroupMemberMutation,
                variables: {
                  user_id: Id,
                  group_id: item.id,
                },
                optimisticResponse: {
                  __typename: "Mutation",
                  remove_groupMembers: {
                    __typename: "User",
                    id: Id,
                    firstname: "abc",
                    lastname: "def",
                    username: "abcdef",
                  },
                },
                update: (cache, { data: { remove_groupMembers } }) => {
                  const data = cache.readQuery({
                    query: getGroups,
                  });

                  const index = data.general_groups.data.findIndex(
                    (d) => d.id === item.id
                  );
                  if (index > -1) {
                    const index1 = data.general_groups.data[
                      index
                    ].members.findIndex((m) => m.id === remove_groupMembers.id);

                    if (index1 > -1) {
                      data.general_groups.data[index].members.splice(index1, 1);
                    }
                  }

                  cache.writeQuery({ query: getGroups, data });
                },
              })
              .then((res) => {
                alert("Succesful!");
              })
              .catch((err) => {});
          }
        },
      },
    ]);
  };

  deleteGroup = (data) => {
    Alert.alert("Exit!", "Do you want to exit group?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          client
            .mutate({
              mutation: deleteGroupMutation,
              variables: {
                id: data.id,
              },
              optimisticResponse: {
                __typename: "Mutation",
                deleteGroup: {
                  __typename: "Group",
                  id: data.id,
                  created_by: 123,
                  description: "description",
                  image_path: null,
                  name: "name",
                },
              },
              update: (cache, { data: { deleteGroup } }) => {
                const data = cache.readQuery({
                  query: getGroups,
                });
                const index = data.general_groups.data.findIndex(
                  (d) => d.id === deleteGroup.id
                );
                if (index > -1) {
                  data.general_groups.data.splice(index, 1);
                }
                cache.writeQuery({ query: getGroups, data });
              },
            })
            .then((res) => {
              console.log("g1");
              this._getGroupDetail();
            })
            .catch((err) => {});
        },
      },
    ]);
  };

  deleteChat = (data) => {
    Alert.alert("Alert!", "Do you want to delete this chat?", [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      {
        text: "OK",
        onPress: () => {
          client
            .mutate({
              mutation: deleteChatMutation,
              variables: {
                sender_id: data.user.id,
              },
              optimisticResponse: {
                __typename: "Mutation",
                delete_messages_list: {
                  __typename: "Message",
                  id: data.id,
                  is_deleted: this.state.me,
                },
              },
              update: (cache, { data: { delete_messages_list } }) => {
                const data = cache.readQuery({
                  query: getMessageList,
                });
                const index = data.me.messages_list.data.findIndex(
                  (d) => d.id === delete_messages_list.id
                );
                if (index > -1) {
                  data.me.messages_list.data.splice(index, 1);
                }
                cache.writeQuery({ query: getMessageList, data });
              },
            })
            .then((res) => {
              // alert("Succesful!");
            })
            .catch((err) => {});
        },
      },
    ]);
  };

  _groupListEmptyComponent = () => {
    return (
      <View style={{ flex: 1, justifyContent: "flex-start" }}>
        <View style={{ alignItems: "center" }}>
          <Image
            style={{ width: 192, height: 286, resizeMode: "contain" }}
            source={require("../assets/images/inboxArrow.png")}
          />
        </View>
        <Text style={styles.emptyText}>No Group Chat found :(</Text>
        <Text style={styles.emptyText}>Create you own group!</Text>
      </View>
    );
  };

  handlerLongClick = () => {
    Alert.alert("long");
  };
  setIndex = (index) => {
    this.setState({ index });
    this.props.navigation.setParams({ index: index });
    if (index === 0) {
      this._onRefresh();
    } else {
      this._onRefresh();
    }
  };

  render() {
    const { index, routes, groupsCount } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <TabView
          tabBarPosition="top"
          navigationState={{ index, routes }}
          renderScene={this.renderScene}
          onIndexChange={this.setIndex}
          renderTabBar={(props) => (
            <TabBar
              {...props}
              indicatorStyle={{ backgroundColor: color.primaryColor }}
              indicatorContainerStyle={{
                backgroundColor: color.whiteColor,
              }}
              activeColor={color.primaryColor}
              inactiveColor={color.blackColor}
              labelStyle={{
                fontFamily: FontFamily.Regular,
                fontSize: 14,
              }}
            />
          )}
        />
      </View>
    );
  }
}

MessageScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Inbox</Text>,
  headerRight: () =>
    screenProps.navigation.getParam("index") === 1 ? (
      <GroupMenu
        {...screenProps}
        openMenu={screenProps.navigation.getParam("openMenu")}
      />
    ) : (
      <ComposeMessage {...screenProps} />
    ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
    flex: Platform.OS === "android" ? 1 : 0,
    marginRight: Platform.OS === "android" ? -38 : 0,
  },
  rightHeaderText: {
    paddingRight: 15,
  },
  msgDayPeriods: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 16,
    marginBottom: 20,
  },
  childmsgDayPeriods: {
    marginTop: 30,
  },
  ListItems: {
    paddingTop: 10,
    paddingBottom: 15,
    paddingLeft: 15,
    paddingRight: 15,
  },
  firstListItem: {
    paddingTop: 0,
  },
  msgProfileImage: {
    marginRight: 10,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  onlineShown: {
    backgroundColor: color.primaryColor,
    width: 8,
    height: 8,
    borderRadius: 10,
    position: "absolute",
    right: -10,
    bottom: 0,
    top: 2,
  },
  msgUserName: {
    fontSize: 14,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.4,
  },
  msgTime: {
    fontSize: 12,
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
  },
  msgDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    fontSize: 13,
  },
  myUnreadMsgDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 13,
  },
  acceptButton: {
    width: 70,
    height: 25,
    paddingTop: 4,
    borderRadius: 4,
    backgroundColor: color.primaryColor,
  },
  rejectButton: {
    width: 70,
    height: 25,
    paddingTop: 4,
    borderRadius: 4,
    backgroundColor: "#E9F2F8",
    marginLeft: 10,
  },
  emptyText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 22,
    textAlign: "center",
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
  divider: {
    height: 1,
    backgroundColor: color.lightGrayColor,
  },
});

export default MessageScreen;
