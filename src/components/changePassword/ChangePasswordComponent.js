import React, { PureComponent } from "react";
import { StyleSheet, Text, ScrollView, View } from "react-native";
import ModalStyled from "../Modal";
import styled from "@emotion/native";
import { Colors } from "../../assets/theme";
import { responsiveSize, screenWidthPercentage } from "../../helpers/utils";
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
  position: "relative"
}));

const Title = styled.Text({}, ({ color }) => ({
  color,
  fontSize: 12,
  fontWeight: "600",
  left: 10
}));

const TextField = styled.TextInput({
  alignSelf: "flex-start",
  width: "96%",
  top: 4,
  marginHorizontal: 10,
  textAlignVertical: "center",
  padding: 0,
  color: Colors.darkGray,
  fontSize: 16
});

export default class ProfileComponent extends PureComponent {
  constructor(props) {
    super(props);
  }

  getColor = key => {
    const { keyOnFocus, novaSenha, novaSenhaRepeat } = this.props;
    if (
      key === "novaSenhaRepeat" &&
      novaSenhaRepeat !== null &&
      novaSenha !== novaSenhaRepeat
    ) {
      return Colors.red;
    }
    if (key === keyOnFocus) {
      return Colors.tertiary;
    }
    return Colors.darkGray;
  };

  enableEnviar = () => {
    const { senhaAtual, novaSenha, novaSenhaRepeat } = this.props;
    if (
      senhaAtual !== "" &&
      novaSenha !== "" &&
      novaSenhaRepeat !== "" &&
      novaSenha === novaSenhaRepeat
    )
      return true;
    return false;
  };

  render() {
    const {
      showModal,
      closeModal,
      firstAction,
      firstLabel,
      secondAction,
      secondLabel,
      isLoadingModal,
      titleModal,
      messageModal
    } = this.props;
    const {
      onChangeHandler,
      senhaAtual,
      novaSenha,
      novaSenhaRepeat,
      trocarSenha
    } = this.props;
    return (
      <ScrollView scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
        <View style={stylesView.general}>
          <TextFieldContainer color={this.getColor("senhaAtual")}>
            <Title color={this.getColor("senhaAtual")}>Senha Atual</Title>
            <TextField
              value={senhaAtual}
              secureTextEntry={true}
              keyboardType={"default"}
              onChangeText={data => onChangeHandler("senhaAtual", data)}
              selectionColor={Colors.tertiary}
              onFocus={() => this.props.onFocus("senhaAtual")}
              onBlur={() => this.props.onBlur()}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                this.novaSenhaInput.focus();
              }}
              ref={input => {
                this.senhaAtualInput = input;
              }}
            />
          </TextFieldContainer>

          <TextFieldContainer color={this.getColor("novaSenha")}>
            <Title color={this.getColor("novaSenha")}>Nova Senha</Title>
            <TextField
              value={novaSenha}
              secureTextEntry={true}
              keyboardType={"default"}
              onChangeText={data => onChangeHandler("novaSenha", data)}
              selectionColor={Colors.tertiary}
              onFocus={() => this.props.onFocus("novaSenha")}
              onBlur={() => this.props.onBlur()}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                this.novaSenhaRepeatInput.focus();
              }}
              ref={input => {
                this.novaSenhaInput = input;
              }}
            />
          </TextFieldContainer>

          <TextFieldContainer color={this.getColor("novaSenhaRepeat")}>
            <Title color={this.getColor("novaSenhaRepeat")}>
              Confirme sua Nova Senha
            </Title>
            <TextField
              value={novaSenhaRepeat}
              secureTextEntry={true}
              keyboardType={"default"}
              onChangeText={data => onChangeHandler("novaSenhaRepeat", data)}
              selectionColor={Colors.tertiary}
              onFocus={() => this.props.onFocus("novaSenhaRepeat")}
              onBlur={() => this.props.onBlur()}
              returnKeyType={"send"}
              onSubmitEditing={() => {
                this.enableEnviar() ? onPressButtonRight() : {};
              }}
              ref={input => {
                this.novaSenhaRepeatInput = input;
              }}
            />
          </TextFieldContainer>

          <View style={[stylesView.textContainer, { alignSelf: "flex-start" }]}>
            {novaSenhaRepeat !== null && novaSenha !== novaSenhaRepeat ? (
              <Text style={stylesView.textEmail}>
                {"As novas senhas informadas são diferentes."}
              </Text>
            ) : senhaAtual !== "" &&
              novaSenha !== "" &&
              novaSenhaRepeat !== "" &&
              novaSenha === novaSenhaRepeat &&
              senhaAtual === novaSenha ? (
              <Text style={stylesView.textEmail}>
                {"Informe uma nova senha diferente da senha atual."}
              </Text>
            ) : (
              <Text style={stylesView.textEmail}>{""}</Text>
            )}
          </View>
          <View style={stylesView.buttonContainer}>
            <ButtonComponent
              label="Enviar"
              onPress={() => trocarSenha()}
              clickable={this.enableEnviar()}
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
      </ScrollView>
    );
  }
}

const stylesView = StyleSheet.create({
  general: {
    flex: 1,
    alignItems: "center",
    marginTop: responsiveSize(3)
  },
  buttonContainer: {
    alignItems: "flex-start",
    justifyContent: "space-between",
    flexDirection: "row",
    marginVertical: responsiveSize(2)
  },
  textContainer: {
    marginHorizontal: screenWidthPercentage(5.5),
    marginTop: responsiveSize(-1.8),
    marginBottom: responsiveSize(2)
  },
  textEmail: {
    color: Colors.lightBlack,
    fontStyle: "italic",
    textAlign: "justify",
    fontWeight: "400",
    fontSize: responsiveSize(1.5)
  }
});
