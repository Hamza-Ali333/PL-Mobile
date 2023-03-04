import React, { Component } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
} from "react-native";
import {
  FontAwesome5,
  Entypo,
  AntDesign,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { List, Checkbox, Avatar } from "react-native-paper";

class MemberhsipScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
    };
  }
  render() {
    const navigation = this.state;
    const { checked } = this.state;
    return (
      <ScrollView
        contentContainerStyle={{ flexGrow: 1 }}
        showsVerticalScrollIndicator={false}
      >
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
            paddingLeft: 10,
            paddingRight: 10,
          }}
        >
          <View>
            <View style={{ alignItems: "center" }}>
              <Avatar.Image
                size={58}
                style={{ resizeMode: "cover", marginBottom: 12 }}
                source={{
                  uri: "https://images.all-free-download.com/images/graphiclarge/winter_woman_in_red_200707.jpg",
                }}
              />
              <Text style={styles.boldText}>Hi' Martha Rojas</Text>
              <View style={styles.spacing} />
              <Text style={styles.heading}>Basic Membership</Text>
              <View style={styles.spacing} />
              <Text style={styles.text}>Valid 23 Dec, 2019 </Text>
            </View>
            <View style={[styles.boxShadow, styles.listpanel]}>
              <Entypo
                style={{ marginRight: 15 }}
                name="tablet-mobile-combo"
                size={24}
                color={color.primaryColor}
              />
              <Text style={styles.boldText}>
                27 days left <Text style={styles.text}>in membership </Text>
              </Text>
            </View>
            <View
              style={[
                styles.boxShadow,
                styles.listpanel,
                { justifyContent: "space-between" },
              ]}
            >
              <TouchableOpacity style={styles.closeIcon}>
                <AntDesign name="closecircle" size={20} color="red" />
              </TouchableOpacity>
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <FontAwesome5
                  style={{ marginRight: 15 }}
                  name="cc-visa"
                  size={42}
                  color={color.primaryColor}
                />
                <View>
                  <Text style={styles.boldText}>Loarwance Norman </Text>
                  <Text style={styles.grayText}>**** **** **** *856 </Text>
                </View>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text style={styles.grayText}>Exp. </Text>
                <Text style={styles.grayText}>05/2022 </Text>
              </View>
            </View>
            <List.Section style={[styles.boxShadow, styles.accodion]}>
              <List.Accordion
                style={{ padding: 8 }}
                titleStyle={{
                  fontFamily: FontFamily.Regular,
                  fontSize: 16,
                  color: color.primaryColor,
                }}
                title="Add New Card"
                left={(props) => (
                  <AntDesign name="plus" size={20} color={color.primaryColor} />
                )}
              >
                <View style={styles.addCard}>
                  <View style={{ marginBottom: 13 }}>
                    <Text style={styles.labelText}>Add Number</Text>
                    <View style={styles.textInput}>
                      <FontAwesome5
                        name="cc-visa"
                        size={18}
                        color={color.primaryColor}
                      />
                      <TextInput
                        style={{ paddingLeft: 10, flex: 1 }}
                        placeholder="**** **** **** 3265"
                      />
                    </View>
                  </View>
                  <View style={{ marginBottom: 13 }}>
                    <Text style={styles.labelText}>Name on Card</Text>
                    <View style={styles.textInput}>
                      <FontAwesome
                        name="user-circle-o"
                        size={18}
                        color={color.primaryColor}
                      />
                      <TextInput
                        style={{ paddingLeft: 10, flex: 1 }}
                        placeholder="Name on Card"
                      />
                    </View>
                  </View>
                  <View style={{ flexDirection: "row" }}>
                    <View style={{ flex: 1, marginRight: 5 }}>
                      <Text style={styles.labelText}>Expiry Date</Text>
                      <View style={styles.textInput}>
                        <TextInput
                          style={{ flex: 1 }}
                          placeholder="Expiry Date"
                        />
                      </View>
                    </View>
                    <View style={{ flex: 1, marginLeft: 5 }}>
                      <Text style={styles.labelText}>CVV Code</Text>
                      <View style={styles.textInput}>
                        <TextInput style={{ flex: 1 }} placeholder="CVV Code" />
                      </View>
                    </View>
                  </View>
                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 13,
                    }}
                  >
                    <Checkbox.Android
                      color={color.primaryColor}
                      status={checked ? "checked" : "unchecked"}
                      onPress={() => {
                        this.setState({ checked: !checked });
                      }}
                    />
                    <Text style={styles.text}>Remember this card</Text>
                  </View>
                  <TouchableOpacity style={styles.fillbtn}>
                    <Text style={styles.fillbtnText}>Pay & proceed</Text>
                    <Ionicons name="ios-arrow-forward" size={20} color="#fff" />
                  </TouchableOpacity>
                </View>
              </List.Accordion>
            </List.Section>
          </View>
        </View>
      </ScrollView>
    );
  }
}

MemberhsipScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Membership</Text>,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.2,
    shadowRadius: 1.41,
    elevation: 2,
  },
  text: {
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 16,
  },
  boldText: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 16,
  },
  grayText: {
    fontFamily: FontFamily.Regular,
    color: color.grayColor,
    fontSize: 16,
  },
  heading: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 18,
  },
  listpanel: {
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 12,
    borderRadius: 10,
    backgroundColor: color.lightGrayColor,
  },
  accodion: {
    marginTop: 13,
    borderRadius: 10,
    backgroundColor: color.lightGrayColor,
  },
  spacing: {
    height: 6,
  },
  closeIcon: {
    position: "absolute",
    right: 0,
    top: -6,
  },
  addCard: {
    paddingLeft: 0,
    margin: 20,
  },
  labelText: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 16,
    marginBottom: 4,
  },
  textInput: {
    backgroundColor: "#fff",
    flexDirection: "row",
    alignItems: "center",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
    height: 40,
  },
  fillbtn: {
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  fillbtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FontFamily.Medium,
    marginRight: 10,
  },
});

export default MemberhsipScreen;
