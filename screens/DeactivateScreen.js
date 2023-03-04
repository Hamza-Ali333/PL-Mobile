import React from "react";
import {
  ScrollView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
} from "react-native";
import { TextInput } from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import client from "../constants/client";
import accountDeactivate from "../graphql/queries/accountDeactivate.js";
import Colors from "../constants/Colors.js";
import submitDeactivationCode from "../graphql/queries/submitDeactivationCode.js";
import { InMemoryCache } from "apollo-cache-inmemory";
import { CachePersistor } from "apollo-cache-persist";
import AsyncStorage from "@react-native-async-storage/async-storage";

const cache = new InMemoryCache({});

const persistor = new CachePersistor({
  cache,
  storage: AsyncStorage,
});

class DeactivateScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      otp: "",
      codeRequesting: false,
      codeReceived: false,
      submitCode: false,
      isSubmitDisabled: true,
    };
  }

  getDeactivationCode() {
    this.setState({ codeRequesting: true });
    client
      .query({
        query: accountDeactivate,
        fetchPolicy: "network-only",
      })
      .then((res) => {
        if (res.data.deactivate.status) {
          this.setState({
            codeRequesting: false,
            codeReceived: true,
            isSubmitDisabled: false,
          });
        }
      })
      .catch((err) => {
        this.setState({ codeRequesting: false, codeReceived: false });
        console.log("err", err);
      });
  }

  submitDeactivationCode() {
    this.setState({ submitCode: true });
    client
      .query({
        query: submitDeactivationCode,
        variables: { otp: this.state.otp },
      })
      .then((res) => {
        if (res.data.confirm_deactivation.status) {
          this.logout();
          this.setState({ submitCode: false });
        } else {
          Alert.alert(res.data.confirm_deactivation.message);
          this.setState({ submitCode: false });
        }

        console.log("res", res);
      })
      .catch((err) => {
        this.setState({ submitCode: false });
      });
  }

  logout = async () => {
    if (persistor) {
      persistor.pause();
      await persistor.purge();
      await client.resetStore();
      persistor.resume();
    }
    await AsyncStorage.clear();
    this.props.navigation.navigate("AuthLoading");
  };

  render() {
    const { codeRequesting, submitCode, codeReceived, isSubmitDisabled } =
      this.state;
    return (
      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{
          flexGrow: 1,
          backgroundColor: "#fff",
          padding: 15,
        }}
      >
        <View style={styles.flex1}>
          <TextInput
            theme={{ colors: { primary: "#FF6600" } }}
            style={styles.EmailInput}
            label="Enter Code"
            maxLength={6}
            value={this.state.otp}
            onChangeText={(txt) => this.setState({ otp: txt })}
          />
          <View style={styles.h15X} />
          <TouchableOpacity
            disabled={isSubmitDisabled}
            style={{
              borderRadius: 10,
              backgroundColor: isSubmitDisabled
                ? color.grayColor
                : color.primaryColor,
              padding: 10,
            }}
            onPress={() =>
              this.state.otp === ""
                ? alert("Please Enter Opt Code First.")
                : this.submitDeactivationCode()
            }
          >
            {submitCode ? (
              <ActivityIndicator size={"small"} color={Colors.whiteColor} />
            ) : (
              <Text
                style={{
                  margin: 5,
                  textAlign: "center",
                  fontFamily: FontFamily.Regular,
                  color: color.whiteColor,
                }}
              >
                Submit Code
              </Text>
            )}
          </TouchableOpacity>
        </View>

        <View style={styles.h15} />
        <View style={styles.h15} />

        {codeReceived ? (
          <Text
            style={{
              textAlign: "center",
              color: Colors.grayColor,
              fontSize: 16,
              fontWeight: "500",
            }}
          >
            Deactivation code sent to your email.
          </Text>
        ) : (
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: color.primaryColor,
              padding: 10,
            }}
            disabled={codeRequesting}
            onPress={() => this.getDeactivationCode()}
          >
            {codeRequesting ? (
              <ActivityIndicator size={"small"} color={Colors.whiteColor} />
            ) : (
              <Text
                style={{
                  margin: 5,
                  textAlign: "center",
                  fontFamily: FontFamily.Regular,
                  color: color.whiteColor,
                }}
              >
                Get Account Deactivation Code
              </Text>
            )}
          </TouchableOpacity>
        )}
      </ScrollView>
    );
  }
}

DeactivateScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    shadowOpacity: 0,
    elevation: 0,
  },
  headerBackTitle: null,
  headerTitle: () => <Text style={styles.headerPageTitle}>Deactivation</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
    flex: Platform.OS === "android" ? 1 : 0,
  },
  flex1: {
    flex: 1,
    justifyContent: "center",
  },
  h15: {
    height: 15,
  },
  h15X: {
    height: 30,
  },
  EmailInput: {
    height: 65,
    paddingLeft: 0,
    backgroundColor: "transparent",
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 17,
  },
  textBold: {
    fontSize: 18,
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
    color: color.blackColor,
  },
  listPanel: {
    backgroundColor: "#F3F5FB",
    borderRadius: 10,
    padding: 10,
    alignItems: "center",
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  filledBtn: {
    backgroundColor: color.primaryColor,
    padding: 12,
    borderRadius: 8,
  },
  filledBtnTxt: {
    color: color.whiteColor,
    fontFamily: FontFamily.Medium,
    fontSize: 16,
    textAlign: "center",
  },
});

export default DeactivateScreen;
