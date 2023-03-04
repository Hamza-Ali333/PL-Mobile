import React, { Component } from "react";
import { StyleSheet, View, Text } from "react-native";
import { Picker } from "@react-native-community/picker";
import color from "../constants/Colors";

export default class PickerComponent extends Component {
  state = { pickerValue: "" };
  UpdateState = (pickerValue) => {
    this.setState({ pickerValue: pickerValue });
    this.props.onSelect(pickerValue);
  };

  render() {
    const { textSize, nameText, marginBottom } = this.props;
    return (
      <View style={styles.pickerStyle}>
        <Picker
          selectedValue={
            this.state.pickerValue
              ? this.state.pickerValue
              : this.props.initialValue
          }
          onValueChange={this.UpdateState}
          style={{ height: 60 }}
        >
          {this.props?.items?.map((item) => (
            <Picker.Item label={item.label} value={item.value} />
          ))}
        </Picker>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  pickerStyle: {
    height: 60,
    width: "100%",
    alignSelf: "center",
    borderRadius: 6,
    backgroundColor: color.lightGrayColor,
  },
});
