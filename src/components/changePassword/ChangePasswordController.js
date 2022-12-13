import React, { PureComponent } from "react";
import ChangePasswordComponent from "./ChangePasswordComponent";
import { updateSenha, reauthenticate } from "../../helpers/databaseHelpers";

export default class ChangePasswordController extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      keyOnFocus: false,
      senhaAtual: "",
      novaSenha: "",
      novaSenhaRepeat: null,
      showModal: false,
      titleModal: "",
      messageModal: "",
      firstAction: false,
      secondAction: false,
      firstLabel: false,
      secondLabel: false,
      isLoadingModal: false,
    };
  }

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

  trocarSenha = async () => {
    this.setState({ showModal: true, isLoadingModal: true });
    let validated = await reauthenticate(this.state.senhaAtual);
    if (!validated) {
      let message = `A senha atual digitada esta incorreta. `;
      let title = "Falha ao atualizar";
      this.setState({
        isLoadingModal: false,
        titleModal: title,
        messageModal: message,
        firstAction: null,
        firstLabel: "Voltar",
        secondAction: null,
        secondLabel: false,
      });
    } else {
      updateSenha(this.state.novaSenha)
        .then(() => {
          let message = `A sua senha foi alterada com sucesso.`;
          let title = "Sucesso!";
          this.setState({
            isLoadingModal: false,
            titleModal: title,
            messageModal: message,
            firstAction: "voltar",
            firstLabel: "Ok",
            secondAction: null,
            secondLabel: false,
          });
        })
        .catch((e) => {
          let erroMessage = messageByErrorCode(e.erro.code);
          let message = `Erro ao realizar alteração da senha.\n${erroMessage} `;
          let title = "Falha ao atualizar";
          this.setState({
            isLoadingModal: false,
            titleModal: title,
            messageModal: message,
            firstAction: null,
            firstLabel: "Voltar",
            secondAction: null,
            secondLabel: false,
          });
        });
    }
  };

  closeModal = (acao) => {
    this.setState({ showModal: false });
    if (acao === "voltar") this.props.navigation.pop();
  };

  render() {
    return (
      <ChangePasswordComponent
        senhaAtual={this.state.senhaAtual}
        novaSenha={this.state.novaSenha}
        keyOnFocus={this.state.keyOnFocus}
        novaSenhaRepeat={this.state.novaSenhaRepeat}
        firstAction={this.state.firstAction}
        firstLabel={this.state.firstLabel}
        isLoadingModal={this.state.isLoadingModal}
        secondLabel={this.state.secondLabel}
        secondAction={this.state.secondAction}
        showModal={this.state.showModal}
        titleModal={this.state.titleModal}
        messageModal={this.state.messageModal}
        onChangeHandler={this.onChangeHandler}
        trocarSenha={this.trocarSenha}
        onFocus={this.onFocus}
        closeModal={this.closeModal}
        onBlur={this.onBlur}
      />
    );
  }
}
