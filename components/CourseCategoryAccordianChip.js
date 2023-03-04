import React from "react";
import {
  View,
  TouchableOpacity,
  Text,
  FlatList,
  StyleSheet,
  LayoutAnimation,
  Platform,
  UIManager,
} from "react-native";
// import Icon from "react-native-vector-icons/MaterialIcons";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import { Chip } from "react-native-paper";
const Colors = {
  PRIMARY: "#1abc9c",

  WHITE: "#ffffff",
  LIGHTGREEN: "#BABABA",
  GREEN: "#0da935",

  GRAY: "#f7f7f7",
  LIGHTGRAY: "#C7C7C7",
  DARKGRAY: "#5E5E5E",
  CGRAY: "#ececec",
  OFFLINE_GRAY: "#535353",
};
class CourseCategoryAccordianChip extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
    };

    if (Platform.OS === "android") {
      UIManager.setLayoutAnimationEnabledExperimental(true);
    }
  }

  saveCategory = (category) => {
    let { categories } = this.props;
    let found = categories.find((data) => data.id === category.id);
    if (!found) {
      categories.push(category);
    } else {
      categories = categories.filter((data) => data.id !== category.id);
    }
    this.props.onCategoryChange(categories);
  };

  componentDidMount() {
    let expanded = this.props.categories.find(
      (data) => data.id === this.props.item.id
    )
      ? true
      : false;
    this.setState({ expanded });
  }

  UNSAFE_componentWillReceiveProps(nextProps) {
    let expanded = nextProps.categories.find(
      (data) => data.id === this.props.item.id
    )
      ? true
      : false;
    this.setState({ expanded });
  }
  onClick = (index) => {
    const temp = this.state.data.slice();
    temp[index].value = !temp[index].value;
    this.setState({ data: temp });
  };

  toggleExpand = (category) => {
    let categories = [];
    categories.push(this.props.parent);
    categories.push(category);
    this.props.onCategoryChange(categories);
    LayoutAnimation.configureNext(LayoutAnimation.Presets.spring);
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    return (
      <View
        style={{
          // flex: 1,
          flexDirection: "row",
          flexWrap: "wrap",
        }}
      >
        <Chip
          onPress={() => this.toggleExpand(this.props.item)}
          style={{
            backgroundColor: this.props.categories.find(
              (data) => data.id === this.props.item.id
            )
              ? "#fd5800"
              : "#F3F5FB",
            margin: 5,
            borderRadius: 10,
          }}
          textStyle={{
            color: this.props.categories.find(
              (data) => data.id === this.props.item.id
            )
              ? color.whiteColor
              : color.grayColor,
            fontFamily: FontFamily.Regular,
          }}
        >
          {this.props.item.name}
        </Chip>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    width: "100%",
    height: 54,
    alignItems: "center",
    paddingLeft: 35,
    paddingRight: 35,
    fontSize: 12,
  },
  title: {
    fontSize: 14,
    fontWeight: "bold",
    color: Colors.DARKGRAY,
  },
  separator: {
    height: 2,
    backgroundColor: Colors.CGRAY,
    width: "100%",
    marginVertical: 10,
  },
  itemActive: {
    fontSize: 12,
    color: Colors.GREEN,
  },
  itemInActive: {
    fontSize: 12,
    color: Colors.DARKGRAY,
  },
  btnActive: {
    borderColor: Colors.GREEN,
  },
  btnInActive: {
    borderColor: Colors.DARKGRAY,
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    height: 56,
    paddingLeft: 25,
    paddingRight: 18,
    alignItems: "center",
    borderWidth: 1,
    borderColor: Colors.GRAY,
  },
  childRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: Colors.GRAY,
  },
  parentHr: {
    flexDirection: "row",
    flexWrap: "wrap",
  },
  childHr: {
    height: 1,
    backgroundColor: Colors.LIGHTGRAY,
    width: "100%",
  },
  colorActive: {
    borderColor: Colors.GREEN,
  },
  colorInActive: {
    borderColor: Colors.DARKGRAY,
  },
});

export default CourseCategoryAccordianChip;
