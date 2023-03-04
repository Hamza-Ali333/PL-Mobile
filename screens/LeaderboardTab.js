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
import LeaderboardScreen from "../screens/LeaderboardScreen";
import LeaderboardOfferScreen from "../screens/LeaderboardOfferScreen";

export default function LeaderboardTab(props) {
  const [index, setIndex] = React.useState(0);
  const [routes] = React.useState([{ key: "first" }, { key: "second" }]);

  const [navigation] = React.useState([{ id: 2 }]);

  const renderScene = ({ route }) => {
    switch (route.key) {
      case "first":
        return <LeaderboardScreen {...props} />;
      case "second":
        return <LeaderboardOfferScreen {...props} />;
      default:
        return null;
    }
  };

  const getTabBarIcon = (props) => {
    const { route } = props;
    if (route.key === "first") {
      return (
        <Text
          style={{
            color: index === 0 ? color.primaryColor : color.grayColor,
            fontFamily: FontFamily.Regular,
            fontSize: 16,
          }}
        >
          Members
        </Text>
      );
    } else if (route.key === "second") {
      return (
        <Text
          style={{
            color: index === 1 ? color.primaryColor : color.grayColor,
            fontFamily: FontFamily.Regular,
            fontSize: 16,
          }}
        >
          Offers
        </Text>
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
          navigation={navigation}
          indicatorStyle={{ backgroundColor: color.primaryColor }}
          renderIcon={(props) => getTabBarIcon(props)}
        />
      )}
    />
  );
}

LeaderboardTab.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.pageTitle}>Trending</Text>,
});

const styles = StyleSheet.create({
  pageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  TabBar: {
    backgroundColor: "#fff",
    elevation: 0,
    borderBottomWidth: 0,
    borderColor: "#D6D6D6",
  },
});
