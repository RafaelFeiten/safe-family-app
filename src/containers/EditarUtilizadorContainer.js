import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import EditarUtilizadorController from "../components/editarUtilizador/EditarUtilizadorController";
import NavigationHeader from "../navigation/NavigationHeader";
import { MenuProvider } from "react-native-popup-menu";
export default class EditarUtilizadorContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <MenuProvider>
        <ScreenLayout hidePaddingTop={true} showImage={true}>
          <EditarUtilizadorController
            navigation={this.props.navigation}
            utilizador={this.props.navigation.getParam("utilizador")}
            beacon={this.props.navigation.getParam("beacon")}
          />
        </ScreenLayout>
      </MenuProvider>
    );
  }
}
