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

class ActiveOfferFilterComponent extends React.Component {
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

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidCatch(error, info) {}

  filter = (id, text) => {
    this.props._applyOfferFilters(
      { isFilterOpen: false, filterText: text, filter_id: id },
      text
    );
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
    this.setState({
      filterText: item.name,
      category: item.id,
    });

    this.applyFilter();
  };

  componentDidMount() {
    this.setState({
      filter_id: this.props._filter_id,
      category: this.props.category,
      filterText: this.props.filterText,
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
    const { checked } = this.state;
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
              onPress={() => {
                this.filter(null, "Active Offers");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color:
                  this.props.filter_id === null
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
              description="To select all option"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={
                    this.props.filter_id === null ? "checked" : "unchecked"
                  }
                  onPress={() => {
                    this.filter(null, "Active Offers");
                  }}
                />
              )}
            />
            <List.Item
              onPress={() => {
                this.filter(1, "Work in progress");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color:
                  this.props.filter_id === 1
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="Work in progress"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="To select Work in progress option"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.props.filter_id === 1 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(1, "Work in progress");
                  }}
                />
              )}
            />
            <List.Item
              onPress={() => {
                this.filter(2, "Submitted");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color:
                  this.props.filter_id === 2
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="Submitted"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="Apply submitted"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.props.filter_id === 2 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(2, "Submitted");
                  }}
                />
              )}
            />
            <List.Item
              onPress={() => {
                this.filter(3, "Awarded");
              }}
              style={[styles.BottomOptionListItems, { borderBottomWidth: 1 }]}
              titleStyle={{
                fontSize: 16,
                marginLeft: -5,
                fontFamily: FontFamily.Medium,
                color:
                  this.props.filter_id === 3
                    ? color.primaryColor
                    : color.blackColor,
              }}
              title="Awarded"
              descriptionStyle={{
                fontSize: 14,
                marginLeft: -5,
                marginTop: 5,
                fontFamily: FontFamily.Regular,
                color: color.blackColor,
              }}
              description="See awarded"
              right={(props) => (
                <RadioButton
                  color={color.primaryColor}
                  style={styles.TopicPageCheckboxes}
                  status={this.props.filter_id === 3 ? "checked" : "unchecked"}
                  onPress={() => {
                    this.filter(3, "Awarded");
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
    height: windowHeight - (getStatusBarHeight() + getStatusBarHeight()),
    //marginTop: 0,
  },
  selectFilterCategoriesInner: {
    zIndex: 1,
    backgroundColor: "#E8E8E8",
  },
});

export default ActiveOfferFilterComponent;
