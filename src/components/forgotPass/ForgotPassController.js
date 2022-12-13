import React from "react";
import { Alert } from "react-native";
import ForgotPassComponent from "./ForgotPassComponent";
import {
  forgotPassword,
  messageByErrorCode
} from "../../helpers/databaseHelpers";

export default class ForgotPassController extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      keyOnFocus: null,
      isLoading: false
    };
  }
  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value
    });
  };

  onFocus = key => {
    const { keyOnFocus } = this.state;
    if (keyOnFocus !== key) this.setState({ keyOnFocus: key });
  };

  onBlur = () => {
    this.setState({ keyOnFocus: null });
  };

  forgotPassword = yourEmail => {
    this.setState({ isLoading: true });
    forgotPassword(yourEmail)
      .then(() => {
        this.setState({ isLoading: false });
        Alert.alert(
          "Email enviado com sucesso",
          "Acesse o link recebido em seu email para continuar o procedimento."
        );
      })
      .catch(e => {
        this.setState({ isLoading: false });
        Alert.alert("Ops...", messageByErrorCode(e.code));
      });
  };

  render() {
    return (
      <ForgotPassComponent
        esquecisenha={this.forgotPassword}
        email={this.state.email}
        isLoading={this.state.isLoading}
        keyOnFocus={this.state.keyOnFocus}
        onChangeHandler={this.onChangeHandler}
        onFocus={this.onFocus}
        onBlur={this.onBlur}
      />
    );
  }
}
