import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import me from "../graphql/queries/me";
import updateCategoriesMutation from "../graphql/mutations/updateCategoriesMutation";
import client from "../constants/client";
import CategoryComponent from "../components/CategoryComponent";
import { Feather } from "@expo/vector-icons";
import AsyncStorage from "@react-native-async-storage/async-storage";

class CategorySettingScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      Email: "",
      username: "",
      LinkedInProfile: "",
      FirstName: "",
      LastName: "",
      tagline: "",
      search: "",
      image: null,
      photoUpdated: Math.random(),
      uploadLoading: false,
      errorMessage: [],
      categories: [],
    };
    this.categoryRef = React.createRef();
  }

  componentDidMount() {
    this.props.navigation.setParams({
      updateProfile: this.updateProfile,
      updateLoading: false,
    });

    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      let categories =
        typeof res.categories !== "undefined" ? res.categories : [];
      this.setState({
        Email: res.email,
        FirstName: res.firstname,
        LastName: res.lastname,
        username: res.username,
        tagline: res.tagline,
        image: res.profile_photo,
        photoUpdated: Math.random(),
        categories: categories,
      });
    });
  }

  saveCategory = () => {
    this.categoryRef.current.saveCategory();
  };

  setUserData = () => {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      let categories =
        typeof res.categories !== "undefined" ? res.categories : [];
      this.setState({
        Email: res.email,
        FirstName: res.firstname,
        LastName: res.lastname,
        tagline: res.tagline,
        image: res.profile_photo,
        photoUpdated: Math.random(),
        categories: categories,
      });
    });
  };

  _getRequestMe = () => {
    this.setState({ uploadLoading: true });
    client
      .query({
        query: me,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        this.setState({ uploadLoading: false });
        if (result.loading === false) {
          AsyncStorage.setItem("me", JSON.stringify(result.data.me)).then(
            (res) => {
              this.setUserData();
            }
          );
          this.setState({
            image: result.data.me.profile_photo,
            photoUpdated: Math.random(),
            uploadLoading: false,
          });
          this.props.navigation.goBack();
        }
      })
      .catch(() => {
        this.setState({ uploadLoading: false });
      });
  };

  setCategory = (categories) => {
    this.setState({ categories, isCategoryShow: false });
    let ids = categories.map(function (a) {
      return a.id;
    });
    client
      .mutate({
        mutation: updateCategoriesMutation,
        variables: {
          categories: ids,
        },
      })
      .then((result) => {
        this._getRequestMe();
      })
      .catch((error) => {});
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: color.whiteColor }}>
        <View style={styles.roundedTextInput}>
          <Feather name="search" size={24} color={color.grayColor} />
          <TextInput
            style={styles.textInput}
            placeholder="Search categories"
            onChangeText={(text) => {
              this.setState({ search: text });
              //this.searchText(text);
            }}
          />
        </View>

        <CategoryComponent
          ref={this.categoryRef}
          _setCategory={this.setCategory}
          categories={this.state.categories}
          uploadLoading={this.state.uploadLoading}
          __closeCategoryModal={() =>
            this.setState({ isCategoryShow: !this.state.isCategoryShow })
          }
          search={this.state.search}
        />
      </View>
    );
  }
}

CategorySettingScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerStyle: {
    shadowOpacity: 0,
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => (
    <Text numberOfLines={1} style={styles.headerPageTitle}>
      Categories
    </Text>
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
  EditProfilePage: {
    flex: 1,
    backgroundColor: "#fff",
    margin: 15,
  },
  TextInput: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
  },
  firstlastName: {
    height: 40,
    backgroundColor: "transparent",
  },
  saveButton: {
    paddingLeft: 10,
    paddingRight: 10,
  },
  roundedTextInput: {
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    height: 40,
    paddingHorizontal: 5,
    marginBottom: 20,
    marginHorizontal: 10,
  },

  textInput: {
    flex: 1,
    paddingLeft: 10,
  },
});

export default CategorySettingScreen;
