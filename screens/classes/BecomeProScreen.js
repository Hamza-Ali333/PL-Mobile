import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { Divider } from "react-native-paper";

class BecomeProScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const navigation = this.state;
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <View style={{ flex: 1 }}>
            <View style={styles.listcontainer}>
              <Image
                style={{ width: 32, height: 32, resizeMode: "contain" }}
                source={require("../../assets/images/key.png")}
              />
              <View style={styles.listtextcontainer}>
                <Text style={styles.listtext}>
                  <Text
                    style={[styles.listtext, { fontFamily: FontFamily.Medium }]}
                  >
                    Free access
                  </Text>{" "}
                  to live classes by founders and business leaders
                </Text>
              </View>
            </View>
            <Divider />
            <View style={styles.listcontainer}>
              <Image
                style={{ width: 32, height: 32, resizeMode: "contain" }}
                source={require("../../assets/images/businessStats.png")}
              />
              <View style={styles.listtextcontainer}>
                <Text style={styles.listtext}>
                  Get presentations, process details user by
                  <Text
                    style={[styles.listtext, { fontFamily: FontFamily.Medium }]}
                  >
                    {" "}
                    senior business leader
                  </Text>
                </Text>
              </View>
            </View>
            <Divider />
            <View style={styles.listcontainer}>
              <Image
                style={{ width: 32, height: 32, resizeMode: "contain" }}
                source={require("../../assets/images/userInterview.png")}
              />
              <View style={styles.listtextcontainer}>
                <Text style={styles.listtext}>
                  <Text
                    style={[styles.listtext, { fontFamily: FontFamily.Medium }]}
                  >
                    1-on-1 interview
                  </Text>{" "}
                  preparation WithBadge industry leaders from your target
                  companies
                </Text>
              </View>
            </View>
            <Divider />
            <View style={styles.listcontainer}>
              <Image
                style={{ width: 32, height: 32, resizeMode: "contain" }}
                source={require("../../assets/images/PremiumBadge.png")}
              />
              <View style={styles.listtextcontainer}>
                <Text style={styles.listtext}>
                  <Text
                    style={[styles.listtext, { fontFamily: FontFamily.Medium }]}
                  >
                    Premium leadership content
                  </Text>{" "}
                  directly in your inbox once every month
                </Text>
              </View>
            </View>
            <Divider />
            <View style={styles.listcontainer}>
              <Image
                style={{ width: 32, height: 32, resizeMode: "contain" }}
                source={require("../../assets/images/founder.png")}
              />
              <View style={styles.listtextcontainer}>
                <Text style={styles.listtext}>
                  <Text
                    style={[styles.listtext, { fontFamily: FontFamily.Medium }]}
                  >
                    Work with founders,
                  </Text>{" "}
                  pilot emerging technology and Machine learning use cases
                </Text>
              </View>
            </View>
          </View>
          <View
            style={{ flex: 1, justifyContent: "center", alignItems: "center" }}
          >
            <TouchableOpacity
              style={styles.probutton}
              onPress={() => this.props.navigation.navigate("PaymentPlan")}
            >
              <Text style={styles.probuttontext}>Become a Pro</Text>
              <Text style={styles.probuttontextfee}>$10/month</Text>
            </TouchableOpacity>
            {/* <TouchableOpacity>
              <Text style={styles.primarytext}>I have an activation code</Text>
            </TouchableOpacity> */}
          </View>
        </View>
      </ScrollView>
    );
  }
}

BecomeProScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Become a Pro</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  listtext: {
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 17,
  },
  listcontainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 10,
    marginBottom: 10,
  },
  listtextcontainer: {
    flex: 1,
    flexDirection: "row",
    marginLeft: 10,
  },
  probutton: {
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 8,
    width: "100%",
  },
  probuttontext: {
    color: color.whiteColor,
    fontFamily: FontFamily.Medium,
    fontSize: 18,
    textAlign: "center",
  },
  probuttontextfee: {
    color: color.whiteColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    textAlign: "center",
    marginTop: 3,
  },
  primarytext: {
    marginTop: 10,
    color: color.primaryColor,
    fontSize: 17,
    textAlign: "center",
    textDecorationLine: "underline",
  },
});

export default BecomeProScreen;
