import * as React from "react";
import {
  View,
  Image,
  Modal,
  TouchableWithoutFeedback,
  TouchableOpacity,
} from "react-native";
import styles from "./styles";
import ImageViewer from "react-native-image-zoom-viewer";
import { AntDesign } from "@expo/vector-icons";

class ImagesGrid extends React.Component {
  _isMounted = false;

  constructor(props) {
    super(props);

    this.state = {
      visible: false,
      index: 0,
    };
  }

  render() {
    let attaches = [];
    let attachments = this.props.item.attachments ?? [];
    // for (var i = 0; i < attachments.length; i++) {
    //   attaches[i] = {
    //     ...attachments[i],
    //     url: OptimizeImage(attachments[i].attachment_url, attachments[i].type),
    //   };
    // }
    return (
      <>
        <Modal visible={this.state.visible} transparent={true}>
          <TouchableOpacity
            onPress={() => this.setState({ visible: false })}
            style={styles.close}
          >
            <AntDesign name="close" size={24} color="white" />
          </TouchableOpacity>
          <ImageViewer
            useNativeDriver={true}
            imageUrls={attaches.filter((attach) => attach.type === "image")}
            index={this.state.index}
          />
        </Modal>
        <View style={styles.ImagesGrid}>
          {attaches &&
            attaches
              .filter((attach) => attach.type === "image")
              .map((item, key) => (
                <View key={key} style={styles.arrayImagesGrid}>
                  <TouchableWithoutFeedback
                    onPress={() => this.setState({ visible: true, index: key })}
                  >
                    <View>
                      <Image
                        style={styles.ImagesGridphoto}
                        source={{
                          uri: item.url,
                        }}
                      />
                    </View>
                  </TouchableWithoutFeedback>
                </View>
              ))}
        </View>
      </>
    );
  }
}

export default ImagesGrid;
