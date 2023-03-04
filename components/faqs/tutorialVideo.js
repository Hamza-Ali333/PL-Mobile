import * as React from "react";
import { View, StyleSheet, Button } from "react-native";
import { Video, AVPlaybackStatus } from "expo-av";

export default function TutorialVideo(props) {
  const video = React.useRef(null);
  const [status, setStatus] = React.useState({});
  return (
    <View style={{ flex: 1 }}>
      <Video
        ref={video}
        style={{ height: 250, width: "100%" }}
        source={{
          uri: props.uri,
        }}
        useNativeControls
        resizeMode="contain"
        isLooping
        onPlaybackStatusUpdate={(status) => setStatus(() => status)}
      />
    </View>
  );
}
