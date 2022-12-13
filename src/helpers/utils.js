import { Dimensions } from "react-native";
import { getStatusBarHeight } from "react-native-status-bar-height";
import moment from "moment";
import DeviceInfo from "react-native-device-info";

const { width, height } = Dimensions.get("window");
const smallDeviceHeight = 680;

export const statusBarHeight = getStatusBarHeight(true);
export const deviceWidth = width;
export const deviceHeight = height;

export const screenHeightPercentage = (value) => {
  const viewport = Dimensions.get("window");
  return (viewport.height / 100) * value;
};

export const screenWidthPercentage = (value) => {
  const viewport = Dimensions.get("window");
  return (viewport.width / 100) * value;
};

export const responsiveSize = (f) => {
  const tempHeight = (16 / 9) * width;
  return Math.sqrt(Math.pow(tempHeight, 2) + Math.pow(width, 2)) * (f / 100);
};

export const formatTimeFromNow = (time) => {
  return moment(time).fromNow();
};

export const isSmallDevice = () => {
  return deviceHeight <= smallDeviceHeight;
};

export const mask = (data, mask) => {
  var masked = data.split("");
  if (mask === "cnpj") {
    masked.splice(2, 1, ".");
    masked.splice(6, 0, ".");
    masked.splice(9, 0, "/");
    masked.splice(14, 0, "-");
    return masked.join("");
  } else if (mask === "telefone") {
    masked.splice(0, 0, "(");
    masked.splice(3, 0, ") ");
    masked.splice(-4, 0, "-");
    return masked.join("");
  } else {
    return data;
  }
};

export const getTime = () => {
  let time = new Date();
  console.log("time", time);
  return time.getTime();
};

export const getDeviceInfos = () => {
  const appName = DeviceInfo.getApplicationName();
  const deviceName = DeviceInfo.getDeviceName();
  const deviceId = DeviceInfo.getDeviceId();
  const systemVersion = DeviceInfo.getSystemVersion();
  const appVersion = DeviceInfo.getVersion();

  const infos = { appName, appVersion, deviceId, systemVersion, deviceName };
  console.log("infos", infos);
  return infos;
};

export const getImageName = (data) => {
  data = data.toString();
  let parts = data.split(".");
  let name = `${getTime()}.${parts[parts.length - 1]}`;
  return name;
};

export const cleanRepeatArray = (data) => {
  return data.filter((x, i) => data.indexOf(x) === i);
};

export const formateDatePadrao = (data) => {
  return `${new Date(data).getDate()}/${new Date(data).getMonth()} - ${new Date(
    data
  ).getHours()}:${new Date(data).getMinutes()}`;
};
