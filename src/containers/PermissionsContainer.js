import React from "react";
import ScreenLayout from "../components/ScreenLayout";
import PermissionsController from "../components/permissions/PermissionsController";
import NavigationHeader from "../navigation/NavigationHeader";
export default class PermissionsContainer extends React.Component {
  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <NavigationHeader
          title={"Permissões"}
          showBackButton={true}
          pressBackButton={this.props.navigation.pop}
        />
        <PermissionsController />
      </ScreenLayout>
    );
  }
}
