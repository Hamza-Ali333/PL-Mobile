import React, { Component } from "react";
import { View,Text,Image, StyleSheet, ImageBackground,Modal,TouchableOpacity } from 'react-native';
import { List} from "react-native-paper";
import color from "../constants/Colors.js";
import FontFamily from "../constants/FontFamily.js";
import { Ionicons } from "@expo/vector-icons";
import { Video } from 'expo-av';
import { Avatar,Badge } from "react-native-paper";



class VideosGrid extends Component {
   state = {
      modalVisible: false,
    };

    setModalVisible(visible) {
      this.setState({modalVisible: visible});
    }
   render() {
    return (
        <View style={styles.videoGrid} >
          <View style={styles.videoGridItems}> 
            <TouchableOpacity style={{width: '50%'}} onPress={() => {this.setModalVisible(true)}}> 
              <ImageBackground 
                source={require("../assets/images/forest.jpg")}
                style={styles.backgroundImage}>
                <View style={styles.videoOverlay}>
                  <Text style={styles.videoDuration}>1:20</Text>
                  <View style={{flex: 1,justifyContent: 'flex-end' }}>
                    <Text style={styles.videoUserName}>Sustainable Living</Text>
                    <Text style={styles.videoViews}>120 views</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '50%'}} onPress={() => {this.setModalVisible(true)}}> 
              <ImageBackground 
                source={require("../assets/images/forest.jpg")}
                style={styles.backgroundImage}>
                <View style={styles.videoOverlay}>
                  <Text style={styles.videoDuration}>1:20</Text>
                  <View style={{flex: 1,justifyContent: 'flex-end' }}>
                    <Text style={styles.videoUserName}>Sustainable Living</Text>
                    <Text style={styles.videoViews}>120 views</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
            <TouchableOpacity style={{width: '50%'}} onPress={() => {this.setModalVisible(true)}}> 
              <ImageBackground 
                source={require("../assets/images/forest.jpg")}
                style={styles.backgroundImage}>
                <View style={styles.videoOverlay}>
                  <Text style={styles.videoDuration}>1:20</Text>
                  <View style={{flex: 1,justifyContent: 'flex-end' }}>
                    <Text style={styles.videoUserName}>Sustainable Living</Text>
                    <Text style={styles.videoViews}>120 views</Text>
                  </View>
                </View>
              </ImageBackground>
            </TouchableOpacity>
          </View>
          <Modal
            animationType="slide"
            transparent={false}
            visible={this.state.modalVisible}
            >
             <View style={styles.Modal}>
              <View style={styles.modalContent}>
                <View style={{ flex: 1, flexDirection: "row",justifyContent:'space-between',paddingTop: '5%'}}>
                  <View style={{ flex: 1, flexDirection: "row",justifyContent:'center'}}>
                    <Avatar.Text
                      style={styles.userProfile}
                      size={45}
                      label='DA'
                    />
                    <View style={{ flex: 1 }}>
                      <TouchableOpacity>
                        <Text style={styles.userName}>
                          Demo
                        </Text>
                      </TouchableOpacity>
                        <Text  style={styles.userStatusText}> 
                          Share your knowledge & win
                        </Text>
                    </View>
                  </View>
                  <TouchableOpacity onPress={() => {this.setModalVisible(!this.state.modalVisible)}}>
                     <Ionicons
                          style={styles.modalCloseIcon}
                          name="ios-close"
                          size={42}
                          color="white"
                        />
                  </TouchableOpacity>
                </View>
                
                    <View style={{ flex: 1,justifyContent:'flex-end'}}>
                      <View style={{flexDirection: "row",marginBottom: 10}}>
                        <Text style={styles.videoBadge}>SUSTAINABILITY</Text>
                      </View>
                      <View style={{flexDirection: "row",marginBottom: 10}}>
                        <Text style={styles.videoViews}>537 views . 3 comments</Text>
                      </View>
                      <View style={{flexDirection: "row",justifyContent:'space-between',alignItems:'center'}}>
                        <View style={{ flex: 1/2,flexDirection: "row",justifyContent:'space-between'}}>
                          <TouchableOpacity>
                            <Image
                              source={require("../assets/images/heartWhite.png")}
                              style={{width:20,height: 20}}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Image
                              source={require("../assets/images/planWhite.png")}
                              style={{width:20,height: 20}}
                            />
                          </TouchableOpacity>
                          <TouchableOpacity>
                            <Image
                              source={require("../assets/images/dotsWhite.png")}
                              style={{width:20,height: 20}}
                            />
                          </TouchableOpacity>
                        </View>
                        <TouchableOpacity>
                           <Text style={styles.learnMoreButton}>Learn More</Text>
                        </TouchableOpacity>
                      </View>
                    </View>
                </View>
                <Video
                  source={{ uri: 'http://d23dyxeqlo5psv.cloudfront.net/big_buck_bunny.mp4' }}
                  rate={1.0}
                  volume={1.0}
                  isMuted={false}
                  resizeMode="cover"
                  shouldPlay
                  isLooping
                  useNativeControls
                  style={styles.videoModal}
                />
            </View>
          </Modal>
        </View>
     );
  }
}



const styles = StyleSheet.create({
  videoGrid:{
    flex: 1,
    backgroundColor: '#fff',
    paddingTop:10,
    marginTop: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
    elevation: 3,
  },
  videoGridItems:{
    flex: 1,
    flexDirection: "row",
    flexWrap: 'wrap'
  },
  backgroundImage:{
    height: 300,
    width:'100%'
  },
  videoUserName:{
    color:'white',
    fontFamily: FontFamily.Regular,
    fontSize: 14,
  },
  videoViews:{
     color:'white',
    fontFamily: FontFamily.Regular,
    fontSize: 12,
  },
  videoOverlay:{
    padding:6,flex: 1
  },
  videoDuration:{
    fontFamily: FontFamily.Regular,
    fontSize: 12,
    color:'white',
    flex: 1,
    textAlign:'right'
  },
  Modal: {
    backgroundColor: "rgba(0, 0, 0, .4)",
    flex: 1,
    flexDirection: "column",
    position: 'relative',
    // height:Dimensions.get('window').height/2,
  },
  modalContent: {
     position: 'relative',
      zIndex: 2,
      flex:1,
      margin:10,

  },
  videoModal:{
    position: 'absolute',
     top: 0,
     right: 0,
     left: 0,
     bottom: 0,
     zIndex: 1,
  },
  userProfile: {
    marginRight: 10,
    width: 42,
    height: 42,
    borderRadius: 90
  },
  userName: {
    color: 'white',
    fontFamily: FontFamily.Bold,
    letterSpacing: 0.5,
    fontSize: 16
  },
  userStatusText: {
    marginTop: 2,
    color: 'white',
    fontFamily: FontFamily.Regular,
    fontSize: 11
  },
  videoBadge:{
    backgroundColor: "rgba(255, 255, 255, .4)",
    color: 'white',
    fontSize: 11,
    fontFamily: FontFamily.Bold,
    borderRadius: 2,
    height: 20,
    padding: 4
  },
  videoViews:{
    color: 'white',
    fontSize: 11,
    fontFamily: FontFamily.Regular,
  },
  learnMoreButton:{
    color: 'white',
    fontSize: 11,
    fontFamily: FontFamily.Regular,
    borderWidth: 1,
    borderColor: '#fff',
    borderRadius: 4,
    padding:8,
  }
});


export default VideosGrid;