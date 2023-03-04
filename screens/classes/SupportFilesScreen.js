import React, { Component } from "react";
import {
  Text,
  View,
  StyleSheet,
  ActivityIndicator,
  TouchableOpacity,
  Button,
  FlatList,
  RefreshControl,
  Alert,
  Linking,
} from "react-native";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import { AntDesign, Feather } from "@expo/vector-icons";
import getCourse from "../../graphql/queries/getCourse";
import { Query } from "react-apollo";
import * as FileSystem from "expo-file-system";
import * as MediaLibrary from "expo-media-library";
import * as Permissions from "expo-permissions";

class SupportFilesScreen extends Component {
  state = { refreshing: false, is_enroll: false };

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      const is_pro = this.props.navigation.getParam("is_pro");
      const item = this.props.navigation.getParam("item");
      this.setState({ is_enroll: item.is_enroll });
      if (is_pro) {
        if (item.is_enroll) {
        } else {
          is_pro && item?.data_type === "PRODUCT"
            ? Alert.alert(
                "Hi,",
                "Please enroll in this class to access support files.",
                [{ text: "OK", onPress: () => this.props.navigation.goBack() }]
              )
            : Alert.alert(
                "Hi,",
                "Please sign-up for Pro level to access support files.",
                [{ text: "OK", onPress: () => this.props.navigation.goBack() }]
              );
        }
      } else {
        if (item.is_enroll && item?.data_type === "PRODUCT") {
        } else {
          Alert.alert(
            "Hi,",
            "Please sign-up for Pro level and enroll in the class first to access support files.",
            [
              { text: "Cancel", onPress: () => this.props.navigation.goBack() },
              {
                text: "Buy Now",
                onPress: () => {
                  item?.data_type === "PRODUCT"
                    ? this.props.navigation.navigate("PaymentPlan", {
                        item: {
                          id: item.id,
                          price: item.course_objective,
                          name: item.course_name,
                          __typename: "Product",
                          type: "Additional Resources",
                          course_id: item.id,
                          is_shippable: item.is_shippable,
                        },
                      })
                    : this.props.navigation.navigate("PackagesPlan");
                },
              },
            ]
          );
        }
      }
    });
  }

  downloadFile = (url) => {
    // const { uri: localUri } = await FileSystem.downloadAsync(remoteUri, FileSystem.documentDirectory + 'name.ext');
    FileSystem.downloadAsync(url, FileSystem.documentDirectory + "doc.pdf")
      .then(({ uri }) => {
        alert("file downloaded");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  handleJoinFree = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      }
    });
  };

  renderItem = ({ item, index }) => {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          marginBottom: 13,
          marginHorizontal: 13,
        }}
      >
        <View
          style={{
            flexDirection: "row",
            alignItems: "center",
            width: "70%",
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
            {item.name}
          </Text>
        </View>

        {this.state.is_enroll ? (
          <TouchableOpacity onPress={() => this.handleJoinFree(item.file_path)}>
            <Feather
              name="download-cloud"
              size={24}
              color={color.primaryColor}
            />
          </TouchableOpacity>
        ) : (
          false
        )}
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
        <Text>No support file found.</Text>
      </View>
    );
  };
  render() {
    return (
      <View style={styles.container}>
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
                  <ActivityIndicator size="small" color={color.primaryColor} />
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
                    <Text style={{ fontSize: 19 }}>No Internet Connection</Text>
                    <Text>Could not connected to the network </Text>
                    <Text>Please check and try again.</Text>
                    <Button title="Retry" onPress={() => refetch()} />
                  </View>
                </View>
              );
            if (data !== undefined) {
              return (
                <FlatList
                  data={data.course.course_support_files}
                  ListEmptyComponent={this._listEmptyComponent}
                  renderItem={({ item, index }) =>
                    this.renderItem({ item, index })
                  }
                  showsHorizontalScrollIndicator={false}
                  keyExtractor={(item) => item.id}
                  refreshControl={
                    <RefreshControl
                      tintColor={color.primaryColor}
                      refreshing={this.state.refreshing}
                      onRefresh={() => {
                        refetch();
                        this.setState({ refreshing: false });
                      }}
                    />
                  }
                />
              );
            }
          }}
        </Query>
      </View>
    );
  }
}

SupportFilesScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Support Files</Text>,
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
});

export default SupportFilesScreen;
