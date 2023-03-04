import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
  Alert,
  Linking,
} from "react-native";
import {
  FontAwesome5,
  AntDesign,
  FontAwesome,
  Ionicons,
} from "@expo/vector-icons";
import color from "../../constants/Colors.js";
import FontFamily from "../../constants/FontFamily.js";
import { List, Checkbox, Divider } from "react-native-paper";
import getCards from "../../graphql/queries/getCards";
import addCardMutation from "../../graphql/mutations/addCardMutation";
import deleteCardMutation from "../../graphql/mutations/deleteCardMutation";
import coursePaymentMutation from "../../graphql/mutations/coursePaymentMutation";
import me from "../../graphql/queries/me";
import { Query } from "react-apollo";
import client from "../../constants/client";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import verifyCouponMutation from "../../graphql/mutations/verifyCouponMutation.js";
import AsyncStorage from "@react-native-async-storage/async-storage";
import getFreeAccess from "../../graphql/mutations/getFreeAccess.js";

class PaymentPlanScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      checked: true,
      terms_conditions: false,
      termsAccordionExpanded: false,
      cardChecked: false,
      cardNumber: "",
      cardName: "",
      expiryDate: "",
      expiryMonth: "",
      expiryYear: "",
      cvvCode: "",
      authUser: {},
      cardId: null,
      refreshing: false,
      cards: null,
      selectedCard: null,
      cardsLength: null,
      course_id: null,
      paymentLoading: false,
      meData: null,
      couponNumber: "",
      couponMessage: "",
      couponErrorStatus: false,
      plan: {},
      radioBtnValue: "Payeezy",
      token: "",
      couponRes: null,
    };
  }

  componentDidMount() {
    this.props.navigation.addListener("didFocus", () => {
      let res;
      AsyncStorage.getItem("me").then((result) => {
        res = JSON.parse(result);
        this.setState({ authUser: res });
      });

      AsyncStorage.getItem("userSession")
        .then((res) => {
          let data = JSON.parse(res);
          this.setState({ token: data.token });
        })
        .catch(() => {});
    });
  }

  numberChange = (text) => {
    this.setState({
      cardNumber: text,
    });
  };

  nameChange = (text) => {
    this.setState({
      cardName: text,
    });
  };

  expiryChange = (text) => {
    this.setState({
      expiryDate:
        text.length === 3 && !text.includes("/")
          ? `${text.substring(0, 2)}/${text.substring(2)}`
          : text,
      expiryMonth: text.substring(0, 2),
      expiryYear: text.substr(text.length - 2),
    });
  };

  cvvChange = (text) => {
    this.setState({
      cvvCode: text,
    });
  };

  toggleTermsAccordion() {
    this.setState({
      termsAccordionExpanded: !this.state.termsAccordionExpanded,
    });
  }

  _choosen(selectedItem, item) {
    this.setState({ selectedItem });
    this.setState({ selectedCard: item });
  }

  renderItem = ({ item, index }, length) => {
    const isSelected = this.state.selectedItem === item.card_id;
    const backgroundColor = isSelected
      ? "rgba(255, 134, 53,.3)"
      : color.lightGrayColor;
    const imageColor = isSelected ? color.primaryColor : color.blackColor;
    const textColor = isSelected ? color.whiteColor : color.grayColor;

    var lastFour = item.card_number.substr(item.card_number.length - 4);
    return (
      <TouchableOpacity
        onPress={() => this._choosen(item.card_id, item)}
        underlayColor={"#ffffff"}
        style={[
          styles.boxShadow,
          styles.listpanel,
          { justifyContent: "space-between", backgroundColor },
        ]}
      >
        <TouchableOpacity
          style={styles.closeIcon}
          onPress={() => this.deleteCardAlert(item.card_id, index, length)}
        >
          <AntDesign name="closecircle" size={20} color="red" />
        </TouchableOpacity>
        <View style={{ flexDirection: "row", alignItems: "center" }}>
          <FontAwesome5
            style={{ marginRight: 15 }}
            name="cc-visa"
            size={42}
            color={imageColor}
          />
          <View>
            <Text style={styles.boldText}>{item.card_holder_name}</Text>
            <Text style={[styles.grayText, { color: textColor }]}>
              **** **** **** {lastFour}{" "}
            </Text>
          </View>
        </View>
        <View style={{ alignItems: "center" }}>
          <Text style={[styles.grayText, { color: textColor }]}>Exp. </Text>
          <Text style={[styles.grayText, { color: textColor }]}>
            {item.expiry_month}/{item.expiry_year}{" "}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  renderCards = () => {
    return (
      <Query query={getCards}>
        {({ loading, error, data }) => {
          let length;
          if (data !== undefined) {
            length = data.me.cards.data.length;
          }

          refetch();
          if (loading)
            return (
              <View>
                <ActivityIndicator size="small" color={color.primaryColor} />
              </View>
            );
          if (error)
            return (
              <View
                style={{
                  alignItems: "center",
                  flex: 1,
                  flexDirection: "column",
                }}
              >
                <View
                  style={{
                    alignItems: "center",
                  }}
                >
                  <Text>Could not Load entered cars.</Text>
                </View>
              </View>
            );
          if (data !== undefined) {
            return (
              <FlatList
                data={data.me.cards.data}
                renderItem={({ item, index }) =>
                  this.renderItem({ item, index }, length)
                }
                showsVerticalScrollIndicator={false}
                keyExtractor={(item) => ` ${item.id}`}
              />
            );
          }
        }}
      </Query>
    );
  };

  addCard = () => {
    client.mutate({
      mutation: addCardMutation,
      variables: {
        card_holder_name: this.state.cardName,
        expiry_month: this.state.expiryMonth,
        expiry_year: this.state.expiryYear,
        card_number: this.state.cardNumber,
        card_cvv: this.state.cvvCode,
        // card_type: String,
      },
    });
  };

  deleteCardAlert = (id, index, length) => {
    if (length > 1) {
      Alert.alert("Card Delete!!", "Do you want to delete card?", [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => this.deleteCard(id) },
      ]);
    } else {
      Alert.alert("Cannot Delete!", "There should be atleast one card?", [
        { text: "OK", onPress: () => console.log("Cancel Pressed") },
      ]);
    }
  };

  deleteCard = (id) => {
    client.mutate({
      mutation: deleteCardMutation,
      variables: {
        card_id: id,
      },
      optimisticResponse: {
        __typename: "Mutation",
        destroy_client_card: {
          __typename: "Response",
          message: "",
        },
      },
      update: (cache, { data: { deleteCard } }) => {
        const data = cache.readQuery({
          query: getCards,
        });
        const index = data.me.cards.data.findIndex(
          (data) => data.card_id === id
        );
        if (index > -1) {
          data.me.cards.data.splice(index, 1);
        }
        cache.writeQuery({ query: getCards, data });
      },
    });
  };

  setUserData = () => {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
    });
  };

  _getRequestMe = () => {
    client
      .query({
        query: me,
        fetchPolicy: "network-only",
      })
      .then((result) => {
        this.setState({ uploadLoading: false });
        if (result.loading === false) {
          this.setState({
            meData: result.data.me,
          });
          AsyncStorage.setItem("me", JSON.stringify(result.data.me)).then(
            (res) => {
              this.setUserData();
            }
          );
        }
      });
  };

  onChangeCoupon = (text) => {
    this.setState({
      couponNumber: text,
    });
  };

  applyCoupon = () => {
    const { couponNumber } = this.state;
    const plan = this.props.navigation.getParam("item");

    if (couponNumber === "") {
      Alert.alert("Please enter a valid coupon Number");
    } else {
      // return new Promise((resolve) => {
      client
        .mutate({
          mutation: verifyCouponMutation,
          variables: {
            package_id: plan.id,
            coupon_code: couponNumber,
          },
        })
        .then((result) => {
          console.log("result", result);
          this.setState({
            couponMessage: result.data.coupen_check_web.message,
            couponErrorStatus: result.data.coupen_check_web.error,
            couponRes: result.data.coupen_check_web,
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
      // });
    }
  };

  processPayment = (package_id = null) => {
    const { selectedCard } = this.state;
    let card_holder_name = null;
    let expiry_month = null;
    let expiry_year = null;
    let card_number = null;
    let card_cvv = null;
    let card_type = null;
    let card_id = null;
    let course_id = this.state.course_id;
    let coupon_code = this.state.couponNumber;

    if (selectedCard !== null) {
      card_holder_name = selectedCard.card_holder_name;
      expiry_month = selectedCard.expiry_month;
      expiry_year = selectedCard.expiry_year;
      card_number = selectedCard.card_number;
      card_cvv = selectedCard.card_cvv;
      card_type = selectedCard.card_type;
      card_id = selectedCard.card_id;
    } else {
      card_holder_name = this.state.cardName;
      expiry_month = this.state.expiryMonth;
      expiry_year = this.state.expiryYear;
      card_number = this.state.cardNumber;
      card_cvv = this.state.cvvCode;
      card_type = "visa";
    }
    if (package_id === null) {
      const { plan } = this.state;
      course_id = plan.course_id;
      package_id = plan.price;
    }
    if (card_holder_name !== null && card_holder_name !== "") {
      if (
        this.state.couponNumber === "" ||
        this.state.couponErrorStatus === false
      ) {
        if (this.state.couponNumber === "") {
          this.setState({ paymentLoading: true });
          client
            .mutate({
              mutation: coursePaymentMutation,
              variables: {
                card_holder_name,
                expiry_month,
                expiry_year,
                card_number,
                card_cvv,
                card_type,
                card_id,
                package_id,
                course_id,
                coupon_code,
              },
            })
            .then((results) => {
              this.setState({ paymentLoading: false });
              if (results.data.add_client_card.status === 400) {
                Alert.alert(
                  "Payment Failed!",
                  `${results.data.add_client_card.error_description}`,
                  [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                );
              } else if (
                results.data.add_client_card.transaction_status === "declined"
              ) {
                Alert.alert("Payment Failed!", "Invalid card!", [
                  {
                    text: "OK",
                    onPress: () => console.log(`Invalid card attached`),
                  },
                ]);

                // this._getRequestMe();
              } else if (
                results.data.add_client_card.transaction_status === "approved"
              ) {
                Alert.alert(
                  "Payment is successful!",
                  "Thank you. You can now enroll in any course and get access to any class you like!",
                  [
                    {
                      text: "OK",
                      onPress: () =>
                        this.props.navigation.navigate("ProcureClasses"),
                    },
                  ]
                );

                this._getRequestMe();
              }
            })
            .catch((error) => {});
        } else {
          if (this.state.couponMessage === "") {
            Alert.alert("Verify Coupon Using Apply Button!");
          } else {
            this.setState({ paymentLoading: true });
            client
              .mutate({
                mutation: coursePaymentMutation,
                variables: {
                  card_holder_name,
                  expiry_month,
                  expiry_year,
                  card_number,
                  card_cvv,
                  card_type,
                  card_id,
                  package_id,
                  course_id,
                  coupon_code,
                },
              })
              .then((results) => {
                this.setState({ paymentLoading: false });
                if (results.data.add_client_card.status === 400) {
                  Alert.alert(
                    "Payment Failed!",
                    `${results.data.add_client_card.error_description}`,
                    [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                  );
                } else if (
                  results.data.add_client_card.transaction_status === "declined"
                ) {
                  Alert.alert("Payment Failed!", "Invalid card!", [
                    {
                      text: "OK",
                      onPress: () => console.log(`Invalid card attached`),
                    },
                  ]);

                  // this._getRequestMe();
                } else if (
                  results.data.add_client_card.transaction_status === "approved"
                ) {
                  Alert.alert(
                    "Payment is successful!",
                    "Thank you. You can now enroll in any course and get access to any class you like!",
                    [
                      {
                        text: "OK",
                        onPress: () =>
                          this.props.navigation.navigate("ProcureClasses"),
                      },
                    ]
                  );

                  this._getRequestMe();
                }
              })
              .catch((error) => {});
          }
        }
      } else {
        Alert.alert("Apply a valid coupon");
      }
    } else {
      Alert.alert("Card not selected!", "Please select a valid card.", [
        { text: "OK", onPress: () => console.log("OK Pressed") },
      ]);
    }
  };

  submitPayments = (id) => {
    const plan = this.props.navigation.getParam("item");

    plan.type == "Additional Resources"
      ? this.setState({ plan: plan }, this.processPayment)
      : this.processPayment(id);
  };

  getFreeAccess = () => {
    const { couponRes, couponNumber } = this.state;
    const plan = this.props.navigation.getParam("item");

    console.log("plan.id", plan.id);
    console.log(
      " plan.type",
      plan.type === "Additional Resources" ? "PRODUCT" : "COURSE"
    );
    console.log("coupon_code", couponNumber);
    console.log("discount", couponRes.discount);
    console.log("amount", couponRes.amount);

    this.setState({ paymentLoading: true });
    client
      .mutate({
        mutation: getFreeAccess,
        variables: {
          orderIdOrPlainId: plan.id,
          order_type:
            plan.type === "Additional Resources" ? "PRODUCT" : "COURSE",
          coupon_code: couponNumber,
          discount: couponRes.discount,
          amount: couponRes.amount,
        },
      })
      .then((res) => {
        this.setState({ paymentLoading: false });
        console.log("res", res);
        Alert.alert("Payment is successful!", "Thank you.", [
          {
            text: "OK",
            onPress: () => this.props.navigation.navigate("ProcureClasses"),
          },
        ]);

        this._getRequestMe();
      })
      .catch((err) => {
        this.setState({ paymentLoading: false });
        console.log("err", err);
      });
  };

  render() {
    const { checked, terms_conditions, termsAccordionExpanded, couponRes } =
      this.state;
    const plan = this.props.navigation.getParam("item");

    const discountedAmount =
      couponRes && couponRes.error === false && couponRes.amount;

    console.log("discountedAmount", discountedAmount);

    console.log("plan", plan);

    return (
      <>
        <KeyboardAwareScrollView
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
              <View style={[styles.boxShadow, styles.planWrap]}>
                <Text style={styles.planName}>{plan.name}</Text>
                <View
                  style={{
                    flex: 1,
                    flexDirection: "row",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text style={styles.text}>You have to pay</Text>
                    <Text style={[styles.heading, { fontSize: 30 }]}>
                      {discountedAmount !== null &&
                      discountedAmount !== false &&
                      discountedAmount > -1
                        ? discountedAmount
                        : plan.price}
                      <Text style={styles.text}>
                        .00 USD
                        {plan.type == "Additional Resources" ? (
                          <Text style={styles.grayText}>
                            {/* /{plan.validity === "M" ? "Month" : "Year"} */}
                          </Text>
                        ) : (
                          <Text style={styles.grayText}>
                            /{plan.validity === "M" ? "Month" : "Year"}
                          </Text>
                        )}
                      </Text>
                    </Text>
                  </View>
                  <View
                    style={{
                      flex: 1,
                      justifyContent: "center",
                      backgroundColor: "#fff",
                    }}
                  >
                    <TouchableOpacity
                      onPress={() => {
                        terms_conditions
                          ? Linking.openURL(
                              this.state.token &&
                                `https://web.procurementleague.com/${
                                  plan.course_id
                                    ? plan.course_id
                                    : "subscription"
                                }/${plan.price}/${plan.name}/${
                                  plan.__typename === "Plan" ? false : true
                                }/${
                                  plan.__typename === "Plan"
                                    ? "subscription"
                                    : "item_based"
                                }/${this.state.token}/Google-Pay`
                            )
                          : Alert.alert("Accept Terms and Conditions!");
                      }}
                      style={[
                        styles.fillbtn,
                        {
                          backgroundColor: terms_conditions
                            ? color.primaryColor
                            : color.grayColor,
                        },
                      ]}
                    >
                      <Text style={styles.fillbtnText}>Pay with google</Text>
                      <Ionicons
                        style={styles.fillbtnIcon}
                        name="ios-arrow-forward"
                        size={20}
                        color="#fff"
                      />
                    </TouchableOpacity>
                  </View>
                </View>

                <>
                  <Divider style={styles.separator} />
                  <View>
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <TextInput
                        style={styles.textInputCoupn}
                        placeholder="Coupon Number"
                        onChangeText={(text) => this.onChangeCoupon(text)}
                      />
                      <TouchableOpacity
                        style={styles.outlinebtn}
                        onPress={this.applyCoupon}
                      >
                        <Text
                          style={[
                            styles.fillbtnText,
                            { color: color.primaryColor },
                          ]}
                        >
                          Apply
                        </Text>
                      </TouchableOpacity>
                    </View>
                  </View>
                </>

                {this.state.couponErrorStatus ? (
                  <Text style={{ color: "red" }}>
                    * {this.state.couponMessage}
                  </Text>
                ) : (
                  <Text>{this.state.couponMessage}</Text>
                )}
              </View>

              {/* <View style={styles.radioViewStyle}>
                <RadioButton.Group
                  onValueChange={(newValue) => {
                    this.setState({ radioBtnValue: newValue });
                  }}
                  value={this.state.radioBtnValue}
                >
                  <Image
                    source={require("../../assets/images/payeezy.png")}
                    style={{ height: 27, width: 27, alignSelf: "center" }}
                  />
                  <RadioButton.Item
                    value="Payeezy"
                    label="Payeezy"
                    status={"checked"}
                    color={color.primaryColor}
                  />
                  <Image
                    source={require("../../assets/images/razorpay.png")}
                    style={{ height: 40, width: 40, alignSelf: "center" }}
                  />
                  <RadioButton.Item
                    style={{
                      width: 100,
                      marginRight: 70,
                    }}
                    value="Razorpay"
                    label="Razorpay"
                    color={color.primaryColor}
                  />
                </RadioButton.Group>
              </View> */}

              {this.state.radioBtnValue == "Payeezy" ? (
                <>
                  {couponRes &&
                  couponRes.discount &&
                  couponRes.discount == 100 ? (
                    false
                  ) : (
                    <>
                      {/* {this.renderCards()} */}
                      <List.Section style={[styles.boxShadow, styles.accodion]}>
                        <List.Accordion
                          style={{ padding: 8 }}
                          titleStyle={{
                            fontFamily: FontFamily.Regular,
                            fontSize: 16,
                            color: color.primaryColor,
                          }}
                          title={`Add new ${"visa"} card`}
                          left={(props) => (
                            <AntDesign
                              name="plus"
                              size={20}
                              color={color.primaryColor}
                            />
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
                                  keyboardType="number-pad"
                                  style={{ paddingLeft: 10, flex: 1 }}
                                  maxLength={16}
                                  placeholder="**** **** **** 3265"
                                  onChangeText={(text) =>
                                    this.numberChange(text)
                                  }
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
                                  onChangeText={(text) => this.nameChange(text)}
                                />
                              </View>
                            </View>
                            <View style={{ flexDirection: "row" }}>
                              <View style={{ flex: 1, marginRight: 5 }}>
                                <Text style={styles.labelText}>
                                  Expiry Date
                                </Text>
                                <View style={styles.textInput}>
                                  <TextInput
                                    style={{ flex: 1 }}
                                    placeholder="MM/YYYY"
                                    value={this.state.expiryDate}
                                    maxLength={7}
                                    onChangeText={(text) =>
                                      this.expiryChange(text)
                                    }
                                  />
                                </View>
                              </View>
                              <View style={{ flex: 1, marginLeft: 5 }}>
                                <Text style={styles.labelText}>CVV Code</Text>
                                <View style={styles.textInput}>
                                  <TextInput
                                    style={{ flex: 1 }}
                                    placeholder="CVV Code"
                                    onChangeText={(text) =>
                                      this.cvvChange(text)
                                    }
                                  />
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
                              <Text style={styles.text}>
                                Remember this card
                              </Text>
                            </View>
                          </View>
                        </List.Accordion>
                      </List.Section>
                    </>
                  )}

                  <List.Section style={[styles.boxShadow, styles.accodion]}>
                    <List.Accordion
                      style={{ padding: 8 }}
                      titleStyle={{
                        fontFamily: FontFamily.Regular,
                        fontSize: 16,
                        color: color.primaryColor,
                      }}
                      title="Terms and Conditions"
                      left={(props) => (
                        <FontAwesome5
                          name="file-signature"
                          size={16}
                          color={color.primaryColor}
                        />
                      )}
                      expanded={termsAccordionExpanded}
                      onPress={() => this.toggleTermsAccordion()}
                    >
                      <View style={styles.addCard}>
                        <Text style={styles.labelText}>
                          All sales are final
                        </Text>
                        <Text style={styles.termsText}>
                          Procurement League and its subsidiaries reserve the
                          right to accept or decline any request for a refund.
                        </Text>
                      </View>
                    </List.Accordion>
                  </List.Section>

                  <View
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      marginBottom: 13,
                    }}
                  >
                    <Checkbox.Android
                      color={color.primaryColor}
                      status={terms_conditions ? "checked" : "unchecked"}
                      onPress={() => {
                        this.setState({
                          terms_conditions: !terms_conditions,
                        });
                      }}
                    />
                    <Text style={styles.text}>Agree Terms and Conditions</Text>
                  </View>
                </>
              ) : (
                <View
                  style={{
                    height: 100,
                    justifyContent: "center",
                  }}
                >
                  <Text style={{ textAlign: "center" }}>
                    Razorpay Payment Link will be show here!
                  </Text>
                </View>
              )}
            </View>
          </View>

          {this.state.radioBtnValue == "Payeezy" ? (
            <TouchableOpacity
              disabled={terms_conditions ? false : true}
              style={[
                styles.fillbtn,
                {
                  backgroundColor: terms_conditions
                    ? color.primaryColor
                    : color.grayColor,
                },
              ]}
              onPress={() => {
                if (
                  plan.type == "Additional Resources" &&
                  plan.is_shippable == true
                ) {
                  if (
                    this.state.selectedCard != null ||
                    this.state.cardName != ""
                  ) {
                    if (
                      this.state.authUser.description === null ||
                      this.state.authUser.address === null
                    ) {
                      Alert.alert(
                        "Profile not completed",
                        "Please complete your profile to pay & proceed",
                        [
                          {
                            text: "Cancel",
                            onPress: () =>
                              console.log(
                                "Cancel Pressed For Profile Completion"
                              ),
                            style: "cancel",
                          },
                          {
                            text: "OK",
                            onPress: () =>
                              this.props.navigation.navigate("EditProfile", {
                                type: plan.type,
                              }),
                          },
                        ]
                      );
                    } else {
                      this.submitPayments(
                        plan.type == "Additional Resources"
                          ? plan.price
                          : plan.id
                      );
                    }
                  } else if (discountedAmount === 0) {
                    this.getFreeAccess();
                  } else {
                    Alert.alert(
                      "Card not selected!",
                      "Please select/add a valid card.",
                      [{ text: "OK", onPress: () => console.log("OK Pressed") }]
                    );
                  }
                } else {
                  discountedAmount === 0
                    ? this.getFreeAccess()
                    : this.submitPayments(
                        plan.type == "Additional Resources"
                          ? discountedAmount > 0
                            ? discountedAmount
                            : plan.price
                          : plan.id
                      );
                }
              }}
            >
              {this.state.paymentLoading ? (
                <ActivityIndicator size="small" color={color.whiteColor} />
              ) : (
                <>
                  <Text style={styles.fillbtnText}>Pay & proceed</Text>
                  <Ionicons
                    style={styles.fillbtnIcon}
                    name="ios-arrow-forward"
                    size={20}
                    color="#fff"
                  />
                </>
              )}
            </TouchableOpacity>
          ) : (
            false
          )}
        </KeyboardAwareScrollView>
      </>
    );
  }
}

PaymentPlanScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => null,
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    textAlign: "center",
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
  separator: {
    marginTop: 13,
    marginBottom: 13,
  },
  planName: {
    fontFamily: FontFamily.Bold,
    color: color.primaryColor,
    fontSize: 25,
    textAlign: "center",
    marginBottom: 10,
  },
  planWrap: {
    paddingTop: 20,
    paddingBottom: 20,
    padding: 10,
    borderRadius: 10,
    backgroundColor: color.lightGrayColor,
  },
  listpanel: {
    marginTop: 13,
    flexDirection: "row",
    alignItems: "center",
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
    margin: 10,
  },
  labelText: {
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    fontSize: 16,
    marginBottom: 4,
  },
  termsText: {
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    fontSize: 13,
    marginBottom: 8,
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
  textInputCoupn: {
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
    borderRadius: 6,
    height: 40,
    flex: 1,
    marginRight: 10,
  },
  fillbtn: {
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
  },
  outlinebtn: {
    padding: 10,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: color.primaryColor,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "center",
    margin: 10,
  },
  fillbtnText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: FontFamily.Medium,
  },
  fillbtnIcon: {
    marginLeft: 10,
  },
  radioViewStyle: {
    height: 50,
    marginTop: 15,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default PaymentPlanScreen;
