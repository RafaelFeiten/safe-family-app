import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  Keyboard,
  TouchableOpacity,
} from "react-native";
import styled from "@emotion/native";
import { TextInputMask } from "react-native-masked-text";
import ModalStyled from "../Modal";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { Colors } from "../../assets/theme";
import ButtonComponent from "../ButtonComponent";
import {
  responsiveSize,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../../helpers/utils";
import { ASSETS } from "../../assets";

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

const TextStyled = styled.Text({
  alignSelf: "flex-start",
  width: "96%",
  top: 4,
  marginHorizontal: 10,
  textAlignVertical: "center",
  padding: 0,
  color: Colors.darkGray,
  fontSize: 16,
});

export default class UtilizadorComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      keyboardOpenned: false,
    };
  }

  componentDidMount() {
    this.keyboardDidShowListener = Keyboard.addListener(
      "keyboardDidShow",
      this._keyboardDidShow
    );
    this.keyboardDidHideListener = Keyboard.addListener(
      "keyboardDidHide",
      this._keyboardDidHide
    );
  }

  componentWillUnmount() {
    this.keyboardDidShowListener.remove();
    this.keyboardDidHideListener.remove();
  }

  _keyboardDidShow = () => {
    this.setState({ keyboardOpenned: true });
  };

  _keyboardDidHide = () => {
    this.setState({ keyboardOpenned: false });
  };

  renderImage = () => {
    const { showActionSheet, imagem } = this.props;

    if (imagem) {
      return (
        <TouchableOpacity
          onPress={() => showActionSheet("camera")}
          style={styles.avatarContainer}
        >
          <View style={styles.avatarImageContainer}>
            <Image
              source={{ uri: `data:image/jpeg;base64,${imagem}` }}
              style={styles.avatar}
            />
          </View>
          <View style={styles.iconContainer}>
            <Image source={ASSETS.icons.camera} style={styles.avatarIcon} />
          </View>
        </TouchableOpacity>
      );
    } else {
      return (
        <TouchableOpacity
          onPress={() => showActionSheet("camera")}
          style={styles.avatarContainer}
        >
          <View
            style={[
              styles.avatarImageContainer,
              { backgroundColor: Colors.white },
            ]}
          >
            <Image
              source={ASSETS.icons.userAvatar}
              style={[
                styles.avatar,
                {
                  tintColor: Colors.darkGray,
                  resizeMode: "contain",
                  opacity: 0.5,
                },
              ]}
            />
          </View>
          <View style={styles.iconContainer}>
            <Image source={ASSETS.icons.camera} style={styles.avatarIcon} />
          </View>
        </TouchableOpacity>
      );
    }
  };

  getColor = (key) => {
    const { keyOnFocus } = this.props;

    if (key === keyOnFocus) {
      if (
        keyOnFocus === "nascimento" &&
        (!this.nascimentoInput.isValid() || this.props.nascimento.length !== 10)
      ) {
        return Colors.red;
      } else {
        return Colors.tertiary;
      }
    }
    return Colors.darkGray;
  };

  enableEnviar = () => {
    const { nome, categoria } = this.props;
    if (!nome || !categoria) {
      return false;
    } else {
      return true;
    }
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
      messageModal,
    } = this.props;

    return (
      <KeyboardAwareScrollView
        extraScrollHeight={screenHeightPercentage(5)}
        enableOnAndroid={true}
        contentContainerStyle={
          this.state.keyboardOpenned === true ? {} : { flex: 1 }
        }
      >
        <View style={styles.general}>
          <View style={styles.imageContainer}>
            {this.renderImage()}
            <View style={styles.textContainer}>
              <Text style={styles.textEmail}>
                {
                  "Atenção: A imagem será utilizada apenas para a localização do utilizador em caso de solicitação de rastreio global."
                }
              </Text>
            </View>
          </View>

          <TextFieldContainer color={this.getColor("categoria")}>
            <TouchableOpacity
              onPress={() => this.props.showActionSheet("categoria")}
            >
              <Title color={this.getColor("categoria")}>Categoria*</Title>
              <TextStyled>
                {this.props.categoria || "Selecione uma categoria..."}
              </TextStyled>
            </TouchableOpacity>
          </TextFieldContainer>

          <TextFieldContainer color={this.getColor("nome")}>
            <Title color={this.getColor("nome")}>Nome/Apelido*</Title>
            <TextField
              value={this.props.nome}
              editable={true}
              onChangeText={(data) => this.props.onChangeHandler("nome", data)}
              selectionColor={Colors.tertiary}
              onFocus={() => this.props.onFocus("nome")}
              onBlur={() => this.props.onBlur()}
              keyboardType={"default"}
              returnKeyType={"next"}
              onSubmitEditing={() => {
                this.nascimentoInput.getElement().focus();
              }}
              ref={(input) => {
                this.nomeInput = input;
              }}
            />
          </TextFieldContainer>

          <TextFieldContainer color={this.getColor("nascimento")}>
            <Title color={this.getColor("nascimento")}>
              Data de nascimento
            </Title>
            <TextInputMask
              value={this.props.nascimento}
              type={"datetime"}
              options={{
                format: "DD/MM/YYYY",
              }}
              style={styles.textInput}
              onChangeText={(_, data) =>
                this.props.onChangeHandler("nascimento", _)
              }
              selectionColor={Colors.tertiary}
              includeRawValueInChangeText={true}
              onFocus={() => this.props.onFocus("nascimento")}
              onBlur={() => this.props.onBlur()}
              returnKeyType={"send"}
              keyboardType={"numeric"}
              ref={(input) => {
                this.nascimentoInput = input;
              }}
              onSubmitEditing={() => {
                this.props.save();
              }}
            />
          </TextFieldContainer>
          <View
            style={
              this.state.keyboardOpenned === true ? {} : styles.buttonContainer
            }
          >
            <ButtonComponent
              label={"Salvar"}
              clickable={this.enableEnviar()}
              onPress={() => this.props.save()}
            />
          </View>
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
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
    alignItems: "center",
  },
  imageContainer: {
    marginVertical: screenHeightPercentage(2),
    alignItems: "center",
  },
  welcome: {
    textAlign: "center",
    color: "black",
  },
  buttonContainer: {
    bottom: 10,
    position: "absolute",
  },
  avatarContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
  },
  termosContainer: {
    alignSelf: "flex-start",
    marginLeft: screenWidthPercentage(5),
    marginTop: screenHeightPercentage(3),
  },
  avatarImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 120 / 2,
    borderColor: Colors.tertiary,
    borderWidth: 3,
  },
  buttonClose: {
    marginLeft: 10,
    marginTop: "3%",
  },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 57,
  },
  iconContainer: {
    borderColor: Colors.tertiary,
    borderWidth: 2.4,
    borderRadius: 43 / 2,
    height: 43,
    width: 43,
    alignItems: "center",
    justifyContent: "center",
    position: "absolute",
    backgroundColor: Colors.white,
  },
  avatarIcon: {
    tintColor: Colors.tertiary,
    width: 22,
    height: 22,
    resizeMode: "contain",
  },
  textContainer: {
    marginHorizontal: screenWidthPercentage(5.5),
    marginTop: responsiveSize(1),
  },
  textEmail: {
    color: Colors.lightBlack,
    fontStyle: "italic",
    textAlign: "justify",
    fontWeight: "400",
    fontSize: responsiveSize(1.5),
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
});
