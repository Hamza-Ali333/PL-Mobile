import React, { Component } from "react";
import {
  View,
  Text,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import ProfilePhoto from "../components/ProfilePhoto";
import capitalize from "../helper/capitalize";
import createGroupMutation from "../graphql/mutations/createGroupMutation";
import client from "../constants/client";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

class CreateGroupScreen extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isSwitchOn: true,
      me: {},
      name: "",
      description: "",
      position: [],
      loading: false,
    };
  }

  componentDidMount() {
    AsyncStorage.getItem("me").then((result) => {
      let res = JSON.parse(result);
      this.setState({ me: res });
    });
  }

  onNameChange = (text) => {
    this.setState({
      name: text,
    });
  };

  onDescriptionChange = (text) => {
    this.setState({
      description: text,
    });
  };

  onSubmitGroup = () => {
    const { name, description } = this.state;

    let ids = [];
    let members = this.props.navigation.getParam("members");
    members.map((m) => {
      ids.push(m.id);
    });

    if (this.formValidation()) {
      this.setState({
        loading: true,
      });

      client
        .mutate({
          mutation: createGroupMutation,
          variables: {
            name: name,
            member_ids: ids,
            description: description,
            group_id: null,
          },
          optimisticResponse: {
            __typename: "Mutation",
            group: {
              id: 1233,
              name: "tesr........",
              description: description,
            },
          },

          // update: (store, { data: { group } }) => {
          //   try {
          //     const data = store.readQuery({
          //       query: getGroups,
          //     });

          //     const votedLink = data.questions.data.find(
          //       (data) => data.id === id
          //     );

          //     votedLink.likes.paginatorInfo.total =
          //       likeQuestion.total_like_votes;
          //     votedLink.dislikes.paginatorInfo.total =
          //       likeQuestion.total_unlike_votes;
          //     votedLink.voteStatus = voteStatus === 1 ? -1 : 1;
          //     store.writeQuery({ query: getGroups, data });
          //   } catch (e) {}
          // },
        })
        .then((result) => {
          this.setState({
            loading: false,
            index: 1,
          });

          Alert.alert("Created", "Group has been created successfully", [
            {
              text: "OK",
              onPress: () =>
                this.props.navigation.navigate("Message", {
                  navigateIndex: 0,
                }),
            },
          ]);
        })
        .catch((err) => {
          Alert.alert("Error", "Cannot create more than 5 groups.", [
            {
              text: "OK",
              onPress: () =>
                this.props.navigation.navigate("Message", {
                  navigateIndex: 1,
                }),
            },
          ]);
        });
    }
  };
  formValidation = () => {
    let position = [];
    if (this.state.name == "" || this.state.name == null) {
      position[0] = " ";
    } else if (this.state.name.length < 2) {
      position[0] = "Minimum 2 characters required!";
    } else if (this.state.name.length > 25) {
      position[0] = "Maximum 25 characters allowed!";
    }

    // if (this.state.description == "" || this.state.description == null) {
    //   position[0] = " ";
    // } else if (this.state.description.length < 32) {
    //   position[0] = "Minimum 10 characters required!";
    // } else if (this.state.description.length > 160) {
    //   position[0] = "Maximum 20 characters allowed!";
    // }

    this.setState({ position });
    if (position.length === 0) {
      return true;
    }
    return false;
  };

  render() {
    const members = this.props.navigation.getParam("members");
    return (
      // <ScrollView style={styles.container}>
      <KeyboardAwareScrollView
        behavior={Platform.OS == "ios" ? "padding" : "height"}
        enabled
        style={styles.container}
      >
        <View style={{ flex: 1 }}>
          <Text style={{ color: "red" }}>{this.state.position[0]}</Text>
          <Text style={styles.label}>Name</Text>
          <TextInput
            style={[
              styles.textInput,
              this.state.position[0]
                ? { borderColor: "red", borderWidth: 1 }
                : {},
            ]}
            placeholder="Name your group"
            onChangeText={(text) => {
              this.onNameChange(text);
            }}
          />
          <View style={styles.separator} />
          <Text style={styles.label}>Description</Text>
          <TextInput
            style={styles.textInput}
            placeholder="Short description for your group"
            onChangeText={(text) => {
              this.onDescriptionChange(text);
            }}
          />

          <View style={styles.separator} />

          {members.map((m) => (
            <TouchableOpacity
              style={styles.ListItems}
              // onPress={() => this.selectMember(item)}
            >
              <View style={{ flexDirection: "row" }}>
                <ProfilePhoto size={42} item={m} me={this.state.me} />

                <View
                  style={{
                    flex: 1,
                    justifyContent: "center",
                    alignItems: "flex-start",
                  }}
                >
                  <View>
                    <Text style={styles.UserName}>
                      {capitalize(m.firstname)} {capitalize(m.lastname)}
                    </Text>

                    <Text style={styles.UserDescription}>@{m.username}</Text>
                  </View>
                </View>
              </View>
            </TouchableOpacity>
          ))}
          {/*<View>
            <Text style={styles.label}>Privacy</Text>
            <TouchableOpacity style={[styles.customInput, styles.list]}>
              <Text style={styles.customInputText}>Privacy</Text>
              <MaterialIcons
                name="arrow-drop-down"
                size={24}
                color={color.grayColor}
              />
            </TouchableOpacity>
            <View style={styles.spacingXL} />
            <View style={styles.spacingXL} />
            <View style={styles.list}>
              <Text style={styles.label}>Allow memebers</Text>
              <Switch
                color={color.primaryColor}
                value={this.state.isSwitchOn}
              />
            </View>
            <View style={styles.spacingXL} />
            <View style={styles.list}>
              <Text style={styles.label}>Member can invite other</Text>
              <Switch
                color={color.primaryColor}
                value={this.state.isSwitchOn}
              />
            </View>
          </View> */}
        </View>
        <TouchableOpacity
          style={styles.primaryBtn}
          onPress={this.onSubmitGroup}
        >
          {this.state.loading ? (
            <ActivityIndicator color={color.whiteColor} size="small" />
          ) : (
            <Text style={styles.primaryBtnTxt}>Create Group</Text>
          )}
        </TouchableOpacity>
        <View style={styles.spacing} />
        {/* </ScrollView> */}
      </KeyboardAwareScrollView>
    );
  }
}

CreateGroupScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Create Group</Text>,
  // headerRight: () =>
  //   screenProps.navigation.getParam("index") === 1 ? (
  //     <GroupMenu
  //       {...screenProps}
  //       openMenu={screenProps.navigation.getParam("openMenu")}
  //     />
  //   ) : (
  //     <ComposeMessage {...screenProps} />
  //   ),
});

export default CreateGroupScreen;

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  rightHeaderText: {
    paddingRight: 15,
  },
  container: {
    flex: 1,
    paddingHorizontal: 15,
  },
  label: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
    color: color.blackColor,
    marginBottom: 5,
  },
  textInput: {
    backgroundColor: color.lightGrayColor,
    height: 45,
    borderRadius: 6,
    paddingHorizontal: 10,
  },
  separator: {
    backgroundColor: color.lightGrayColor,
    height: 1,
    marginVertical: 13,
  },
  spacingXL: {
    height: 30,
  },
  spacing: {
    height: 20,
  },
  customInput: {
    height: 45,
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
  customInputText: {
    fontFamily: FontFamily.Regular,
    fontSize: 14,
    color: color.grayColor,
  },
  list: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  primaryBtn: {
    backgroundColor: color.primaryColor,
    padding: 10,
    borderRadius: 6,
    alignItems: "center",
  },
  primaryBtnTxt: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
    color: color.whiteColor,
  },
  ListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
  },
  UserName: {
    fontSize: 16,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.5,
  },
  UserDescription: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    letterSpacing: 0.5,
    fontSize: 16,
  },
});
