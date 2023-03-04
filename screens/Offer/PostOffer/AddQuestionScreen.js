import React, { Component } from "react";
import {
  ActivityIndicator,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from "react-native";
import { StackActions, NavigationActions } from "react-navigation";
import { AntDesign } from "@expo/vector-icons";
import color from "../../../constants/Colors.js";
import FontFamily from "../../../constants/FontFamily.js";
import saveOfferQuestionMutation from "../../../graphql/mutations/saveOfferQuestionMutation";
import client from "../../../constants/client";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";

class AddQuestionScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      checked: true,
      description: "",
      questions: [],
      textInput: [],
      inputData: [],
      position: [],
      scaleAnimationDialog: false,
      errorMessage: [],
      text: "",
    };
  }

  componentDidMount() {
    this.props.navigation.setParams({
      submitOfferQuestion: this.submitOfferQuestion,
    });

    if (Object.keys(this.props.navigation.getParam("offer")).length > 0) {
      let offer = this.props.navigation.getParam("offer");
      let questions = [];
      let inputData = [];
      offer.questions.map((question, index) => {
        questions.push(question.question);
        inputData.push({ text: question.question, index: index });
        this.addTextInput(index, question.question);
      });
      this.setState({
        description: offer.description,
        questions: questions,
        inputData: inputData,
      });
    } else {
      this.addTextInput(this.state.textInput.length);
    }
  }

  displayError = (error) => {
    try {
      if (error) {
        let { graphQLErrors } = error;
        if (graphQLErrors[0].extensions.category === "validation") {
          this.validationErrors = graphQLErrors[0].extensions.validation;
        }
      }
      let errorMessage = [];
      for (var key in this.validationErrors) {
        var value = this.validationErrors[key];
        errorMessage.push(value[0]);
      }

      this.setState({ errorMessage });
    } catch (e) {}
  };

  submitOfferQuestion = () => {
    let flag = true;
    let position = [];

    if (this.state.questions.length === 0) {
      position[1] = "Atleast one question is required!";
      flag = false;
    }

    this.setState({ position });

    if (!flag) {
      return false;
    }
    this.submitQuestion();
  };

  submitQuestion = () => {
    this.setState({ loading: true });
    client
      .mutate({
        mutation: saveOfferQuestionMutation,
        variables: {
          offer_id: this.props.navigation.getParam("data").id,
          questions: this.state.questions,
        },
      })
      .then((results) => {
        if (results.data.saveOfferQuestion.id) {
          this.props.navigation.navigate("AddDescriptionScreen", {
            data: this.props.navigation.getParam("data"),
            offer: this.props.navigation.getParam("offer"),
          });
        }
      })
      .catch((res) => {
        this.setState({ scaleAnimationDialog: false, loading: false });
        this.displayError(res);
      });
  };

  addTextInput = () => {
    let questions = this.state.questions;
    if (this.state.text != "") {
      questions.push(this.state.text);
      this.setState({ questions: questions, text: "" });
    }
  };

  removeTextInput = (index) => {
    let questions = this.state.questions;
    questions.splice(index, 1);
    this.setState({ questions });
  };

  addValues = (text, index) => {
    let questionArray = this.state.questions;
    let dataArray = this.state.inputData;
    let checkBool = false;
    if (dataArray.length !== 0) {
      dataArray.forEach((element) => {
        if (element.index === index) {
          element.text = text;

          checkBool = true;
        }
        questionArray[element.index] = element.text;
      });
    }
    if (checkBool) {
      this.setState({
        inputData: dataArray,
        questions: questionArray,
      });
    } else {
      dataArray.push({ text: text, index: index });
      questionArray.push(text);
      this.setState({
        inputData: dataArray,
        questions: questionArray,
      });
    }
  };

  getValues = () => {};

  setText = (text) => {
    this.setState({ text });
  };

  render() {
    const { checked } = this.state;
    return (
      <KeyboardAwareScrollView>
        <View
          style={{
            flex: 1,
            backgroundColor: "#fff",
          }}
        >
          <View style={{ borderColor: "#CCCFD6" }}>
            {this.state.errorMessage.map((error, index) => (
              <Text key={index} style={{ color: "#FF4141" }}>
                {error}
              </Text>
            ))}
          </View>
          <ScrollView
            showsVerticalScrollIndicator={false}
            keyboardDismissMode="on-drag"
            keyboardShouldPersistTaps="always"
          >
            <View>
              {this.state.questions.map((value, index) => {
                let number = index;
                number++;
                return (
                  <View
                    key={index}
                    style={{
                      paddingLeft: 15,
                      paddingRight: 15,
                      paddingBottom: 13,
                      paddingTop: 13,
                      borderTopWidth: 0,
                    }}
                  >
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                      }}
                    >
                      <Text style={styles.dateRangeText}>
                        Question {number}
                      </Text>
                      <TouchableOpacity
                        onPress={() => this.removeTextInput(index)}
                      >
                        <Text style={{ color: "#FF4141" }}>Remove</Text>
                      </TouchableOpacity>
                    </View>
                    <Text style={styles.addQuestionDescription}>{value}</Text>
                  </View>
                );
              })}

              <View>
                <View
                  style={{
                    paddingLeft: 15,
                    paddingRight: 15,
                    paddingBottom: 13,
                    paddingTop: 13,
                    borderTopWidth: 1,
                    borderColor: "#CCCFD6",
                  }}
                >
                  <View style={{}}>
                    <TextInput
                      keyboardShouldPersit={true}
                      style={styles.awardTextInput}
                      placeholder="Type you question"
                      multiline
                      value={this.state.text}
                      onChangeText={this.setText}
                    />
                  </View>
                </View>

                {this.state.position[1] ? (
                  <Text style={{ color: "#FF4141" }}>
                    {this.state.position[1]}
                  </Text>
                ) : null}
              </View>
            </View>
            <TouchableOpacity
              onPress={this.addTextInput}
              style={{
                borderBottomWidth: 1,
                borderTopWidth: 1,
                borderColor: "#CCCFD6",
                alignItems: "center",
                backgroundColor: "#F3F5FB",
                height: 45,
                justifyContent: "center",
              }}
            >
              <Text style={styles.addQuestionText}>
                <AntDesign name="plus" size={18} color={color.primaryColor} />
                Add
              </Text>
            </TouchableOpacity>
          </ScrollView>
          <Dialog
            dialogStyle={{ borderRadius: 24 }}
            onTouchOutside={() => {
              this.setState({ scaleAnimationDialog: false });
            }}
            onHardwareBackPress={() => {
              this.setState({ scaleAnimationDialog: false });
            }}
            width={0.7}
            overlayOpacity={0.9}
            visible={this.state.scaleAnimationDialog}
            dialogAnimation={new ScaleAnimation()}
            dialogTitle={
              <DialogTitle title="What do you want?" hasTitleBar={true} />
            }
          >
            <DialogContent>
              {this.state.loading ? (
                <ActivityIndicator size="large" color={color.primaryColor} />
              ) : (
                <View>
                  <TouchableOpacity
                    style={{
                      paddingBottom: 10,
                      marginBottom: 10,
                      marginTop: 10,
                      borderBottomWidth: 1,
                      borderColor: color.lightGrayColor,
                    }}
                    onPress={() => this.submitQuestion(1)}
                  >
                    <Text
                      style={{
                        fontSize: 19,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                    >
                      Publish Offer
                    </Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    onPress={() => this.submitQuestion(0)}
                    style={{ marginBottom: 10 }}
                  >
                    <Text
                      style={{
                        fontSize: 19,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                      }}
                    >
                      Save as draft
                    </Text>
                  </TouchableOpacity>
                </View>
              )}
            </DialogContent>
          </Dialog>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

AddQuestionScreen.navigationOptions = (screenProps) => ({
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
    <Text style={styles.postQuestionPageTitle}>Add questions</Text>
  ),
  headerRight: () => (
    <TouchableOpacity
      style={styles.touchRightHeadText}
      onPress={screenProps.navigation.getParam("submitOfferQuestion")}
    >
      <Text style={styles.postText}>Next</Text>
    </TouchableOpacity>
  ),
});
{
  /*<AddQuestionHeadRight {...screenProps} />*/
}
const styles = StyleSheet.create({
  postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  touchRightHeadText: {
    padding: 10,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
  },
  BottomOptionListItems: {
    borderColor: "#E8E8E8",
    borderTopWidth: 1,
  },
  BottomOptionImage: {
    width: 24,
    height: 24,
    marginTop: 5,
    marginRight: 8,
    marginLeft: 8,
  },
  bottomModal: {
    justifyContent: "flex-end",
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.2)",
    alignItems: "stretch",
  },
  modalContent: {
    backgroundColor: "#fff",
    // height:Dimensions.get('window').height/2.5,
  },
  modalListItemIcons: {
    width: 20,
    height: 20,
    marginTop: 8,
    marginRight: 5,
    marginLeft: 5,
  },
  modalCloseList: {
    color: color.blackColor,
    textAlign: "center",
    fontSize: 16,
    paddingTop: 10,
    paddingBottom: 10,
  },
  modalCloseIcon: {
    alignContent: "flex-end",
    position: "absolute",
    right: 15,
    top: 5,
    zIndex: 1,
  },
  dateRangeText: {
    fontSize: 20,
    fontFamily: FontFamily.Medium,
    color: color.blackColor,
    marginBottom: 5,
  },
  addQuestionDescription: {
    fontSize: 16,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
  },
  dateFromText: {
    fontSize: 17,
    fontFamily: FontFamily.Regular,
    color: "#929292",
  },
  awardTextInput: {
    borderColor: "#000",
    padding: 10,
    backgroundColor: color.lightGrayColor,
    color: color.blackColor,
    fontSize: 16,
    borderRadius: 6,
    flex: 1,
    minHeight: 80,
    alignItems: "flex-start",
    justifyContent: "flex-start",
  },
  addQuestionText: {
    color: color.primaryColor,
    fontSize: 18,
  },
});

export default AddQuestionScreen;
