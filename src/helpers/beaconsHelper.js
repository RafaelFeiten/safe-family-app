import Kontakt from "react-native-kontaktio";
import Permissions from "react-native-permissions";
import Geolocation from "@react-native-community/geolocation";

const { connect, startScanning } = Kontakt;

export const readIOSBeacon = async () => {
  //=== IOS ===
  const status = await Permissions.request("location");
};

export const readAndroidBeacon = async () => {
  const status = await Permissions.request("location");
  if (status === "authorized") {
    connect()
      .then(() => {
        startScanning();
      })
      .catch((error) => {
        console.log("erro ao start do scannign");
        console.log(error);
      });
  }
};

export const getUserLocation = async () => {
  let locationPermission = await Permissions.check("location");
  if (locationPermission === "undetermined") {
    locationPermission = await Permissions.request("location");
  }

  return new Promise((resolve) => {
    if (locationPermission === "authorized") {
      Geolocation.getCurrentPosition(
        (position) => {
          resolve(position.coords);
        },
        (error) => {
          console.log("error", error);
          console.log("Localização não encontrada");
          resolve(false);
        },
        { enableHighAccuracy: false, timeout: 20000 }
      );
    } else {
      console.log("Permissão de localização não concedida");
      resolve(false);
    }
  });
};

export const getBeaconDistance = (beacon, mock) => {
  if (mock) {
    return new Date().getTime().toString()[9];
  }

  const { rssi, txPower } = beacon;
  if (!rssi || rssi === 0) {
    return "-";
  }

  let ratio = (rssi * 1) / txPower;

  let distance = 0.89976 * Math.pow(ratio, 7.7095) + 0.111;
  return Math.round(distance);
};
