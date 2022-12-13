import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import ChangePasswordController from "../components/changePassword/ChangePasswordController";
import NavigationHeader from "../navigation/NavigationHeader";

export default class ChangePasswordContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <NavigationHeader
          title={"Trocar Senha"}
          showBackButton
          pressBackButton={this.props.navigation.pop}
        />
        <ChangePasswordController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
