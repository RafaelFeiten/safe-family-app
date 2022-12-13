import React, { Component } from "react";
import CadastrarComponent from "./CadastrarComponent";
import {
  getUserBeacons,
  deleteBeacon,
  updateUtilizador,
  updateBeacon,
  getUtilizadorByBeaconID,
} from "../../helpers/databaseHelpers";

export default class CadastrarController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      beacons: [],
      isLoading: true,
      showModal: false,
      titleModal: "",
      messageModal: "",
      firstAction: false,
      secondAction: false,
      firstLabel: false,
      secondLabel: false,
      isLoadingModal: false,
      beaconSelecionado: null,
    };
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.subs = [
      navigation.addListener("didFocus", () => this.getUserBeacons()),
    ];
  }

  getUserBeacons = async () => {
    let beacons = await getUserBeacons();
    this.setState({ beacons, isLoading: false });
  };

  onPressButton = (index) => {
    if (index === 1) this.props.navigation.navigate("ListaContainer");
    if (index === 2) this.props.navigation.navigate("QRCodeContainer");
  };

  closeModal = (acao) => {
    this.setState({ showModal: false });
    if (acao === "voltar") this.props.navigation.pop();
    if (acao === "home") {
      if (this.props.pop) {
        this.props.navigation.navigate("EditarUtilizadorContainer", {
          beacon: this.state.beaconSelecionado,
        });
      } else {
        this.props.navigation.navigate("HomeContainer");
      }
    }

    if (acao === "delete")
      this.setState({ isLoadingModal: true, showModal: true }, () =>
        this._deleteBeacon(this.state.beacons[this.state.beaconSelecionado])
      );
  };

  deleteBeacon = async (beacon, index) => {
    let message = `${
      beacon.ativo ? "Este beacon esta sendo utilizado!\n" : ""
    }Deseja mesmo continuar com a exclusão?`;
    let title = "Deletar Beacon";
    return this.setState({
      showModal: true,
      titleModal: title,
      messageModal: message,
      firstAction: null,
      firstLabel: "Cancelar",
      secondAction: "delete",
      secondLabel: "Continuar",
      beaconSelecionado: index,
    });
  };

  _deleteBeacon = async (beacon) => {
    let uid = beacon.uid;
    let erro = await deleteBeacon(uid);
    if (erro) {
      let message = `Ocorreu um erro ao excluir o Beacon, tente novamente dentro de alguns minutos...`;
      let title = "Ops...";
      return this.setState({
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: null,
        firstLabel: "Ok",
        secondAction: false,
        secondLabel: null,
      });
    } else {
      if (beacon.ativo) {
        let utilizador = await getUtilizadorByBeaconID(uid);
        if (utilizador) await updateUtilizador(utilizador, "beaconID", null);
      }

      let message = `O Beacon foi excluido do seu histórico!`;
      let title = "Sucesso!";
      return this.setState(
        {
          isLoadingModal: false,
          titleModal: title,
          messageModal: message,
          firstAction: null,
          firstLabel: "Ok",
          secondAction: false,
          secondLabel: null,
        },
        () => this.getUserBeacons()
      );
    }
  };

  selectBeacon = async (beacon) => {
    const { utilizador } = this.props;

    if (beacon.ativo) {
      let message = `Este Beacon já esta em uso por outro utilizador...`;
      let title = "Ops...";
      return this.setState({
        showModal: true,
        titleModal: title,
        messageModal: message,
        firstAction: null,
        firstLabel: "Ok",
        secondAction: null,
        secondLabel: null,
      });
    }
    this.setState({
      showModal: true,
      isLoadingModal: true,
    });
    let erro = await updateUtilizador(utilizador, "beaconID", beacon.uid);
    if (erro) {
      let message = `Não foi possivel atribuir este Beacon ao utilizador.\nTente novamente dentro de alguns minutos.`;
      let title = "Ops...";
      return this.setState({
        isLoadingModal: false,
        showModal: true,
        titleModal: title,
        messageModal: message,
        firstAction: null,
        firstLabel: "Ok",
        secondAction: null,
        secondLabel: null,
      });
    } else {
      if (this.props.pop) {
        this.setState({ beaconSelecionado: beacon });
      }
      if (this.props.beaconAntigo) {
        await updateBeacon(this.props.beaconAntigo, "ativo", false);
      }
      await updateBeacon(beacon.uid, "ativo", true);
      let message = `Beacon atribuido ao utilizador com sucesso!`;
      let title = "Sucesso!";
      this.setState({
        showModal: true,
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "home",
        firstLabel: "Ok",
        secondAction: null,
        secondLabel: null,
      });
    }
  };

  render() {
    return (
      <CadastrarComponent
        beacons={this.state.beacons}
        isLoading={this.state.isLoading}
        onPressButton={this.onPressButton}
        deleteBeacon={this.deleteBeacon}
        showModal={this.state.showModal}
        closeModal={this.closeModal}
        selectBeacon={this.selectBeacon}
        firstAction={this.state.firstAction}
        firstLabel={this.state.firstLabel}
        secondAction={this.state.secondAction}
        secondLabel={this.state.secondLabel}
        isLoadingModal={this.state.isLoadingModal}
        titleModal={this.state.titleModal}
        messageModal={this.state.messageModal}
        modoSelecao={this.props.modoSelecao}
      />
    );
  }
}
