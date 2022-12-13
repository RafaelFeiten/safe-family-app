import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import { connect } from "react-redux";
import { Colors } from "../assets/theme";

import { screenWidthPercentage, responsiveSize } from "../helpers/utils";
class NavigationTabItem extends PureComponent {
  constructor(props) {
    super(props);
  }

  stylesTab = StyleSheet.create({
    mainButtonContainer: {
      flexDirection: "column",
      justifyContent: "center",
      alignSelf: "center",
      paddingBottom: 10,
      position: "absolute",
    },
    notifContainer: {
      position: "absolute",
      top: 1,
      right: responsiveSize(-2),
      backgroundColor: Colors.white,
      height: 15,
      width: 15,
      borderRadius: 8,
      justifyContent: "center",
      alignItems: "center",
    },
    notifText: {
      fontSize: responsiveSize(1.4),
      fontWeight: "bold",
      textAlign: "center",
    },
  });

  normalButton = () => {
    const {
      focused,
      tabIcon,
      baseColor,
      selectedColor,
      size,
      marginBottom,
    } = this.props;
    return (
      <Image
        source={tabIcon}
        style={{
          resizeMode: "contain",
          tintColor: focused ? selectedColor : baseColor,
          height: size || 25,
          width: size || 25,
          marginBottom: marginBottom || 5,
        }}
      />
    );
  };

  render() {
    const {
      focused,
      tabLabel,
      tabIcon,
      baseColor,
      selectedColor,
      mensagensNaoLidas,
    } = this.props;
    if (!tabIcon)
      return (
        <View
          style={{
            justifyContent: "flex-end",
            alignItems: "center",
            width: screenWidthPercentage(33),
          }}
        >
          <Text
            style={{
              color: focused ? selectedColor : baseColor,
              fontWeight: "600",
            }}
          >
            {tabLabel}
          </Text>
        </View>
      );
    return (
      <View style={{ flex: 1, justifyContent: "flex-end" }}>
        <View style={{ borderTopWidth: 1, alignSelf: "flex-start" }} />
        {tabLabel === "Chat" && mensagensNaoLidas > 0 && (
          <View style={this.stylesTab.notifContainer}>
            <Text style={this.stylesTab.notifText}>{mensagensNaoLidas}</Text>
          </View>
        )}
        <View style={this.stylesTab.mainButtonContainer}>
          {this.normalButton()}
        </View>
        <View style={{ alignItems: "center", justifyContent: "center" }}>
          <Text
            style={{
              color: focused ? selectedColor : baseColor,
              fontSize: responsiveSize(1.45),
            }}
          >
            {tabLabel}
          </Text>
        </View>
      </View>
    );
  }
}

const mapStateToProps = (state) => ({
  mensagensNaoLidas: state.mensagens.naoLidas,
  state: state.mensagens,
});

export default connect(mapStateToProps)(NavigationTabItem);
