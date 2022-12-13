import React from "react";
import ScreenLayout from "../components/ScreenLayout";
import ForgotPassController from "../components/forgotPass/ForgotPassController";
import NavigationHeader from "../navigation/NavigationHeader";
export default class ForgotPassContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { navigation } = this.props;
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <NavigationHeader
          title={"Recuperar Senha"}
          showBackButton
          pressBackButton={this.props.navigation.pop}
        />
        <ForgotPassController navigation={navigation} />
      </ScreenLayout>
    );
  }
}
