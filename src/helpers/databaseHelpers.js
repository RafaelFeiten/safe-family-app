import firestore from "@react-native-firebase/firestore";
import auth from "@react-native-firebase/auth";
// import AsyncStorage from "@react-native-community/async-storage";
import { Alert } from "react-native";
import axios from "axios";
import store from "../store";
import { addMensagens, addChat } from "../actions/mensagens";

export const verifyError = async (title, message) => {
  if (error.status === 400) {
    Alert.alert(title, message, [{ text: "Ok", onPress: () => {} }], {
      cancelable: false,
    });
  }
};

//=====================SERVIDOR API=====================

const api = axios.create({
  baseURL: "https://tccsafefamily.firebaseapp.com",
  // baseURL: "http://localhost:5000",
  timeout: 540000,
  headers: {
    AcceptedLanguage: "pt-br",
  },
});

export async function getConfigs() {
  let user = await getCurrentUser();
  let token = await user.getIdToken();
  return {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
}

export const updateEmail = async (novoEmail) => {
  const config = await getConfigs(true);
  let body = {};
  const url = `user/update/email/${novoEmail}`;
  return new Promise((resolve, reject) => {
    api
      .put(url, body, config)
      .then(async (resp) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e.response.data || e.response);
      });
  });
};

export const updateSenha = async (novaSenha) => {
  const config = await getConfigs(true);
  let body = {};
  const url = `user/update/senha/${novaSenha}`;
  return new Promise((resolve, reject) => {
    api
      .put(url, body, config)
      .then(async (resp) => {
        resolve(false);
      })
      .catch((e) => {
        reject(e.response.data || e.response);
      });
  });
};

export const deleteUser = async () => {
  const config = await getConfigs(true);
  const url = `user`;
  return new Promise((resolve, reject) => {
    api
      .delete(url, config)
      .then(async (resp) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e.response.data || e.response);
      });
  });
};

export const sendImageUtilizador = async (body) => {
  const config = await getConfigs(true);
  const url = `/utilizador/image/post`;
  return new Promise((resolve, reject) => {
    api
      .post(url, body, config)
      .then(async (resp) => {
        resolve(false);
      })
      .catch((e) => {
        console.log("e", e);

        resolve(e.response.data || e.response);
      });
  });
};

export const getImageUtilizador = async (body) => {
  const config = await getConfigs(true);
  const url = `/utilizador/image/get`;
  return new Promise((resolve, reject) => {
    api
      .post(url, body, config)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((e) => {
        reject(e.response.data || e.response);
      });
  });
};

export const notificarPerdaUtilizador = async (body) => {
  const config = await getConfigs(true);
  const url = `/utilizador/notificar/perdido`;
  return new Promise((resolve, reject) => {
    api
      .post(url, body, config)
      .then((resp) => {
        console.log("resp", resp);
        resolve(resp.data);
      })
      .catch((e) => {
        console.log("e", e);
        reject(e.response.data || e.response);
      });
  });
};

export const notificarUtilizadorVisualizado = async (body) => {
  const config = await getConfigs(true);
  const url = `/utilizador/notificar/visualizado`;
  return new Promise((resolve, reject) => {
    api
      .post(url, body, config)
      .then((resp) => {
        resolve(resp.data);
      })
      .catch((e) => {
        console.log("e", e);
        reject(e.response.data || e.response);
      });
  });
};

export const notificarEncontroUtilizador = async (body) => {
  const config = await getConfigs(true);
  const url = `/utilizador/notificar/encontrado`;
  return new Promise((resolve, reject) => {
    api
      .post(url, body, config)
      .then((resp) => {
        console.log("resp", resp);
        resolve(resp.data);
      })
      .catch((e) => {
        console.log("e", e);
        reject(e.response.data || e.response);
      });
  });
};

export const notificarMensagem = async (body) => {
  const config = await getConfigs(true);
  const url = `/utilizador/notificar/mensagem`;
  return new Promise((resolve, reject) => {
    api
      .post(url, body, config)
      .then((resp) => {
        console.log("resp", resp);
        resolve(resp.data);
      })
      .catch((e) => {
        console.log("e", e);
        reject(e.response.data || e.response);
      });
  });
};

export const deleteImageUtilizador = async (body) => {
  const config = await getConfigs(true);
  const url = `/utilizador/image/delete`;
  return new Promise((resolve, reject) => {
    api
      .post(url, body, config)
      .then(async (resp) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e.response.data || e.response);
      });
  });
};

//=====================FIRESTORE=====================

