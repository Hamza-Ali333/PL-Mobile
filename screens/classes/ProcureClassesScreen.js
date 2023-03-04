import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  ActivityIndicator,
  Button,
  RefreshControl,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { Feather } from "@expo/vector-icons";
import ClassesComponent from "../../components/ClassesComponent";
import Classes from "../../components/Skeleton/Classes.js";
import { Query } from "react-apollo";
import getClasses from "../../graphql/queries/getClasses";
import Colors from "../../constants/Colors.js";
import NoWifi from "../../components/NoWifi/index.js";
import gstyles from "../../constants/gstyles.js";

class ProcureClassesScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      DATA: [1, 2, 3, 4, 5, 6, 7, 8],
      courses1: [],
      myCategories: [],
      search: "",
      selectedCategories: [],
      categories: [],
      refreshing: false,
      authUser: {},
    };
    this.scrollViewRef = React.createRef();
    this.refetch = [];
    this.refetch3;
  }

  _onRefresh = () => {
    this.refetch.map((item, _) => {
      item();
    });
    this.setState({ refreshing: false });
  };

  tapOnTabNavigator = async () => {
    const netInfo = await Network.getNetworkStateAsync();

    if (typeof this.refetch === "function") {
      if (netInfo.isConnected) {
        this.refetch();
      }
    }
  };
  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ authUser: res });
      const cat = res.categories;
      this.setState({ myCategories: cat });
    });

    this.props.navigation.addListener("didFocus", this._onRefresh);
  }

  renderItemTopClass = ({ item, index }) => {
    const { navigation } = this.props;
    return (
      <ClassesComponent
        key={index}
        navigation={navigation}
        maxWidth={200}
        item={item}
      />
    );
  };

  renderItem = ({ item, index }, type) => {
    return (
      <ClassesComponent
        key={index}
        maxWidth={300}
        item={item}
        type={type}
        authUser={this.state.authUser}
        navigation={this.props.navigation}
      />
    );
  };

  renderClassesList = (type) => {
    let variables = {};

    let type2 = "";
    if (type === "Upcoming") {
      type2 = "upcoming";
    } else if (type === "Expired") {
      type2 = "expired";
    } else if (type === "Newest") {
      type2 = "newest";
    } else if (type === "Popular") {
      type2 = "popular";
    } else if (type === "Featured") {
      type2 = "featured";
    } else if (type === "Additional Resources") {
      type2 = "item_based";
    }

    variables.typeInfo = type2;

    if (this.state.search !== "") {
      variables.search = this.state.search;
    }
    return (
      <Query query={getClasses} variables={variables}>
        {({ loading, error, data, fetchMore, refetch }) => {
          this.refetch.push(refetch);
          if (loading) {
            return (
              type === "Upcoming" && (
                <>
                  <Classes />
                  <View style={{ height: 20 }} />
                  <Classes />
                  <View style={{ height: 20 }} />
                  <Classes />
                </>
              )
            );
          }
          if (error)
            return type === "Upcoming" && <NoWifi onPress={() => refetch()} />;
          if (data !== undefined) {
            return (
              <>
                {data.courses.data.length > 0 ? (
                  <View style={styles.titleList}>
                    <Text style={styles.heading}>
                      {type}
                      {type === "Additional Resources" ? false : " "}
                      {type == "Additional Resources"
                        ? ""
                        : type === "Upcoming"
                        ? "Events"
                        : type === "Expired"
                        ? "Events"
                        : "Classes"}
                    </Text>
                    {data.courses.data.length > 1 && (
                      <TouchableOpacity
                        style={{
                          paddingVertical: 5,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                        onPress={() =>
                          this.props.navigation.navigate("UpcommingClasses", {
                            type: type,
                          })
                        }
                      >
                        <Text style={styles.primaryText}>more</Text>
                        <Feather
                          name="chevron-right"
                          size={15}
                          color={color.primaryColor}
                        />
                      </TouchableOpacity>
                    )}
                  </View>
                ) : null}
                {type === "Additional Resources" ? (
                  <Text style={{ paddingLeft: 10 }}>(One-Time Purchase)</Text>
                ) : (
                  false
                )}
                <FlatList
                  horizontal
                  data={data.courses.data.slice(0, 5)}
                  renderItem={({ item, index }) =>
                    this.renderItem({ item, index }, type)
                  }
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => `class ${item.id}`}
                />
              </>
            );
          }
        }}
      </Query>
    );
  };

  render() {
    return (
      <>
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <RefreshControl
              tintColor={Colors.primaryColor}
              refreshing={this.state.refreshing}
              onRefresh={() => {
                this._onRefresh();
              }}
            />
          }
        >
          <View style={styles.container}>
            {this.renderClassesList("Upcoming")}

            {this.renderClassesList("Expired")}

            {this.renderClassesList("Additional Resources")}

            {this.renderClassesList("Newest")}

            {this.renderClassesList("Popular")}

            {this.renderClassesList("Featured")}
          </View>
        </ScrollView>
      </>
    );
  }
}

ProcureClassesScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    shadowOpacity: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <Text style={styles.headerPageTitle}>Procure Classes</Text>
  ),
  headerRight: () => (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: "center",
        paddingRight: 10,
      }}
      onPress={() => screenProps.navigation.navigate("ClassSearch")}
    >
      <Feather name="search" size={20} color={color.primaryColor} />
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
    flex: Platform.OS === "android" ? 1 : 0,
    marginRight: Platform.OS === "android" ? -30 : 0,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
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
});

export default ProcureClassesScreen;
