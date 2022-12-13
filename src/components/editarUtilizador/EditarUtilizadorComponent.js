import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Image,
  TouchableOpacity,
} from "react-native";
import styled from "@emotion/native";
import { TextInputMask } from "react-native-masked-text";
import Slider from "@react-native-community/slider";
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
import LoadingComponent from "../LoadingComponent";

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

export default class EditarUtilizadorComponent extends Component {
  renderImage = () => {
    const { showActionSheet, imagem, isLoadingImage } = this.props;
    if (isLoadingImage) {
      return (
        <TouchableOpacity
          onPress={() => showActionSheet("camera")}
          style={styles.avatarContainer}
          disabled={true}
        >
          <View
            style={[
              styles.avatarImageContainer,
              { backgroundColor: Colors.white },
            ]}
          >
            <View
              style={[
                styles.avatar,
                { alignItems: "center", justifyContent: "center", top: 5 },
              ]}
            >
              <LoadingComponent size="large" color={Colors.tertiary} />
            </View>
          </View>
          <View style={styles.iconContainer}>
            <Image source={ASSETS.icons.camera} style={styles.avatarIcon} />
          </View>
        </TouchableOpacity>
      );
    } else if (imagem) {
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
    const {
      nome,
      imagem,
      distancia,
      categoria,
      nascimento,
      utilizador,
      isLoadingImage,
      beacon,
      beaconProps,
    } = this.props;
    if (
      (beacon !== beaconProps ||
        distancia !== utilizador.distancia ||
        nome !== utilizador.nome ||
        categoria !== utilizador.categoria ||
        nascimento !== utilizador.nascimento ||
        imagem !== utilizador.imagem) &&
      !isLoadingImage
    ) {
      return true;
    } else {
      return false;
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
        extraScrollHeight={screenHeightPercentage(12)}
        enableOnAndroid={true}
        contentContainerStyle={{ flex: 1 }}
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
              <Title color={this.getColor("categoria")}>Categoria</Title>
              <TextStyled>
                {this.props.categoria || "Selecione uma categoria..."}
              </TextStyled>
            </TouchableOpacity>
          </TextFieldContainer>

          <TextFieldContainer color={this.getColor("nome")}>
            <Title color={this.getColor("nome")}>Nome/Apelido</Title>
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
              returnKeyType={"next"}
              keyboardType={"numeric"}
              ref={(input) => {
                this.nascimentoInput = input;
              }}
              onSubmitEditing={() => {
                this.props.save();
              }}
            />
          </TextFieldContainer>

          <TextFieldContainer color={this.getColor("beacon")}>
            <TouchableOpacity
              onPress={() => {
                this.props.beacon.uid
                  ? this.props.showActionSheet("beacon")
                  : this.props.selectBeacon(1);
              }}
            >
              <Title color={this.getColor("beacon")}>Beacon</Title>
              <TextStyled numberOfLines={1}>
                {this.props.beacon.descricao ||
                  this.props.beacon.uid ||
                  "Selecionar um Beacon..."}
              </TextStyled>
            </TouchableOpacity>
          </TextFieldContainer>
          <View style={{ alignItems: "center" }}>
            <Text
              style={{ fontSize: responsiveSize(2), marginBottom: 10 }}
            >{`Distância de segurança: ${this.props.distancia} m`}</Text>
            <Slider
              style={{ width: 200, height: 40 }}
              minimumValue={1}
              value={this.props.distancia}
              maximumValue={15}
              step={1}
              minimumTrackTintColor={Colors.blue}
              maximumTrackTintColor={Colors.red}
              onValueChange={(v) => this.props.onChangeHandler("distancia", v)}
            />
          </View>
          <View style={styles.buttonContainer}>
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
    flex: 1,
    justifyContent: "flex-end",
    alignItems: "center",
  },
  avatarContainer: {
    alignItems: "flex-end",
    justifyContent: "flex-end",
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
