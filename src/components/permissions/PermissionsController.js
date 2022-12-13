import React from "react";
import Permissions from "react-native-permissions";
import { Platform } from "react-native";
import PermissionsComponent from "./PermissionsComponent";
import AndroidOpenSettings from "react-native-android-open-settings";
import { getUserInfos, updateUserByParam } from "../../helpers/databaseHelpers";
export default class PermissionController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      content: [],
      autorizaMapa: false,
      keyOnFocus: null,
      nomeMapa: null,
      user: null,
    };
    this.checkPermissions();
    this.getUser();
  }

  checkPermissions = async () => {
    const content = [
      { permission: "location", label: "Localização" },
      { permission: "camera", label: "Câmera" },
    ];
    if (Platform.OS === "ios") {
      content.push({ permission: "notification", label: "Notificação" });
    }

    content.forEach((item) => {
      item.label = item.label;
      item.description = permissions[`${item.permission}_description`];
      item.status = "denied";
      this.setStatus(item);
    });

    Permissions.checkMultiple(content.map((item) => item.permission))
      .then((response) => {
        content.forEach((item) => {
          item.status = response[item.permission];
          this.setStatus(item);
        });

        this.setState({ content });
      })
      .catch((error) => {
        this.setState({ content });
      });
  };

  getUser = async () => {
    let { nomeMapa, autorizaMapa, uid } = await getUserInfos();
    this.setState({ nomeMapa, autorizaMapa, user: uid });
  };

  setStatus = (permission) => {
    if (permission.status === "authorized") {
      permission.statusLabel = "Permitido";
    } else {
      permission.statusLabel = "Permitir";
    }
  };

  onFocus = (key) => {
    const { keyOnFocus } = this.state;
    if (keyOnFocus !== key) this.setState({ keyOnFocus: key });
  };

  onBlur = async () => {
    this.setState({ keyOnFocus: null });
    await updateUserByParam(this.state.user, "nomeMapa", this.state.nomeMapa);
  };

  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value,
    });
  };

  requestPermission = (permission, status) => {
    if (status !== "authorized") {
      Permissions.request(permission)
        .then((response) => {
          if (Platform.OS === "ios" && response === "denied")
            Permissions.openSettings().then(() => this.checkPermissions());
          this.setState(
            {
              status: { ...this.state.status, [permission]: response },
            },
            () => this.checkPermissions()
          );
        })
        .catch((error) => console.log(error));
    } else if (Platform.OS === "ios") {
      Permissions.openSettings().then((_) => this.checkPermissions());
    } else {
      AndroidOpenSettings.appDetailsSettings();
    }
  };

  setMapaAutorizacao = async () => {
    await updateUserByParam(
      this.state.user,
      "autorizaMapa",
      !this.state.autorizaMapa
    );
    this.setState({ autorizaMapa: !this.state.autorizaMapa });
  };

  render() {
    return (
      <PermissionsComponent
        content={this.state.content}
        keyOnFocus={this.state.keyOnFocus}
        autorizaMapa={this.state.autorizaMapa}
        nomeMapa={this.state.nomeMapa}
        request={this.requestPermission}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        onChangeHandler={this.onChangeHandler}
        setMapaAutorizacao={this.setMapaAutorizacao}
      />
    );
  }
}

const permissions = {
  location_description:
    "Utilizaremos sua localização para o rastreio dos Beacons.",
  notification_description:
    "Utilizaremos as notificações para informar eventos importantes ocorridos na plataforma.",
  camera_description:
    "Utilizaremos a câmera para buscar imagens para o utilizador.",
  // "Utilizaremos a câmera para ler códigos QRCode e facilitar o cadastro de um dispositivo.",
  alertTitle: "Permissão de acesso à",
  alertMessage:
    "Acesse as prefêrencias do app nas Configurações do aparelho, toque em Permissões para alterar a opção de",
};
