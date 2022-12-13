import React, { Component } from "react";
import EditarUtilizadorComponent from "./EditarUtilizadorComponent";
import {
  sendImageUtilizador,
  getImageUtilizador,
  updateUtilizador,
  updateBeacon,
  updateUtilizadorComplete,
  deleteUtilizador,
} from "../../helpers/databaseHelpers";
import ImagePicker from "react-native-image-picker";
import ActionSheet from "react-native-actionsheet";
import { getImageName } from "../../helpers/utils";
import NavigationHeader from "../../navigation/NavigationHeader";

export default class EditarUtilizadorController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagem: null,
      imageName: null,
      categoria: props.utilizador.categoria,
      nascimento: props.utilizador.nascimento,
      distancia: props.utilizador.distancia,
      nome: props.utilizador.nome,
      keyOnFocus: null,
      title: null,
      options: [],
      showModal: false,
      titleModal: "",
      messageModal: "",
      firstAction: false,
      secondAction: false,
      firstLabel: false,
      secondLabel: false,
      isLoadingModal: false,
      isLoadingImage: props.utilizador.imagem ? true : false,
      utilizador: props.utilizador,
      beacon: props.beacon,
    };
    this.getImage();
  }

  UNSAFE_componentWillReceiveProps({ beacon }) {
    this.setState({ beacon });
  }

  getImage = async () => {
    let imagem = this.props.utilizador.imagem;
    let utilizador = this.props.utilizador;
    if (imagem) {
      let body = {
        caminho: imagem,
      };
      let arquivo = await getImageUtilizador(body);
      utilizador.imagem = arquivo.content;
      if (arquivo) {
        this.setState({
          imagem: arquivo.content,
          imageName: arquivo.name,
          isLoadingImage: false,
          utilizador,
        });
      } else {
        this.setState({
          isLoadingImage: false,
        });
      }
    }
  };

  pickImage(index) {
    if (index === 1) {
      ImagePicker.launchCamera(options, (response) => {
        if (response.error) {
          let message = `Ocorreu um erro ao tentar buscar a imagem.\n${response.error.toString()} `;
          let title = "Ops...";
          this.setState({
            showModal: true,
            isLoadingModal: false,
            titleModal: title,
            messageModal: message,
            firstAction: null,
            firstLabel: "Voltar",
            secondAction: null,
            secondLabel: false,
          });
        } else if (!response.didCancel && !response.customButton) {
          let imageName = getImageName(response.uri);
          this.setState({ imagem: response.data, imageName });
        }
      });
    }
    if (index == 2) {
      ImagePicker.launchImageLibrary(options, (response) => {
        if (response.error) {
          let message = `Ocorreu um erro ao tentar buscar a imagem.\n${response.error.toString()} `;
          let title = "Ops...";
          this.setState({
            showModal: true,
            isLoadingModal: false,
            titleModal: title,
            messageModal: message,
            firstAction: null,
            firstLabel: "Voltar",
            secondAction: null,
            secondLabel: false,
          });
        } else if (!response.didCancel && !response.customButton) {
          let imageName = getImageName(response.uri);
          this.setState({ imagem: response.data, imageName });
        }
      });
    }
  }

  showActionSheet = (type) => {
    if (type === "camera") {
      this.setState(
        {
          title: "Escolha de onde você deseja pegar uma imagem ?",
          options: ["Cancelar", "Câmera", "Galeria"],
        },
        () => this.ActionSheet.show()
      );
    }

    if (type === "categoria") {
      this.setState(
        {
          title: "Escolha a categoria do utilizador:",
          options: ["Cancelar", "Criança", "Pet"],
        },
        () => this.ActionSheet.show()
      );
    }

    if (type === "beacon") {
      this.setState(
        {
          title: "Escolha uma ação abaixo:",
          options: ["Cancelar", "Alterar Beacon", "Remover Beacon"],
        },
        () => this.ActionSheet.show()
      );
    }
  };

  onFocus = (key) => {
    const { keyOnFocus } = this.state;
    if (keyOnFocus !== key) this.setState({ keyOnFocus: key });
  };

  onBlur = () => {
    this.setState({ keyOnFocus: null });
  };

  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value,
    });
  };

  selectCategoria = (index) => {
    const { options } = this.state;
    if (index !== 0) {
      this.setState({ categoria: options[index] });
    }
  };

  closeModal = (acao) => {
    this.setState({ showModal: false });
    if (acao === "voltar") this.props.navigation.pop();
    if (acao === "desativar")
      this.setState({ showModal: true, isLoadingModal: true }, () =>
        this.desativarUtilizador()
      );
    if (acao === "excluir")
      this.setState({ showModal: true, isLoadingModal: true }, () =>
        this.excluirUtilizador()
      );
    if (acao === "beacon")
      this.props.navigation.navigate("CadastrarContainer2", {
        utilizador: this.state.novoUID,
      });
  };

  save = async () => {
    const {
      imagem,
      imageName,
      nome,
      categoria,
      nascimento,
      utilizador,
      distancia,
      beacon,
    } = this.state;
    this.setState({ isLoadingModal: true, showModal: true });

    if (this.props.beacon.uid && !beacon.uid) {
      await updateBeacon(this.props.beacon.uid, "ativo", false);
    }

    let modelUtilizador = {
      nome,
      categoria,
      nascimento,
      distancia,
      beaconID: beacon.uid || null,
    };
    let uid = utilizador.uid;
    let error = await updateUtilizadorComplete(uid, modelUtilizador);
    if (error) {
      let erroMessage = messageByErrorCode(error.erro.code);
      let message = `Erro ao salvar alterações no utilizador.\n${erroMessage}`;
      let title = "Ops...";
      return this.setState({
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "voltar",
        firstLabel: "Voltar",
        secondAction: null,
        secondLabel: false,
      });
    } else {
      if (imagem !== utilizador.imagem) {
        let caminho = `utilizadores/${uid}/${imageName}`;

        let modelStorage = {
          content: imagem,
          caminho,
          utilizador: uid,
        };

        let erro = await sendImageUtilizador(modelStorage);
        if (erro) {
          let message =
            "Não conseguimos salvar sua imagem.\n Tente novamente dentro de alguns minutos.";
          let title = "Ops...";
          return this.setState({
            isLoadingModal: false,
            titleModal: title,
            messageModal: message,
            firstAction: "voltar",
            firstLabel: "Ok",
            secondAction: null,
            secondLabel: null,
          });
        }
      }
      let message = `As alterações do utilizador foram salvas com sucesso.`;
      let title = "Sucesso!";
      return this.setState({
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "voltar",
        firstLabel: "Ok",
        secondAction: null,
        secondLabel: null,
      });
    }
  };

  selectBeacon = (index) => {
    if (index === 1) {
      this.props.navigation.navigate("CadastrarContainer2", {
        utilizador: this.state.utilizador.uid,
        pop: true,
        beaconAntigo: this.state.beacon.uid || null,
      });
    }
    if (index === 2) {
      this.setState({ beacon: {} });
    }
  };

  completeAction = (index) => {
    if (this.state.title === "Escolha a categoria do utilizador:") {
      this.selectCategoria(index);
    }
    if (this.state.title === "Escolha de onde você deseja pegar uma imagem ?") {
      this.pickImage(index);
    }
    if (this.state.title === "Escolha uma ação abaixo:") {
      this.selectBeacon(index);
    }
  };

  desativarUtilizador = async () => {
    let id = this.state.utilizador.uid;
    let status = this.state.utilizador.ativo;
    let erro = await updateUtilizador(id, "ativo", !status);

    if (erro) {
      let message = status
        ? `Ocorreu um erro ao desativar utilizador.\nTente novamente dentro de alguns minutos.`
        : `Ocorreu um erro ao ativar utilizador.\nTente novamente dentro de alguns minutos.`;
      let title = "Ops...";
      return this.setState({
        showModal: true,
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "voltar",
        firstLabel: "OK",
        secondAction: null,
        secondLabel: null,
      });
    } else {
      let message = status
        ? `Seu utilizador foi desativado com sucesso.\nVocê poderá reativa-lo a qualquer momento novamente.`
        : `Seu utilizador foi ativado com sucesso.`;
      let title = "Sucesso!";
      return this.setState({
        showModal: true,
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "voltar",
        firstLabel: "OK",
        secondAction: null,
        secondLabel: null,
      });
    }
  };

  excluirUtilizador = async () => {
    let id = this.state.utilizador.uid;
    let beacon = this.state.beacon;
    if (beacon) {
      await updateBeacon(beacon.uid, "ativo", false);
    }
    let erro = await deleteUtilizador(id);

    if (erro) {
      let message = `Ocorreu um erro ao excluir o utilizador.\nTente novamente dentro de alguns minutos.`;
      let title = "Ops...";
      return this.setState({
        showModal: true,
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "voltar",
        firstLabel: "OK",
        secondAction: null,
        secondLabel: null,
      });
    } else {
      let message = `Seu utilizador foi excluir com sucesso.`;
      let title = "Sucesso!";
      return this.setState({
        showModal: true,
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "voltar",
        firstLabel: "OK",
        secondAction: null,
        secondLabel: null,
      });
    }
  };

  onPressMenu = (index) => {
    if (index === 0) {
      let message = this.state.utilizador.ativo
        ? `Tem certeza de que deseja desativar o utilizador? \nEle não será mais rastreado!`
        : `Tem certeza de que deseja ativar o utilizador?`;

      let title = "Atenção!";
      return this.setState({
        showModal: true,
        titleModal: title,
        messageModal: message,
        firstAction: null,
        firstLabel: "Cancelar",
        secondAction: "desativar",
        secondLabel: "Continuar",
      });
    }

    if (index === 1) {
      let message = `Tem certeza de que deseja excluir o utilizador?`;
      let title = "Atenção!";
      return this.setState({
        showModal: true,
        titleModal: title,
        messageModal: message,
        firstAction: null,
        firstLabel: "Cancelar",
        secondAction: "excluir",
        secondLabel: "Continuar",
      });
    }
  };

  getOptions = () => {
    if (this.props.utilizador.ativo) {
      return ["Desativar", "Excluir"];
    } else {
      return ["Ativar", "Excluir"];
    }
  };

  render() {
    return (
      <>
        <NavigationHeader
          title={"Editar Utilizador"}
          showBackButton={true}
          options={this.getOptions()}
          pressMenuButton={(index) => this.onPressMenu(index)}
          pressBackButton={this.props.navigation.pop}
        />
        <EditarUtilizadorComponent
          imagem={this.state.imagem}
          categoria={this.state.categoria}
          nome={this.state.nome}
          utilizador={this.state.utilizador}
          beacon={this.state.beacon}
          beaconProps={this.props.beacon}
          isLoadingImage={this.state.isLoadingImage}
          nascimento={this.state.nascimento}
          distancia={this.state.distancia}
          keyOnFocus={this.state.keyOnFocus}
          firstAction={this.state.firstAction}
          firstLabel={this.state.firstLabel}
          isLoadingModal={this.state.isLoadingModal}
          secondLabel={this.state.secondLabel}
          secondAction={this.state.secondAction}
          showModal={this.state.showModal}
          titleModal={this.state.titleModal}
          messageModal={this.state.messageModal}
          showActionSheet={this.showActionSheet}
          save={this.save}
          selectBeacon={this.selectBeacon}
          onChangeHandler={this.onChangeHandler}
          onFocus={this.onFocus}
          closeModal={this.closeModal}
          onBlur={this.onBlur}
        />
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={this.state.title}
          options={this.state.options}
          cancelButtonIndex={0}
          onPress={(index) => this.completeAction(index)}
        />
      </>
    );
  }
}

const options = {
  title: "Foto de perfil",
  customButtons: [{ name: "imageAvatar", title: "Imagem de perfil" }],
  storageOptions: {
    skipBackup: true,
    path: "images",
  },
  quality: 0.4,
};
