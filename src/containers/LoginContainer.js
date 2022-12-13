import React, { Component } from "react";
import LoginController from "../components/login/LoginController";
import ScreenLayout from "../components/ScreenLayout";

export default class LoginContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout showImage={true}>
        <LoginController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
