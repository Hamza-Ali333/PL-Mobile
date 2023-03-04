import React, { Component } from "react";
import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Animated,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import color from "../constants/Colors";
import link from "../constants/link";
import { Audio } from "expo-av";
import * as Permissions from "expo-permissions";
import uuid from "react-native-uuid";

export default class RecordingAnimation extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isPressed: false,
      animated: new Animated.Value(0),
      opacityA: new Animated.Value(1),
      haveRecordingPermissions: false,
      isLoading: false,
      isPlaybackAllowed: false,
      muted: false,
      soundPosition: null,
      soundDuration: null,
      recordingDuration: null,
      shouldPlay: false,
      isPlaying: false,
      isRecording: false,
      fontLoaded: false,
      shouldCorrectPitch: true,
      volume: 1.0,
      rate: 1.0,
      token: null,
      loading: false,
    };
    this._onPress = this._onPress.bind(this);
    this.recording = null;
    this.sound = null;
    this.isSeeking = false;
    this.shouldPlayAtEndOfSeek = false;
    try {
      this.recordingSettings = JSON.parse(
        JSON.stringify(
          (Audio.RECORDING_OPTIONS_PRESET_HIGH_QUALITY = {
            android: {
              extension: ".m4a",
              outputFormat: Audio.RECORDING_OPTION_ANDROID_OUTPUT_FORMAT_MPEG_4,
              audioEncoder: Audio.RECORDING_OPTION_ANDROID_AUDIO_ENCODER_AAC,
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
            },
            ios: {
              extension: ".m4a",
              outputFormat: Audio.RECORDING_OPTION_IOS_OUTPUT_FORMAT_MPEG4AAC,
              audioQuality: Audio.RECORDING_OPTION_IOS_AUDIO_QUALITY_MIN,
              sampleRate: 44100,
              numberOfChannels: 2,
              bitRate: 128000,
              linearPCMBitDepth: 16,
              linearPCMIsBigEndian: false,
              linearPCMIsFloat: false,
            },
          })
        )
      );
    } catch (e) {}
  }

  componentDidMount() {
    this._setUserSession();
  }

  _setUserSession = async () => {
    const save = await AsyncStorage.getItem("userSession");
    const item = JSON.parse(save);
    this.setState({ token: item.token });
  };

  _askForPermissions = async () => {
    const response = await Permissions.askAsync(Permissions.AUDIO_RECORDING);
    this.setState({
      haveRecordingPermissions: response.status === "granted",
    });
  };

  _updateScreenForRecordingStatus = (status) => {
    if (status.canRecord) {
      this.setState({
        isRecording: status.isRecording,
        recordingDuration: status.durationMillis,
      });
    } else if (status.isDoneRecording) {
      this.setState({
        isRecording: false,
        recordingDuration: status.durationMillis,
      });
      if (!this.state.isLoading) {
        this._stopRecordingAndEnablePlayback();
      }
    }
  };

  _stopPlaybackAndBeginRecording = async () => {
    this.setState({
      isLoading: true,
    });
    if (this.sound !== null) {
      await this.sound.unloadAsync();
      this.sound.setOnPlaybackStatusUpdate(null);
      this.sound = null;
    }
    await Audio.setAudioModeAsync({
      allowsRecordingIOS: true,
      interruptionModeIOS: Audio.INTERRUPTION_MODE_IOS_DO_NOT_MIX,
      playsInSilentModeIOS: true,
      shouldDuckAndroid: true,
      interruptionModeAndroid: Audio.INTERRUPTION_MODE_ANDROID_DO_NOT_MIX,
      playThroughEarpieceAndroid: false,
      staysActiveInBackground: true,
    });
    if (this.recording !== null) {
      this.recording.setOnRecordingStatusUpdate(null);
      this.recording = null;
    }

    const recording = new Audio.Recording();
    await recording.prepareToRecordAsync(this.recordingSettings);
    recording.setOnRecordingStatusUpdate(this._updateScreenForRecordingStatus);

    this.recording = recording;
    await this.recording.startAsync(); // Will call this._updateScreenForRecordingStatus to update the screen.
    this.setState({
      isLoading: false,
    });
  };

  createFormData = (photo, body) => {
    const data = new FormData();

    data.append("file", {
      name: "audio-file.3gp",
      type: "audio/3gp",
      uri: Platform.OS === "android" ? photo : photo.replace("", ""),
    });

    Object.keys(body).forEach((key) => {
      data.append(key, body[key]);
    });

    return data;
  };

  handleUploadPhoto = (file) => {
    return fetch(link.url + "/api/attachment/upload", {
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        Authorization: `Bearer ${this.state.token}` || null,
      },
      body: this.createFormData(file, { userId: "123" }),
    })
      .then((response) => response.json())
      .then((response) => response)
      .catch((error) => {
        this.setState({ loading: false });
      });
  };

  _stopRecordingAndEnablePlayback = async () => {
    this.setState({
      isLoading: true,
      loading: true,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
    //const info = await FileSystem.getInfoAsync(this.recording.getURI());
    const file = await this.handleUploadPhoto(this.recording.getURI());

    const _id = uuid.v4();
    const _date = new Date();
    this.props.socket.emit("chat_message", [
      {
        _id: _id,
        createdAt: _date,
        text: "audio message",
        audio: link.url + "/" + file.path,
        user: this.props._user(),
      },
    ]);
    this.setState({ loading: false });
  };

  _onRecordPressed = () => {
    this._askForPermissions();
    if (this.state.isRecording) {
      this._stopRecordingAndEnablePlayback();
    } else {
      this._stopPlaybackAndBeginRecording();
    }
  };

  _onCancelRecordPressed = async () => {
    this.setState({
      isLoading: true,
      loading: false,
    });
    try {
      await this.recording.stopAndUnloadAsync();
    } catch (error) {
      // Do nothing -- we are already unloaded.
    }
  };

  _getMMSSFromMillis(millis) {
    const totalSeconds = millis / 1000;
    const seconds = Math.floor(totalSeconds % 60);
    const minutes = Math.floor(totalSeconds / 60);

    const padWithZero = (number) => {
      const string = number.toString();
      if (number < 10) {
        return "0" + string;
      }
      return string;
    };
    return padWithZero(minutes) + ":" + padWithZero(seconds);
  }

  _getRecordingTimestamp() {
    if (this.state.recordingDuration != null) {
      return `${this._getMMSSFromMillis(this.state.recordingDuration)}`;
    }
    return `${this._getMMSSFromMillis(0)}`;
  }

  _runAnimation() {
    const { animated, opacityA } = this.state;

    Animated.loop(
      Animated.parallel([
        Animated.timing(animated, {
          toValue: 1,
          duration: 1000,
        }),
        Animated.timing(opacityA, {
          toValue: 0,
          duration: 1000,
        }),
      ])
    ).start();
  }
  _stopAnimation() {
    Animated.loop(
      Animated.parallel([Animated.timing(animated), Animated.timing(opacityA)])
    ).stop();
  }
  _onPress() {
    this.setState((state) => ({ isPressed: !state.isPressed }));
  }
  _micLoader() {
    const { loading } = this.state;
    if (loading) {
      return <ActivityIndicator size="small" color={color.primaryColor} />;
    } else {
      return (
        <TouchableOpacity onPress={this._onRecordPressed}>
          <Ionicons color={color.primaryColor} size={25} name="md-mic" />
        </TouchableOpacity>
      );
    }
  }
  _micButton() {
    const { isPressed, animated, opacityA } = this.state;
    if (this.state.isRecording) {
      return (
        <View
          style={{
            marginRight: 20,
            marginLeft: 20,
            flexDirection: "row",
            justifyContent: "center",
            opacity: opacityA,
          }}
        >
          <TouchableOpacity onPress={this._onCancelRecordPressed}>
            <Ionicons
              size={45}
              color="#ec1328"
              name="ios-close-circle-outline"
            />
          </TouchableOpacity>

          <View style={{ justifyContent: "center" }}>
            <Text style={[styles.recordingTimestamp, {}]}>
              {this._getRecordingTimestamp()}
            </Text>
          </View>

          <TouchableOpacity onPress={this._onRecordPressed}>
            <Ionicons
              size={45}
              color="#40e41b"
              name="ios-checkmark-circle-outline"
            />
          </TouchableOpacity>
        </View>
      );
    } else {
      //some function
      return (
        <View
          style={{
            width: 50,
            height: 50,
            borderRadius: 50,
            backgroundColor: "#ffffff",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          {this._micLoader()}
        </View>
      );
    }
  }

  render() {
    return (
      <View style={styles.container}>
        {/*Platform.OS === "android" ? this._micButton() : null*/}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {},
  recordingTimestamp: {
    paddingLeft: 20,
    paddingRight: 20,
  },
});
