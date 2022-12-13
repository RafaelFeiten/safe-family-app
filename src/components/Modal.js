import React, { PureComponent } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import styled from "@emotion/native";
import { Colors } from "../assets/theme";
import {
  responsiveSize,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../helpers/utils";
import Modal from "react-native-modal";
import LoadingComponent from "./LoadingComponent";
import LinearGradient from "react-native-linear-gradient";

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

export default class ModalStyled extends PureComponent {
  constructor(props) {
    super(props);
  }
  getColor = (key) => {
    return Colors.tertiary;
  };
  render() {
    const {
      firstAction,
      secondAction,
      firstLabel,
      secondLabel,
      closeModal,
      showModal,
      titleModal,
      messageModal,
      isLoading,
      forceButton,
      showInput,
    } = this.props;
    if (isLoading)
      return (
        <Modal
          isVisible={showModal}
          onBackButtonPress={() => (forceButton ? {} : closeModal())}
          onBackdropPress={() => (forceButton ? {} : closeModal())}
        >
          <View style={[stylesModal.container, { opacity: 1 }]}>
            <LoadingComponent
              size={"large"}
              label={"Carregando..."}
              labelStyle={{ color: Colors.white }}
              color={Colors.white}
            />
          </View>
        </Modal>
      );

    return (
      <Modal
        isVisible={showModal}
        onBackButtonPress={() => (forceButton ? {} : closeModal())}
        onBackdropPress={() => (forceButton ? {} : closeModal())}
      >
        <LinearGradient
          colors={[Colors.lightGray, Colors.white]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 1 }}
          style={[
            stylesModal.container,
            { height: this.props.height || screenHeightPercentage(30) },
          ]}
        >
          <View style={stylesModal.containerTitle}>
            <Text style={stylesModal.textTitle}>{titleModal}</Text>
          </View>
          <View
            style={{
              flex: 1,
              marginBottom: responsiveSize(2),
              marginHorizontal: screenWidthPercentage(5),
            }}
          >
            <Text style={stylesModal.textMessage}>{messageModal}</Text>
          </View>
          {showInput && (
            <TextFieldContainer color={this.getColor()}>
              <Title color={this.getColor()}>Descrição</Title>
              <TextField
                value={this.props.inputModal}
                editable={true}
                onChangeText={(data) =>
                  this.props.onChangeHandler("inputModal", data)
                }
                selectionColor={Colors.tertiary}
                keyboardType={"default"}
                returnKeyType={"go"}
                onSubmitEditing={() => closeModal("enviar")}
                ref={(input) => {
                  this.modalInput = input;
                }}
              />
            </TextFieldContainer>
          )}

          <View style={stylesModal.bottomContainer}>
            <LinearGradient
              colors={[Colors.darkTertiary, Colors.lightGray]}
              start={{ x: 0, y: 0.2 }}
              end={{ x: 0, y: 1 }}
              style={stylesModal.buttonContainer}
            >
              <TouchableOpacity onPress={() => closeModal(firstAction)}>
                <Text style={stylesModal.erroMessage}>{firstLabel}</Text>
              </TouchableOpacity>
            </LinearGradient>
            {secondLabel && (
              <LinearGradient
                colors={[Colors.darkTertiary, Colors.lightGray]}
                start={{ x: 0, y: 0.2 }}
                end={{ x: 0, y: 1 }}
                style={stylesModal.buttonContainer}
              >
                <TouchableOpacity onPress={() => closeModal(secondAction)}>
                  <Text style={stylesModal.erroMessage}>{secondLabel}</Text>
                </TouchableOpacity>
              </LinearGradient>
            )}
          </View>
        </LinearGradient>
      </Modal>
    );
  }
}

const stylesModal = StyleSheet.create({
  container: {
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
    width: "100%",
    height: "30%",
    borderRadius: 6,
    opacity: 0.9,
  },
  erroMessage: {
    color: Colors.black,
    textAlign: "center",
    fontSize: responsiveSize(2),
  },
  buttonContainer: {
    flex: 0.5,
    borderWidth: 1,
    backgroundColor: Colors.white,
    borderColor: Colors.lightBlack,
    borderRadius: 10,
    justifyContent: "center",
    paddingVertical: responsiveSize(0.8),
    marginHorizontal: responsiveSize(0.5),
    elevation: 4,
    shadowColor: Colors.darkGray,
    shadowOffset: { height: 0 },
    shadowOpacity: 1,
    shadowRadius: 5,
  },
  containerTitle: {
    flex: 1,
    marginTop: responsiveSize(2),
  },
  bottomContainer: {
    alignItems: "flex-end",
    flex: 1,
    marginBottom: responsiveSize(2),
    flexDirection: "row",
  },
  textTitle: {
    color: Colors.black,
    fontSize: responsiveSize(2.3),
    fontWeight: "700",
  },
  textMessage: {
    color: Colors.black,
    textAlign: "center",
    fontStyle: "italic",
  },
});
