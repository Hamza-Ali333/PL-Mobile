import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { Avatar } from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { List, Checkbox } from "react-native-paper";

class ActivityHeader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: 1
    };
  }

  componentDidMount() {
    this.setState({ checked: this.props._notify_type });
  }

  handleChange = value => {
    let { checked } = this.state;
    checked = value;

    this.setState({ checked });
    this.props._applyFilter(checked);
  };

  render() {
    const { checked } = this.state;
    return (
      <View style={{ backgroundColor: "#fff" }}>
        <List.Item
          onPress={() => this.handleChange(1)}
          style={styles.BottomOptionListItems}
          titleStyle={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: FontFamily.Regular,
            color: "#7B7B7B"
          }}
          title="All Activity"
          right={props => (
            <Checkbox
              status={checked === 1 ? "checked" : ""}
              color={color.primaryColor}
              style={styles.TopicPageCheckboxes}
            />
          )}
        />
        <List.Item
          onPress={() => this.handleChange(2)}
          style={styles.BottomOptionListItems}
          titleStyle={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: FontFamily.Regular,
            color: "#7B7B7B"
          }}
          title="Likes"
          right={props => (
            <Checkbox
              status={checked === 2 ? "checked" : ""}
              color={color.primaryColor}
              style={styles.TopicPageCheckboxes}
            />
          )}
        />
        <List.Item
          onPress={() => this.handleChange(3)}
          style={styles.BottomOptionListItems}
          titleStyle={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: FontFamily.Regular,
            color: "#7B7B7B"
          }}
          title="Answers"
          right={props => (
            <Checkbox
              status={checked === 3 ? "checked" : ""}
              color={color.primaryColor}
              style={styles.TopicPageCheckboxes}
            />
          )}
        />
        <List.Item
          onPress={() => this.handleChange(4)}
          style={styles.BottomOptionListItems}
          titleStyle={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: FontFamily.Regular,
            color: "#7B7B7B"
          }}
          title="Comments"
          right={props => (
            <Checkbox
              status={checked === 4 ? "checked" : ""}
              color={color.primaryColor}
              style={styles.TopicPageCheckboxes}
            />
          )}
        />
        <List.Item
          onPress={() => this.handleChange(5)}
          style={styles.BottomOptionListItems}
          titleStyle={{
            fontSize: 16,
            fontWeight: "400",
            fontFamily: FontFamily.Regular,
            color: "#7B7B7B"
          }}
          title="Followers"
          right={props => (
            <Checkbox
              status={checked === 5 ? "checked" : ""}
              color={color.primaryColor}
              style={styles.TopicPageCheckboxes}
            />
          )}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15
  },
  TopicPageCheckboxes: {
    marginRight: 20
  }
});

export default ActivityHeader;
