import React from "react";
import {
  Dimensions,
  View,
  Text,
  TextInput,
  SafeAreaView,
  StyleSheet,
} from "react-native";
import { AntDesign } from "@expo/vector-icons";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";

const SCREEN_HEIGHT = Dimensions.get("window").height;

class PrivateDiscussionFilterScreen extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {};
  }
  render() {
    return (
      <View
        style={{
          flex: 1,
          backgroundColor: "#fff",
          paddingTop: 0,
          padding: 15,
        }}
      >
        <SafeAreaView>
          <View style={styles.searchInputContainer}>
            <AntDesign style={styles.searchIcon} name="search1"></AntDesign>
            <TextInput
              style={styles.searchTextInput}
              placeholder="Search by Discussion, People and Tags"
            />
          </View>
        </SafeAreaView>
      </View>
    );
  }
}

PrivateDiscussionFilterScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => <Text style={styles.headerPageTitle}>Search</Text>,
});

const styles = StyleSheet.create({
  keyboardAvoidContainer: {
    flex: 1,
    backgroundColor: "orange",
  },
  leadboardModal: {
    backgroundColor: "rgba(226, 226, 226, .75)",
    flex: 1,
    flexDirection: "column",
    // height:Dimensions.get('window').height/2,
  },
  leadboardModalContent: {
    flex: 1,
    backgroundColor: "#fff",
    marginTop: "20%",
  },
  postQuestionTextareaConatiner: {
    flex: 1,
    margin: 15,
    flexDirection: "column",
  },
  postQuestionTextInput: {
    fontSize: 20,
    fontFamily: FontFamily.Regular,
    color: color.blackColor,
    width: "100%",
    textAlignVertical: "top",
  },
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  headerPageTitleRight: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 18,
    paddingRight: 15,
  },
  searchInputContainer: {
    marginBottom: 1,
  },
  searchIcon: {
    position: "absolute",
    left: 10,
    top: 8,
    fontSize: 22,
    zIndex: 1,
    color: "#8C8C8C",
  },
  searchTextInput: {
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    paddingLeft: 40,
    fontSize: 14,
    height: 40,
    fontFamily: FontFamily.Regular,
    color: "#686D76",
  },
  searchListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
  },
  postButton: {
    padding: 10,
    marginRight: 5,
    justifyContent: "center",
  },
  postText: {
    fontFamily: FontFamily.Regular,
    color: color.primaryColor,
    fontSize: 15,
  },
  filterSelection: {
    flex: 1,
    alignItems: "center",
    margin: 5,
    backgroundColor: color.lightGrayColor,
    borderRadius: 10,
    padding: 5,
  },
  ListItems: {
    borderColor: "#E8E8E8",
    borderBottomWidth: 1,
    marginRight: 15,
    marginLeft: 15,
    paddingBottom: 10,
    paddingTop: 10,
  },
  UserProfileImage: {
    marginRight: 12,
    width: 38,
    height: 38,
    borderRadius: 90,
  },
  UserName: {
    fontSize: 16,
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    letterSpacing: 0.5,
  },
});
export default PrivateDiscussionFilterScreen;
