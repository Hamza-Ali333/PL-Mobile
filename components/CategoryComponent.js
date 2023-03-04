import React from "react";
import {
  View,
  Text,
  Dimensions,
  StyleSheet,
  TouchableOpacity,
  FlatList,
  UIManager,
  Platform,
  LayoutAnimation,
  ActivityIndicator,
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { NavigationActions } from "react-navigation";
import category from "../graphql/queries/getMroCategories";
import Accordian from "./CategoryAccordian";
import { Query } from "react-apollo";
import OnlyList from "./Skeleton/OnlyList.js";
import gstyles from "../constants/gstyles.js";
import { Divider } from "react-native-paper";

class CategoryComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      visible: false,
      expanded: [],
      categories: [],
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {
    this.setState({ categories: this.props.categories });
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.categories !== this.props.categories) {
      this.setState({ categories: nextProps.categories });
    }
  }

  navigateToHome = () => {
    this.props.navigation.navigate("Home");
  };

  enableVisible = () => {
    let categories = this.props.categories;
    this.setState({ visible: true, categories: categories });
  };

  newPost = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("NewPost");
  };

  RichEditorScreen = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("RichEditorScreen");
  };

  newOffer = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate(
      "Menu",
      {},
      NavigationActions.navigate({
        routeName: "NewOffers",
      })
    );
  };

  cancel = () => {
    this.setState({ visible: false });
    this.props.navigation.navigate("Home");
  };

  saveCategory = () => {
    this.props._setCategory(this.state.categories);
  };

  _onCategoryChange = (categories) => {
    this.setState({ categories });
  };

  accordianPress = (item) => {
    if (item.parent === 0) {
      let expanded = this.state.expanded;
      if (expanded[item.id] === true) {
        expanded[item.id] = false;
      } else {
        expanded = [];
        expanded[item.id] = true;
      }
      LayoutAnimation.configureNext({
        duration: 300,
        create: {
          type: LayoutAnimation.Types.easeInEaseOut,
          property: LayoutAnimation.Properties.opacity,
        },
        update: {
          type: LayoutAnimation.Types.easeInEaseOut,
        },
      });
      this.setState({ expanded });
    } else {
      this.props.navigation.navigate("NewOffers");
    }
  };

  categories = (data, parent) => {
    return data.filter((item) => {
      return item.parent_id == parent;
    });
  };

  renderItem = ({ item, index }) => {
    return (
      <Accordian
        categories={this.state.categories}
        key={index}
        item={item}
        onCategoryChange={this._onCategoryChange}
      />
    );
  };

  render() {
    const { search } = this.props;
    return (
      <View
        style={{ height: Dimensions.get("window").height, zIndex: 1, flex: -1 }}
      >
        <Query
          query={category}
          variables={{
            search: search,
          }}
        >
          {({ loading, error, data, fetchMore, refetch }) => {
            if (loading)
              return (
                <View
                  style={{
                    flex: 1,
                  }}
                >
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
                </View>
              );
            return (
              <FlatList
                data={data.mro_categories.data}
                renderItem={this.renderItem}
                keyExtractor={(item) => item.id}
              />
            );
          }}
        </Query>
        {typeof this.props.__closeCategoryModal === "function" && (
          <TouchableOpacity
            style={{
              borderRadius: 10,
              backgroundColor: color.primaryColor,
              margin: 10,
              padding: 10,
            }}
            onPress={this.saveCategory}
          >
            {this.props.uploadLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <Text
                style={{
                  margin: 5,
                  textAlign: "center",
                  fontFamily: FontFamily.Regular,
                  color: color.whiteColor,
                }}
              >
                Save
              </Text>
            )}
          </TouchableOpacity>
        )}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  touchRightHeadText: {
    padding: 10,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  profileGridItems: {
    flexDirection: "row",
    backgroundColor: "#F3F5FB",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
  },
});

export default CategoryComponent;
