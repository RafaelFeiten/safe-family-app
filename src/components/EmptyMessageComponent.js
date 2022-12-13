import React, { Component } from "react";
import { View, Text, StyleSheet, Image, ImageBackground } from "react-native";
import { Colors } from "../assets/theme";
import { ASSETS } from "../assets/index";

export default class EmptyMessageComponent extends Component {
  render() {
    const { message, color, source, children } = this.props;
    return (
      <ImageBackground
        source={source}
        style={{ width: "100%", height: "100%" }}
      >
        <View style={styles.container}>
          <Text style={[styles.emptyMessage, color ? { color: color } : null]}>
            {message || "Ops! Você ainda não possui items aqui!"}
          </Text>
        </View>
        <View
          style={{
            justifyContent: "center",
            alignItems: "center",
            marginBottom: "10%"
          }}
        >
          {children}
        </View>
      </ImageBackground>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center"
  },
  emptyMessage: {
    color: Colors.redPrimary,
    fontSize: 20,
    fontWeight: "bold",
    textAlign: "center",
    color: "gray"
  },
  emptyIcon: {
    resizeMode: "center"
  }
});
