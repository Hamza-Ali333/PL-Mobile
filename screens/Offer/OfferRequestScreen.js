import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  Button,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { Query } from "react-apollo";

import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import { Avatar, Badge } from "react-native-paper";
import offerWithCompanies from "../../graphql/queries/offerWithCompanies";
import firstChar from "../../helper/firstChar";
import link from "../../constants/link";

class OfferRequestScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", this.tapOnTabNavigator);
  }

  tapOnTabNavigator = () => {
    if (typeof this.refetch === "function") this.refetch();
  };

  requestScreen = (id) => {
    this.props.navigation.navigate("OfferInviteScreen", { id: id });
  };

  requestScreenEdit = (id) => {
    this.props.navigation.navigate("NewOffers", { id: id });
  };
  render() {
    const { navigate } = this.props.navigation;
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <ScrollView>
          <Query query={offerWithCompanies}>
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
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Image source={require("../../assets/images/wifi.png")} />
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

              return data.me.offerWithCompanies.data.map((item, key) => {
                let url = link.url + "/" + item.logo;
                return (
                  <View>
                    <View style={{ flex: 1, flexDirection: "row" }}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          alignItems: "center",
                        }}
                      >
                        {item.logo ? (
                          <Avatar.Image
                            style={styles.userProfile}
                            size={50}
                            source={{ uri: url }}
                          />
                        ) : (
                          <Avatar.Text
                            style={styles.userProfile}
                            size={50}
                            label={firstChar(item.title)}
                          />
                        )}
                        <View style={{ flex: 1 }}>
                          <TouchableOpacity>
                            <Text style={styles.userName}>{item.title}</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    </View>
                    <ScrollView horizontal={true}>
                      <View
                        style={{
                          flex: 1,
                          flexDirection: "row",
                          marginTop: 15,
                          borderWidth: 1,
                          borderColor: "white",
                          marginBottom: 20,
                          justifyContent: "space-around",
                          paddingTop: 7,
                        }}
                      >
                        {item.offers.data.map((offer, index) => {
                          return (
                            <View>
                              <TouchableOpacity
                                style={{
                                  position: "absolute",
                                  zIndex: 9,
                                  right: 20,
                                }}
                                onPress={this.requestScreenEdit.bind(
                                  this,
                                  offer.id
                                )}
                              >
                                <Text style={{ color: "red", fontSize: 16 }}>
                                  Edit
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                style={styles.offersBlock}
                                onPress={this.requestScreen.bind(
                                  this,
                                  offer.id
                                )}
                              >
                                {offer.requestCount > 0 ? (
                                  <Badge style={styles.offersBlockBadge}>
                                    {offer.requestCount}
                                  </Badge>
                                ) : null}

                                <Text style={styles.offersBlockText}>
                                  {offer.title}
                                </Text>
                              </TouchableOpacity>
                            </View>
                          );
                        })}
                      </View>
                    </ScrollView>
                  </View>
                );
              });
            }}
          </Query>
        </ScrollView>
      </View>
    );
  }
}

OfferRequestScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Requests</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  userName: {
    color: color.blackColor,
    fontFamily: FontFamily.Bold,
    fontSize: 17,
  },
  userProfile: {
    marginRight: 10,
  },
  editText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 16,
    paddingLeft: 10,
  },
  offersBlock: {
    height: 156,
    width: 156,
    backgroundColor: color.lightGrayColor,
    borderRadius: 5,
    alignItems: "center",
    justifyContent: "center",
    position: "relative",
    marginRight: 10,
  },
  offersBlockText: {
    color: "#DCDEE0",
    fontFamily: FontFamily.Medium,
    fontSize: 17,
  },
  offersBlockBadge: {
    position: "absolute",
    top: -5,
    right: -5,
    zIndex: 1,
  },
});

export default OfferRequestScreen;
