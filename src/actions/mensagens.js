export const addChat = (mensagens) => {
  return {
    type: "ADD_CHAT",
    mensagens,
  };
};

export const addMensagens = (mensagens, chatID, uid) => {
  return {
    type: "ADD_MSG",
    mensagens,
    chatID,
    loading: false,
    uid,
  };
};
