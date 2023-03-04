import React, { useEffect, useState } from "react";
import link from "../constants/link";
import { Image } from "react-native";

const UploadImage = ({ item, groupId }) => {
  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (item && groupId) {
      let url = link.url + "/uploads/group_images/" + groupId + "/" + item;

      setImageUrl(url);
    }
  }, [item]);

  return (
    <Image
      style={{ width: 100, height: 100, borderRadius: 50 }}
      source={
        imageUrl !== ""
          ? {
              uri: imageUrl,
            }
          : require("../assets/images/camera_icon.png")
      }
    />
  );
};

export default UploadImage;
