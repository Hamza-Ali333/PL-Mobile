import * as React from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ImageBackground,
  ScrollView,
} from "react-native";
import { TabView, TabBar, SceneMap } from "react-native-tab-view";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import VideosGrid from "../components/VideosGrid";
import HowItWorks from "../components/HowItWorks";
import QATab from "../components/QATab";
import { Ionicons } from "@expo/vector-icons";

const HowItWorksTab = () => (
  <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
    <HowItWorks />
  </View>
);

const VideosGridTab = () => (
  <ScrollView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <VideosGrid />
    </View>
  </ScrollView>
);
const Q_ATab = () => (
  <ScrollView style={{ flex: 1 }}>
    <View style={{ flex: 1, backgroundColor: "#f7f7f7" }}>
      <QATab />
    </View>
  </ScrollView>
);

export default function TabViewExample() {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([
    { key: "first" },
    { key: "second" },
    { key: "third" },
  ]);

  const renderScene = SceneMap({
    first: HowItWorksTab,
    second: VideosGridTab,
    third: Q_ATab,
  });

  const getTabBarIcon = (props) => {
    const { route } = props;
    if (route.key === "first") {
      return (
        <Text
          style={{
            color: color.blackColor,
            fontFamily: FontFamily.Regular,
            fontSize: 14,
          }}
        >
          How it works
        </Text>
      );
    } else if (route.key === "second") {
      return (
        <Image
          style={{ width: 22, height: 22 }}
          source={require("../assets/images/ShoppingBagColor.png")}
        />
      );
    } else if (route.key === "third") {
      return (
        <Image
          style={{ width: 22, height: 22 }}
          source={require("../assets/images/TVColor.png")}
        />
      );
    }
  };
  return (
    <TabView
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      renderTabBar={(props) => (
        <TabBar
          style={styles.TabBar}
          {...props}
          indicatorStyle={{ backgroundColor: "#3f3f3f" }}
          activeColor={{ backgroundColor: "red" }}
          renderIcon={(props) => getTabBarIcon(props)}
        />
      )}
    />
  );
}

TabViewExample.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.pageTitle}>Page Title</Text>,
});

const styles = StyleSheet.create({
  pageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  TabBar: {
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
});
