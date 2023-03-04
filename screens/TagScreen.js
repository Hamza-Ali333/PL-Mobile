import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TextInput,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { List, Checkbox, Divider } from "react-native-paper";
import OptimizedFlatList from "../components/OptimizedFlatList";
import searchTags from "../graphql/queries/searchTags";
import { Query } from "react-apollo";
import Toast, { DURATION } from "react-native-easy-toast";
import OnlyList from "../components/Skeleton/OnlyList";
import gstyles from "../constants/gstyles";
import NoWifi from "../components/NoWifi";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class TagScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      checked: [],
      selectedLists: [],
      isLoading: true,
      isSearchDone: true,
    };
  }

  componentDidMount() {
    let tag_ids = this.props.navigation.getParam("tag_ids");
    this.setState({ checked: tag_ids, selectedLists: tag_ids });
  }

  renderFooter() {
    return this.state.isLoading ? (
      <ActivityIndicator color={color.primaryColor} style={{ margin: 15 }} />
    ) : null;
  }

  handleChange = (item) => {
    let { checked } = this.state;
    let found = checked.find((data) => data.id === item.id);
    if (!found) {
      if (!this.props.navigation.getParam("limit")) {
        if (checked.length > 4) {
          this.toast.show("You can't select more then 5 tags.");
          return false;
        }
      }

      checked.push(item);
    } else {
      checked = checked.filter((data) => data.id !== item.id);
    }

    this.setState({ checked });
    this.props.navigation.state.params.updateTags(checked);
  };

  searchText = (text) => {
    this.setState({ text });
  };

  render() {
    let { text, checked } = this.state;
    return (
      <View style={{ flex: 1, backgroundColor: "#fff" }}>
        <Toast
          ref={(r) => (this.toast = r)}
          style={{ backgroundColor: "gray" }}
          defaultCloseDelay={3000}
          position="center"
          positionValue={200}
          fadeInDuration={1000}
          fadeOutDuration={1000}
          opacity={0.8}
          textStyle={{ color: "#ffffff" }}
        />
        <ScrollView style={styles.checkBoxesList}>
          <View style={styles.HotPagesSearchInputContainer}>
            <AntDesign
              style={styles.HotPagesearchIcon}
              name="search1"
            ></AntDesign>
            <TextInput
              style={styles.HotPagesTextInput}
              value={this.state.text}
              placeholder="Enter to search and select"
              onChangeText={(text) => this.searchText(text)}
            />
          </View>
          {checked.length > 0 && (
            <View
              style={{
                borderRadius: 1,
                borderBottomWidth: 1,
                borderColor: color.primaryColor,
              }}
            >
              <Text
                style={{
                  fontFamily: FontFamily.Bold,
                  fontSize: 18,
                  margin: 10,
                }}
              >
                Added tags
              </Text>
              {checked.map((item, index) => (
                <View key={index} style={styles.ListItems}>
                  <List.Item
                    onPress={() => this.handleChange(item)}
                    style={styles.BottomOptionListItems}
                    titleStyle={{
                      fontSize: 16,
                      fontWeight: "400",
                      fontFamily: FontFamily.Regular,
                      color: color.primaryColor,
                    }}
                    title={item.tag_title}
                    right={(props) => (
                      <Checkbox
                        color={color.primaryColor}
                        style={styles.TopicPageCheckboxes}
                        status={
                          checked.find((data) => data.id === item.id)
                            ? "checked"
                            : ""
                        }
                      />
                    )}
                  />
                </View>
              ))}
            </View>
          )}
          <Query query={searchTags} variables={{ q: "%" + text + "%" }}>
            {({ loading, error, data, fetchMore }) => {
              if (loading)
                return (
                  <View>
                    <OnlyList />
                    <View style={gstyles.h_5} />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                    <Divider />
                    <View style={gstyles.h_5} />
                    <OnlyList />
                  </View>
                );

              if (error) return <NoWifi />;
              if (data) {
              }

              return (
                <OptimizedFlatList
                  data={data.tagSearch.data}
                  extraData={this.state}
                  renderItem={({ item, index }) => {
                    if (checked.find((data) => data.id === item.id)) {
                      return null;
                    }
                    return (
                      <List.Item
                        onPress={() => this.handleChange(item)}
                        style={styles.BottomOptionListItems}
                        titleStyle={{
                          fontSize: 17,
                          fontFamily: FontFamily.Regular,
                          color: color.blackColor,
                        }}
                        title={item.tag_title}
                        right={(props) => (
                          <Checkbox.Android
                            uncheckedColor={color.grayColor}
                            color={color.primaryColor}
                            style={styles.TopicPageCheckboxes}
                            status={
                              checked.find((data) => data.id === item.id)
                                ? "checked"
                                : "indeterminate"
                            }
                          />
                        )}
                      />
                    );
                  }}
                  keyExtractor={(item, index) => index.toString()}
                  // initialNumToRender={10}
                  onEndReachedThreshold={0.5}
                />
              );
            }}
          </Query>
        </ScrollView>
      </View>
    );
  }
}

TagScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Add Tags</Text>,
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
  HotPagesSearchInputContainer: {
    position: "relative",
    paddingLeft: 15,
    paddingRight: 15,
    paddingBottom: 8,
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  HotPagesearchIcon: {
    position: "absolute",
    left: 25,
    top: 10,
    fontSize: 20,
    zIndex: 1,
    color: "#8C8C8C",
  },
  HotPagesTextInput: {
    width: "100%",
    backgroundColor: "#F8F8F8",
    borderColor: "#E8E8E8",
    borderWidth: 1,
    borderRadius: 4,
    paddingLeft: 40,
    fontSize: 16,
    height: 40,
    fontFamily: FontFamily.Regular,
  },
  checkBoxesList: {
    backgroundColor: "#fff",
    flex: 1,
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

export default TagScreen;
