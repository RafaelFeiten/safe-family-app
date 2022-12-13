import React, { PureComponent } from "react";
import { Image, StyleSheet } from "react-native";
import { SafeAreaView } from "react-navigation";
import { Colors } from "../assets/theme";
import {
  statusBarHeight,
  screenHeightPercentage,
  screenWidthPercentage
} from "../helpers/utils";
import { ASSETS } from "../assets";

export default class ScreenLayout extends PureComponent {
  constructor(props) {
    super(props);
  }

  stylesImage = StyleSheet.create({
    background: {
      height: screenHeightPercentage(100),
      width: screenWidthPercentage(100),
      position: "absolute",
      opacity: 0.02,
      top: -1,
      zIndex: -10
    }
  });

  render() {
    const { children, backgroundColor, showImage, hidePaddingTop } = this.props;

    if (showImage)
      return (
        <SafeAreaView
          forceInset={{ bottom: "never", top: "never" }}
          style={{
            flex: 1,
            paddingTop: hidePaddingTop ? 0 : statusBarHeight,
            backgroundColor: backgroundColor
              ? backgroundColor
              : Colors.background
          }}
        >
          <Image
            style={this.stylesImage.background}
            source={ASSETS.images.background}
          />
          {children}
        </SafeAreaView>
      );
    return (
      <SafeAreaView
        forceInset={{ bottom: "never", top: "never" }}
        style={{
          flex: 1,
          paddingTop: hidePaddingTop ? 0 : statusBarHeight,
          backgroundColor: backgroundColor ? backgroundColor : Colors.background
        }}
      >
        {children}
      </SafeAreaView>
    );
  }
}
