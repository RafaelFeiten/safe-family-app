import React from "react";
import LoginComponent from "./LoginComponent";
import {
  signIn,
  isUserAuth,
  saveHistoricoLogin,
  messageByErrorCode,
  logout,
} from "../../helpers/databaseHelpers";
import { Alert } from "react-native";
import { getDeviceInfos, getTime } from "../../helpers/utils";

export default class LoginController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      senha: "",
      isLoading: false,
      isLoadingAuth: true,
      keyOnFocus: null,
      message: "",
      infos: null,
    };
    this.verifyUserLogged();
  }

  verifyUserLogged = () => {
    isUserAuth()
      .then((user) => {
        this.setState({ isLoadingAuth: false }, () =>
          this.props.navigation.navigate("Home")
        );
      })
      .catch((error) => {
        this.getDeviceInfos();
        this.setState({ isLoadingAuth: false });
      });
  };

  getDeviceInfos = () => {
    let infos = getDeviceInfos();
    this.setState({ infos });
  };

  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value,
    });
  };

  tryLogin = () => {
    this.setState({ isLoading: true, message: "" });
    const { email, senha, infos } = this.state;
    const { navigation } = this.props;
    signIn(email, senha)
      .then((data) => {
        let userID = data.user.uid;
        let time = getTime();
        let historico = { ...infos, time };
        saveHistoricoLogin(userID, historico);
        this.setState({ isLoading: false }, () => {
          navigation.navigate("Home");
        });
      })
      .catch((error) => {
        this.setState(
          {
            message: messageByErrorCode(error.code),
            isLoading: false,
          },
          () => {
            this.renderMessage(error.user);
          }
        );
      });
  };

  renderMessage(user) {
    const { message } = this.state;
    if (!message) {
      return null;
    } else {
      return Alert.alert(
        "",
        message,
        message === messageByErrorCode("check-email")
          ? [
              {
                text: "Enviar email",
                onPress: () => {
                  user.sendEmailVerification();
                  logout();
                },
              },
              {
                text: "OK",
                onPress: () => {
                  logout();
                },
              },
            ]
          : [
              {
                text: "OK",
                onPress: () => {},
              },
            ],
        { cancelable: false }
      );
    }
  }

  signIn = () => {
    this.props.navigation.navigate("signIn");
  };

  forgotPass = () => {
    this.props.navigation.navigate("ForgotPass");
  };

  onFocus = (key) => {
    const { keyOnFocus } = this.state;
    if (keyOnFocus !== key) this.setState({ keyOnFocus: key });
  };

  onBlur = () => {
    this.setState({ keyOnFocus: null });
  };

  render() {
    return (
      <LoginComponent
        email={this.state.email}
        senha={this.state.senha}
        message={this.state.message}
        keyOnFocus={this.state.keyOnFocus}
        onChangeHandler={this.onChangeHandler}
        tryLogin={this.tryLogin}
        isLoading={this.state.isLoading}
        isLoadingAuth={this.state.isLoadingAuth}
        signIn={this.signIn}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
        forgotPass={this.forgotPass}
      />
    );
  }
}
