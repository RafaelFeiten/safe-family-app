import React from "react";
import { Alert } from "react-native";
import ProfileRegistrationComponent from "./ProfileRegistrationComponent";
import {
  signUp,
  logout,
  saveNewUser,
  messageByErrorCode,
} from "../../helpers/databaseHelpers";
import { getDeviceInfos, getTime } from "../../helpers/utils";

export default class ProfileRegistrationController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      nome: "",
      email: "",
      telefone: "",
      senha: "",
      message: "",
      infos: null,
      isLoading: false,
      keyOnFocus: false,
    };
  }

  componentDidMount() {
    this.getDeviceInfos();
  }

  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value,
    });
  };

  onFocus = (key) => {
    const { keyOnFocus } = this.state;
    if (keyOnFocus !== key) this.setState({ keyOnFocus: key });
  };

  onBlur = () => {
    this.setState({ keyOnFocus: null });
  };

  renderMessage() {
    const { message } = this.state;
    if (!message) {
      return null;
    } else {
      return Alert.alert("", message);
    }
  }

  getDeviceInfos = () => {
    let infos = getDeviceInfos();
    this.setState({ infos });
  };

  registerUser = () => {
    const { senha, email, nome, telefone, infos } = this.state;
    console.log("chamou");
    this.setState({ isLoading: true }, () => {
      signUp(email, senha)
        .then((data) => {
          let userID = data.user.uid;
          let userData = {
            nome,
            email,
            telefone,
            nomeMapa: nome.split(" ")[0] || "",
            autorizaMapa: true,
          };
          let time = getTime();
          let historico = { ...infos, time };
          saveNewUser(userID, userData, historico)
            .then(() => {
              this.setState(
                {
                  message:
                    "Cadastro realizado com sucesso!\nPor favor, consulte sua caixa de entrada para verificação do email.",
                  isLoading: false,
                },
                () => this.renderMessage()
              );
              logout();
              this.props.navigation.navigate("Login");
            })
            .catch((error) => {
              this.setState(
                { message: messageByErrorCode(error.code), isLoading: false },
                () => this.renderMessage()
              );
            });
        })
        .catch((error) => {
          this.setState(
            {
              message: messageByErrorCode(error.code),
              isLoading: false,
            },
            () => this.renderMessage()
          );
          console.log(error);
        });
    });
  };

  render() {
    return (
      <ProfileRegistrationComponent
        isLoading={this.state.isLoading}
        nome={this.state.nome}
        email={this.state.email}
        senha={this.state.senha}
        telefone={this.state.telefone}
        keyOnFocus={this.state.keyOnFocus}
        onChangeHandler={this.onChangeHandler}
        registerUser={this.registerUser}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    );
  }
}
