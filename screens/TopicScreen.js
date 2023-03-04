import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  Image,
  TextInput,
  TouchableOpacity,
} from "react-native";
import { createBottomTabNavigator, createAppContainer } from "react-navigation";
import getCategories from "../graphql/queries/getCategories";
import OptimizedFlatList from "../components/OptimizedFlatList";
import { AntDesign, Ionicons } from "@expo/vector-icons";
import Constants from "expo-constants";
import { ExpoConfigView } from "@expo/samples";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List, Checkbox } from "react-native-paper";
import { Query } from "react-apollo";

class TopicScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: [],
      selectedLists: [],
    };
  }

  componentDidMount() {
    let topic_ids = this.props.navigation.getParam("topic_ids");
    this.setState({ checked: topic_ids, selectedLists: topic_ids });
  }

  handleChange = (value) => {
    let { checked } = this.state;
    let found = checked.find((data) => data === value);
    if (!found) {
      checked.push(value);
    } else {
      var idx = checked.indexOf(value);
      checked.splice(idx, 1);
    }

    this.setState({ checked });
    this.props.navigation.state.params.updateTopics(checked);
  };

  render() {
    let { checked } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Text style={{ fontFamily: FontFamily.Bold, fontSize: 18, margin: 10 }}>
          Select one or more topics
        </Text>
        <Query query={getCategories}>
          {({ loading, error, data, fetchMore }) => {
            if (loading)
              return (
                <View>
                  <ActivityIndicator size="small" color={color.primaryColor} />
                </View>
              );

            if (error) return <Text>error</Text>;

            return (
              <OptimizedFlatList
                style={styles.postQuestionBottomOption}
                data={data.categories}
                extraData={this.state}
                renderItem={({ item, index }) => {
                  return (
                    <List.Item
                      onPress={() => this.handleChange(item.id)}
                      style={styles.BottomOptionListItems}
                      titleStyle={{
                        fontSize: 17,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                      title={item.name}
                      right={(props) => (
                        <Checkbox
                          color={color.primaryColor}
                          style={styles.TopicPageCheckboxes}
                          status={
                            checked.find((data) => data === item.id)
                              ? "checked"
                              : "indeterminate"
                          }
                        />
                      )}
                    />
                  );
                }}
                keyExtractor={(item, index) => index.toString()}
              />
            );
          }}
        </Query>
      </View>
    );
  }
}

TopicScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Add Topics</Text>,
  headerRight: () => (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={() => screenProps.navigation.goBack()}
    >
      <Text style={styles.headerRightText}>Next</Text>
    </TouchableOpacity>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    borderRadius: 3,
    borderColor: color.primaryColor,
  },
  headerRightText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    paddingTop: 5,
    paddingBottom: 5,
    paddingLeft: 8,
    paddingRight: 8,
  },
  postQuestionBottomOption: {
    flex: 1,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 2,
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15,
    paddingLeft: 0,
    paddingRight: 0,
    paddingBottom: 5,
    paddingTop: 5,
  },
  TopicPageCheckboxes: {
    marginRight: 20,
  },
});

export default TopicScreen;
