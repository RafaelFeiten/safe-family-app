import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import CadastrarController from "../components/cadastrar/CadastrarController";
import NavigationHeader from "../navigation/NavigationHeader";

export default class CadastrarContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout
        hidePaddingTop={true}
        showImage={true}
        backgroundColor={"white"}
      >
        <NavigationHeader
          title={"Meus Beacons"}
          showBackButton
          pressBackButton={() =>
            this.props.navigation.getParam("pop")
              ? this.props.navigation.pop()
              : this.props.navigation.navigate("HomeContainer")
          }
        />
        <CadastrarController
          navigation={this.props.navigation}
          modoSelecao={true}
          utilizador={this.props.navigation.getParam("utilizador")}
          beaconAntigo={this.props.navigation.getParam("beaconAntigo") || false}
          pop={this.props.navigation.getParam("pop") || false}
        />
      </ScreenLayout>
    );
  }
}
