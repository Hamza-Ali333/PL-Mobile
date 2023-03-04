import React, { useCallback, useRef, useState } from "react";
import {
  StyleSheet,
  Image,
  View,
  TouchableOpacity,
  ImageBackground,
  Linking,
  Dimensions,
} from "react-native";
import { Model } from "react-model";
import VideoPlayer from "../components/CourseVideoPlayer";
import Swiper from "react-native-swiper";
import Colors from "../constants/Colors";
const { width } = Dimensions.get("window");

export default React.memo(function SlideViewer(props) {
  const videoplayer = useRef(null);

  let mediaUrl;
  if (props.album !== null) {
    mediaUrl = props.album;
  }

  let mediaLength = mediaUrl.length;

  interface SlideState {
    imgList: [];
    loadQueue: mediaLength;
  }

  interface SlideActions {
    loaded: mediaLength;
  }

  const SlideSchema: ModelType<SlideState, SlideActions> = {
    state: {
      imgList: mediaUrl,
      loadQueue: [0],
    },
    actions: {
      loaded: (index) => {
        return (state) => {
          state.loadQueue[index] = 1;
        };
      },
    },
  };

  const Slide = (props) => {
    return (
      <View style={styles.slide}>
        {props.extension === "mp4" ||
        props.extension === "mov" ||
        props.extension === "avi" ? (
          <VideoPlayer
            onLoad={() => {
              props.loadHandle(props.i);
            }}
            ref={videoplayer}
            uri={props.uri}
            item={{ height: 200 }}
            navigation={props.navigation}
          />
        ) : props.youtube_link ? (
          <TouchableOpacity
            activeOpacity={0.8}
            onPress={() => Linking.openURL(props.youtube_link)}
          >
            <ImageBackground
              imageStyle={[
                styles.image,
                { justifyContent: "center", alignItems: "center" },
              ]}
              source={{ uri: props.uri }}
              style={[
                styles.image,
                { justifyContent: "center", alignItems: "center" },
              ]}
              resizeMode="contain"
            >
              <Image
                source={require("../assets/images/play-button.png")}
                style={{ height: 50, width: 50 }}
              />
            </ImageBackground>
          </TouchableOpacity>
        ) : (
          <Image
            onLoad={() => {
              props.loadHandle(props.i);
            }}
            style={styles.image}
            source={{ uri: props.uri }}
            resizeMode={"contain"}
          />
        )}
      </View>
    );
  };

  const [{ useStore }] = useState(() => Model(SlideSchema));
  const [state, actions] = useStore();
  const loadHandle = useCallback((i) => {
    actions.loaded(i);
  }, []);

  return (
    <View
      style={{
        marginTop: 13,
      }}
    >
      <Swiper
        loop={false}
        // renderPagination={renderPagination}
        loadMinimal
        loadMinimalSize={1}
        style={{
          height: 200,
          backgroundColor: "grey",
        }}
        activeDotStyle={{ backgroundColor: Colors.primaryColor }}
      >
        {state.imgList.map((media, i) => (
          <Slide
            loadHandle={loadHandle}
            extension={media.extension}
            youtube_link={media.youtube_link}
            uri={media.file_path}
            i={i}
            key={i}
            loaded={state.loadQueue[i]}
          />
        ))}
      </Swiper>
    </View>
  );
});

const styles = StyleSheet.create({
  slide: {
    height: 200,
    justifyContent: "center",
    backgroundColor: "white",
  },
  image: {
    width,
    height: 200,
    backgroundColor: "transparent",
    alignSelf: "center",
  },
});
