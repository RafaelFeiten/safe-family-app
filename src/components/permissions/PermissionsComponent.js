import React from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styled from "@emotion/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import {
  responsiveSize,
  screenWidthPercentage,
  screenHeightPercentage,
} from "../../helpers/utils";
import { Colors } from "../../assets/theme";

const TextFieldContainer = styled.View({}, ({ color }) => ({
  width: "90%",
  borderRadius: 4,
  marginBottom: responsiveSize(2),
  justifyContent: "center",
  height: 50,
  borderWidth: 1,
  backgroundColor: Colors.white,
  borderColor: color,
  position: "relative",
}));

const Title = styled.Text({}, ({ color }) => ({
  color,
  fontSize: 12,
  fontWeight: "600",
  left: 10,
}));

const TextField = styled.TextInput({
  alignSelf: "flex-start",
  width: "96%",
  top: 4,
  marginHorizontal: 10,
  textAlignVertical: "center",
  padding: 0,
  color: Colors.darkGray,
  fontSize: 16,
});

export default class PermissionsComponent extends React.Component {
  constructor(props) {
    super(props);
  }

  renderItems = ({ item, index }) => {
    return (
      <View style={styles.permissionItem} index={index}>
        <View style={styles.permissionTop}>
          <View style={styles.permissionTitle}>
            <Text style={styles.namePermission}>{item.label}</Text>
          </View>
          <TouchableOpacity
            style={styles.permissionStatus}
            onPress={() => {
              this.props.request(item.permission, item.status);
            }}
          >
            <PermissionStatus status={item.status}>
              {item.statusLabel}
            </PermissionStatus>
          </TouchableOpacity>
        </View>
        <View style={styles.permissionBottom}>
          <View style={{ flex: 1 }}>
            <Text style={styles.description}>{item.description}</Text>
          </View>
        </View>
      </View>
    );
  };

  getColor = (key) => {
    const { keyOnFocus } = this.props;
    if (key === keyOnFocus) {
      return Colors.tertiary;
    }
    return Colors.darkGray;
  };

  render() {
    const { content, setMapaAutorizacao, autorizaMapa } = this.props;
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={screenHeightPercentage(5)}
        enableOnAndroid={true}
        scrollEnabled={false}
      >
        <View style={styles.container}>
          <FlatList
            data={content}
            scrollEnabled={false}
            ListHeaderComponent={
              <View style={{ alignItems: "center" }}>
                <Text
                  style={{
                    fontSize: responsiveSize(2.2),
                    textDecorationLine: "underline",
                    textDecorationColor: Colors.tertiary,
                  }}
                >
                  {"Permissões do Aplicativo"}
                </Text>
              </View>
            }
            renderItem={this.renderItems}
            keyExtractor={(item) => item.permission}
          />
          <View style={{ marginTop: screenHeightPercentage(5) }}>
            <View style={{ alignItems: "center" }}>
              <Text
                style={{
                  fontSize: responsiveSize(2.2),
                  textDecorationLine: "underline",
                  textDecorationColor: Colors.tertiary,
                }}
              >
                {"Permissões do Mapa"}
              </Text>
            </View>
            <View
              style={[styles.permissionItem, { flex: 1, borderBottomWidth: 0 }]}
            >
              <View style={styles.permissionTop}>
                <View style={styles.permissionTitle}>
                  <Text style={styles.namePermission}>
                    {"Localização no mapa"}
                  </Text>
                </View>
                <TouchableOpacity
                  style={styles.permissionStatus}
                  onPress={() => {
                    setMapaAutorizacao();
                  }}
                >
                  <PermissionStatus status={autorizaMapa}>
                    {autorizaMapa ? "Permitido" : "Permitir"}
                  </PermissionStatus>
                </TouchableOpacity>
              </View>
              <View style={styles.permissionBottom}>
                <View style={{ flex: 1 }}>
                  <Text style={styles.description}>
                    {
                      "Ao permitir, você autoriza o aplicativo a mostrar sua localização no mapa para outros usuários."
                    }
                  </Text>
                </View>
              </View>
            </View>
            <View style={{ flex: 2, alignItems: "center" }}>
              <TextFieldContainer color={this.getColor("nomeMapa")}>
                <Title color={this.getColor("nomeMapa")}>Nome</Title>
                <TextField
                  value={this.props.nomeMapa}
                  onChangeText={(data) =>
                    this.props.onChangeHandler("nomeMapa", data)
                  }
                  selectionColor={Colors.tertiary}
                  onFocus={() => this.props.onFocus("nomeMapa")}
                  onBlur={() => this.props.onBlur()}
                  keyboardType={"default"}
                  ref={(input) => {
                    this.nomeInput = input;
                  }}
                />
              </TextFieldContainer>
            </View>
          </View>
        </View>
      </KeyboardAwareScrollView>
    );
  }
}

const PermissionStatus = styled(Text)(
  {
    fontSize: responsiveSize(2),
    fontWeight: "500",
  },
  (props) => ({
    color:
      props.status === "authorized" || props.status === true
        ? "green"
        : Colors.red,
  })
);

const styles = StyleSheet.create({
  lineTop: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  container: {
    flex: 1,
  },
  permissionItem: {
    padding: "4%",
    alignSelf: "flex-start",
    width: "100%",
    borderBottomWidth: 0.7,
    borderBottomColor: Colors.darkGray,
  },
  permissionTop: {
    flex: 1,
    flexDirection: "row",
    paddingBottom: "1%",
  },
  permissionBottom: {
    flex: 2,
    paddingBottom: "1%",
  },
  permissionStatus: {
    flex: 1,
    alignSelf: "center",
    alignItems: "flex-end",
  },
  permissionTitle: {
    flex: 1,
    alignSelf: "center",
    alignItems: "flex-start",
  },
  namePermission: {
    color: Colors.black,
    fontSize: responsiveSize(2),
    fontWeight: "500",
  },
  description: {
    color: Colors.lightBlack,
    fontSize: responsiveSize(1.5),
  },
});
