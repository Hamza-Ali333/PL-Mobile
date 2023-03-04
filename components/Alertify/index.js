import React from "react";
import { View, Text } from "react-native";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";
import { List } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

class Alertify extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      alertVisible: false,
      isDismiss: true,
    };
  }

  toggle = (isDismiss = true) => {
    this.setState({
      alertVisible: !this.state.alertVisible,
      isDismiss: isDismiss,
    });
  };

  open = () => {
    this.setState({ alertVisible: true });
  };

  _onDismiss = () => {
    if (this.state.isDismiss) {
      this.props.onDismiss();
    }
  };

  render() {
    return (
      <Dialog
        onDismiss={this._onDismiss}
        dialogStyle={{ borderRadius: 24 }}
        onTouchOutside={() => {
          //this.setState({ alertVisible: false });
        }}
        onHardwareBackPress={() => {
          //this.setState({ alertVisible: false });
        }}
        width={0.7}
        visible={this.state.alertVisible}
        dialogAnimation={new ScaleAnimation()}
        dialogTitle={
          <View style={{ margin: 5 }}>
            <Ionicons
              style={{ textAlign: "center" }}
              name="ios-checkmark-circle-outline"
              size={40}
              color={color.primaryColor}
            />
            <Text
              style={{
                textAlign: "center",
                fontFamily: FontFamily.Regular,
                fontSize: 18,
              }}
            >
              {this.props.title ?? "Question Posted"}
            </Text>
          </View>
        }
      >
        <DialogContent>
          {this.props.description && (
            <Text
              style={{
                fontFamily: FontFamily.Regular,
                textAlign: "center",
                marginBottom: 5,
              }}
            >
              {this.props.description}
            </Text>
          )}
          {this.props.items &&
            this.props.items.map((item, index) => (
              <List.Item
                key={index}
                style={{
                  borderBottomWidth: 1,
                  borderBottomColor: color.lightGrayColor,
                }}
                titleStyle={{ textAlign: "center" }}
                title={item.title ?? ""}
                onPress={item.onPress.bind(this)}
              />
            ))}

          <List.Item
            style={[
              this.props.description
                ? {
                    borderTopWidth: 1,
                    borderTopColor: color.lightGrayColor,
                  }
                : {},
            ]}
            titleStyle={{ color: color.grayColor, textAlign: "center" }}
            onPress={this.toggle}
            title={this.props.closeText ?? "Close"}
          />
        </DialogContent>
      </Dialog>
    );
  }
}

export default Alertify;
