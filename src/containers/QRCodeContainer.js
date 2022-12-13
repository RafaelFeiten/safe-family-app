import React, { Component } from "react";
import { View, Alert, Platform } from "react-native";
import QRCodeController from "../components/QRcode/QRCodeController";
import Permissions from "react-native-permissions";
// import AndroidOpenSettings from "react-native-android-open-settings";

export default class QRCodeContainer extends Component {
  constructor(props) {
    super(props);
    this.state = {
      authorized: false
    };
  }

  static navigationOptions = {
    tabBarVisible: false
  };

  componentDidMount() {
    const { navigation } = this.props;
    this.subs = [
      navigation.addListener("didFocus", () => this.checkPermission())
    ];
  }

  onRead = result => {
    console.log("result", result);
  };

  onClose = () => {
    const { navigation } = this.props;
    this.setState({ authorized: false });
    console.log("onClose");
    navigation.pop();
  };

  checkPermission = () => {
    Permissions.check("camera").then(response => {
      console.log("response", response);
      if (response !== "authorized") {
        if (
          (Platform.OS === "ios" && response === "denied") ||
          response === "restricted"
        ) {
          Alert.alert(
            "Por favor, permita câmera.",
            "O Safe Kids precisa da sua permissão de acesso a câmera para esta funcionalidade.",
            [
              {
                text: "Permitir",
                onPress: () => {
                  Platform.OS === "ios"
                    ? Permissions.openSettings()
                    : // AndroidOpenSettings.appDetailsSettings();
                      null;
                  this.props.navigation.pop();
                }
              }
            ],
            { cancelable: false }
          );
        } else
          Permissions.request("camera").then(response => {
            if (response === "authorized") {
              this.setState({ authorized: true });
            } else {
              this.props.navigation.pop();
            }
          });
      } else {
        this.setState({ authorized: true });
      }
    });
  };

  render() {
    return (
      <View style={{ flex: 1 }}>
        {this.state.authorized && (
          <QRCodeController
            navigation={this.props.navigation}
            onRead={this.onRead}
            onClose={this.onClose}
          />
        )}
      </View>
    );
  }
}
