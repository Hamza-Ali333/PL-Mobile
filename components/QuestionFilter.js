import React from "react";
import { Query } from "react-apollo";
import {
  ActivityIndicator,
  Dimensions,
  LayoutAnimation,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  UIManager,
  View,
} from "react-native";
import { List, RadioButton } from "react-native-paper";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import getCategories from "../graphql/queries/getCategories";

const windowWidth = Dimensions.get("window").width;

class QuestionFilter extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      checked: true,
      filter_id: 0,
      filterText: "",
      sortText: "",
      category: null,
      marginTop: -1000,
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  filter = (id, sortText) => {
    this.setState({ filter_id: id, sortText: sortText }, this.applyFilter);
    // setTimeout(() => {
    //   this.props.openBottomFilter();
    // }, 500);
  };

  applyFilter = () => {
    //this.props.openBottomFilter();

    this.props.filter(
      this.state.filter_id,
      this.state.category,
      this.state.filterText,
      this.state.sortText
    );
  };

  openFilterModel = (item) => {
    this.setState(
      {
        filterText: item.name,
        category: item.id,
      },
      this.applyFilter
    );
  };

  componentDidMount() {
    this.setState({
      filter_id: this.props._filter_id,
      category: this.props.category,
      filterText: this.props.filterText,
      sortText: this.props.sortText,
    });

    LayoutAnimation.configureNext({
      duration: 100,
      create: {
        type: LayoutAnimation.Types.linear,
        springDamping: 0,
        property: LayoutAnimation.Properties.scaleX,
      },
    });
  }

  render() {
    return (
      <View style={[styles.selectFilterCategories]}>
        <ScrollView style={styles.selectFilterCategoriesInner}>
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
                        this.openFilterModel({ id: null, name: "All Topics" })
                      }
                      style={[
                        styles.BottomOptionListItems,
                        { borderBottomWidth: 1 },
                      ]}
                      titleStyle={{
                        fontSize: 16,
                        fontFamily: FontFamily.Medium,
                        marginLeft: -5,
                        color:
                          this.state.category === null
                            ? color.primaryColor
                            : color.blackColor,
                      }}
                      title="All Topics"
                      descriptionStyle={{
                        fontSize: 14,
                        marginLeft: -5,
                        marginTop: 5,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                      description="All topics from below are selected"
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
                            this.openFilterModel({
                              id: null,
                              name: "All Topics",
                            })
                          }
                        />
                      )}
                    />
                    {data.categories &&
                      data.categories.map((item, index) => (
                        <List.Item
                          onPress={() => this.openFilterModel(item)}
                          key={item.id}
                          style={[
                            styles.BottomOptionListItems,
                            data.categories.length - 1 === index
                              ? {}
                              : { borderBottomWidth: 1 },
                          ]}
                          titleStyle={{
                            fontSize: 16,
                            fontFamily: FontFamily.Medium,
                            marginLeft: -5,
                            color:
                              this.state.category === item.id
                                ? color.primaryColor
                                : color.blackColor,
                          }}
                          title={item.name}
                          descriptionStyle={{
                            fontSize: 14,
                            marginLeft: -5,
                            marginTop: 5,
                            fontFamily: FontFamily.Regular,
                            color: color.blackColor,
                          }}
                          description={item.description}
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
          <View style={{ paddingLeft: 20, paddingBottom: 10, paddingTop: 10 }}>
            <Text
              style={{
                fontFamily: FontFamily.Bold,
                color: color.blackColor,
                fontSize: 20,
                marginBottom: 8,
                marginTop: 10,
              }}
            >
              Sort (Based on discussion activity)
            </Text>

            <List.Item
              onPress={() => {
                this.filter(0, "");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Medium,
                marginLeft: -5,
                color:
                  this.state.filter_id === 0
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="All"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="System sorts based on all users."
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.state.filter_id === 0 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(0, "");
                  }}
                />
              )}
            />
            <List.Item
              onPress={() => {
                this.filter(1, " - What's hot");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Medium,
                marginLeft: -5,
                color:
                  this.state.filter_id === 1
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="What's hot"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Based on overall views, and discussion activity."
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.state.filter_id === 1 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(1, " - What's hot");
                  }}
                />
              )}
            />
            <List.Item
              onPress={() => {
                this.filter(2, " - What's new");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Medium,
                marginLeft: -5,
                color:
                  this.state.filter_id === 2
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="What's new"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Based on recent discussion activity."
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.state.filter_id === 2 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(2, " - What's new");
                  }}
                />
              )}
            />
            <List.Item
              onPress={() => {
                this.filter(3, " - Unanswered");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Medium,
                marginLeft: -5,
                color:
                  this.state.filter_id === 3
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="Unanswered"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Questions where no answers are written yet."
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.state.filter_id === 3 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(3, " - Unanswered");
                  }}
                />
              )}
            />

            {/* ////// */}
            <List.Item
              onPress={() => {
                this.filter(5, " - Expert Opinion");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Medium,
                marginLeft: -5,
                color:
                  this.state.filter_id === 5
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="Expert Opinion"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Expert opinios from other experts."
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.state.filter_id === 5 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(5, " - Expert Opinion");
                  }}
                />
              )}
            />

            {/* ///// */}

            <List.Item
              onPress={() => {
                this.filter(4, " - My Discussion");
              }}
              style={[styles.BottomOptionListItems]}
              titleStyle={{
                fontSize: 16,
                fontFamily: FontFamily.Medium,
                marginLeft: -5,
                color:
                  this.state.filter_id === 4
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="My Discussion"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Your questions and answers"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.state.filter_id === 4 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(4, " - My Discussion");
                  }}
                />
              )}
            />
          </View>
        </ScrollView>
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
    paddingLeft: 0,
  },
  LastBottomOptionListItems: {
    borderBottomWidth: 0,
  },
  TopicPageCheckboxes: {
    marginRight: 20,
  },
  selectFilterCategories: {
    flex: -1,
    //position: "absolute",
    width: windowWidth,
    //height: windowHeight - (getStatusBarHeight()+getStatusBarHeight()),
    //marginTop: 0,
  },
  selectFilterCategoriesInner: {
    zIndex: 1,
    backgroundColor: "#E8E8E8",
  },
});

export default QuestionFilter;
