import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import UtilizadorController from "../components/utilizador/UtilizadorController";
import NavigationHeader from "../navigation/NavigationHeader";

export default class UtilizadorContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <NavigationHeader
          title={"Novo Utilizador"}
          showBackButton={true}
          pressBackButton={this.props.navigation.pop}
        />
        <UtilizadorController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
