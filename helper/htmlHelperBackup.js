import React from "react";
import FontFamily from "../constants/FontFamily";
import color from "../constants/Colors";
import { EU } from "../components/react-native-mentions-editor";
import { Text, View, Image, Dimensions, TouchableOpacity } from "react-native";
import ReactHtmlParser from "react-html-parser";
import Lightbox from "react-native-lightbox";

const formatMentionNode = (txt, key) => {
  return (
    <Text
      //onPress={this.navigateProfile.bind(this, key)}
      key={key}
      style={{ color: "#FF8635" }}
    >
      {txt}
    </Text>
  );
};

export const htmlToNative = (text, profile) => {
  const transform = (node, index, option) => {
    if (node) {
      switch (node.type) {
        case "text":
          return (
            <Text
              style={{
                fontSize: 15,
              }}
            >
              {EU.displayTextWithMentions(node.data, formatMentionNode)}
            </Text>
          );
          break;
        case "tag":
          if (node.name == "b") {
            return (
              <Text
                style={{
                  fontFamily: "Lato-Bold",
                }}
              >
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "i") {
            return (
              <Text
                style={{
                  fontStyle: "italic",
                }}
              >
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "u") {
            return (
              <Text
                style={{
                  textDecorationLine: "underline",
                }}
              >
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "ul") {
            return (
              <View style={{ flexDirection: "column", flex: 1 }}>
                {node.children.map((item, index) => transform(item, index))}
              </View>
            );
          }
          if (node.name === "ol") {
            return (
              <View style={{ flexDirection: "column", flex: 1 }}>
                {node.children.map((item, index) =>
                  transform(item, index, "num")
                )}
              </View>
            );
          }
          if (node.name === "li") {
            return (
              <Text
                style={{
                  lineHeight: 21,
                  fontSize: 15,
                  color: color.blackColor,
                }}
              >
                {option === "num" ? index + 1 + ` ` : `\u2022`}
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "a") {
            return (
              <Text
                style={{
                  color: "red",
                }}
              >
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "input") {
            if (node.attribs.value !== undefined) {
              return (
                <TouchableOpacity onPress={profile.bind(this, node.attribs.id)}>
                  <Text
                    style={{
                      color: color.primaryColor,
                    }}
                  >
                    {node.attribs.value}
                  </Text>
                </TouchableOpacity>
              );
            }
          }
          if (node.name === "br") {
            return <Text>{"\n"}</Text>;
          }
          if (node.name === "img") {
            if (node.attribs.src !== undefined) {
              return (
                <View
                  style={{
                    height: 200,
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Lightbox style={{ flex: 1 }} underlayColor="#fff">
                    <Image
                      style={{
                        width: Dimensions.get("window").width,
                        height: "100%",
                      }}
                      source={{
                        uri: node.attribs.src,
                      }}
                    />
                  </Lightbox>
                </View>
              );
            }
          }

          break;
        default:
          return null;
      }
    }
    return null;
  };

  return ReactHtmlParser(text, {
    decodeEntities: true,
    transform,
  });
};

export default htmlToNative;
