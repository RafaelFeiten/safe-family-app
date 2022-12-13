import React from "react";
import ProfileRegistrationController from "../components/profileRegistration/ProfileRegistrationController";
import ScreenLayout from "../components/ScreenLayout";
import NavigationHeader from "../navigation/NavigationHeader";

export default class ProfileRegistrationContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <NavigationHeader
          title={"Registre-se"}
          showBackButton
          pressBackButton={this.props.navigation.pop}
        />
        <ProfileRegistrationController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
