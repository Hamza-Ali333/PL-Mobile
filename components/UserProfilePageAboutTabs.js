import React from "react";
import {
  ActivityIndicator,
  Dimensions,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Avatar } from "react-native-paper";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import getUser from "../graphql/queries/getUser";
import { Query } from "react-apollo";
import firstChar from "../helper/firstChar";
import link from "../constants/link";
import * as WebBrowser from "expo-web-browser";

class UserProfilePageAboutTabs extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      refreshing: false,
      me: {},
      show: false,
      user_id: this.props.user_id,
    };
    this.refetch;
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res, profile_photo: res.profile_photo });
    });
  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  _handleOpenWithWebBrowser = (link) => {
    WebBrowser.openBrowserAsync(link);
  };

  render() {
    let height = {};
    if (this.props.index !== 2) {
      height = { height: 0 };
    }
    return (
      <View style={[{ backgroundColor: "#fff" }, height]}>
        <Query query={getUser} variables={{ id: this.state.user_id }}>
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
            if (loading)
              return (
                <View>
                  <ActivityIndicator size="small" color={color.primaryColor} />
                </View>
              );

            if (error)
              return (
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Image source={require("../assets/images/wifi.png")} />
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

            return (
              <View>
                {data.user.description ? (
                  <View style={{ padding: 13 }}>
                    <Text
                      style={{
                        fontFamily: FontFamily.Bold,
                        color: color.blackColor,
                        fontSize: 18,
                        marginBottom: 14,
                      }}
                    >
                      Description
                    </Text>
                    <Text
                      style={{
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                        fontSize: 16,
                      }}
                    >
                      {data.user.description}
                    </Text>
                  </View>
                ) : null}

                <View
                  style={{
                    padding: 13,
                    //borderTopWidth: 1,
                    //borderBottomWidth: 1,
                    borderColor: "#D6D6D6",
                  }}
                >
                  {data.user.companies.data.length > 0 && (
                    <View
                      style={{
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text
                        style={{
                          fontFamily: FontFamily.Bold,
                          color: color.blackColor,
                          fontSize: 18,
                        }}
                      >
                        Companies
                      </Text>
                    </View>
                  )}

                  <View style={{ paddingTop: 13 }}>
                    {data.user.companies.data.map((item, key) => (
                      <TouchableOpacity
                        onPress={() =>
                          this._handleOpenWithWebBrowser(item.linked_in_profile)
                        }
                        key={key}
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          paddingBottom: 10,
                          paddingTop: 10,
                        }}
                      >
                        {item.logo ? (
                          <Avatar.Image
                            style={{ marginRight: 15 }}
                            size={50}
                            source={{ uri: link.url + "/" + item.logo }}
                          />
                        ) : (
                          <Avatar.Text
                            style={{ marginRight: 15 }}
                            size={50}
                            label={firstChar(item.title)}
                          />
                        )}
                        <Text
                          style={{
                            fontFamily: FontFamily.Bold,
                            color: color.blackColor,
                            fontSize: 16,
                          }}
                        >
                          {item.title}
                        </Text>
                      </TouchableOpacity>
                    ))}
                  </View>
                </View>

                <View style={{ padding: 13 }}>
                  {/* <View style={{ flexDirection: "row" }}>
                        <Text
                          style={{
                            color: "#9299A1",
                            fontSize: 14,
                            marginRight: 5,
                          }}
                        >
                          Category:
                        </Text>
                        <Text
                          style={{
                            color: color.blackColor,
                            fontSize: 16,
                            fontFamily: FontFamily.Bold,
                          }}
                        >
                          Strategic Sourcing
                        </Text>
                      </View> */}
                  {data.user.country ? (
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <Text
                        style={{
                          color: "#9299A1",
                          fontSize: 14,
                          marginRight: 5,
                        }}
                      >
                        Country:
                      </Text>
                      <Text
                        style={{
                          color: color.blackColor,
                          fontSize: 16,
                          fontFamily: FontFamily.Bold,
                        }}
                      >
                        {data.user.country}
                      </Text>
                    </View>
                  ) : null}
                  {data.user.city ? (
                    <View style={{ flexDirection: "row", marginTop: 10 }}>
                      <Text
                        style={{
                          color: "#9299A1",
                          fontSize: 14,
                          marginRight: 5,
                        }}
                      >
                        City:
                      </Text>
                      <Text
                        style={{
                          color: color.blackColor,
                          fontSize: 16,
                          fontFamily: FontFamily.Bold,
                        }}
                      >
                        {data.user.city}
                      </Text>
                    </View>
                  ) : null}
                </View>
                {/* <View style={{ padding: 13 }}>
                      <View style={{ flexDirection: "row" }}>
                        <TouchableOpacity style={styles.socialLinks}>
                          <FontAwesome
                            name="linkedin"
                            size={24}
                            color={color.primaryColor}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialLinks}>
                          <FontAwesome
                            name="facebook"
                            size={24}
                            color={color.primaryColor}
                          />
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.socialLinks}>
                          <FontAwesome
                            name="twitter"
                            size={24}
                            color={color.primaryColor}
                          />
                        </TouchableOpacity>
                      </View>
                    </View> */}
              </View>
            );
          }}
        </Query>
        {/* <View style={{alignItems: "center"}}>
              <Text style={{ fontSize: 20,fontFamily: FontFamily.Regular,}}>No data found</Text>
              <TouchableOpacity>
                  <Text style={{padding:5, color: color.primaryColor,fontSize: 15,fontFamily: FontFamily.Regular,}}>Join Discussion</Text></TouchableOpacity>
              
            </View> */}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  postButton: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 15,
  },
});

export default UserProfilePageAboutTabs;
