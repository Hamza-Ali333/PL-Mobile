import React from "react";
import {
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

class ActivitiesFilterComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      setModalVisible: false,
      checked: 1,
    };
  }

  componentDidMount() {
    this.setState({ checked: this.props._notify_type });
  }

  handleChange = (value) => {
    let { checked } = this.state;
    checked = value;

    this.setState({ checked });
    this.props._applyFilter(checked);
  };

  render() {
    const { setModalVisible, checked } = this.state;
    return (
      <View style={[styles.selectFilterCategories]}>
        <ScrollView style={styles.selectFilterCategoriesInner}>
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
              Filters
            </Text>
            <List.Item
              onPress={() => this.handleChange(1)}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color: checked === 1 ? color.primaryColor : color.blackColor,
              }}
              title="All"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Shows all activity by you or discussions posted by you"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={checked === 1 ? "checked" : "unchecked"}
                  onPress={() => this.handleChange(1)}
                />
              )}
            />
            <List.Item
              onPress={() => this.handleChange(2)}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color: checked === 2 ? color.primaryColor : color.blackColor,
              }}
              title="Likes"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Shows all the likes you have gained"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={checked === 2 ? "checked" : ""}
                  onPress={() => this.handleChange(2)}
                />
              )}
            />
            <List.Item
              onPress={() => this.handleChange(3)}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color: checked === 3 ? color.primaryColor : color.blackColor,
              }}
              title="Answers"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Shows answers written by you"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={checked === 3 ? "checked" : ""}
                  onPress={() => this.handleChange(3)}
                />
              )}
            />
            <List.Item
              onPress={() => this.handleChange(4)}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color: checked === 4 ? color.primaryColor : color.blackColor,
              }}
              title="Comments"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Shows your comments"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={checked === 4 ? "checked" : ""}
                  onPress={() => this.handleChange(4)}
                />
              )}
            />
            {/* <List.Item
                  onPress={() => this.handleChange(5)}
                  style={[styles.BottomOptionListItems, { borderBottomWidth: 1}]}
                  titleStyle={{
                    fontSize: 16,
                    marginLeft: -5,
                    fontFamily: FontFamily.Medium,
                    color:
                    checked === 5
                        ? color.primaryColor
                        : color.blackColor,
                  }}
                  title="Followers"
                  descriptionStyle={{
                    fontSize: 14,
                    marginLeft: -5,
                    marginTop: 5,
                    fontFamily: FontFamily.Regular,
                    color:color.blackColor
                  }}
                  description="Shows users following you"
                  right={(props) => (
                    <RadioButton
                      color={color.primaryColor}
                      style={styles.TopicPageCheckboxes}
                      status={checked === 5 ? "checked" : ""}
                      onPress={() => this.handleChange(5)}
                    />
                  )}
                /> */}
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

export default ActivitiesFilterComponent;
