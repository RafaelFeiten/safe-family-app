import React, { Component } from "react";
import { View, StatusBar } from "react-native";
import RootNavigator from "../navigation/RootNavigator";
import { Colors } from "../assets/theme";
import SplashScreen from "react-native-splash-screen";
import { Provider } from "react-redux";
import store from "../store";
import "react-native-gesture-handler";

export default class MainContainer extends Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    SplashScreen.hide();
    let moment = require("moment");
    require("moment/locale/pt-br");
    moment.locale("pt-br");
  }
  render() {
    return (
      <Provider store={store}>
        <View style={{ flex: 1 }}>
          <StatusBar backgroundColor={Colors.black} />
          <RootNavigator />
        </View>
      </Provider>
    );
  }
}
