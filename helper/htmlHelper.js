import React from "react";
import color from "../constants/Colors";
import { EU } from "../components/react-native-mentions-editor";
import { Text } from "react-native";
import ReactHtmlParser from "react-html-parser";
import * as WebBrowser from "expo-web-browser";

const addValidUrl = (url) => {
  let newUrl = window.decodeURIComponent(url);
  newUrl = newUrl.trim().replace(/\s/g, "");

  if (/^(:\/\/)/.test(newUrl)) {
    return `http${newUrl}`;
  }
  if (!/^(f|ht)tps?:\/\//i.test(newUrl)) {
    return `http://${newUrl}`;
  }

  return newUrl;
};

const _onLinkPressed = async (item) => {
  await WebBrowser.openBrowserAsync(addValidUrl(item[0].data));
};
const formatMentionNode = (txt, key) => {
  return (
    <Text key={key} style={{ color: "#FF8635" }}>
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
              key={index}
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
                key={index}
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
                key={index}
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
                key={index}
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
              <Text key={index} style={{ borderWidth: 1 }}>
                {"\n"}
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "ol") {
            return (
              <Text key={index} style={{ borderWidth: 1 }}>
                {"\n"}
                {node.children.map((item, index) =>
                  transform(item, index, "num")
                )}
              </Text>
            );
          }
          if (node.name === "li") {
            let num = index + 1;
            return (
              <Text
                key={index}
                style={{
                  lineHeight: 21,
                  fontSize: 15,
                  color: color.blackColor,
                  paddingLeft: 0,
                }}
              >
                {option === "num" ? `\n\t` + num + ` ` : `\n\u2022`}
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "a") {
            return (
              <Text
                onPress={() => _onLinkPressed(node.children)}
                key={index}
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
                <Text
                  key={index}
                  onPress={profile.bind(this, node.attribs.id)}
                  style={{
                    color: color.primaryColor,
                  }}
                >
                  {" "}
                  {node.attribs.value}{" "}
                </Text>
              );
            }
          }
          if (node.name === "mention") {
            if (node.attribs.id !== undefined) {
              return (
                <Text
                  key={index}
                  onPress={profile.bind(this, node.attribs.id)}
                  style={{
                    color: color.primaryColor,
                  }}
                >
                  {node.children.map((item, index) => transform(item, index))}
                </Text>
              );
            }
          }
          if (node.name === "span") {
            return (
              <Text key={index}>
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "p") {
            return (
              <Text key={index}>
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
          }
          if (node.name === "br") {
            return <Text key={index}>{"\n\n"}</Text>;
          }
          if (node.name === "img") {
            if (node.attribs.src !== undefined) {
              return null;
            }
          }
          if (node.name == "strong") {
            return (
              <Text
                key={index}
                style={{
                  fontFamily: "Lato-Bold",
                }}
              >
                {node.children.map((item, index) => transform(item, index))}
              </Text>
            );
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
