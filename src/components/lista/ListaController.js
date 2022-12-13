import React, { Component } from "react";
import { Platform, DeviceEventEmitter } from "react-native";
import ListaComponent from "./ListaComponent";
import { readIOSBeacon, readAndroidBeacon } from "../../helpers/beaconsHelper";
import {
  getBeaconById,
  getCurrentUser,
  saveNewBeacon,
} from "../../helpers/databaseHelpers";

export default class ListaController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beaconList: [],
      userId: "eu",
      showModal: false,
      titleModal: "",
      messageModal: "",
      firstAction: false,
      secondAction: false,
      firstLabel: false,
      secondLabel: false,
      isLoadingModal: false,
      indexOnFocus: null,
      keyOnFocus: null,
      descricao: null,
    };
  }

  componentDidMount() {
    this.getUserInfos();

    if (Platform.OS === "ios") {
      readIOSBeacon();
    } else {
      DeviceEventEmitter.addListener("beaconsDidUpdate", this.scanningBeacon);
      readAndroidBeacon();
    }
  }

  getUserInfos = () => {
    getCurrentUser()
      .then((user) => {
        this.setState({ userId: user.uid });
      })
      .catch((e) => {
        console.log("erro ao get user", e);
      });
  };

  closeModal = (acao) => {
    this.setState({ showModal: false });
    if (acao === "voltar") this.props.navigation.pop();
  };

  onFocus = (key) => {
    const { keyOnFocus } = this.state;
    if (keyOnFocus !== key) this.setState({ keyOnFocus: key });
  };

  onBlur = () => {
    this.setState({ keyOnFocus: null });
  };

  setIndex = (index) => {
    if (!this.state.beaconList[index].owner) {
      if (this.state.indexOnFocus === index) {
        this.setState({ indexOnFocus: null });
      } else {
        this.setState({ indexOnFocus: index });
      }
    } else {
      let message = "Você não pode cadastrar este beacon...";
      let title = "Ops...";
      this.setState({
        showModal: true,
        titleModal: title,
        messageModal: message,
        firstAction: null,
        firstLabel: "Ok",
      });
    }
  };

  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value,
    });
  };

  cadastrarBeacon = async (item) => {
    const { descricao, userId } = this.state;
    this.setState({ isLoadingModal: true, showModal: true });

    let uuid = `${item.uuid}-${item.major}-${item.minor}`;
    let model = {
      created: new Date().getTime(),
      owner: userId,
      ativo: false,
      status: "normal",
      descricao,
    };

    let erro = await saveNewBeacon(uuid, model);
    if (!erro) {
      let message =
        "O Beacon foi cadastrado com sucesso! Você poderá visualiza-lo na sua lista.";
      let title = "Sucesso!";
      this.setState({
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        secondAction: null,
        secondLabel: null,
        firstAction: "voltar",
        firstLabel: "Ok",
      });
    } else {
      let message =
        "Ocorreu um erro ao salvar o Beacon. \nTente novamente dentro de alguns instantes.";
      let title = "Ops...";
      this.setState({
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        secondAction: null,
        secondLabel: null,
        firstAction: null,
        firstLabel: "Ok",
      });
    }
  };

  scanningBeacon = async ({ beacons }) => {
    let { beaconList } = this.state;
    let uuids = beaconList.map((b) => {
      return `${b.uuid}-${b.major || 0}-${b.minor || 0}`;
    });
    await Promise.all(
      beacons.map(async (beacon) => {
        let uuid = `${beacon.uuid}-${beacon.major || 0}-${beacon.minor || 0}`;
        let exist = uuids.includes(uuid);
        if (!exist) {
          let { owner } = await getBeaconById(uuid);
          beaconList.push({
            uuid: beacon.uuid,
            major: beacon.major,
            minor: beacon.minor,
            owner,
          });
          this.setState({ beaconList });
        }
      })
    );
  };

  render() {
    return (
      <ListaComponent
        beaconList={this.state.beaconList}
        descricao={this.state.descricao}
        keyOnFocus={this.state.keyOnFocus}
        indexOnFocus={this.state.indexOnFocus}
        userId={this.state.userId}
        cadastrarBeacon={this.cadastrarBeacon}
        closeModal={this.closeModal}
        firstAction={this.state.firstAction}
        firstLabel={this.state.firstLabel}
        isLoadingModal={this.state.isLoadingModal}
        secondLabel={this.state.secondLabel}
        secondAction={this.state.secondAction}
        showModal={this.state.showModal}
        onFocus={this.onFocus}
        onChangeHandler={this.onChangeHandler}
        onBlur={this.onBlur}
        setIndex={this.setIndex}
        titleModal={this.state.titleModal}
        messageModal={this.state.messageModal}
      />
    );
  }
}
