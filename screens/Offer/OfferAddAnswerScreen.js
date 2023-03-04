import React from "react";
import {
  Alert,
  ActivityIndicator,
  Dimensions,
  RefreshControl,
  Button,
  Text,
  TouchableOpacity,
  View,
  StyleSheet,
  FlatList,
  TextInput,
  Image,
  ScrollView,
} from "react-native";
import { FontAwesome } from "@expo/vector-icons";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Query } from "react-apollo";

import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import getOfferQuestionAnswer from "../../graphql/queries/getOfferQuestionAnswer";
import updateOfferAnswerMutation from "../../graphql/mutations/updateOfferAnswerMutation";
import client from "../../constants/client";
import { requestMiddleware } from "../../components/CombineFunction";

const screenHeight = Dimensions.get("window").width;
class OfferAddQuestionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      text: "",
      data: [],
      height: [],
      filterText: "1",
      totalQuestion: "0",
    };
    this.refetch;
    this.data = [];
    this.height = [];
  }

  componentDidMount() {
    this.props.navigation.setParams({ filterText: this.state.filterText });
    this.props.navigation.setParams({
      totalQuestion: this.props.navigation.getParam("total"),
    });
    this.setState({ height: this.height, data: this.data });
    this.refetch();
  }

  previous = (index) => {
    let filterText = index;
    this.props.navigation.setParams({ filterText: filterText });
    let height = this.state.height;
    height.map((v, i) => {
      height[i] = 0;
    });
    height[index - 1] = screenHeight;
    this.setState({ height: height });
  };

  next = (index, total) => {
    let height = this.state.height;

    if (index === total) {
      this.submitAnswers();
    } else {
      let filterText = index + 2;
      this.props.navigation.setParams({ filterText: filterText });
      height.map((v, i) => {
        height[i] = 0;
      });
      height[index + 1] = screenHeight;
      this.setState({ height: height });
    }
  };

  addValues = (text, index) => {
    let dataArray = this.state.data;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach((element) => {
        if (element.id === index) {
          element.answer = text;

          checkBool = true;
        }
      });
    }

    if (checkBool) {
      this.setState({
        data: dataArray,
      });
    }
  };

  submitAnswers = async () => {
    let res = await requestMiddleware(this.props.navigation.getParam("id"));
    if (res) {
      client
        .mutate({
          mutation: updateOfferAnswerMutation,
          variables: {
            offer_id: parseInt(this.props.navigation.getParam("id")),
            answers: this.state.data,
          },
        })
        .then((results) => {
          if (results.data.offerAnswerQuestion.id) {
            if (this.props.navigation.getParam("refresh")) {
              this.props.navigation.state.params.refresh();
            }
            Alert.alert(
              "Answer submitted",
              "Please wait for the owner review",
              [
                {
                  text: "OK",
                  onPress: () => {
                    this.props.navigation.goBack();
                  },
                },
              ],
              { cancelable: false }
            );
          }

          //this.props.navigation.setParams({ postLoading: false });
        })
        .catch((res) => {
          //this.displayError(res);
        });
    }
  };

  render() {
    return (
      <KeyboardAwareScrollView>
        <Query
          query={getOfferQuestionAnswer}
          variables={{ id: parseInt(this.props.navigation.getParam("id")) }}
        >
          {({ loading, error, data, fetchMore, refetch }) => {
            this.refetch = refetch;
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
                  }}
                >
                  <Image source={require("../../assets/images/wifi.png")} />
                  <View
                    style={{
                      alignItems: "center",
                    }}
                  >
                    <Text style={{ fontSize: 19 }}>No Internet Connection</Text>
                    <Text>Could not connected to the network </Text>
                    <Text>Please check and try again.</Text>
                    <Button title="Retry" onPress={() => refetch()} />
                  </View>
                </View>
              );
            let totalQuestion = data.offerQuestionAnswer.length - 1;

            return data.offerQuestionAnswer.map((item, key) => {
              this.data[key] = item;
              if (this.state.height.length === 0) {
                if (key === 0) {
                  this.height[key] = screenHeight;
                } else {
                  this.height[key] = 0;
                }
              }

              return (
                <View
                  key={key}
                  style={[
                    {
                      flex: 1,
                      backgroundColor: "#fff",
                      paddingLeft: 15,
                      paddingRight: 15,
                      //height:this.state.height[key]
                    },
                    this.state.height[key] === 0 ||
                    this.state.height[key] === undefined
                      ? { position: "absolute", top: 1000 * screenHeight }
                      : {},
                  ]}
                >
                  <View style={{ flexDirection: "row", marginTop: 20 }}>
                    <Text
                      style={{
                        backgroundColor: color.primaryColor,
                        width: 2,
                        marginTop: 5,
                        marginBottom: 5,
                      }}
                    ></Text>
                    <Text style={styles.accordionParagraph}>
                      {item.question}
                    </Text>
                  </View>
                  <View style={{ marginTop: 20, flex: 1 }}>
                    <View style={styles.postQuestionTextareaConatiner}>
                      <TextInput
                        style={styles.postQuestionTextInput}
                        multiline={true}
                        placeholder="what is your answer?"
                        onChangeText={(text) => this.addValues(text, key)}
                      >
                        {item.answer}
                      </TextInput>
                    </View>
                  </View>

                  <View
                    style={{
                      flex: 1 / 6,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      marginTop: 15,
                      //height:this.state.height[key]
                    }}
                  >
                    <TouchableOpacity
                      disabled={key === 0 ? true : false}
                      onPress={() => this.previous(key)}
                      style={{
                        flex: 1,
                        backgroundColor: "#E9EDF2",
                        alignItems: "center",
                        height: 40,
                        justifyContent: "center",
                        borderRadius: 10,
                        marginRight: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: "#818181",
                          fontSize: 16,
                          fontFamily: FontFamily.Medium,
                        }}
                      >
                        Previous
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      //disabled={key===totalQuestion? true: false}
                      onPress={() => this.next(key, totalQuestion)}
                      style={{
                        flex: 1,
                        backgroundColor: color.primaryColor,
                        alignItems: "center",
                        height: 40,
                        justifyContent: "center",
                        borderRadius: 10,
                        marginLeft: 2,
                      }}
                    >
                      <Text
                        style={{
                          color: "#fff",
                          fontSize: 16,
                          fontFamily: FontFamily.Medium,
                        }}
                      >
                        {key === totalQuestion ? "Submit" : "Next"}
                      </Text>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            });
          }}
        </Query>
      </KeyboardAwareScrollView>
    );
  }
}

OfferAddQuestionScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => (
    <View style={{ flex: 1, flexDirection: "row", justifyContent: "center" }}>
      <Text style={styles.headerPageTitle}>Question </Text>
      <Text style={[styles.headerPageTitle, { color: color.primaryColor }]}>
        {screenProps.navigation.getParam("filterText")}
      </Text>
      <Text style={styles.headerPageTitle}>
        {" "}
        / {screenProps.navigation.getParam("totalQuestion")}
      </Text>
    </View>
  ),
});
const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  accordionParagraph: {
    fontFamily: FontFamily.Bold,
    fontSize: 16,
    color: color.blackColor,
    lineHeight: 20,
    paddingLeft: 10,
  },
  postQuestionTextareaConatiner: {
    flex: 1,
  },
  postQuestionTextInput: {
    flex: 1,
    fontSize: 15,
    lineHeight: 20,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    width: "100%",
    textAlignVertical: "top",
    backgroundColor: color.lightGrayColor,
    borderRadius: 8,
    paddingTop: 10,
    paddingLeft: 10,
    paddingRight: 10,
    paddingBottom: 10,
  },
});

export default OfferAddQuestionScreen;
