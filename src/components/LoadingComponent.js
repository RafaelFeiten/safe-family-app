import React, { Component } from "react";
import { View, Text, ActivityIndicator } from "react-native";
import { Colors } from "../assets/theme";
export default class LoadingComponent extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    const { size, style, label, labelStyle, color } = this.props;

    return (
      <View style={style}>
        <ActivityIndicator size={size} color={color || Colors.lightBlack} />
        <Text style={labelStyle}>{label}</Text>
      </View>
    );
  }
}
