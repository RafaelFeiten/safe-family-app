import React, { Component } from "react";
import UtilizadorComponent from "./UtilizadorComponent";
import {
  getCurrentUser,
  saveNewUtilizador,
  sendImageUtilizador,
} from "../../helpers/databaseHelpers";
import ImagePicker from "react-native-image-picker";
import ActionSheet from "react-native-actionsheet";
import { getImageName } from "../../helpers/utils";

export default class UtilizadorController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      imagem: null,
      imageName: null,
      categoria: null,
      nascimento: "",
      nome: null,
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
      novoUID: null,
    };
  }

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
        () => this.ActionSheet.show("teste")
      );
    }

    if (type === "categoria") {
      this.setState(
        {
          title: "Escolha a categoria do utilizador.",
          options: ["Cancelar", "Criança", "Pet"],
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
    if (acao === "beacon")
      this.props.navigation.navigate("CadastrarContainer2", {
        utilizador: this.state.novoUID,
      });
  };

  save = async () => {
    const { imagem, imageName, nome, categoria, nascimento } = this.state;
    this.setState({ isLoadingModal: true, showModal: true });
    let user = await getCurrentUser();

    let modelUtilizador = {
      owner: user.uid,
      nome,
      categoria,
      nascimento,
      distancia: 5,
      ativo: true,
      imagem: null,
    };

    let { error, uid } = await saveNewUtilizador(modelUtilizador);
    if (error) {
      let erroMessage = messageByErrorCode(error.erro.code);
      let message = `Erro ao registrar utilizador.\n${erroMessage}`;
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
      this.setState({ novoUID: uid });
      if (imageName) {
        let caminho = `utilizadores/${uid}/${imageName}`;

        let modelStorage = {
          content: imagem,
          caminho,
          utilizador: uid,
        };

        let erro = await sendImageUtilizador(modelStorage);
        if (erro) {
          let message =
            "Não conseguimos salvar sua imagem, você poderá salva-la mais tarde.\nDeseja atribuir esse novo utilizador a um Beacon?";
          let title = "Ops...";
          return this.setState({
            isLoadingModal: false,
            titleModal: title,
            messageModal: message,
            firstAction: "voltar",
            firstLabel: "Depois",
            secondAction: "beacon",
            secondLabel: "Agora",
          });
        }
      }
      let message = `O seu utilizador foi salvo com sucesso.\nDeseja atribuir esse novo utilizador a um Beacon?`;
      let title = "Sucesso!";
      return this.setState({
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: "voltar",
        firstLabel: "Depois",
        secondAction: "beacon",
        secondLabel: "Agora",
      });
    }
  };

  render() {
    return (
      <>
        <UtilizadorComponent
          imagem={this.state.imagem}
          categoria={this.state.categoria}
          nome={this.state.nome}
          nascimento={this.state.nascimento}
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
          onPress={(index) => {
            this.state.title === "Escolha a categoria do utilizador."
              ? this.selectCategoria(index)
              : this.pickImage(index);
          }}
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
