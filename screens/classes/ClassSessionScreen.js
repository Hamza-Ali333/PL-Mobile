import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  FlatList,
  Linking,
  ActivityIndicator,
  RefreshControl,
  Alert,
  Button,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import { AntDesign } from "@expo/vector-icons";
import { TouchableOpacity } from "react-native-gesture-handler";
import { TabView, TabBar } from "react-native-tab-view";
import getCourse from "../../graphql/queries/getCourse";
import { Query } from "react-apollo";
import me from "../../graphql/queries/me";
import client from "../../constants/client";
class ClassSessionScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      opacity: 1,
      tab: 1,
      show: false,
      index: 0,
      me: {},
      // routes: [{ key: "questions" }, { key: "answers" }],
      routes: [
        { key: "first", title: "Free" },
        { key: "second", title: "Paid" },
      ],
    };
  }

  setIndex = (index) => {
    this.setState({ index });
  };

  _getRequestMe = () => {
    //this.resetCache();
    client
      .query({
        query: me,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        if (result.loading === false) {
          AsyncStorage.setItem("me", JSON.stringify(result.data.me)).then(
            (res) => {
              // this.setUserData();
            }
          );

          // setPro(result.data.me.is_pro);
          this.setState({
            me: result.data.me,
          });
        }
      });
  };

  componentDidMount() {
    this._getRequestMe();
    let res;
    AsyncStorage.getItem("me").then((result) => {
      res = JSON.parse(result);
      this.setState({
        me: res,
      });
    });
  }

  handleJoinPaid = (url) => {
    const item = this.props.navigation.getParam("item");

    if (
      item?.data_type === "PRODUCT" ? item?.is_enroll : this.state.me.is_pro
    ) {
      Linking.canOpenURL(url).then((supported) => {
        if (supported) {
          Linking.openURL(url);
        }
      });
    } else {
      Alert.alert("Please sign-up for Pro level.", [
        {
          text: "OK",
          onPress: () => this.props.navigation.goBack(),
        },
      ]);
    }
  };

  handleJoinFree = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };
  renderItem = ({ item, index }, key) => {
    if (key) {
    }
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginVertical: 13,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            marginRight: 10,
          }}
        >
          <View
            style={{
              backgroundColor: color.grayColor,
              padding: 8,
              borderRadius: 60,
              marginRight: 10,
            }}
          >
            <AntDesign name="filetext1" size={18} color="white" />
          </View>
          <Text numberOfLines={1} style={styles.title}>
            {item.title}dafdfdxxx
          </Text>
        </View>

        <TouchableOpacity
          style={styles.fillBtn}
          onPress={
            key && key === "first"
              ? () => this.handleJoinFree(item.url)
              : () => this.handleJoinPaid(item.url)
          }
        >
          <Text style={styles.fillBtnText}>Join</Text>
        </TouchableOpacity>
      </View>
    );
  };

  _listEmptyComponent = () => {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          marginTop: "7%",
        }}
      >
        <Text>No session found.</Text>
      </View>
    );
  };

  renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return (
          <Query
            query={getCourse}
            variables={{ id: this.props.navigation.getParam("id") }}
          >
            {({ loading, error, data, fetchMore, refetch }) => {
              if (loading) {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator
                      size="small"
                      color={color.primaryColor}
                    />
                  </View>
                );
              }
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
                      <Text style={{ fontSize: 19 }}>
                        No Internet Connection
                      </Text>
                      <Text>Could not connected to the network </Text>
                      <Text>Please check and try again.</Text>
                      <Button title="Retry" onPress={() => refetch()} />
                    </View>
                  </View>
                );
              if (data !== undefined) {
                let freeSession = [];

                if (data.course.course_session.length > 0) {
                  data.course.course_session.map((s) => {
                    if (s.is_paid == false) {
                      freeSession.push(s);
                    }
                  });
                } else {
                  freeSession = [];
                }
                return (
                  <FlatList
                    data={freeSession}
                    renderItem={({ item, index }) =>
                      this.renderItem({ item, index }, route.key)
                    }
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={this._listEmptyComponent}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                      <RefreshControl
                        tintColor={color.primaryColor}
                        // refreshing={this.state.refreshing}
                        onRefresh={() => {
                          // this.setState({ isLoaded: true });
                          refetch();
                          // this._onRefresh.bind(this);
                        }}
                      />
                    }
                  />
                );
              }
            }}
          </Query>
        );
      case "second":
        return (
          <Query
            query={getCourse}
            variables={{ id: this.props.navigation.getParam("id") }}
          >
            {({ loading, error, data, fetchMore, refetch }) => {
              if (loading) {
                return (
                  <View
                    style={{
                      flex: 1,
                      alignItems: "center",
                      justifyContent: "center",
                    }}
                  >
                    <ActivityIndicator
                      size="small"
                      color={color.primaryColor}
                    />
                  </View>
                );
              }
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
                      <Text style={{ fontSize: 19 }}>
                        No Internet Connection
                      </Text>
                      <Text>Could not connected to the network </Text>
                      <Text>Please check and try again.</Text>
                      <Button title="Retry" onPress={refetch} />
                    </View>
                  </View>
                );
              if (data !== undefined) {
                let freeSession = [];

                if (data.course.course_session.length > 0) {
                  data.course.course_session.map((s) => {
                    if (s.is_paid == true) {
                      freeSession.push(s);
                    }
                  });
                } else {
                  freeSession = [];
                }
                return (
                  <FlatList
                    data={freeSession}
                    renderItem={({ item, index }) =>
                      this.renderItem({ item, index })
                    }
                    showsHorizontalScrollIndicator={false}
                    ListEmptyComponent={this._listEmptyComponent}
                    keyExtractor={(item) => item.id}
                    refreshControl={
                      <RefreshControl
                        tintColor={color.primaryColor}
                        // refreshing={this.state.refreshing}
                        onRefresh={() => {
                          // this.setState({ isLoaded: true });
                          refetch();
                          // this._onRefresh.bind(this);
                        }}
                      />
                    }
                  />
                );
              }
            }}
          </Query>
        );
      default:
        return null;
    }
  };
  render() {
    const { index, routes } = this.state;
    // const is_enroll = this.props.navigation.getParam("is_enroll");
    // const type = this.props.navigation.getParam("type");

    return (
      <View style={styles.container}>
        <TabView
          style={{ marginBottom: 50 }}
          navigationState={{ index, routes }}
          renderScene={this.renderScene}
          onIndexChange={this.setIndex}
          renderTabBar={(props) => (
            <TabBar
              style={styles.TabBar}
              {...props}
              navigation={this.props.navigation}
              indicatorContainerStyle={{ backgroundColor: "white" }}
              activeColor={color.primaryColor}
              inactiveColor={color.blackColor}
              labelStyle={{
                textTransform: "capitalize",
                fontFamily: FontFamily.Medium,
              }}
              indicatorStyle={{
                backgroundColor: color.primaryColor,
              }}
            />
          )}
        />
      </View>
    );
  }
}

ClassSessionScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Sessions</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
    backgroundColor: "#fff",
  },
  TabBar: {
    elevation: 0,
    borderBottomWidth: 0,
    borderColor: "#D6D6D6",
  },
  heading: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 18,
  },
  goProMsg: {
    flexDirection: "row",
    backgroundColor: color.primaryColor,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 10,
    paddingVertical: 13,
    position: "absolute",
    top: 0,
    zIndex: 1,
  },
  goProMsgText: {
    fontSize: 16,
    color: "white",
    flex: 1,
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
  list: {
    backgroundColor: "#fff",
    borderRadius: 6,
    maxWidth: 300,
    margin: 10,
    marginRight: 0,
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
    flex: 1,
  },
  titleList: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingLeft: 10,
    paddingRight: 10,
    marginTop: 20,
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
  fillBtn: {
    justifyContent: "center",
    backgroundColor: color.primaryColor,
    padding: 6,
    paddingHorizontal: 20,
    borderRadius: 3,
    alignItems: "center",
  },
  fillBtnText: {
    color: "#fff",
    fontFamily: FontFamily.Medium,
    fontSize: 12,
  },
});

export default ClassSessionScreen;
