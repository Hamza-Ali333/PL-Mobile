import React, { Component, useEffect, useRef, useState } from "react";
import {
  ScrollView,
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  FlatList,
  Button,
  ActivityIndicator,
} from "react-native";
import color from "../../constants/Colors.js";
import link from "../../constants/link";
import client from "../../constants/client";
import FontFamily from "../../constants/FontFamily.js";
import * as FileSystem from "expo-file-system";
import { AntDesign, Feather, MaterialIcons } from "@expo/vector-icons";
import { Audio } from "expo-av";
import VideoPlayer from "../../components/CourseVideoPlayer";
import videoCompletedMutation from "../../graphql/mutations/videoCompletedMutation";
import getClasses from "../../graphql/queries/getClasses";
import getCourseCertificate from "../../graphql/queries/getCourseCertificate";
import * as Permissions from "expo-permissions";
import * as MediaLibrary from "expo-media-library";

function GoToClassScreen(props) {
  let item = props.navigation.getParam("item");
  const [sections, setSection] = useState([1, 2, 3]);
  const [videoData, setVideData] = useState([1, 2, 3, 4]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [selectedDocument, setSelectedDocument] = useState(null);
  const [selectedAudio, setSelectedAudio] = useState(null);
  const [sound, setSound] = React.useState();
  const [selectedItem, setSelectedItem] = useState(null);
  const [isCompleted, setisCompleted] = useState(false);
  const [loading, setLoading] = useState(false);
  const videoplayer = useRef(null);

  const { navigation } = props;

  const _choosen = (selectedItem, item) => {
    setSelectedItem(selectedItem);
    if (selectedItem.video_path !== null) {
      setSelectedVideo(selectedItem.video_path);
      setSelectedAudio(null);
      setSelectedDocument(null);
    } else if (selectedItem.audio_path !== null) {
      setSelectedVideo(null);
      setSelectedAudio(selectedItem.audio_path);
      setSelectedDocument(null);
    } else if (selectedItem.document_path !== null) {
      setSelectedVideo(null);
      setSelectedAudio(null);
      setSelectedDocument(selectedItem.document_path);
    }
  };

  useEffect(() => {
    if (item.contents.data.length > 0) {
      if (item.contents.data[0].content_modules[0].video_path) {
        setSelectedVideo(item.contents.data[0].content_modules[0].video_path);
      } else if (item.contents.data[0].content_modules[0].document_path) {
        setSelectedDocument(
          item.contents.data[0].content_modules[0].document_path
        );
      } else if (item.contents.data[0].content_modules[0].audio_path) {
        setSelectedAudio(item.contents.data[0].content_modules[0].audio_path);
      }
      setSelectedItem(item.contents.data[0].content_modules[0]);
    } else {
      setSelectedVideo(null);
      setSelectedDocument(null);
      setSelectedAudio(null);
    }
  }, []);

  // ............. Audio
  async function playSound() {
    const { sound } = await Audio.Sound.createAsync(
      // require("./assets/Hello.mp3")
      { uri: selectedAudio }
    );
    setSound(sound);
    await sound.playAsync();
  }

  const saveFile = async (fileUri) => {
    const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
    if (status === "granted") {
      const asset = await MediaLibrary.createAssetAsync(fileUri);
      await MediaLibrary.createAlbumAsync("Download", asset, true);
      alert("Saved to Photos");
    }
  };
  const handleDownloadCertificate = () => {
    setLoading(true);

    client
      .query({
        query: getCourseCertificate,
        variables: { id: item.id },
      })
      .then((result) => {
        let item = result;

        setLoading(false);
        let url = link.url + "/" + item.data.getCertificate.naadac;
        // let fileUri = FileSystem.documentDirectory + new Date() + ".png";
        let fileUri = FileSystem.documentDirectory + "certificate.png";
        FileSystem.downloadAsync(url, fileUri)

          .then(({ uri }) => {
            saveFile(uri);
          })
          .catch((error) => {
            console.error(error);
          });
      })
      .catch((error) => {});
  };

  const handleVideoCompleted = (flag) => {
    setisCompleted(flag);
    if (flag) {
      client.mutate({
        mutation: videoCompletedMutation,
        variables: {
          id: selectedItem.id,
        },

        optimisticResponse: {
          __typename: "Mutation",
          course_watched: {
            __typename: "Module",
            id: selectedItem.id,
            is_completed: true,
          },
        },

        update: (store, { data: { course_watched } }) => {
          try {
            const data = store.readQuery({
              query: getClasses,
            });

            // let completedVideo = null;

            data.courses.data.map((c) => {
              c.contents.data.map((d) => {
                if (d.content_modules.length > 0) {
                  let completedVideo = d.content_modules.find(
                    (m) => m.id === selectedItem.id
                  );
                  completedVideo.is_completed = true;
                }
              });
            });

            store.writeQuery({ query: getClasses, data });
          } catch (e) {}
        },
      });
    }
  };

  useEffect(() => {
    return sound
      ? () => {
          sound.unloadAsync();
        }
      : undefined;
  }, [sound]);
  // .............

  const downloadFile = (url) => {
    // const { uri: localUri } = await FileSystem.downloadAsync(remoteUri, FileSystem.documentDirectory + 'name.ext');
    FileSystem.downloadAsync(url, FileSystem.documentDirectory + "doc.pdf")
      .then(({ uri }) => {})
      .catch((error) => {});
  };

  const renderItem = ({ item, index }) => {
    const isSelected = selectedItem === item;
    const backgroundColor = isSelected ? color.primaryColor : color.whiteColor;
    const imageColor = isSelected ? color.whiteColor : color.blackColor;
    const textColor = isSelected ? color.whiteColor : color.grayColor;
    const titleColor = isSelected ? color.whiteColor : color.blackColor;
    const itemPadding = isSelected ? 5 : 0;
    const borderRadius = isSelected ? 6 : 0;

    let moduleName = null;
    let video = false;
    let doc = false;
    let audio = false;

    if (item.module_video_original_name !== null) {
      moduleName = item.module_video_original_name;
      video = true;
    } else if (item.module_audio_original_name !== null) {
      moduleName = item.module_audio_original_name;
      audio = true;
    } else if (item.module_document_original_name) {
      moduleName = item.module_document_original_name;
      doc = true;
    }

    // console.log("video item >>", item);

    return (
      <TouchableOpacity
        onPress={() => _choosen(item)}
        style={[
          styles.divider,
          {
            backgroundColor: backgroundColor,
            padding: itemPadding,
            borderRadius: borderRadius,
          },
        ]}
      >
        <View style={styles.list}>
          <View style={styles.counter}>
            <Text style={styles.counterText}>{index + 1}</Text>
          </View>
          <View style={styles.leacutresWrap}>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
              }}
            >
              <Text style={[styles.courseTitle, { color: titleColor }]}>
                {moduleName}
              </Text>

              {item.is_completed ? (
                <View style={styles.watchedBadge}>
                  <Feather name="check" size={11} color={color.whiteColor} />
                </View>
              ) : null}
            </View>

            <View style={styles.leacutreVideoLength}>
              <MaterialIcons
                name="closed-caption"
                size={20}
                color={textColor}
              />
              {video === true ? (
                <Text style={[styles.leacutreTime, { color: textColor }]}>
                  Video
                </Text>
              ) : null}
            </View>
          </View>
          {video === true ? (
            <></>
          ) : doc === true ? (
            <TouchableOpacity
              style={styles.playButton}
              onPress={() => downloadFile(selectedDocument)}
            >
              <AntDesign name="download" size={22} color={imageColor} />
            </TouchableOpacity>
          ) : null}
        </View>
      </TouchableOpacity>
    );
  };

  const renderSections = () => {
    const isSelected = selectedItem === item.card_id;
    const backgroundColor = isSelected
      ? color.primaryColor
      : color.lightGrayColor;
    const imageColor = isSelected ? color.whiteColor : color.primaryColor;
    const textColor = isSelected ? color.whiteColor : color.grayColor;
    return item.contents.data.map((s) => (
      <View>
        <View style={styles.spacing} />
        <Text style={{ color: color.grayColor, fontSize: 12 }}>
          {s.content_name}
        </Text>

        <FlatList
          data={s.content_modules}
          renderItem={renderItem}
          showsVerticalScrollIndicator={false}
          keyExtractor={(item) => item.id}
        />
      </View>
    ));
  };

  return (
    <ScrollView
      contentContainerStyle={{ flexGrow: 1 }}
      showsVerticalScrollIndicator={false}
    >
      <View style={styles.container}>
        <View style={styles.video}>
          {selectedVideo !== null ? (
            <VideoPlayer
              uri={selectedVideo}
              item={{ height: 200 }}
              navigation={navigation}
              handleVideoCompleted={handleVideoCompleted}
              // style={{ height: 200 }}
              onLoad={() => {
                <ActivityIndicator color="red" />;
              }}
              // ref={videoplayer}
              // uri={props.uri}
              // item={{ height: 200 }}
              // navigation={navigation}
            />
          ) : selectedDocument !== null ? (
            <TouchableOpacity
              style={{
                height: 200,
                backgroundColor: color.lightGrayColor,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
              onPress={() => downloadFile(selectedDocument)}
            >
              <AntDesign name="filetext1" size={110} color={color.grayColor} />
              <Text
                style={{
                  color: color.primaryColor,
                  fontFamily: FontFamily.Medium,
                  fontSize: 16,
                  marginTop: 13,
                }}
              >
                Download
              </Text>
            </TouchableOpacity>
          ) : selectedAudio !== null ? (
            <View
              style={{
                height: 200,
                backgroundColor: color.lightGrayColor,
                borderRadius: 6,
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Text>Audio</Text>
              <Button title="Play Sound" onPress={playSound} />
            </View>
          ) : null}

          {/* <View style={styles.leacutreTitleCurrent}>
            <Text style={styles.courseTitle}>{item.course_name}</Text>
          </View> */}
        </View>
        <View style={styles.divider} />
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Text style={styles.courseTitle}>Lecutres</Text>
          {item.module_percentage >= 100 ? (
            <View style={{ flexDirection: "row" }}>
              <Text style={[styles.text, { fontSize: 14 }]}>Cerificate: </Text>

              {loading ? (
                <View>
                  <ActivityIndicator size="small" color="#000" />
                </View>
              ) : (
                <TouchableOpacity onPress={handleDownloadCertificate}>
                  <Text
                    style={[
                      styles.text,
                      { fontSize: 14, color: color.primaryColor },
                    ]}
                  >
                    Download
                  </Text>
                </TouchableOpacity>
              )}
            </View>
          ) : null}
        </View>

        {renderSections()}
      </View>
    </ScrollView>
  );
}

GoToClassScreen.navigationOptions = (screenProps) => ({
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
  headerTitle: () => (
    <Text style={styles.headerPageTitle}>
      {screenProps.navigation.getParam("courseName")}
    </Text>
  ),
});

const styles = StyleSheet.create({
  headerPageTitle: {
    fontFamily: FontFamily.Bold,
    color: color.blackColor,
    fontSize: 20,
  },
  container: {
    flex: 1,
    backgroundColor: "#fff",
    paddingLeft: 10,
    paddingRight: 10,
  },
  boxShadow: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  list: {
    flexDirection: "row",
    alignItems: "center",
  },
  leacutresWrap: {
    flex: 1,
  },
  leacutreVideoLength: {
    flexDirection: "row",
    alignItems: "center",
  },
  leacutreTime: {
    color: color.grayColor,
    fontFamily: FontFamily.Regular,
    fontSize: 13,
  },
  counter: {
    marginRight: 10,
    width: 22,
    height: 22,
    backgroundColor: color.lightGrayColor,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
  },
  counterText: {
    fontFamily: FontFamily.Medium,
    fontSize: 11,
  },
  courseTitle: {
    fontFamily: FontFamily.Medium,
    fontSize: 16,
  },
  watchedBadge: {
    width: 16,
    height: 16,
    backgroundColor: "#2ECC71",
    borderRadius: 30,
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 5,
  },
  dash: {
    backgroundColor: color.grayColor,
    width: 4,
    height: 1,
    marginHorizontal: 8,
  },
  leacutreTitleCurrent: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 13,
  },
  title: {
    fontFamily: FontFamily.Medium,
    fontSize: 18,
  },
  divider: {
    // height: 1,
    // backgroundColor: color.lightGrayColor,
    marginVertical: 13,
  },
  playButton: {
    paddingHorizontal: 10,
    padding: 8,
  },
  spacing: {
    height: 13,
  },
  text: {
    color: color.black,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
  grayText: {
    color: color.grayColor,
    fontSize: 16,
    fontFamily: FontFamily.Regular,
  },
  primaryText: {
    color: color.primaryColor,
    fontSize: 16,
    fontFamily: FontFamily.Medium,
  },
});

export default GoToClassScreen;
