import React from "react";
import { View, TouchableOpacity, Text, StyleSheet,Image } from "react-native";
import { SimpleLineIcons } from "@expo/vector-icons";
import color from "../constants/Colors";
import { LinearGradient } from 'expo-linear-gradient';

class FollowUnfollowUser extends React.PureComponent {
  constructor(props) {
    super(props);

    this.delaySaveTimer;
  }

  _handleFollowerPressed = () => {
    this.props.item.is_follower = true;
    this.forceUpdate();
    clearTimeout(this.delaySaveTimer);
    this.delaySaveTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        this.props._handleFollowerPressed(this.props.item.id);
      });
    }, 2000);
  };

  _handleUnfollowerPressed = () => {
    this.props.item.is_follower = false;
    this.forceUpdate();
    clearTimeout(this.delaySaveTimer);
    this.delaySaveTimer = setTimeout(() => {
      requestAnimationFrame(() => {
        this.props._handleUnfollowerPressed(this.props.item.id);
      });
    }, 2000);
  };

  render() {
    return (
      <View>
        {!this.props.item.is_follower && (
          <TouchableOpacity
            onPress={this._handleFollowerPressed}>
            <LinearGradient
                style={[styles.sendMessage,styles.follow]}
                colors={['#FF8635', '#FF7735', '#FF6635']}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}>
              <Text style={{fontSize: 16,color: "#fff"}}>
                Follow
              </Text>
              <Image
                style={{ width: 17, height: 13,resizeMode: 'cover',marginLeft: 6 }}
                source={require("../assets/images/userPlus.png")}/>
            </LinearGradient>
          </TouchableOpacity>
        )}
        {this.props.item.is_follower && (
          <TouchableOpacity
            onPress={this._handleUnfollowerPressed}
            style={[styles.sendMessage,styles.unfollow]}>
              <Text style={{fontSize: 15,color: color.grayColor}}>
                Unfollow
              </Text>
          </TouchableOpacity>
        )}
      </View>
    );
  }
}
const styles = StyleSheet.create({
  sendMessage: {
    borderRadius: 10,
    height: 40,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: 'center',
  },
  unfollow:{
    borderWidth: 1,
    backgroundColor: color.lightGrayColor,
    borderColor: color.grayColor,
  }
});
export default FollowUnfollowUser;
