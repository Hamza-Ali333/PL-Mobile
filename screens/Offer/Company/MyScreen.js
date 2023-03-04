import React, { Component } from "react";
import {
  ActivityIndicator,
  AsyncStorage,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
} from "react-native";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import { Query } from "react-apollo";
import LottieView from "lottie-react-native";
import color from "../../../constants/Colors.js";
import FontFamily from "../../../constants/FontFamily.js";
import { Avatar, List, Chip } from "react-native-paper";
import ProfilePhoto from "../../../components/ProfilePhoto";
import myCompany from "../../../graphql/queries/myCompany";
import link from "../../../constants/link";
import firstChar from "../../../helper/firstChar";

class MyScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      message: "",
      me: {},
      status: 1,
      company: {},
    };
    this.refetch;
  }

  componentDidMount() {
    let company = this.props.navigation.getParam("company");
    this.setState({ company: company });
    this.refetch();
  }

  handleChange = (company) => {
    this.setState({ company });
    this.props.navigation.state.params.updateCompany(company);
    this.props.navigation.goBack();
  };

  editHandle = (company) => {
    this.props.navigation.navigate("NewCompany", {
      id: company.id,
      refetch: this.refresh,
    });
  };

  refresh = () => {
    this.refetch();
  };

  selectNewCmpany = (company) => {
    this.setState({ company });
    this.props.navigation.state.params.updateCompany(company);
    this.props.navigation.goBack();
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
        <Query query={myCompany}>
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
            if (loading)
              return (
                <View>
                  <LottieView
                    style={{
                      width: "100%",
                      backgroundColor: "#ffffff",
                    }}
                    source={require("../../../assets/lottie/list-loader.json")}
                    autoPlay
                    loop
                  />
                </View>
              );

            if (data.me.companies) {
              return data.me.companies.data.map((item, index) => {
                let url = link.url + "/" + item.logo;
                return (
                  <View key={index} style={styles.postQuestionProfile}>
                    {item.logo ? (
                      <Avatar.Image
                        style={{ marginRight: 15 }}
                        size={62}
                        source={{ uri: url }}
                      />
                    ) : (
                      <Avatar.Text
                        style={{ marginRight: 15 }}
                        size={62}
                        label={firstChar(item.title)}
                      />
                    )}
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <View style={{ flex: 2, justifyContent: "center" }}>
                        <View
                          style={{
                            justifyContent: "space-between",
                            flexDirection: "row",
                          }}
                        >
                          <Text style={styles.userName}>{item.title}</Text>

                          <TouchableOpacity
                            onPress={() => this.editHandle(item)}
                            style={{
                              padding: 5,
                              justifyContent: "center",
                              alignItems: "center",
                            }}
                          >
                            <Text
                              style={{
                                color: color.primaryColor,
                                fontSize: 17,
                                fontFamily: FontFamily.Regular,
                              }}
                            >
                              Edit
                            </Text>
                          </TouchableOpacity>
                        </View>

                        <TouchableOpacity
                          onPress={() => this.handleChange(item)}
                          style={{
                            backgroundColor: "#F3F5FB",
                            width: 95,
                            height: 26,
                            borderRadius: 8,
                            justifyContent: "center",
                            alignItems: "center",
                          }}
                        >
                          <Text
                            style={{
                              color: color.primaryColor,
                              fontSize: 12,
                              fontFamily: FontFamily.Regular,
                            }}
                          >
                            Select
                          </Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                  </View>
                );
              });
            } else {
              return null;
            }
          }}
        </Query>

        <TouchableOpacity
          onPress={() =>
            this.props.navigation.navigate("NewCompany", {
              refetch: this.refresh,
              _selectNewCmpany: this.selectNewCmpany,
            })
          }
          style={{
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 35,
            backgroundColor: "#F3F5FB",
            height: 45,
            borderRadius: 10,
          }}
        >
          <AntDesign name="plus" size={24} color={color.primaryColor} />
          <Text
            style={{
              color: color.primaryColor,
              fontSize: 17,
              fontFamily: FontFamily.Regular,
            }}
          >
            Add Company
          </Text>
        </TouchableOpacity>
      </View>
    );
  }
}

MyScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <Text style={styles.postQuestionPageTitle}>My Companies</Text>
  ),
});

const styles = StyleSheet.create({
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  postQuestionProfile: {
    marginTop: 25,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
});

export default MyScreen;
