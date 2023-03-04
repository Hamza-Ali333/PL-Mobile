import React from "react";
import { ActivityIndicator, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import client from "../constants/client";
import me from "../graphql/queries/me";
import color from "../constants/Colors";

_bootstrapAsync = async (props) => {
  //AsyncStorage.removeItem('userSession');
  const userSession = await AsyncStorage.getItem("userSession");
  if (userSession) {
    const item = JSON.parse(userSession);
    client
      .query({
        query: me,
      })
      .then((result) => {
        AsyncStorage.setItem("me", JSON.stringify(result.data.me))
          .then((result) => {
            props.navigation.navigate(item.token ? "Main" : "Auth");
          })
          .catch((err) => {
            AsyncStorage.removeItem("userSession");
            props.navigation.navigate("Auth");
          });
      })
      .catch((error) => {
        AsyncStorage.removeItem("userSession");
        props.navigation.navigate("Auth");
      });
  } else {
    props.navigation.navigate("Auth");
  }
};

const AuthLoadingScreen = (props) => {
  this._bootstrapAsync(props);

  return (
    <View
      style={{
        flex: 1,
        flexDirection: "column",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: "#F7F7F7",
      }}
    >
      <ActivityIndicator color={color.primaryColor} />
    </View>
  );
};

export default AuthLoadingScreen;
