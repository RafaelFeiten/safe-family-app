import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  Image,
  ScrollView,
  View,
} from "react-native";
import styled from "@emotion/native";
import { ASSETS } from "../../assets";
import LinearGradient from "react-native-linear-gradient";
import { Colors } from "../../assets/theme";
import {
  responsiveSize,
  mask,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../../helpers/utils";
import LoadingComponent from "../LoadingComponent";

const Item = styled(TouchableOpacity)(
  {
    flexDirection: "row",
    height: screenHeightPercentage(10),
    alignItems: "center",
  },
  (props) => ({
    backgroundColor: props.index % 2 === 1 ? null : Colors.white,
    borderBottomWidth: 0.3,
    borderColor: Colors.darkGray,
  })
);

export default class MoreComponent extends PureComponent {
  renderButtons = () => {
    const { content } = this.props;

    if (content && content.length > 0) {
      const { actionPress } = this.props;

      return content.map((item, index) => {
        return (
          <Item index={index} onPress={() => actionPress(item.action)}>
            <Image
              source={ASSETS.icons[item.thumb]}
              style={stylesView.itemImage}
            />
            <Text style={stylesView.itemText}>{item.label}</Text>
          </Item>
        );
      });
    } else {
      return <View />;
    }
  };

  render() {
    return (
      <View style={stylesView.general}>
        <LinearGradient
          colors={[Colors.darkTertiary, Colors.white]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerContainerAbsolute}
        />
        <View style={styles.first}>
          {this.props.profile ? (
            <Text style={styles.title}>{this.props.profile.nome}</Text>
          ) : (
            <LoadingComponent />
          )}
        </View>
        <View style={styles.midle}>
          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.statusContainer}>
                <Image
                  source={ASSETS.icons.email}
                  style={[styles.icon, { tintColor: Colors.white }]}
                />
                <View style={styles.labelContainer}>
                  <Text style={[styles.iconStatus, { color: Colors.white }]}>
                    Email
                  </Text>
                </View>
              </View>
            </View>
            <View style={[styles.col, { alignItems: "flex-end" }]}>
              {this.props.profile ? (
                <Text
                  style={[styles.dataStatus, { color: Colors.white }]}
                  numberOfLines={1}
                >
                  {this.props.profile.email}
                </Text>
              ) : (
                <LoadingComponent />
              )}
            </View>
          </View>

          <View style={styles.row}>
            <View style={styles.col}>
              <View style={styles.statusContainer}>
                <Image
                  source={ASSETS.icons.smartphone}
                  style={[styles.icon, { tintColor: Colors.black }]}
                />
                <View style={styles.labelContainer}>
                  <Text style={styles.iconStatus}>Telefone</Text>
                </View>
              </View>
            </View>
            <View style={[styles.col, { alignItems: "flex-end" }]}>
              {this.props.profile ? (
                <Text style={styles.dataStatus}>
                  {mask(this.props.profile.telefone, "telefone")}
                </Text>
              ) : (
                <LoadingComponent />
              )}
            </View>
          </View>
        </View>
        <View
          style={{
            flex: 1,
          }}
        >
          {this.renderButtons()}
        </View>
        <View
          style={{
            backgroundColor: "white",
            position: "absolute",
            height: screenHeightPercentage(17),
            width: screenWidthPercentage(100),
            bottom: 0,
            opacity: 0.5,
            justifyContent: "space-between",
            alignItems: "flex-end",
            flexDirection: "row",
            padding: 3,
          }}
        >
          <Text> Rafael M. Feiten</Text>
          <Text>{"1.3.1"}</Text>
        </View>
      </View>
    );
  }
}

const stylesView = StyleSheet.create({
  general: {
    flex: 1,
  },
  itemImage: {
    width: 30,
    height: 30,
    marginLeft: 30,
    marginRight: 15,
    tintColor: Colors.darkTertiary,
  },
  itemText: {
    color: Colors.black,
    fontSize: responsiveSize(1.8),
  },
  versionText: {
    color: Colors.lightBlack,
  },
  footer: {
    flexDirection: "row",
    margin: responsiveSize(0.1),
    justifyContent: "space-between",
    padding: responsiveSize(0.5),
  },
});

const styles = StyleSheet.create({
  first: {
    justifyContent: "center",
    alignItems: "center",
    flex: 0.1,
    marginTop: screenHeightPercentage(5),
  },
  headerContainerAbsolute: {
    position: "absolute",
    height: screenHeightPercentage(40),
    backgroundColor: Colors.white,
    width: screenWidthPercentage(100),
    opacity: 0.8,
  },
  title: {
    fontSize: responsiveSize(3.5),
    color: Colors.white,
    fontWeight: "bold",
  },
  midle: {
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    flex: 0.4,
    paddingHorizontal: responsiveSize(2.3),

    borderBottomWidth: 0.3,
    borderColor: Colors.darkGray,
  },
  row: {
    flexDirection: "row",
    flex: 0.5,
    justifyContent: "space-between",
  },
  col: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-start",
  },
  statusContainer: {
    flexDirection: "row",
    justifyContent: "center",
  },
  icon: {
    resizeMode: "contain",
    height: responsiveSize(3.8),
    width: responsiveSize(3.8),
    tintColor: Colors.darkGray,
  },
  iconStatus: {
    color: Colors.blackS,
    fontWeight: "bold",
    fontSize: responsiveSize(2.4),
  },
  labelContainer: {
    justifyContent: "center",
    paddingLeft: "8%",
  },
  dataStatus: {
    color: Colors.blackS,
    fontSize: responsiveSize(1.9),
  },
});
