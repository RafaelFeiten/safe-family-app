import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  Image,
  StatusBar,
} from "react-native";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
  renderers,
} from "react-native-popup-menu";
import LinearGradient from "react-native-linear-gradient";

const { Popover } = renderers;
import { Colors } from "../assets/theme";
import {
  screenHeightPercentage,
  screenWidthPercentage,
  responsiveSize,
} from "../helpers/utils";
import { ASSETS } from "../assets";

export default class NavigationHeader extends PureComponent {
  createLeftButtons = () => {
    const { showBackButton } = this.props;

    if (showBackButton) {
      const { pressBackButton } = this.props;
      return (
        <TouchableOpacity onPress={() => pressBackButton()}>
          <Image
            source={ASSETS.icons.arrow}
            style={[styles.imageButton, { marginLeft: 10 }]}
          />
        </TouchableOpacity>
      );
    } else {
      return null;
    }
  };

  createRightButtons = () => {
    const { pressMenuButton, options } = this.props;

    if (pressMenuButton) {
      return (
        <Menu
          renderer={Popover}
          rendererProps={{
            preferredPlacement: "bottom",
            placement: "bottom",
            anchorStyle: {
              backgroundColor: Colors.tertiary,
              marginTop: 5,
              marginRight: 5,
            },
          }}
        >
          <MenuTrigger>
            <View
              style={{
                alignItems: "center",
                top: 6,
              }}
            >
              <Image
                source={ASSETS.icons.menu}
                style={[styles.imageButton, { marginRight: 10 }]}
              />
            </View>
          </MenuTrigger>
          <MenuOptions
            style={{
              backgroundColor: Colors.tertiary,
              width: screenWidthPercentage(38),
              paddingHorizontal: screenWidthPercentage(5),
            }}
          >
            {options.map((option, index) => {
              return (
                <>
                  <MenuOption
                    style={{
                      height: 50,
                      justifyContent: "center",
                    }}
                    onSelect={() => pressMenuButton(index)}
                  >
                    <Text style={styles.option}>{option}</Text>
                  </MenuOption>
                  <View
                    style={{ height: 1, backgroundColor: Colors.darkTertiary }}
                  />
                </>
              );
            })}
          </MenuOptions>
        </Menu>
      );
    } else {
      return null;
    }
  };

  render() {
    const { title } = this.props;

    return (
      <LinearGradient
        style={styles.content}
        colors={[Colors.darkTertiary, Colors.tertiary]}
        start={{ x: 0, y: 0.28 }}
        end={{ x: 0, y: 0.85 }}
      >
        <StatusBar barStyle="light-content" />
        <View style={styles.viewLeftButtons}>{this.createLeftButtons()}</View>
        <Text style={styles.title}>{title}</Text>
        <View style={styles.viewRightButtons}>{this.createRightButtons()}</View>
      </LinearGradient>
    );
  }
}

const styles = StyleSheet.create({
  content: {
    opacity: 0.98,
    flexDirection: "row",
    paddingBottom: screenHeightPercentage(3),
    paddingTop: screenHeightPercentage(5.5),
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: Colors.darkTertiary,
    elevation: 25,
  },

  touchableContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 100,
    height: 40,
    marginBottom: 8,
  },
  imageButton: {
    width: 30,
    height: 30,
    tintColor: Colors.white,
  },
  title: {
    fontSize: responsiveSize(3.2),
    color: "white",
    fontFamily: "Roboto-Bold",
  },
  viewLeftButtons: {
    position: "absolute",
    paddingTop: screenHeightPercentage(2),
    flexDirection: "row",
    left: 0,
  },
  viewRightButtons: {
    position: "absolute",
    paddingTop: screenHeightPercentage(2),
    flexDirection: "row",
    right: 0,
  },
  option: {
    color: Colors.white,
    fontSize: responsiveSize(2.2),
    fontWeight: "600",
  },
});
