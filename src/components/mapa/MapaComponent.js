import React, { Component } from "react";
import { Image, View, Text, TouchableOpacity } from "react-native";
import Map, { Marker, PROVIDER_GOOGLE, Callout } from "react-native-maps";
import { withNavigationFocus } from "react-navigation";
import { mapStyle, Colors } from "../../assets/theme";
import { ASSETS } from "../../assets";
import { responsiveSize, formateDatePadrao } from "../../helpers/utils";

class MapView extends Component {
  renderUserCallout(marker) {
    return (
      <Callout
        style={{
          width: parseInt(marker.nome.length * responsiveSize(1.2)),
          minWidth: parseInt(7 * responsiveSize(1.2)),
        }}
        tooltip
      >
        <Text
          style={{
            color: Colors.white,
            fontSize: responsiveSize(1.8),
            textAlign: "center",
          }}
        >
          {marker.nome || `Anônimo`}
        </Text>
      </Callout>
    );
  }

  renderBeaconCallout(marker) {
    return (
      <Callout
        style={{
          width: marker.utilizador
            ? parseInt(marker.utilizador.length * responsiveSize(1.2))
            : 0,
          minWidth: parseInt(7 * responsiveSize(1.2)),
        }}
        tooltip
      >
        <Text
          style={{
            color: Colors.white,
            fontSize: responsiveSize(1.8),
            textAlign: "center",
          }}
        >
          {marker.utilizador || `Anônimo`}
        </Text>
        <Text
          style={{
            color: Colors.white,
            fontSize: responsiveSize(1.4),
            textAlign: "center",
          }}
        >
          {`${formateDatePadrao(marker.dataRastreio)}`}
        </Text>
      </Callout>
    );
  }

  render() {
    const {
      latitude,
      longitude,
      users,
      onPress,
      style,
      showUsuarios,
      showBeaconsPerdidos,
      beacons,
    } = this.props;

    return (
      <>
        <Map
          provider={PROVIDER_GOOGLE}
          style={style}
          customMapStyle={mapStyle}
          initialRegion={{
            latitude: -29.583317,
            longitude: -50.9059124,
            latitudeDelta: 0.025,
            longitudeDelta: 0.025,
          }}
          showsUserLocation={true}
          onPress={onPress}
          zoomEnabled
          rotateEnabled
          scrollEnabled
          loadingEnabled
        >
          {users.length > 0 &&
            showUsuarios &&
            users.map((marker, index) => (
              <Marker key={index} coordinate={marker.lastLocation}>
                <Image
                  source={ASSETS.icons.pin}
                  style={{
                    height: responsiveSize(3),
                    width: responsiveSize(3),
                    tintColor: Colors.gray,
                  }}
                />
                {this.renderUserCallout(marker)}
              </Marker>
            ))}
          {beacons.length > 0 &&
            showBeaconsPerdidos &&
            beacons.map((marker, index) => (
              <Marker key={index} coordinate={marker.position}>
                <Image
                  source={ASSETS.icons.pin}
                  style={{
                    height: responsiveSize(3),
                    width: responsiveSize(3),
                    tintColor: Colors.red,
                  }}
                />
                {this.renderBeaconCallout(marker)}
              </Marker>
            ))}
        </Map>
        <View
          style={{
            height: responsiveSize(8),
            width: responsiveSize(15),
            position: "absolute",
            opacity: 0.3,
            borderRadius: 10,
            backgroundColor: Colors.white,
            marginTop: responsiveSize(5),
            marginLeft: responsiveSize(1),
          }}
        />
        <View
          style={{
            position: "absolute",
            marginTop: responsiveSize(5),
            marginLeft: responsiveSize(1.5),
            height: responsiveSize(8),
            width: responsiveSize(15),
            justifyContent: "space-around",
          }}
        >
          <TouchableOpacity
            onPress={() => {
              this.props.changeStatus("showUsuarios");
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={showUsuarios ? ASSETS.icons.pin : ASSETS.icons.pinOff}
              style={{
                height: responsiveSize(3),
                width: responsiveSize(3),
                tintColor: Colors.gray,
              }}
            />
            <Text style={{ color: Colors.white }}> {"- Usuários"}</Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => {
              this.props.changeStatus("showBeaconsPerdidos");
            }}
            style={{ flexDirection: "row", alignItems: "center" }}
          >
            <Image
              source={
                showBeaconsPerdidos ? ASSETS.icons.pin : ASSETS.icons.pinOff
              }
              style={{
                height: responsiveSize(3),
                width: responsiveSize(3),
                tintColor: Colors.redPrimary,
              }}
            />
            <Text style={{ color: Colors.white }}> {"- Beacons"}</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  }
}
export default withNavigationFocus(MapView);
