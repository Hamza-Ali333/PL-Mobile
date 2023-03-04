import React, { Component } from "react";
import { DeviceEventEmitter } from "react-native";
export const postWithProgress = (url, data) => {
  return new Promise((resolve, reject) => {
    var oReq = new XMLHttpRequest();

    oReq.upload.onprogress = function (e) {
      if (e.lengthComputable) {
        var percentComplete = (e.loaded / e.total) * 100;
        DeviceEventEmitter.emit("event.progress", percentComplete);
      }
    };
    oReq.open("POST", url, true);
    oReq.send(data);
    oReq.onload = function () {
      if (oReq.readyState == XMLHttpRequest.DONE) {
        let data = JSON.parse(oReq.responseText);
        resolve(data);
      }
    };
  });
};
