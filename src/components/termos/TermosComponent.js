import React from "react";
import { View, Text, StyleSheet, ScrollView } from "react-native";
import {
  responsiveSize,
  screenWidthPercentage,
  screenHeightPercentage,
} from "../../helpers/utils";
import { Colors } from "../../assets/theme";

export default class PermissionsComponent extends React.Component {
  render() {
    return (
      <ScrollView style={styles.container}>
        <View style={styles.containerHeader}>
          <Text style={styles.textHeader}>{this.props.title}</Text>
        </View>
        <Text style={styles.textBody}>{this.props.body}</Text>
      </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginHorizontal: screenWidthPercentage(3),
  },
  containerHeader: {
    alignItems: "center",
    marginVertical: screenHeightPercentage(5),
  },
  textHeader: {
    fontSize: responsiveSize(3),
    fontWeight: "600",
    color: Colors.darkTertiary,
  },
  textBody: {
    fontSize: responsiveSize(2),
    textAlign: "justify",
  },
});
