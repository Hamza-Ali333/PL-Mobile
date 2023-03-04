import React from "react";
import {
  ActivityIndicator,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  Image,
  ScrollView,
} from "react-native";
import { Query } from "react-apollo";
import AsyncStorage from "@react-native-async-storage/async-storage";
import ProfilePhoto from "../../components/ProfilePhoto";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import getReward from "../../graphql/queries/getReward";

class OfferRewardScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      me: {},
    };
    this.refetch;
  }

  _handlePress = () =>
    this.setState({
      expanded: !this.state.expanded,
    });

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
    this.refetch();
  }

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <View
          style={{
            flex: 1,
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 10,
          }}
        >
          <View style={{ flex: 2, justifyContent: "center" }}>
            <Text
              style={{
                fontSize: 13,
                fontFamily: FontFamily.Regular,
                color: color.grayColor,
              }}
            >
              User
            </Text>
          </View>
          <Text
            style={{
              fontSize: 13,
              fontFamily: FontFamily.Regular,
              color: color.grayColor,
            }}
          >
            Correct answers
          </Text>
        </View>
        <Query
          query={getReward}
          variables={{ id: parseInt(this.props.navigation.getParam("id")) }}
        >
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
                  <Image source={require("../../assets/images/wifi.png")} />
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
            if (this.state.me.id !== data.offer.user.id) {
              //return null;
            }
            return data.offer.participants.map((item, key) => {
              return (
                <TouchableOpacity
                  onPress={() =>
                    this.props.navigation.navigate("Chat", { data: item.user })
                  }
                  style={styles.OfferUserChatWrapper}
                >
                  <ProfilePhoto size={42} item={item.user} />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <View style={{ flex: 2, justifyContent: "center" }}>
                      <Text style={styles.userName}>
                        {item.user.firstname} {item.user.lastname}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          fontFamily: FontFamily.Regular,
                          color: color.grayColor,
                        }}
                      >
                        @{item.user.username}
                      </Text>
                    </View>
                    <Text
                      style={{
                        fontSize: 13,
                        fontFamily: FontFamily.Regular,
                        color: color.grayColor,
                      }}
                    >
                      {item.correct}/{item.total}
                    </Text>
                  </View>
                </TouchableOpacity>
              );
            });
          }}
        </Query>
      </ScrollView>
    );
  }
}

OfferRewardScreen.navigationOptions = (screenProps) => ({
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
});
const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  OfferUserChatWrapper: {
    flexDirection: "row",
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: "#c4c4c4",
    paddingBottom: 10,
    paddingTop: 10,
  },
  userProfile: {
    marginRight: 10,
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
});

export default OfferRewardScreen;
