import React, { PureComponent } from "react";
import ProfileComponent from "./ProfileComponent";
import {
  getUserInfos,
  updateEmail,
  updateUser,
  logout,
  messageByErrorCode,
  deleteUser,
} from "../../helpers/databaseHelpers";

export default class ProfileController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      telefone: "",
      nome: "",
      keyOnFocus: "",
      email: null,
      telefone: null,
      nome: null,
      erroProfile: false,
      loadingProfile: true,
      profile: null,
      showModal: false,
      titleModal: "",
      messageModal: "",
      firstAction: false,
      secondAction: false,
      firstLabel: false,
      secondLabel: false,
      isLoadingModal: false,
    };
    this.getUserInfos();
  }

  getUserInfos = () => {
    getUserInfos()
      .then((user) => {
        console.log("user", user);
        this.setState({
          loadingProfile: false,
          email: user.email,
          telefone: user.telefone,
          nome: user.nome,
          profile: user,
        });
      })
      .catch((e) => {
        console.log("erro ao get user", e);
        this.setState({ erroProfile: true });
      });
  };

  onFocus = (key) => {
    const { keyOnFocus } = this.state;
    if (keyOnFocus !== key) this.setState({ keyOnFocus: key });
  };

  onBlur = () => {
    this.setState({ keyOnFocus: null });
  };

  closeModal = (acao) => {
    if (acao === "excluir") {
      this.excluirUsuario();
    } else {
      this.setState({ showModal: false });
      if (acao === "voltar") this.props.navigation.pop();
      if (acao === "sair") this.logout();
    }
  };

  logout = () => {
    this.setState({ showModal: false }, () => {
      logout()
        .then(() => this.props.navigation.navigate("Login"))
        .catch((e) => console.log("e", e));
    });
  };

  excluirUsuario = () => {
    this.setState({ isLoadingModal: true });

    deleteUser()
      .then(() => {
        let message = `Seu perfil foi excluído da plataforma... \n Sentiremos sua falta :( `;
        let title = "Excluir Perfil";
        this.setState({
          isLoadingModal: false,
          titleModal: title,
          messageModal: message,
          firstAction: "sair",
          firstLabel: "Sair",
          secondAction: null,
          secondLabel: null,
        });
      })
      .catch((e) => {
        let message =
          "Ocorreu um erro ao tentar excluir o usuário. Tente novamente dentro de alguns minutos...";
        let title = "Excluir Perfil";
        this.setState({
          isLoadingModal: false,
          titleModal: title,
          messageModal: message,
          firstAction: null,
          firstLabel: "Voltar",
          secondAction: null,
          secondLabel: null,
        });
      });
  };

  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value,
    });
  };

  onPressButton = async () => {
    const { nome, email, telefone, profile } = this.state;
    if (
      profile.nome === nome &&
      profile.telefone === telefone &&
      profile.email === email
    ) {
      let message =
        "Você tem certeza de que deseja excluir seu perfil? Esta ação não pode ser revertida...";
      let title = "Excluir perfil";
      this.setState({
        showModal: true,
        titleModal: title,
        messageModal: message,
        secondAction: "excluir",
        secondLabel: "Excluir",
        firstAction: null,
        firstLabel: "Cancelar",
      });
    } else {
      this.setState({ showModal: true, isLoadingModal: true });

      let erroEmail = false;
      let erroProfile = false;
      let erroMessage = null;
      if (profile.email !== email) {
        let erro = await updateEmail(email);
        if (erro) {
          erroMessage = messageByErrorCode(erro.erro.code);
          erroEmail = true;
        } else {
          if (profile.nome !== nome || profile.telefone !== telefone) {
            let error = await updateUser(profile.uid, nome, telefone);
            if (error) {
              erroProfile = true;
              erroMessage = messageByErrorCode("");
            }
          }
        }
      } else if (profile.nome !== nome || profile.telefone !== telefone) {
        let error = await updateUser(profile.uid, nome, telefone);
        if (error) {
          erroProfile = true;
          erroMessage = messageByErrorCode("");
        }
      }

      if (erroEmail || erroProfile) {
        let message = `Erro ao realizar alteração no cadastro.\n ${erroMessage} `;
        let title = "Falha ao atualizar!";
        this.setState({
          isLoadingModal: false,
          titleModal: title,
          messageModal: message,
          firstAction: "voltar",
          firstLabel: "Ok",
          secondAction: null,
          secondLabel: false,
        });
      } else {
        let message = `A alteração dos dados cadastrais foi realizada com sucesso...\n ${
          profile.email !== email
            ? `Por favor, consulte sua caixa de entrada para verificação do email. Você esta sendo redirecionado para a tela de Login.`
            : ""
        }`;
        let title = "Alteração concluída!";
        this.setState({
          isLoadingModal: false,
          titleModal: title,
          messageModal: message,
          firstAction: profile.email !== email ? "sair" : "voltar",
          firstLabel: "Ok",
          secondAction: null,
          secondLabel: false,
        });
      }
    }
  };

  render() {
    return (
      <ProfileComponent
        email={this.state.email}
        nome={this.state.nome}
        telefone={this.state.telefone}
        profile={this.state.profile}
        titleModal={this.state.titleModal}
        messageModal={this.state.messageModal}
        firstAction={this.state.firstAction}
        firstLabel={this.state.firstLabel}
        isLoadingModal={this.state.isLoadingModal}
        secondLabel={this.state.secondLabel}
        secondAction={this.state.secondAction}
        showModal={this.state.showModal}
        keyOnFocus={this.state.keyOnFocus}
        erroProfile={this.state.erroProfile}
        loadingProfile={this.state.loadingProfile}
        onFocus={this.onFocus}
        closeModal={this.closeModal}
        onBlur={this.onBlur}
        onChangeHandler={this.onChangeHandler}
        onPressButton={this.onPressButton}
      />
    );
  }
}
