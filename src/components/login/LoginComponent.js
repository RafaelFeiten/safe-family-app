import React, { Component } from "react";
import {
  View,
  Animated,
  Image,
  Text,
  Keyboard,
  TouchableOpacity,
  Platform,
  ScrollView,
} from "react-native";
import { StyleSheet, Dimensions } from "react-native";
import styled from "@emotion/native";
import { Colors } from "../../assets/theme";
import { ASSETS } from "../../assets";
import ButtonComponent from "../ButtonComponent";

import { responsiveSize } from "../../helpers/utils";
import LoadingComponent from "../LoadingComponent";

const window = Dimensions.get("window");
const IMAGE_HEIGHT = window.height / 3.5;
const IMAGE_HEIGHT_SMALL = window.height / 4.2;

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

class LoginComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showKeyboard: false,
    };
    this.imageHeight = new Animated.Value(IMAGE_HEIGHT);
  }
  renderAndroid() {
    const { showKeyboard } = this.state;

    if (showKeyboard === true) {
      return (
        <>
          <Image
            source={ASSETS.images.logo}
            style={[styles.logo, { height: IMAGE_HEIGHT_SMALL }]}
          />
          <Text
            style={[
              styles.familyText,
              {
                fontSize: responsiveSize(5),
              },
            ]}
          >
            Safe Family
          </Text>
        </>
      );
    } else {
      return (
        <>
          <Image
            source={ASSETS.images.logo}
            style={[styles.logo, { height: IMAGE_HEIGHT }]}
          />
          <Text
            style={[
              styles.familyText,
              {
                fontSize: responsiveSize(6),
              },
            ]}
          >
            Safe Family
          </Text>
        </>
      );
    }
  }

  renderIOS() {
    return (
      <>
        <Animated.Image
          source={ASSETS.images.logo}
          style={[styles.logo, { height: this.imageHeight }]}
        />
        <Text
          style={[
            styles.familyText,
            {
              fontSize: responsiveSize(5),
            },
          ]}
        >
          Safe Family
        </Text>
      </>
    );
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

  _keyboardDidShow = (event) => {
    this.setState({ showKeyboard: true }, () => {
      Platform.OS === "ios"
        ? Animated.timing(this.imageHeight, {
            duration: event.duration,
            toValue: IMAGE_HEIGHT_SMALL,
          }).start()
        : null;
    });
  };

  _keyboardDidHide = (event) => {
    this.setState({ showKeyboard: false }, () => {
      Platform.OS === "ios"
        ? Animated.timing(this.imageHeight, {
            duration: event.duration,
            toValue: IMAGE_HEIGHT,
          }).start()
        : null;
    });
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

  renderButton() {
    const { isLoading, tryLogin } = this.props;
    if (isLoading) {
      return <LoadingComponent />;
    }
    return (
      <ButtonComponent
        label={"Entrar"}
        onPress={() => {
          this.clickableTrue() ? tryLogin() : {};
        }}
        clickable={this.clickableTrue()}
      />
    );
  }

  clickableTrue = () => {
    const { email, senha } = this.props;
    if (email !== "" && senha !== "") {
      return true;
    } else {
      return false;
    }
  };

  render() {
    const {
      onChangeHandler,
      isLoadingAuth,
      signIn,
      forgotPass,
      tryLogin,
    } = this.props;
    if (isLoadingAuth) {
      return (
        <View style={styles.active}>
          <LoadingComponent size="large" />
        </View>
      );
    }
    return (
      <ScrollView scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
        <View
          style={[
            styles.container,
            { paddingTop: this.state.showKeyboard ? "3%" : "15%" },
          ]}
          behavior="padding"
        >
          {Platform.OS === "ios" && this.renderIOS()}
          {Platform.OS === "android" && this.renderAndroid()}
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
              blurOnSubmit={true}
              returnKeyType={"send"}
              keyboardShouldPersistTaps={"never"}
              ref={(input) => {
                this.senhaInput = input;
              }}
              onSubmitEditing={() => {
                this.clickableTrue() ? tryLogin() : {};
              }}
            />
          </TextFieldContainer>

          <View style={{ marginVertical: responsiveSize(2) }}>
            {this.renderButton()}
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.text}>
              <View style={{ flexDirection: "row" }}>
                <Text>Ainda não possui uma conta? </Text>
                <TouchableOpacity
                  onPress={() => {
                    signIn();
                  }}
                >
                  <Text style={styles.text2}>Registre-se</Text>
                </TouchableOpacity>
              </View>
            </View>
            <View
              style={{
                marginTop: "5%",
              }}
            >
              <TouchableOpacity
                onPress={() => {
                  forgotPass();
                }}
              >
                <Text style={[styles.text2]}>Esqueceu sua senha?</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </ScrollView>
    );
  }
}
export default LoginComponent;
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    flex: 1,
  },
  active: {
    flex: 1,
    alignSelf: "center",
    justifyContent: "center",
  },
  logo: {
    height: IMAGE_HEIGHT,
    resizeMode: "contain",
    opacity: 0.9,
  },
  register: {
    marginBottom: 20,
    width: window.width - 100,
    alignItems: "center",
    justifyContent: "center",
    height: 50,
    backgroundColor: "#ffae",
  },
  text: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
  },
  text2: {
    color: Colors.darkTertiary,
    textDecorationLine: "underline",
    fontSize: 16,
    bottom: 2,
  },
  footerContainer: {
    alignItems: "center",
    justifyContent: "flex-end",
    flex: 1,
  },
  familyText: {
    fontFamily: "Roboto-Bold",
    color: Colors.darkTertiary,
    shadowColor: Colors.darkGray,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.78,
    shadowRadius: 3,
    marginBottom: 10,
  },
});
