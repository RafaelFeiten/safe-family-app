import React, { Component } from "react";
import OneSignal from "react-native-onesignal";
import ScreenLayout from "../components/ScreenLayout";
import HomeController from "../components/home/HomeController";
import { getDeviceInfos } from "../helpers/utils";
import { getCurrentUser } from "../helpers/databaseHelpers";

export default class HomeContainer extends Component {
  constructor(props) {
    super(props);

    OneSignal.init("oneSignalAppId");
    this.sendTag();
  }

  componentDidMount() {
    OneSignal.addEventListener("received", this.onReceived.bind(this));
    OneSignal.addEventListener("opened", this.onOpened.bind(this));
    OneSignal.addEventListener("ids", this.onIds.bind(this));
  }

  sendTag = async () => {
    let infos = getDeviceInfos();
    let { appVersion, appName } = infos;
    let { uid } = await getCurrentUser();
    OneSignal.sendTags({ appName, appVersion, user: uid });
  };

  componentWillUnmount() {
    OneSignal.removeEventListener("received", this.onReceived);
    OneSignal.removeEventListener("opened", this.onOpened);
    OneSignal.removeEventListener("ids", this.onIds);
  }

  onReceived(notification) {}
  onIds(device) {}

  onOpened(openResult) {
    if (openResult.action) {
      const { actionID } = openResult.action;
      if (actionID === "ajudar" || actionID === "responder") {
        this.props.navigation.navigate("ChatContainer");
      }
      if (actionID === "visualizar") {
        this.props.navigation.navigate("Maps", {
          esconderLegenda: true,
          esconderUsuarios: true,
        });
      }
    }
  }

  render() {
    return (
      <ScreenLayout hidePaddingTop={true} showImage={true}>
        <HomeController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
