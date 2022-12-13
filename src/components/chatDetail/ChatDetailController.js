import React, { Component } from "react";
import { connect } from "react-redux";
import ChatDetailComponent from "./ChatDetailComponent";
import {
  getUserInfos,
  getImageUtilizador,
  sendMensagemChat,
  notificarMensagem,
  setMensagemLida,
  getCurrentUser,
} from "../../helpers/databaseHelpers";
import ModalStyled from "../Modal";

class ChatDetailController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      isLoading: true,
      mensagens: [],
      mensagem: null,
      user: props.user,
      //modal
      showModal: false,
      firstAction: null,
      secondAction: null,
      titleModal: "Ops...",
      messageModal: "Ocorreu uma falha ao enviar a mensagem. Tente novamente!",
      firstLabel: "OK",
      secondLabel: null,
      isLoadingModal: false,
    };
    this.setMensagemLidas(props);
    this.replaceKey(props);
  }

  componentWillReceiveProps(props) {
    this.setMensagemLidas(props);
    this.replaceKey(props);
  }

  replaceKey = async ({ chatID }) => {
    let chatMensagens = [];
    let mensagem;
    this.props.mensagens.map((m) => {
      if (m.chatID === chatID) {
        chatMensagens = m.mensagens;
        mensagem = m;
      }
    });

    let msgs = await Promise.all(
      chatMensagens.map(async (msg) => {
        msg.user = { _id: msg.autor, name: msg.nome };
        msg._id = msg.data;
        msg.text = msg.texto;
        msg.createdAt = msg.data;
        if (msg.imagem) {
          let body = {
            caminho: msg.imagem,
          };
          let arquivo = await getImageUtilizador(body);
          msg.image = `data:image/jpeg;base64,${arquivo.content}`;
        }
        return msg;
      })
    );

    this.setState({ mensagens: msgs, mensagem, isLoading: false });
  };

  setMensagemLidas = async ({ chatID }) => {
    let { uid } = await getCurrentUser();

    this.props.mensagens.map(async (mensagem) => {
      if (mensagem.chatID === chatID) {
        let { mensagens } = mensagem;
        await Promise.all(
          mensagens.map(async (m) => {
            if (
              !m.visualizada &&
              ((m.autor !== uid && m.autor !== "sistema") ||
                (m.autor === "sistema" && mensagem.owner !== uid))
            ) {
              await setMensagemLida(chatID, m.mensagemID);
            }
          })
        );
      }
    });
  };

  enviarMensagem = async (message) => {
    if (!this.state.mensagem.ativo) {
      this.setState({
        showModal: true,
        messageModal:
          "Esta conversa já encerrou, não é mais possível enviar mensagens.",
      });
    } else {
      let { user } = this.state;
      if (!user) {
        user = await getUserInfos();
      }
      const { mensagem } = this.state;
      return new Promise((resolve, reject) => {
        let stateMensagens = this.state.mensagens;
        stateMensagens.push(message[0]);

        let model = {
          autor: user.uid,
          nome: user.nome,
          data: new Date().getTime(),
          texto: message[0].text,
        };
        sendMensagemChat(mensagem.chatID, model)
          .then(async () => {
            if (mensagem.ultimaMensagem === mensagem.created) {
              let model = {
                owner: mensagem.owner,
              };
              await notificarMensagem(model);
            }
          })
          .then(() => {
            this.setState({ mensagens: stateMensagens });
          })
          .catch(() => {
            this.setState({
              showModal: true,
              messageModal:
                "Ocorreu uma falha ao enviar a mensagem. Tente novamente!",
            });
          });
      });
    }
  };

  closeModal = () => {
    this.setState({ showModal: false });
  };

  render() {
    return (
      <>
        <ChatDetailComponent
          mensagens={this.state.mensagens}
          user={this.state.user}
          isLoading={this.state.isLoading}
          enviarMensagem={this.enviarMensagem}
          mensagem={this.state.mensagem}
        />
        <ModalStyled
          showModal={this.state.showModal}
          forceButton={true}
          firstAction={this.state.firstAction}
          secondAction={this.state.secondAction}
          firstLabel={this.state.firstLabel}
          secondLabel={this.state.secondLabel}
          closeModal={this.closeModal}
          titleModal={this.state.titleModal}
          messageModal={this.state.messageModal}
          isLoading={this.state.isLoadingModal}
        />
      </>
    );
  }
}

const mapStateToProps = (state) => ({
  mensagens: state.mensagens.mensagens,
});

export default connect(mapStateToProps)(ChatDetailController);
