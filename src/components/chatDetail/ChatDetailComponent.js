import React, { Component, KeyboardAvoidingView } from "react";
import { Image } from "react-native";
import { GiftedChat, Send } from "react-native-gifted-chat";
import { Colors } from "../../assets/theme";
import LoadingComponent from "../LoadingComponent";
import "dayjs/locale/pt-br";
import { ASSETS } from "../../assets";

export default class ChatDetailComponent extends Component {
  renderSend = (props) => (
    <Send
      {...props}
      containerStyle={{ justifyContent: "center", marginRight: 5 }}
    >
      <Image
        source={ASSETS.icons.sended}
        style={{
          height: 30,
          width: 30,
          resizeMode: "contain",
          tintColor: Colors.tertiary,
        }}
      />
    </Send>
  );

  render() {
    const { mensagens, isLoading, enviarMensagem, user, mensagem } = this.props;
    if (isLoading) {
      return (
        <LoadingComponent
          size={"large"}
          style={{ flex: 1, alignItems: "center", justifyContent: "center" }}
        />
      );
    }
    return (
      <GiftedChat
        ref={(ref) => (this.giftedChatRef = ref)}
        messages={mensagens}
        onSend={(messages) => {
          enviarMensagem(messages);
          setTimeout(() => {
            this.giftedChatRef.scrollToBottom();
          }, 1500);
        }}
        user={{
          _id: user.uid,
          name: "Você",
        }}
        placeholder={
          mensagem.ativo
            ? "Digite uma mensagem..."
            : "Não é mais possível enviar mensagens..."
        }
        locale={"pt-br"}
        renderSend={this.renderSend}
        inverted={false}
        alignTop={false}
        scrollToBottom={true}
        renderUsernameOnMessage={true}
      />
    );
  }
}
