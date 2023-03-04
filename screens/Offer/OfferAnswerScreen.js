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
import { Query } from "react-apollo";
import { Avatar, List, Checkbox } from "react-native-paper";
import Dialog, {
  DialogContent,
  DialogTitle,
  ScaleAnimation,
} from "react-native-popup-dialog";

import ProfilePhoto from "../../components/ProfilePhoto";
import color from "../../constants/Colors";
import FontFamily from "../../constants/FontFamily";
import getParticipant from "../../graphql/queries/getParticipant";
import offerAnswerAccept from "../../graphql/mutations/offerAnswerAccept";
import offerAnswerReject from "../../graphql/mutations/offerAnswerReject";
import offerParticipantMutation from "../../graphql/mutations/offerParticipantMutation";
import client from "../../constants/client";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";

class OfferAnswerScreen extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: true,
      scaleAnimationDialog: false,
      action: {},
    };
    this.refetch;
  }

  componentDidMount() {
    this.refetch();
  }

  _handlePress = () =>
    this.setState({
      expanded: !this.state.expanded,
    });

  _handlePress = (type, id) => {
    this.setState({
      scaleAnimationDialog: true,
      action: { type: type, id: id },
    });
  };

  _actionPopup = (type) => {
    if (type === "yes") {
      let action = this.state.action;
      if (action.type === "accept") {
        this.offerAnswerAccept(action.id);
      } else if (action.type === "reject") {
        this.offerAnswerReject(action.id);
      }
    }
    this.setState({ scaleAnimationDialog: false, action: {} });
  };

  offerAnswerAccept = (answer_id) => {
    client
      .mutate({
        mutation: offerAnswerAccept,
        variables: {
          answer_id: answer_id,
        },
      })
      .then((results) => {
        this.refetch();
      })
      .catch((res) => {});
  };

  offerAnswerReject = (answer_id) => {
    client
      .mutate({
        mutation: offerAnswerReject,
        variables: {
          answer_id: answer_id,
        },
      })
      .then((results) => {})
      .catch((res) => {});
  };

  needRevision = (id) => {
    client
      .mutate({
        mutation: offerParticipantMutation,
        variables: {
          id: id,
        },
      })
      .then((results) => {
        Alert.alert(
          "Revision sent",
          "Your revision request has been sent to this user",
          [{ text: "OK", onPress: () => console.log("OK Pressed") }],
          { cancelable: false }
        );
      })
      .catch((res) => {});
  };

  render() {
    return (
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingLeft: 15,
          paddingRight: 15,
        }}
      >
        <Query
          query={getParticipant}
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
            let item = data.offerParticipant;
            return (
              <List.Accordion
                expanded={true}
                style={{
                  paddingLeft: 0,
                  paddingRight: 0,
                  paddingTop: 0,
                  paddingBottom: 10,
                  borderColor: "#C4C4C4",
                  borderBottomWidth: 1,
                }}
                titleStyle={{
                  fontSize: 20,
                  fontFamily: FontFamily.Bold,
                  color: color.blackColor,
                }}
                left={(props) => <ProfilePhoto size={42} item={item.user} />}
                title={
                  <Text
                    style={{
                      fontFamily: FontFamily.Bold,
                      fontSize: 15,
                      color: color.blackColor,
                    }}
                  >
                    {item.user.firstname} {item.user.lastname}
                  </Text>
                }
              >
                <View>
                  <View style={{ marginLeft: "-20%" }}>
                    {item.answers.map((answer, index) => {
                      return (
                        <View
                          key={index}
                          style={{
                            borderBottomWidth: 1,
                            borderColor: "#C4C4C4",
                            paddingBottom: 10,
                          }}
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
                              {answer.question.question}
                            </Text>
                          </View>
                          <View style={{ marginTop: 15 }}>
                            <Text
                              style={{
                                fontFamily: FontFamily.Regular,
                                fontSize: 16,
                                color: color.blackColor,
                                lineHeight: 18,
                              }}
                            >
                              {answer.answer}
                            </Text>
                          </View>
                          {answer.mark === "pending" ? (
                            <View
                              style={{
                                flexDirection: "row",
                                justifyContent: "space-between",
                                marginTop: 15,
                              }}
                            >
                              <TouchableOpacity
                                onPress={this._handlePress.bind(
                                  this,
                                  "reject",
                                  answer.id
                                )}
                                style={{
                                  flex: 1,
                                  backgroundColor: "#E9EDF2",
                                  alignItems: "center",
                                  height: 36,
                                  justifyContent: "center",
                                  borderRadius: 10,
                                  marginRight: 2,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#818181",
                                    fontSize: 14,
                                    fontFamily: FontFamily.Medium,
                                  }}
                                >
                                  Reject
                                </Text>
                              </TouchableOpacity>
                              <TouchableOpacity
                                onPress={this._handlePress.bind(
                                  this,
                                  "accept",
                                  answer.id
                                )}
                                style={{
                                  flex: 1,
                                  backgroundColor: color.primaryColor,
                                  alignItems: "center",
                                  height: 36,
                                  justifyContent: "center",
                                  borderRadius: 10,
                                  marginLeft: 2,
                                }}
                              >
                                <Text
                                  style={{
                                    color: "#fff",
                                    fontSize: 14,
                                    fontFamily: FontFamily.Medium,
                                  }}
                                >
                                  Accept
                                </Text>
                              </TouchableOpacity>
                            </View>
                          ) : (
                            <View
                              style={{
                                flex: 1,
                                alignItems: "center",
                                height: 36,
                                justifyContent: "center",
                                backgroundColor: "#E9EDF2",
                              }}
                            >
                              <Text
                                style={{
                                  color: "#818181",
                                  fontSize: 14,
                                  fontFamily: FontFamily.Medium,
                                }}
                              >
                                {answer.mark}
                              </Text>
                            </View>
                          )}
                        </View>
                      );
                    })}
                  </View>
                  <View style={{ marginLeft: "-20%", marginTop: 30 }}>
                    {item.isRevision ? (
                      <TouchableWithoutFeedback
                        style={{
                          backgroundColor: "#E9EDF2",
                          alignItems: "center",
                          height: 36,
                          justifyContent: "center",
                          borderRadius: 10,
                          marginLeft: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: "#818181",
                            fontSize: 14,
                            fontFamily: FontFamily.Medium,
                          }}
                        >
                          Revision Pending
                        </Text>
                      </TouchableWithoutFeedback>
                    ) : (
                      <TouchableOpacity
                        onPress={() => this.needRevision(item.id)}
                        style={{
                          backgroundColor: color.primaryColor,
                          alignItems: "center",
                          height: 36,
                          justifyContent: "center",
                          borderRadius: 10,
                          marginLeft: 2,
                        }}
                      >
                        <Text
                          style={{
                            color: "#fff",
                            fontSize: 14,
                            fontFamily: FontFamily.Medium,
                          }}
                        >
                          Need Revision
                        </Text>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </List.Accordion>
            );
          }}
        </Query>

        <Dialog
          dialogStyle={{ borderRadius: 24 }}
          onTouchOutside={() => {
            this.setState({ scaleAnimationDialog: false });
          }}
          width={0.7}
          visible={this.state.scaleAnimationDialog}
          dialogAnimation={new ScaleAnimation()}
          dialogTitle={<DialogTitle title="Alert" hasTitleBar={true} />}
        >
          <DialogContent>
            <Text style={{ textAlign: "center", margin: 10 }}>
              Are you sure you want to proceed?
            </Text>
            <View
              style={{ justifyContent: "space-around", flexDirection: "row" }}
            >
              <Button
                color={color.grayColor}
                title="Cancel"
                onPress={this._actionPopup.bind(this, "cancel")}
              />
              <Button
                color={color.primaryColor}
                title="Yes"
                onPress={this._actionPopup.bind(this, "yes")}
              />
            </View>
          </DialogContent>
        </Dialog>
      </ScrollView>
    );
  }
}

OfferAnswerScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Answers</Text>,
});
const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  postQuestionProfile: {
    paddingLeft: 15,
    paddingRight: 15,
    flexDirection: "row",
    backgroundColor: "#fff",
  },
  userProfile: {
    marginRight: 10,
  },
  userName: {
    fontSize: 17,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
  },
  DescriptionTitle: {
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    fontSize: 20,
  },
  DescriptionText: {
    color: color.blackColor,
    fontFamily: FontFamily.Regular,
    fontSize: 16,
    lineHeight: 22,
    marginTop: 15,
  },
  accordionParagraph: {
    fontFamily: FontFamily.Bold,
    fontSize: 16,
    color: color.blackColor,
    lineHeight: 20,
    paddingLeft: 10,
  },
});

export default OfferAnswerScreen;
