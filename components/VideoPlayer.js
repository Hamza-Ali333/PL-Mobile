import React from "react";
import {
  View,
  TouchableOpacity,
  Image,
  StyleSheet,
  Platform,
} from "react-native";
import { Video, Audio } from "expo-av";
import * as VideoThumbnails from "expo-video-thumbnails";

import color from "../constants/Colors";
import FontFamily from "../constants/FontFamily";
import link from "../constants/link";
import { _handleOfferWatched } from "./CombineFunction";

class VideoPlayer extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      isPlaying: false,
      pauseButtonDisplay: true,
      replayButtonDisplay: false,
      image: null,
    };
    this.videoplayer, this.clearTimeout;
  }

  componentDidMount() {
    if (this.props.show) {
      if (Platform.OS === "ios") {
        this.generateThumbnail();
      }
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
        if (this.props.isWatched === false) {
          _handleOfferWatched(this.props.offer_id);
          if (typeof this.props._scrollToBottom === "function") {
            this.props._scrollToBottom();
          }
        }

        this.setState({ replayButtonDisplay: true });
        if (this.videoplayer) {
          this.videoplayer.stopAsync();
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
    this.videoplayer.pauseAsync();
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
    let { image } = this.state;
    let uri = link.s3 + this.props.uri;
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
            ref={(ref) => {
              this.videoplayer = ref;
            }}
            source={{
              uri: uri,
            }}
            //ignoreSilentSwitch={"ignore"}
            rate={1.0}
            volume={1.0}
            isMuted={false}
            resizeMode="contain"
            shouldCorrectPitch={true}
            onPlaybackStatusUpdate={(playbackStatus) =>
              this._onPlaybackStatusUpdate(playbackStatus)
            }
            style={{
              flex: 1,
              backgroundColor: "#fff",
              height: typeof item !== undefined ? parseInt(item.height) : 350,
              justifyContent: "center",
              alignItems: "center",
            }}
          />
        </View>
      );
    }

    return null;
  }
}

const styles = StyleSheet.create({});

export default VideoPlayer;
