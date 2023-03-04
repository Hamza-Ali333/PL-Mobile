import React from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  ScrollView,
  Dimensions,
  Platform,
  LayoutAnimation,
  UIManager,
} from "react-native";
import { Ionicons, FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Chip, Badge, List, Checkbox, RadioButton } from "react-native-paper";
import getCategories from "../graphql/queries/getCategories";
import { Query } from "react-apollo";
import { getStatusBarHeight } from "react-native-status-bar-height";

const windowWidth = Dimensions.get("window").width;
const windowHeight = Dimensions.get("window").height;

class FindOfferPopupComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      scrollEnabled: true,
      checked: true,
      filter_id: 0,
      filterText: "",
      category: null,
      marginTop: -1000,
    };
  }

  filter = (id) => {
    this.setState({ filter_id: id });
    this.applyFilter();
    setTimeout(() => {
      this.props.openBottomFilter();
    }, 500);
  };

  applyFilter = () => {
    //this.props.openBottomFilter();
    setTimeout(() => {
      this.props.filter(
        this.state.filter_id,
        this.state.category,
        this.state.filterText
      );
    }, 600);
  };

  openFilterModel = (item) => {
    this.props._applyCategoryFilter(item);
  };

  componentDidMount() {}

  render() {
    const { checked } = this.state;
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
              hahaha
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
                        this.openFilterModel({ id: null, name: "All topics" })
                      }
                      style={[
                        styles.BottomOptionListItems,
                        { borderBottomWidth: 1 },
                      ]}
                      titleStyle={{
                        fontSize: 16,
                        fontFamily: FontFamily.Medium,
                        color:
                          this.props.category === null
                            ? color.primaryColor
                            : color.blackColor,
                        marginLeft: -5,
                      }}
                      title="All"
                      descriptionStyle={{
                        fontSize: 14,
                        marginLeft: -5,
                        marginTop: 5,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                      description="Select All to see"
                      right={(props) => (
                        <RadioButton
                          color={color.primaryColor}
                          style={styles.TopicPageCheckboxes}
                          status={
                            this.props.category === null
                              ? "checked"
                              : "unchecked"
                          }
                          onPress={() =>
                            this.openFilterModel({
                              id: null,
                              name: "All topics",
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
                            marginLeft: -5,
                            fontFamily: FontFamily.Medium,
                            color:
                              this.props.category === item.id
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
                          description="Select All to see"
                          right={(props) => (
                            <RadioButton
                              color={color.primaryColor}
                              style={styles.TopicPageCheckboxes}
                              status={
                                this.props.category === item.id
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
    height: windowHeight - (getStatusBarHeight() + getStatusBarHeight()),
    //marginTop: 0,
  },
  selectFilterCategoriesInner: {
    zIndex: 1,
    backgroundColor: "#E8E8E8",
  },
});

export default FindOfferPopupComponent;
