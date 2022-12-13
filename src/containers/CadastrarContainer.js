import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import CadastrarController from "../components/cadastrar/CadastrarController";

export default class CadastrarContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <CadastrarController
          navigation={this.props.navigation}
          modoSelecao={false}
          utilizador={null}
        />
      </ScreenLayout>
    );
  }
}
