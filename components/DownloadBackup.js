import * as FileSystem from "expo-file-system";
import link from "../constants/link";

const callback = (downloadProgress) => {
  const progress =
    downloadProgress.totalBytesWritten /
    downloadProgress.totalBytesExpectedToWrite;
};

const downloadResumable = FileSystem.createDownloadResumable(
  link.url + "/uploads/chatBackup/827/ChatApp.sqlite3",
  FileSystem.documentDirectory + "/SQLite/ChatApp",
  {},
  callback
);

export const downloadStart = async () => {
  try {
    const { uri } = await downloadResumable.downloadAsync();
  } catch (e) {
    console.error(e);
  }
};
