import { getMensagensDetail } from "../helpers/databaseHelpers";

const INITIAL_STATE = {
  mensagens: [],
  loading: true,
  naoLidas: 0,
};

export default function mensagens(state = INITIAL_STATE, action) {
  switch (action.type) {
    case "ADD_CHAT":
      getMensagens(action.mensagens);
      return {
        ...state,
        mensagens: action.mensagens,
        loading: action.mensagens.length > 0 ? true : false,
      };

    case "ADD_MSG":
      let { mensagens, naoLidas } = saveMensagensDetail(
        state,
        action.mensagens,
        action.chatID,
        action.uid
      );
      return {
        ...state,
        mensagens,
        loading: action.loading,
        naoLidas,
      };

    default:
      return state;
  }
}

const getMensagens = (mensagens) => {
  mensagens.map((data) => {
    getMensagensDetail(data.chatID);
  });
};

const saveMensagensDetail = (state, mensagens, chatID, uid) => {
  let naoLidas = 0;

  let msg = state.mensagens.map((mensagem) => {
    if (mensagem.chatID === chatID) {
      let naoLidasMensagem = 0;
      let showOnChat = false;
      if (mensagens && mensagens.length > 0) {
        mensagens.map((m) => {
          if (
            (m.autor !== uid && m.autor !== "sistema") ||
            (m.autor === "sistema" && mensagem.owner !== uid)
          ) {
            if (!m.visualizada) {
              naoLidas++;
              naoLidasMensagem++;
            }
            showOnChat = true;
          }
        });
      }
      return { ...mensagem, mensagens, naoLidasMensagem, showOnChat };
    } else {
      if (mensagem.mensagens && mensagem.mensagens.length > 0) {
        mensagem.mensagens.map((m) => {
          if (
            !m.visualizada &&
            ((m.autor !== uid && m.autor !== "sistema") ||
              (m.autor === "sistema" && mensagem.owner !== uid))
          ) {
            naoLidas++;
          }
        });
      }
      return mensagem;
    }
  });

  return { mensagens: msg, naoLidas };
};
