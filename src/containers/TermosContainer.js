import React from "react";
import ScreenLayout from "../components/ScreenLayout";
import TermosController from "../components/termos/TermosController";
import NavigationHeader from "../navigation/NavigationHeader";
export default class TermosContainer extends React.Component {
  render() {
    return (
      <ScreenLayout hidePaddingTop={true}>
        <NavigationHeader
          title={"Termos de uso"}
          showBackButton={true}
          pressBackButton={this.props.navigation.pop}
        />
        <TermosController
          title={this.props.navigation.getParam("title")}
          body={this.props.navigation.getParam("body")}
        />
      </ScreenLayout>
    );
  }
}
