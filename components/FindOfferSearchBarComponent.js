import React from "react";
import {
  TouchableOpacity,
  Text,
  Image,
  Dimensions,
  View,
  StyleSheet,
  TextInput,
  LayoutAnimation,
  UIManager,
  Keyboard
} from "react-native";
import { Chip } from "react-native-paper";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Ionicons, AntDesign } from "@expo/vector-icons";

const width = (Dimensions.get("window").width - 4 * 10) / 2;

class FindOfferSearchBarComponent extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
    };
    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  componentDidMount() {}

  setSearchText = (text) => {
    this.setState({ text });
    if (text === "" || text === null) {
      this.props.screenProps.navigation.getParam("searchText")("");
    }
  };


  doSearch = () => {
    this.props.screenProps.navigation.getParam("searchText")(
        this.state.text
      )
      Keyboard.dismiss();
  }

  render() {
    LayoutAnimation.configureNext({
      duration: 100,
      create: {
        type: LayoutAnimation.Types.linear,
        springDamping: 0,
        property: LayoutAnimation.Properties.scaleX,
      },
    });

    if (this.props.screenProps.navigation.getParam("isSearchBar")) {
      return (
        <View style={styles.searchInputContainer}>
          <TouchableOpacity
            style={styles.search}
            onPress={this.doSearch}
          >
            <AntDesign style={styles.searchIcon} name="search1"></AntDesign>
          </TouchableOpacity>
          <TextInput
            autoFocus={true}
            style={styles.searchTextInput}
            value={this.state.text}
            placeholder="Discover"
            onSubmitEditing={this.doSearch}
            onChangeText={(text) => this.setSearchText(text)}
          />
        </View>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={this.props.screenProps.navigation.getParam(
            "openOfferFilter"
          )}
          style={{
            flex: 1,
            flexDirection: "row",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text style={styles.headerPageTitle}>
            {this.props.screenProps.navigation.getParam("offerFilterText")}
          </Text>
          <Image
            style={{ width: 15, height: 15, resizeMode: "contain" }}
            source={require("../assets/images/colorarrwdown.png")}
          />
        </TouchableOpacity>
      );
    }
  }
}

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Regular,
    fontWeight: "500",
    color: color.primaryColor,
    fontSize: 17,
    marginLeft: 15,
    marginRight: 5,
  },
  searchInputContainer: {
    flex: 1,
  },
  searchIcon: {
    fontSize: 22,
    zIndex: 1,
    color: "#8C8C8C",
  },
  search: {
    position: "absolute",
    right: 5,
    top: 8,
    fontSize: 22,
    zIndex: 1,
    color: "#8C8C8C",
  },
  searchTextInput: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingLeft: 10,
    fontSize: 14,
    height: 40,
    fontFamily: FontFamily.Regular,
    color: "#686D76",
  },
});

export default FindOfferSearchBarComponent;
