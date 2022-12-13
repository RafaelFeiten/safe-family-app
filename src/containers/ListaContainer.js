import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import ListaController from "../components/lista/ListaController";
import NavigationHeader from "../navigation/NavigationHeader";

export default class ListaContainer extends Component {
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
          title={"Beacons próximos"}
          showBackButton
          pressBackButton={this.props.navigation.pop}
        />
        <ListaController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
