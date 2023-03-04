import React, { useRef } from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
  Text,
  ActivityIndicator,
} from "react-native";
import { Video, Audio } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";
import { withNavigationFocus } from "react-navigation";
import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import { _handleOfferWatched } from "./CombineFunction";
import { Entypo } from "@expo/vector-icons";

const millisToMinutesAndSeconds = (millis) => {
  var minutes = Math.floor(millis / 60000);
  var seconds = ((millis % 60000) / 1000).toFixed(0);
  if (isNaN(minutes) || isNaN(seconds)) {
    return null;
  }
  return `${minutes}:${seconds < 10 ? "0" : ""}${seconds}`;
};

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      pauseButtonDisplay: true,
      replayButtonDisplay: false,
      image: null,
      time: "",
      isBuffering: false,
    };
    this.videoplayer, this.clearTimeout;
  }

  componentDidMount() {
    if (this.props.show) {
      if (Platform.OS === "ios") {
        this.generateThumbnail();
      }
    }

    return () => {
      navFocusListener.remove();
    };
  }

  componentDidUpdate(prevProps) {
    if (prevProps.isFocused !== this.props.isFocused) {
      // Use the `this.props.isFocused` boolean
      this.videoPause();
    }
  }

  generateThumbnail = async () => {
    try {
      const { uri } = await VideoThumbnails.getThumbnailAsync(
        link.s3 + this.props.uri,
        {
          time: 10,
        }
      );
      this.setState({ image: uri });
    } catch (e) {}
  };

  _onPlaybackStatusUpdate = (playbackStatus) => {
    this.setState({
      time: millisToMinutesAndSeconds(
        playbackStatus.durationMillis - playbackStatus.positionMillis
      ),
    });
    if (playbackStatus.isBuffering) {
      this.setState({ isBuffering: true });
    } else {
      this.setState({ isBuffering: false });
    }
    if (playbackStatus.isPlaying) {
      if (!this.state.isPlaying) {
        this.setState({ isPlaying: true, replayButtonDisplay: false });
      }
      if (this.state.pauseButtonDisplay) {
        this.clearTimeout = setTimeout(() => {
          this.setState({ pauseButtonDisplay: false });
        }, 2000);
      }
    } else {
      if (this.state.isPlaying) {
        this.setState({ isPlaying: false, replayButtonDisplay: false });
      }
      if (
        playbackStatus.durationMillis === playbackStatus.positionMillis &&
        playbackStatus.isLoaded
      ) {
        this.setState({ replayButtonDisplay: true });
        if (this.videoplayer) {
          this.videoplayer.stopAsync();
        }
        let flag = false;
        if (typeof this.props.handleVideoCompleted === "function") {
          flag = true;
          this.props.handleVideoCompleted(flag);
        }
      }
      if (!this.state.pauseButtonDisplay) {
        this.setState({ pauseButtonDisplay: true });
      }
    }
  };

  videoPlay = () => {
    this.enableAudio();
    this.videoplayer.playAsync();
  };

  videoPause = () => {
    if (this.videoplayer !== null) {
      this.videoplayer.pauseAsync();
    }
  };

  videoReplay = () => {
    this.videoplayer.replayAsync();
  };

  pauseButtonDisplay = () => {
    clearTimeout(this.clearTimeout);
    this.setState({ pauseButtonDisplay: true });
  };

  enableAudio = async () => {
    try {
      await Audio.setAudioModeAsync({
        allowsRecordingIOS: false,
        interruptionModeIOS: INTERRUPTION_MODE_IOS_DO_NOT_MIX,
        playsInSilentModeIOS: true,
        staysActiveInBackground: false,
        interruptionModeAndroid: INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
        shouldDuckAndroid: false,
      });
    } catch (e) {}
  };

  render() {
    let { image, time, isBuffering } = this.state;
    let uri;
    if (this.props.uri === null) {
      uri = this.props.url;
    } else {
      uri = link.s3 + this.props.uri;
    }
    let item = this.props.item;
    let width = typeof item !== "undefined" ? parseInt(item.width) : 350;
    let height = typeof item !== "undefined" ? parseInt(item.height) : 350;
    //uri = "https://pl-prod-content.s3.amazonaws.com/0/video/4jsjEElQYePOpPUnfEf0vWvDglCZGp0SeEuT9Z9T.mp4";
    if (this.props.show) {
      return (
        <View>
          {image ? (
            <Image
              source={{ uri: image }}
              style={{
                width: this.props.width,
                height: 200,
                resizeMode: "cover",
              }}
            />
          ) : (
            <View style={{ width: this.props.width, height: 200 }}></View>
          )}
          <View
            style={{
              position: "absolute",
              zIndex: 1,
              width: "100%",
              height: "100%",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "rgba(0, 0, 0, .25)",
            }}
          >
            <Image
              style={{
                width: 50,
                height: 45,
                resizeMode: "contain",
              }}
              source={require("../assets/images/playButton.png")}
            />
          </View>
        </View>
      );
    }
    if (!this.props.show) {
      return (
        <View style={[this.props.style]}>
          {!this.state.isPlaying ? (
            this.state.replayButtonDisplay ? (
              <TouchableOpacity
                onPress={this.videoReplay}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, .25)",
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 45,
                    resizeMode: "contain",
                  }}
                  source={require("../assets/images/replayButton.png")}
                />
              </TouchableOpacity>
            ) : isBuffering ? (
              <View
                style={{
                  position: "absolute",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, .25)",
                }}
              >
                <ActivityIndicator size="large" color={color.white} />
              </View>
            ) : (
              <TouchableOpacity
                onPress={this.videoPlay}
                style={{
                  position: "absolute",
                  zIndex: 1,
                  width: "100%",
                  height: "100%",
                  justifyContent: "center",
                  alignItems: "center",
                  backgroundColor: "rgba(0, 0, 0, .25)",
                }}
              >
                <Image
                  style={{
                    width: 50,
                    height: 45,
                    resizeMode: "contain",
                  }}
                  source={require("../assets/images/playButton.png")}
                />
              </TouchableOpacity>
            )
          ) : this.state.pauseButtonDisplay ? (
            <TouchableOpacity
              onPress={this.videoPause}
              style={{
                position: "absolute",
                zIndex: 1,
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
                backgroundColor: "rgba(0, 0, 0, .25)",
              }}
            >
              <Image
                style={{ width: 50, height: 45, resizeMode: "contain" }}
                source={require("../assets/images/pauseButton.png")}
              />
            </TouchableOpacity>
          ) : (
            <TouchableOpacity
              onPress={this.pauseButtonDisplay}
              style={{
                position: "absolute",
                zIndex: 1,
                width: "100%",
                height: "100%",
                justifyContent: "center",
                alignItems: "center",
              }}
            ></TouchableOpacity>
          )}

          <Video
            onLoad={this.props.onLoad}
            shouldPlay={false}
            ref={(ref) => {
              this.videoplayer = ref;
            }}
            source={{
              uri: this.props.uri,
            }}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldCorrectPitch={true}
            onPlaybackStatusUpdate={(playbackStatus) => {
              this._onPlaybackStatusUpdate(playbackStatus);
            }}
            style={{
              backgroundColor: "#fff",
              height: typeof item !== undefined ? parseInt(item.height) : 350,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
          {!!time && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                right: 0,
                backgroundColor: "#000",
                margin: 5,
                padding: 2,
                borderRadius: 5,
              }}
            >
              <Text style={{ color: color.whiteColor, fontSize: 16 }}>
                {time}
              </Text>
            </View>
          )}
          {!!time && (
            <View
              style={{
                position: "absolute",
                bottom: 0,
                left: 0,
                backgroundColor: "#000",
                margin: 5,
                padding: 2,
                borderRadius: 5,
                zIndex: 10,
              }}
            >
              <TouchableOpacity
                style={{ zIndex: 10 }}
                onPress={() => this.videoplayer.presentFullscreenPlayer()}
              >
                <Entypo
                  name="resize-full-screen"
                  size={24}
                  color={color.whiteColor}
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({});

export default withNavigationFocus(VideoPlayer);
