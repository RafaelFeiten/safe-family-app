import React, { PureComponent } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  ScrollView,
  View,
} from "react-native";
import { TextInputMask } from "react-native-masked-text";
import ModalStyled from "../Modal";
import styled from "@emotion/native";

import { Colors } from "../../assets/theme";
import {
  responsiveSize,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../../helpers/utils";
import LoadingComponent from "../LoadingComponent";
import ButtonComponent from "../ButtonComponent";

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

export default class ProfileComponent extends PureComponent {
  renderButtonMessage = () => {
    const { nome, email, telefone, profile } = this.props;
    if (
      profile.nome === nome &&
      profile.telefone === telefone &&
      profile.email === email
    ) {
      return "Excluir Perfil";
    }
    return "Salvar Perfil";
  };

  getColor = (key) => {
    const { keyOnFocus, invalidEmail } = this.props;
    if (key === "email" && invalidEmail) {
      return Colors.red;
    }
    if (key === keyOnFocus) {
      return Colors.tertiary;
    }
    return Colors.darkGray;
  };

  enableEnviar = () => {
    const { nome, email, telefone, profile } = this.props;
    if (
      profile.nome === nome &&
      profile.telefone === telefone &&
      profile.email === email
    )
      return false;
    return true;
  };

  render() {
    const {
      onChangeHandler,
      onPressButton,
      erroProfile,
      loadingProfile,
      closeModal,
      firstAction,
      secondAction,
      showModal,
      titleModal,
      messageModal,
      firstLabel,
      secondLabel,
      isLoadingModal,
    } = this.props;
    if (loadingProfile) {
      return (
        <LoadingComponent
          size={"large"}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
          label={"Carregando perfil..."}
          labelStyle={{ color: Colors.darkGray }}
        />
      );
    }
    if (erroProfile) {
      return (
        <View>
          <Text style={{ color: "red" }}>
            {"Não foi possível buscar o usuário."}
          </Text>
        </View>
      );
    } else
      return (
        <ScrollView scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
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
                returnKeyType={"send"}
                ref={(input) => {
                  this.emailInput = input;
                }}
                onSubmitEditing={() => {
                  this.enableEnviar() ? onPressButton() : {};
                }}
              />
            </TextFieldContainer>
            <View style={stylesView.buttonContainer}>
              <ButtonComponent
                label={this.renderButtonMessage()}
                paddingHorizontal={50}
                onPress={() => onPressButton()}
                clickable={true}
              />
            </View>

            <ModalStyled
              showModal={showModal}
              forceButton={true}
              firstAction={firstAction}
              secondAction={secondAction}
              firstLabel={firstLabel}
              secondLabel={secondLabel}
              closeModal={closeModal}
              titleModal={titleModal}
              messageModal={messageModal}
              isLoading={isLoadingModal}
            />
          </View>
          <View style={stylesView.textContainer}>
            <Text style={stylesView.textEmail}>
              {
                "Atenção: O endereço de email é utilizado para o acesso à plataforma, informe um email válido para evitar problemas futuros."
              }
            </Text>
          </View>
        </ScrollView>
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
    marginTop: screenHeightPercentage(2),
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
    fontWeight: "400",
    fontSize: responsiveSize(1.5),
  },
});
