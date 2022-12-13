import React from "react";
import { View, StyleSheet, Text, Keyboard, ScrollView } from "react-native";
import { Colors } from "../../assets/theme";
import ButtonComponent from "../ButtonComponent";
import Hyperlink from "react-native-hyperlink";
import { TextInputMask } from "react-native-masked-text";
import styled from "@emotion/native";
import {
  screenWidthPercentage,
  responsiveSize,
  screenHeightPercentage,
} from "../../helpers/utils";
import LoadingComponent from "../LoadingComponent";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

const TextFieldContainer = styled.View({}, ({ color }) => ({
  width: "90%",
  borderRadius: 4,
  marginBottom: responsiveSize(2),
  justifyContent: "center",
  height: 50,
  borderWidth: 1,
  backgroundColor: Colors.white,
  borderColor: color,
  position: "relative",
}));

const Title = styled.Text({}, ({ color }) => ({
  color,
  fontSize: 12,
  fontWeight: "600",
  left: 10,
}));

const TextField = styled.TextInput({
  alignSelf: "flex-start",
  width: "96%",
  top: 4,
  marginHorizontal: 10,
  textAlignVertical: "center",
  padding: 0,
  color: Colors.darkGray,
  fontSize: 16,
});

export default class ProfileRegistrationComponent extends React.Component {
  componentWillMount() {
    this.keyboardWillShowSub = Keyboard.addListener(
      "keyboardWillShow",
      this.keyboardWillShow
    );
    this.keyboardWillHideSub = Keyboard.addListener(
      "keyboardWillHide",
      this.keyboardWillHide
    );
  }

  enableEnviar = () => {
    const { nome, email, telefone, senha } = this.props;
    if (nome !== "" && email !== "" && telefone.length >= 10 && senha !== "") {
      return true;
    } else {
      return false;
    }
  };

  getColor = (key) => {
    const { keyOnFocus, invalidEmail, telefone } = this.props;
    if (key === "email" && invalidEmail) {
      return Colors.red;
    }
    if (key === "telefone" && telefone.length > 0 && telefone.length < 10) {
      return Colors.red;
    }
    if (key === keyOnFocus) {
      return Colors.tertiary;
    }
    return Colors.darkGray;
  };

