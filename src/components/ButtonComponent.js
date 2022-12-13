import React, { Component } from "react";
import { View, Text, TouchableOpacity, StyleSheet, Image } from "react-native";
import { Colors } from "../assets/theme";
import LinearGradient from "react-native-linear-gradient";

export default class ButtonComponent extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { label, clickable, onPress, paddingHorizontal } = this.props;
    return (
      <TouchableOpacity
        onPress={onPress}
        disabled={clickable === true ? false : true}
      >
        <LinearGradient
          colors={
            clickable === true
              ? [Colors.darkTertiary, Colors.tertiary]
              : [Colors.darkGray, Colors.gray]
          }
          start={{ x: 0, y: 0.28 }}
          end={{ x: 0, y: 0.85 }}
          style={[
            stylesFirst.touchableContainer,
            {
              width: 200 + (paddingHorizontal || 0),
            },
          ]}
        >
          <Text
            style={[
              stylesFirst.label,
              clickable === true ? stylesFirst.labelOn : stylesFirst.labelOff,
            ]}
          >
            {label}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    );
  }
}

const stylesFirst = StyleSheet.create({
  touchableContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: 43,
    marginBottom: 8,
    elevation: 5,
    shadowColor: Colors.black,
    shadowOffset: { height: 0, width: 0 },
    shadowRadius: 8,
  },
  clickable: {
    backgroundColor: Colors.tertiary,
    elevation: 4,
    shadowColor: Colors.darkGray,
    shadowOffset: { height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  noClickable: {
    backgroundColor: Colors.darkGray,
    elevation: 4,
    shadowColor: Colors.darkGray,
    shadowOffset: { height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  label: {
    fontSize: 20,
    fontWeight: "700",
  },
  labelOn: {
    color: Colors.white,
  },
  labelOff: {
    color: Colors.white,
  },
});