export const saveHistoricoLogin = (userID, data) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users/${userID}/historico_login`)
      .add(data)
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        console.log("e", e); //validar
      });
  });
};

export const saveNewUser = (userID, userData, deviceInfos) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("users")
      .doc(userID)
      .set(userData)
      .then((snapshot) => {
        saveHistoricoLogin(userID, deviceInfos)
          .then(() => resolve(true))
          .catch((e) => {
            console.log("e", e);
          });
      })
      .catch((e) => {
        console.log("e", e);
      });
  });
};

export const getUserInfos = async () => {
  let user = await getCurrentUser();
  let uid = user.uid;

  return new Promise((resolve, reject) => {
    firestore()
      .collection("users")
      .doc(uid)
      .get()
      .then((snapshot) => {
        let data = { ...snapshot.data(), uid: snapshot.id };
        resolve(data);
      })
      .catch((e) => {
        reject(e);
        console.log("e", e);
      });
  });
};

export const updateUser = (uid, nome, telefone) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users`)
      .doc(uid)
      .update({ nome, telefone })
      .then(() => {
        resolve(false);
      })
      .catch(function(error) {
        resolve(error);
      });
  });
};

export const updateUserByParam = (uid, param, value) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`users`)
      .doc(uid)
      .update({ [param]: value })
      .then(() => {
        resolve(false);
      })
      .catch(function(error) {
        resolve(error);
      });
  });
};

export const saveNewUtilizador = async (data) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("utilizadores")
      .add(data)
      .then((snapshot) => {
        resolve({ error: false, uid: snapshot.id });
      })
      .catch((e) => {
        resolve({ error: e });
      });
  });
};

export const saveBeaconLocation = async (id, data) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`beacons/${id}/locations`)
      .add(data)
      .then((snapshot) => {
        resolve(false);
      })
      .catch((e) => {
        console.log("erro ao salvar historico", e);
        resolve(e);
      });
  });
};

export const updateUtilizador = async (id, atributo, valor) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("utilizadores")
      .doc(id)
      .update({
        [atributo]: valor,
      })
      .then((snapshot) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

export const updateUserLocation = async (lastLocation) => {
  let user = await getCurrentUser();
  let uid = user.uid;
  return new Promise((resolve, reject) => {
    firestore()
      .collection("users")
      .doc(uid)
      .update({
        lastLocation,
      })
      .then(() => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

export const updateUtilizadorComplete = async (id, data) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("utilizadores")
      .doc(id)
      .update(data)
      .then((snapshot) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

export const deleteUtilizador = async (id) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("utilizadores")
      .doc(id)
      .delete()
      .then((snapshot) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

export const getUtilizadores = async () => {
  let user = await getCurrentUser();
  let uid = user.uid;
  return new Promise((resolve, reject) => {
    firestore()
      .collection("utilizadores")
      .where("owner", "==", uid)
      .get()
      .then((snapshot) => {
        let data = snapshot.docs.map((doc) => {
          return { ...doc.data(), uid: doc.id };
        });
        console.log("data", data);
        resolve(data);
      })
      .catch((e) => {
        reject(e);
        console.log("e", e);
      });
  });
};

export const getMensagens = async () => {
  let user = await getCurrentUser();
  let uid = user.uid;
  firestore()
    .collection("chat")
    .where("envolvidos", "array-contains", uid)
    .orderBy("ultimaMensagem", "desc")
    .onSnapshot(
      (snapshot) => {
        let chat = snapshot.docs.map((doc) => {
          return { ...doc.data(), chatID: doc.id };
        });
        store.dispatch(addChat(chat));
      },
      (e) => {
        console.log("e", e);
        store.dispatch(addChat([]));
      }
    );
};

export const getMensagensDetail = async (chatID) => {
  let { uid } = await getCurrentUser();

  firestore()
    .collection(`chat/${chatID}/mensagens`)
    .orderBy("data", "asc")
    .onSnapshot(
      (snapshot) => {
        let data = snapshot.docs.map((doc) => {
          return { ...doc.data(), mensagemID: doc.id };
        });
        store.dispatch(addMensagens(data, chatID, uid));
      },
      (e) => {
        console.log("e", e);
        store.dispatch(addMensagens([], chatID, uid));
      }
    );
};

export const setMensagemLida = async (chatID, docID) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`chat/${chatID}/mensagens`)
      .doc(docID)
      .update({ visualizada: true })
      .then(() => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

export const getUtilizadorByBeaconID = async (uid) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("utilizadores")
      .where("beaconID", "==", uid)
      .get()
      .then((snapshot) => {
        snapshot.docs.map((doc) => {
          resolve(doc.id);
        });
      })
      .catch((e) => {
        reject(false);
      });
  });
};

export const getBeaconById = async (uuid) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("beacons")
      .doc(uuid)
      .get()
      .then((snapshot) => {
        if (!snapshot.exists) resolve(false);
        resolve(snapshot.data());
      })
      .catch((e) => {
        console.log("e", e);
        resolve(false);
      });
  });
};

export const getUserBeacons = async () => {
  let user = await getCurrentUser();
  let uid = user.uid;

  return new Promise((resolve, reject) => {
    firestore()
      .collection("beacons")
      .where("owner", "==", uid)
      .get()
      .then((snapshot) => {
        if (snapshot.empty) resolve([]);
        let data = snapshot.docs.map((doc) => {
          return { ...doc.data(), uid: doc.id };
        });
        resolve(data);
      })
      .catch((e) => {
        console.log("e", e);
        resolve([]);
      });
  });
};

export const deleteBeacon = async (uuid) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection(`beacons/${uuid}/locations`)
      .get()
      .then(async (snapshot) => {
        if (snapshot.docs.length > 0)
          await Promise.all(
            snapshot.docs.map((doc) => {
              firestore()
                .collection(`beacons/${uuid}/locations`)
                .doc(doc.id)
                .delete();
            })
          );
      })
      .then(() => {
        firestore()
          .collection("beacons")
          .doc(uuid)
          .delete()
          .then(() => {
            resolve(false);
          });
        resolve(false);
      })
      .catch((e) => {
        console.log("erro delete collection", e);
        resolve(e);
      });
  });
};

