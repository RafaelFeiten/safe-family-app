import React, { Component } from "react";
import MoreController from "../components/more/MoreController";
import ScreenLayout from "../components/ScreenLayout";
import NavigationHeader from "../navigation/NavigationHeader";
export default class HomeContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <MoreController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
