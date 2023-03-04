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
import CourseCategoryAccordianChip from "./CourseCategoryAccordianChip";
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
class CourseCategoryAccordian extends React.Component {
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
    let item = [];
    item.push(category);
    this.props.onCategoryChange(item);
  };

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

  toggleExpand = () => {
    // LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
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
    this.setState({ expanded: !this.state.expanded });
  };

  render() {
    return (
      <View>
        <TouchableOpacity
          style={styles.row}
          onPress={() => this.toggleExpand()}
        >
          <Text style={styles.title}>{this.props.item.name}</Text>
          {/* <Icon
            name={
              this.state.expanded
                ? "keyboard-arrow-down"
                : "keyboard-arrow-right"
            }
            size={30}
            color={color.grayColor}
          /> */}
        </TouchableOpacity>
        <View style={styles.parentHr}>
          {this.state.expanded && (
            <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
              <Chip
                onPress={() => this.saveCategory(this.props.item)}
                selected={true}
                style={{
                  backgroundColor: this.props.categories.find(
                    (data) => data.id === this.props.item.id
                  )
                    ? "#cb410b"
                    : color.lightGrayColor,
                  margin: 5,
                  borderRadius: 10,
                  alignItems: "center",
                  height: 35,
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
              {this.props.item.items.map((item, i) => (
                <View
                  key={i}
                  style={{ flexDirection: "row", flexWrap: "wrap" }}
                >
                  <CourseCategoryAccordianChip
                    {...this.props}
                    item={item}
                    items={item.items}
                    parent={this.props.item}
                  />
                </View>
              ))}
            </View>
          )}
        </View>
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
  separator: {
    height: 2,
    backgroundColor: Colors.CGRAY,
    width: "100%",
    marginVertical: 10,
  },
  title: {
    fontSize: 14,
    fontFamily: FontFamily.Medium,
    color: color.grayColor,
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
    height: 55,
    alignItems: "center",
    borderBottomWidth: 1,
    borderColor: color.lightGrayColor,
    paddingHorizontal: 5,
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

export default CourseCategoryAccordian;