export const updateBeacon = async (uuid, atributo, valor) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("beacons")
      .doc(uuid)
      .update({ [atributo]: valor })
      .then(() => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

export const saveNewBeacon = async (beacon, model) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("beacons")
      .doc(beacon)
      .set(model)
      .then((snapshot) => {
        resolve(false);
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

export const sendMensagemChat = async (chatID, mensagem) => {
  return new Promise((resolve, reject) => {
    firestore()
      .collection("chat")
      .doc(chatID)
      .update({ ultimaMensagem: new Date().getTime() })
      .then(() => {
        firestore()
          .collection("chat")
          .doc(chatID)
          .collection("mensagens")
          .add(mensagem)
          .then(() => {
            resolve(false);
          })
          .catch((e) => {
            resolve(e);
          });
      })
      .catch((e) => {
        resolve(e);
      });
  });
};

//=====================AUTHENTICATION=====================

export function isUserAuth() {
  return new Promise((resolve, reject) => {
    auth().onAuthStateChanged(function(user) {
      if (user) {
        resolve(user);
      } else {
        reject(user);
      }
    });
  });
}

export function getCurrentUser() {
  return new Promise((resolve, reject) => {
    const user = auth().currentUser;
    resolve(user);
  });
}

export function signUp(email, password) {
  return new Promise((resolve, reject) => {
    auth()
      .createUserWithEmailAndPassword(email, password)
      .then((user) => {
        user.user.sendEmailVerification();
        resolve(user);
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
      });
  });
}

export function signIn(email, password) {
  return new Promise((resolve, reject) => {
    auth()
      .signInWithEmailAndPassword(email, password)
      .then((user) => {
        if (!user.user.emailVerified) {
          reject({ code: "check-email", user: user.user });
        } else {
          resolve(user);
        }
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
      });
  });
}

export function logout() {
  return new Promise((resolve, reject) => {
    auth()
      .signOut()
      .then(() => {
        resolve(false);
      })
      .catch((error) => {
        console.log("error", error);
        reject(error);
      });
  });
}

export function forgotPassword(yourEmail) {
  return new Promise((resolve, reject) => {
    auth()
      .sendPasswordResetEmail(yourEmail)
      .then((user) => {
        resolve(user);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function messageByErrorCode(errorCode) {
  console.log("errorCode", errorCode);
  switch (errorCode) {
    case "auth/wrong-password":
      return "Senha inválida!";
    case "auth/user-not-found":
      return "Usuário não encontrado!";
    case "auth/invalid-email":
      return "Email inválido!";
    case "auth/user-disabled":
      return "Usuário desabilitado!";
    case "auth/email-already-in-use":
      return "Email já em uso!";
    case "auth/email-already-exists":
      return "Email já em uso!";
    case "auth/weak-password":
      return "A senha precisa ter mais do que 6 caracteres!";
    case "check-email":
      return "Seu email precisa ser verificado! Consulte sua caixa de entrada.\n Não recebeu? Envie um novo clicando no botão abaixo:";
    default:
      return "Tente novamente dentro de alguns minutos...";
  }
}

export const reauthenticate = (password) => {
  return new Promise(async (resolve, reject) => {
    const user = await getCurrentUser();
    var cred = auth.EmailAuthProvider.credential(user.email, password);
    user
      .reauthenticateWithCredential(cred)
      .then(() => {
        resolve(true);
      })
      .catch((e) => {
        resolve(false);
      });
  });
};
