import React from "react";
import { Text, StyleSheet, View, ScrollView } from "react-native";
import { Colors } from "../../assets/theme";
import ButtonComponent from "../ButtonComponent";
import { ASSETS } from "../../assets";
import Hyperlink from "react-native-hyperlink";
import styled from "@emotion/native";
import { responsiveSize } from "../../helpers/utils";
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

export default class ProfileRegistrationContainer extends React.Component {
  constructor(props) {
    super(props);
  }
  clickableTrue = () => {
    const { email } = this.props;
    if (email !== "") {
      return true;
    } else {
      return false;
    }
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

  render() {
    const { onChangeHandler, email } = this.props;
    return (
      <ScrollView scrollEnabled={false} contentContainerStyle={{ flex: 1 }}>
        <View style={styles.container}>
          <View style={styles.form}>
            <Text style={styles.text}>
              Informe seu e-mail para continuar com o procedimento:
            </Text>
          </View>

          <TextFieldContainer color={this.getColor("email")}>
            <Title color={this.getColor("email")}>E-mail</Title>
            <TextField
              value={email}
              keyboardType={"email-address"}
              onChangeText={(data) => onChangeHandler("email", data)}
              selectionColor={Colors.tertiary}
              onFocus={() => this.props.onFocus("email")}
              onBlur={() => this.props.onBlur()}
              returnKeyType={"send"}
              keyboardShouldPersistTaps={"never"}
              ref={(input) => {
                this.emailInput = input;
              }}
              onSubmitEditing={() => {
                this.clickableTrue() ? this.props.esquecisenha(email) : {};
              }}
            />
          </TextFieldContainer>
          <View style={styles.button}>
            {this.props.isLoading ? (
              <LoadingComponent size={"large"} />
            ) : (
              <ButtonComponent
                label={"Recuperar"}
                onPress={() => this.props.esquecisenha(this.props.email)}
                clickable={this.clickableTrue()}
              />
            )}
          </View>
        </View>
        <View style={styles.bottomContainer}>
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
              Caso tenha problemas para recuperar sua senha,
              mailto:rafaelfeiten@sou.faccat.br
            </Text>
          </Hyperlink>
        </View>
      </ScrollView>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: "15%",
  },
  buttonClose: {
    marginLeft: 10,
    marginTop: "3%",
  },
  form: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    width: "95%",
  },
  text: {
    marginHorizontal: "5%",
    marginBottom: "10%",
    fontSize: responsiveSize(2),
    textAlign: "center",
  },
  bottomText: {
    textAlign: "center",
  },
  bottomContainer: {
    flex: 1,
    justifyContent: "flex-end",
    marginBottom: "5%",
    marginHorizontal: "5%",
  },
  button: {
    marginTop: "5%",
  },
});