  render() {
    const { onChangeHandler, registerUser } = this.props;
    return (
      <View style={{ flex: 1 }}>
        <KeyboardAwareScrollView
          extraScrollHeight={screenHeightPercentage(5)}
          enableOnAndroid={true}
        >
          <View style={stylesView.general}>
            <TextFieldContainer color={this.getColor("nome")}>
              <Title color={this.getColor("nome")}>Nome Completo</Title>
              <TextField
                value={this.props.nome}
                onChangeText={(data) => onChangeHandler("nome", data)}
                selectionColor={Colors.tertiary}
                onFocus={() => this.props.onFocus("nome")}
                onBlur={() => this.props.onBlur()}
                keyboardType={"default"}
                returnKeyType={"next"}
                onSubmitEditing={() => {
                  this.telefoneInput.getElement().focus();
                }}
                ref={(input) => {
                  this.nomeInput = input;
                }}
              />
            </TextFieldContainer>
            <TextFieldContainer color={this.getColor("telefone")}>
              <Title color={this.getColor("telefone")}>Telefone</Title>
              <TextInputMask
                value={this.props.telefone}
                type={"cel-phone"}
                options={{
                  maskType: "BRL",
                  withDDD: true,
                  dddMask: "(99) ",
                }}
                style={stylesView.textInput}
                onChangeText={(_, data) => onChangeHandler("telefone", data)}
                selectionColor={Colors.tertiary}
                includeRawValueInChangeText={true}
                onFocus={() => this.props.onFocus("telefone")}
                onBlur={() => this.props.onBlur()}
                returnKeyType={"next"}
                keyboardType={"phone-pad"}
                ref={(input) => {
                  this.telefoneInput = input;
                }}
                onSubmitEditing={() => {
                  this.emailInput.focus();
                }}
              />
            </TextFieldContainer>

            <TextFieldContainer color={this.getColor("email")}>
              <Title color={this.getColor("email")}>E-mail</Title>
              <TextField
                value={this.props.email}
                keyboardType={"email-address"}
                onChangeText={(data) => onChangeHandler("email", data)}
                selectionColor={Colors.tertiary}
                onFocus={() => this.props.onFocus("email")}
                onBlur={() => this.props.onBlur()}
                returnKeyType={"next"}
                keyboardShouldPersistTaps={"never"}
                ref={(input) => {
                  this.emailInput = input;
                }}
                onSubmitEditing={() => {
                  this.senhaInput.focus();
                }}
              />
            </TextFieldContainer>

            {this.props.keyOnFocus === "email" && (
              <View style={stylesView.textContainer}>
                <Text style={stylesView.textEmail}>
                  {
                    "Atenção: O endereço de email é utilizado para o acesso a plataforma, informe um email válido para evitar problemas futuros."
                  }
                </Text>
              </View>
            )}
            <TextFieldContainer color={this.getColor("senha")}>
              <Title color={this.getColor("senha")}>Senha</Title>
              <TextField
                value={this.props.senha}
                secureTextEntry={true}
                keyboardType={"default"}
                onChangeText={(data) => onChangeHandler("senha", data)}
                selectionColor={Colors.tertiary}
                onFocus={() => this.props.onFocus("senha")}
                onBlur={() => this.props.onBlur()}
                returnKeyType={"send"}
                keyboardShouldPersistTaps={"never"}
                ref={(input) => {
                  this.senhaInput = input;
                }}
                onSubmitEditing={() => {
                  this.enableEnviar() ? registerUser() : {};
                }}
              />
            </TextFieldContainer>
          </View>

          <View
            style={{
              marginTop: screenHeightPercentage(3),
              alignItems: "center",
            }}
          >
            {this.props.isLoading ? (
              <LoadingComponent size={"large"} />
            ) : (
              <ButtonComponent
                label="Cadastrar"
                onPress={() => registerUser()}
                clickable={this.enableEnviar()}
              />
            )}
          </View>
        </KeyboardAwareScrollView>

        <View style={stylesView.bottomContainer}>
          <Hyperlink
            linkDefault
            linkStyle={{ color: Colors.darkTertiary }}
            linkText={(url) =>
              url === "mailto:rafaelfeiten@sou.faccat.br"
                ? "entre em contato."
                : url
            }
          >
            <Text
              style={{
                textAlign: "center",
              }}
            >
              Caso tenha problemas para se registrar na plataforma,
              mailto:rafaelfeiten@sou.faccat.br
            </Text>
          </Hyperlink>
        </View>
      </View>
    );
  }
}

const stylesView = StyleSheet.create({
  general: {
    flex: 1,
    alignItems: "center",
    marginTop: responsiveSize(3),
  },
  buttonContainer: {
    flex: 1,
    alignItems: "flex-end",
    justifyContent: "space-between",
    flexDirection: "row",
    marginBottom: responsiveSize(2),
  },
  buttonStyle: {
    flex: 0.5,
    height: responsiveSize(6),
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: responsiveSize(2.1),
    fontWeight: "700",
    color: Colors.white,
  },
  buttonLeftContainer: {
    borderTopLeftRadius: 30,
    borderBottomLeftRadius: 30,
    marginLeft: 5,
  },
  buttonRightContainer: {
    borderTopRightRadius: 30,
    borderBottomRightRadius: 30,
    marginRight: 5,
    borderLeftColor: Colors.darkGray,
  },
  textInput: {
    alignSelf: "flex-start",
    width: "96%",
    top: 4,
    marginHorizontal: 10,
    textAlignVertical: "center",
    padding: 0,
    color: Colors.darkGray,
    fontSize: 16,
  },
  textContainer: {
    marginHorizontal: screenWidthPercentage(5.5),
    marginTop: responsiveSize(-1.8),
    marginBottom: responsiveSize(2),
  },
  textEmail: {
    color: Colors.lightBlack,
    fontStyle: "italic",
    textAlign: "justify",
    fontWeight: "100",
    fontSize: responsiveSize(1.5),
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: "5%",
    marginHorizontal: "5%",
  },
});
