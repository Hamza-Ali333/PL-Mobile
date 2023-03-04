import React from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { Divider } from "react-native-paper";
import { Feather } from "@expo/vector-icons";

class InvoiceScreen extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <View style={styles.container}>
        <View style={styles.scrolledView}>
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>18/2021</Text>
            <TouchableOpacity style={styles.probutton}>
              <Feather name="download" size={24} color={color.primaryColor} />
            </TouchableOpacity>
          </View>
          <Divider style={styles.separator} />
          <View
            style={{
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            <Text style={styles.text}>02/2020</Text>
            <TouchableOpacity style={styles.probutton}>
              <Feather name="download" size={24} color={color.primaryColor} />
            </TouchableOpacity>
          </View>
        </View>
      </View>
    );
  }
}

InvoiceScreen.navigationOptions = (screenProps) => ({
  headerTintColor: color.primaryColor,
  headerBackTitleStyle: { fontSize: 18 },
  headerBackTitle: null,
  headerTruncatedBackTitle: null,
  headerForceInset: { top: "never", bottom: "never" },
  headerStyle: {
    shadowOpacity: 0,
    borderBottomColor: "transparent",
    borderWidth: 0,
    height: 70,
    elevation: 0,
  },
  headerTitle: () => <Text style={styles.headerPageTitle}>Invoices</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#f7f7f7",
  },
  scrolledView: {
    backgroundColor: "#fff",
    marginTop: 15,
    padding: 15,
  },
  text: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 16,
  },
  probuttontext: {
    color: color.primaryColor,
    fontFamily: FontFamily.Medium,
    fontSize: 16,
  },
  separator: {
    marginTop: 13,
    marginBottom: 13,
  },
});

export default InvoiceScreen;
