import React, { Component } from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  Dimensions,
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Ionicons } from "@expo/vector-icons";
import { List, Checkbox, RadioButton } from "react-native-paper";
import getCategories from "../graphql/queries/getCategories";
import { Query } from "react-apollo";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class HomeHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      show: false,
    };
  }

  ShowHideComponent = () => {
    if (this.state.show == true) {
      this.setState({ show: false });
    } else {
      this.setState({ show: true });
    }
  };

  render() {
    const { checked } = this.state;
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={this.ShowHideComponent}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.headerPageTitle}>Home</Text>
          <Image
            style={{ width: 20, height: 20, resizeMode: "contain" }}
            source={require("../assets/images/colorarrwdown.png")}
          />
        </TouchableOpacity>

        {this.state.show ? (
          <ScrollView
            contentContainerStyle={{ flexGrow: 1 }}
            style={styles.selectFilterCategories}
          >
            <View style={styles.selectFilterCategoriesInner}>
              <View
                style={{
                  paddingLeft: 20,
                  paddingBottom: 10,
                  paddingTop: 10,
                  borderBottomWidth: 1,
                  borderColor: "#CCCFD6",
                }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.Bold,
                    color: color.blackColor,
                    fontSize: 20,
                    marginBottom: 10,
                  }}
                >
                  Topics
                </Text>

                <Query query={getCategories}>
                  {({ loading, error, data, fetchMore }) => {
                    if (loading)
                      return (
                        <View>
                          <ActivityIndicator
                            size="small"
                            color={color.primaryColor}
                          />
                        </View>
                      );

                    if (error) return <Text>error</Text>;
                    return (
                      <View>
                        <List.Item
                          onPress={() =>
                            this.openFilterModel({ id: null, name: null })
                          }
                          style={styles.BottomOptionListItems}
                          titleStyle={{
                            fontSize: 15.3,
                            fontFamily: FontFamily.Regular,
                            color:
                              this.state.category === null
                                ? color.primaryColor
                                : color.blackColor,
                            margin: -7,
                          }}
                          title="All"
                          right={(props) => (
                            <RadioButton
                              color={color.primaryColor}
                              style={styles.TopicPageCheckboxes}
                              status={
                                this.state.category === null
                                  ? "checked"
                                  : "unchecked"
                              }
                              onPress={() =>
                                this.openFilterModel({ id: null, name: null })
                              }
                            />
                          )}
                        />
                        {data.categories &&
                          data.categories.map((item, index) => (
                            <List.Item
                              onPress={() => this.openFilterModel(item)}
                              key={item.id}
                              style={styles.BottomOptionListItems}
                              titleStyle={{
                                fontSize: 15,
                                marginLeft: -5,
                                fontFamily: FontFamily.Regular,
                                color:
                                  this.state.category === item.id
                                    ? color.primaryColor
                                    : color.blackColor,
                              }}
                              title={item.name}
                              right={(props) => (
                                <RadioButton
                                  color={color.primaryColor}
                                  style={styles.TopicPageCheckboxes}
                                  status={
                                    this.state.category === item.id
                                      ? "checked"
                                      : "unchecked"
                                  }
                                  onPress={() => this.openFilterModel(item)}
                                />
                              )}
                            />
                          ))}
                      </View>
                    );
                  }}
                </Query>
              </View>
              <View
                style={{ paddingLeft: 20, paddingBottom: 10, paddingTop: 10 }}
              >
                <Text
                  style={{
                    fontFamily: FontFamily.Bold,
                    color: color.blackColor,
                    fontSize: 20,
                    marginBottom: 8,
                    marginTop: 10,
                  }}
                >
                  Filters
                </Text>

                <List.Item
                  onPress={() => {
                    this.filter(0);
                  }}
                  style={styles.BottomOptionListItems}
                  titleStyle={{
                    fontSize: 15,
                    marginLeft: -5,
                    fontFamily: FontFamily.Regular,
                    color:
                      this.state.filter_id === 0
                        ? color.primaryColor
                        : color.blackColor,
                  }}
                  title="All"
                  right={(props) => (
                    <RadioButton
                      color={color.primaryColor}
                      style={styles.TopicPageCheckboxes}
                      status={
                        this.state.filter_id === 0 ? "checked" : "unchecked"
                      }
                      onPress={() => {
                        this.filter(0);
                      }}
                    />
                  )}
                />
                <List.Item
                  onPress={() => {
                    this.filter(1);
                  }}
                  style={styles.BottomOptionListItems}
                  titleStyle={{
                    fontSize: 15,
                    marginLeft: -5,
                    fontFamily: FontFamily.Regular,
                    color:
                      this.state.filter_id === 1
                        ? color.primaryColor
                        : color.blackColor,
                  }}
                  title="What's hot"
                  right={(props) => (
                    <RadioButton
                      color={color.primaryColor}
                      style={styles.TopicPageCheckboxes}
                      status={
                        this.state.filter_id === 1 ? "checked" : "unchecked"
                      }
                      onPress={() => {
                        this.filter(1);
                      }}
                    />
                  )}
                />
                <List.Item
                  onPress={() => {
                    this.filter(2);
                  }}
                  style={styles.BottomOptionListItems}
                  titleStyle={{
                    fontSize: 15,
                    marginLeft: -5,
                    fontFamily: FontFamily.Regular,
                    color:
                      this.state.filter_id === 2
                        ? color.primaryColor
                        : color.blackColor,
                  }}
                  title="What's new"
                  right={(props) => (
                    <RadioButton
                      color={color.primaryColor}
                      style={styles.TopicPageCheckboxes}
                      status={
                        this.state.filter_id === 2 ? "checked" : "unchecked"
                      }
                      onPress={() => {
                        this.filter(2);
                      }}
                    />
                  )}
                />
                <List.Item
                  onPress={() => {
                    this.filter(3);
                  }}
                  style={styles.BottomOptionListItems}
                  titleStyle={{
                    fontSize: 15,
                    marginLeft: -5,
                    fontFamily: FontFamily.Regular,
                    color:
                      this.state.filter_id === 3
                        ? color.primaryColor
                        : color.blackColor,
                  }}
                  title="Unanswered"
                  right={(props) => (
                    <RadioButton
                      color={color.primaryColor}
                      style={styles.TopicPageCheckboxes}
                      status={
                        this.state.filter_id === 3 ? "checked" : "unchecked"
                      }
                      onPress={() => {
                        this.filter(3);
                      }}
                    />
                  )}
                />
                <List.Item
                  onPress={() => {
                    this.filter(4);
                  }}
                  style={styles.BottomOptionListItems}
                  titleStyle={{
                    fontSize: 15,
                    marginLeft: -5,
                    fontFamily: FontFamily.Regular,
                    color:
                      this.state.filter_id === 4
                        ? color.primaryColor
                        : color.blackColor,
                  }}
                  title="My Discussion "
                  right={(props) => (
                    <RadioButton
                      color={color.primaryColor}
                      style={styles.TopicPageCheckboxes}
                      status={
                        this.state.filter_id === 4 ? "checked" : "unchecked"
                      }
                      onPress={() => {
                        this.filter(4);
                      }}
                    />
                  )}
                />
              </View>
            </View>
          </ScrollView>
        ) : null}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginLeft: 15,
    marginRight: 5,
  },
  BottomOptionListItems: {
    borderColor: "#CCCFD6",
    borderBottomWidth: 1,
    paddingLeft: 0,
  },
  LastBottomOptionListItems: {
    borderBottomWidth: 0,
  },
  TopicPageCheckboxes: {
    marginRight: 20,
  },
  selectFilterCategories: {
    position: "absolute",
    width: windowWidth,
    height: windowHeight,
    marginTop: 45,
  },
  selectFilterCategoriesInner: {
    zIndex: 9999999999999,
    backgroundColor: "#fff",
  },
});
export default HomeHeader;
