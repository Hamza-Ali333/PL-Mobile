import React,{Component} from "react";
import {
  View,
  TouchableOpacity,
  Text,
  StyleSheet,
  Image,
  Modal,
  Button
} from "react-native";
import { Ionicons, FontAwesome, AntDesign, Entypo } from "@expo/vector-icons";
import { Chip, Badge, List,  Checkbox, RadioButton  } from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";

class PostQuestionHeader extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        modalVisible: false,
      };
    }

  showModal = () => this.setState({ modalVisible: true });
  hideModal = () => this.setState({ modalVisible: false });
  
  NewOfferScreenNavigate =(props) =>{
      this.props.navigation.navigate("NewOffers");
    }

  render() {
     const { modalVisible } = this.state;
    return (
        <View>
          <TouchableOpacity style={{flex:1,flexDirection: 'row',alignItems: 'center'}} onPress={this.showModal}>
              <Text style={styles.postQuestionPageTitle}>Post your question</Text>
              <Image
                style={{width: 14,height: 14,resizeMode: 'contain'}}
                source={require("../assets/images/ArrowDown.png")}/>
          </TouchableOpacity>
              <Modal
            animationType="slide"
            transparent={true}
            visible={modalVisible} >
            <View style={styles.leadboardModal}>
           
              <View style={styles.leadboardModalContent}>
                <View style={{position: 'relative'}}>
                 <Text style={styles.popUpHeading}>What do you want?</Text>
                  <TouchableOpacity style={styles.modalCloseIcon}
                   onPress={this.hideModal}>
                    <Ionicons
                          name="ios-close"
                          size={28}
                          color={color.blackColor}
                        />
                  </TouchableOpacity>
                    <TouchableOpacity style={styles.BottomOptionListItems}
                    onPress={this.NewOfferScreenNavigate}>
                      <Text style={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                       }}>New Post</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.BottomOptionListItems}>
                      <Text style={{
                        fontSize: 15,
                        fontFamily: FontFamily.Regular,
                        color: color.blackColor,
                       }}>New Offers</Text>
                    </TouchableOpacity>
                  </View>
              </View>
            </View>
          </Modal>
        </View>
    );
  }
}

const styles = StyleSheet.create({
   postQuestionPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
    marginLeft: 15,
    marginRight: 5,
  },
  leadboardModal: {
    backgroundColor: "rgba(226, 226, 226, .75)",
    flex: 1,
    flexDirection: "column",
    paddingTop: '10%',
    paddingLeft: "10%",
    paddingRight: "10%",
    zIndex: 11111,
    // height:Dimensions.get('window').height,
  },
  leadboardModalContent: {
    backgroundColor: "#fff",
    width:"100%",
    borderRadius: 24,
    padding:25,
    zIndex: 111
  },
  popUpHeading:{
    fontSize: 20,
    color: color.blackColor,
    fontFamily: FontFamily.Medium,
    marginBottom:20,
  },
  BottomOptionListItems: {
    paddingTop:10,
    paddingBottom:10,
    borderBottomWidth: 1,
    borderColor: color.lightGrayColor
  },
  TopicPageCheckboxes: {
    marginRight: 20
  },
  modalCloseIcon: {
    lineHeight: 20,
    height: 30,
    position: 'absolute' ,
    right: 0,
    top: 0,
    zIndex: 111,
    width: 40,
    alignItems: 'center', 
  }
});
export default PostQuestionHeader;
