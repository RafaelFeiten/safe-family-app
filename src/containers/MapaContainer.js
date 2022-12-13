import React, { Component } from "react";
import MapaController from "../components/mapa/MapaController";

export default class MapaContainer extends Component {
  render() {
    return (
      <MapaController
        navigation={this.props.navigation}
        esconderUsuarios={this.props.navigation.getParam("esconderUsuarios")}
        esconderBeaconsPerdidos={this.props.navigation.getParam(
          "esconderBeaconsPerdidos"
        )}
      />
    );
  }
}
