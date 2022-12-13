import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import ProfileController from "../components/profile/ProfileController";
import NavigationHeader from "../navigation/NavigationHeader";

export default class ProfileContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <NavigationHeader
          title={"Meu Cadastro"}
          showBackButton
          pressBackButton={this.props.navigation.pop}
        />
        <ProfileController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
