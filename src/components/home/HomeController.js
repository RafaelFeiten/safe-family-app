import React, { Component } from "react";
import {
  Platform,
  DeviceEventEmitter,
  Vibration,
  ScrollView,
} from "react-native";
import { playSampleSound } from "react-native-notification-sounds";
import ActionSheet from "react-native-actionsheet";
import HomeComponent from "./HomeComponent";
import firestore from "@react-native-firebase/firestore";
import {
  getCurrentUser,
  getUtilizadores,
  saveBeaconLocation,
  getBeaconById,
  notificarPerdaUtilizador,
  notificarEncontroUtilizador,
  updateUserLocation,
  notificarUtilizadorVisualizado,
  getMensagens,
} from "../../helpers/databaseHelpers";
import {
  readIOSBeacon,
  readAndroidBeacon,
  getUserLocation,
  getBeaconDistance,
  mockBeacon,
} from "../../helpers/beaconsHelper";
import { cleanRepeatArray } from "../../helpers/utils";

export default class HomeController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userID: null,
      beaconsList: [],
      utilizadores: [],
      beaconsPerdidos: [],
      salvarBeaconFirestore: [],
      getDistanciaBeacon: [],
      notificarBeacon: [],
      isLoading: true,
      silenceAlert: true,
      alerting: false,
      beaconSelecionado: null,
      options: [],
      position: null,
      //modal
      showModal: false,
      firstAction: "",
      secondAction: "",
      titleModal: "",
      messageModal: "",
      firstLabel: "",
      secondLabel: "",
      isLoadingModal: false,
      inputModal: null,
    };
    getMensagens();
  }

  componentDidMount() {
    this.getUserInfos();

    const { navigation } = this.props;
    this.subs = [
      navigation.addListener("didFocus", () => this.getUtilizadores()),
    ];
    this.validaUltimaLeitura();
    Vibration.cancel();

    setInterval(() => {
      this.userLocation();
    }, 10000);

    if (Platform.OS === "ios") {
      // readIOSBeacon();
      //not implemented
    } else {
      DeviceEventEmitter.addListener("beaconsDidUpdate", this.scanningBeacon);
      readAndroidBeacon();
    }
  }

  componentWillUnmount() {
    Vibration.cancel();
    clearInterval(this.state.alerting);
  }

  onChangeHandler = (item, value) => {
    this.setState({
      [item]: value,
    });
  };

  beaconsPerdidos = () => {
    firestore()
      .collection("beacons")
      .where("status", "==", "perdido")
      .onSnapshot(
        (snapshot) => {
          let beaconsPerdidos = snapshot.docs.map((doc) => {
            let { owner } = doc.data();
            if (owner !== this.state.userID) return doc.id;
          });
          beaconsPerdidos = beaconsPerdidos.filter((x) => x);
          this.setState({ beaconsPerdidos });
        },
        (err) => {
          console.log(`Encountered error: ${err}`);
        }
      );
  };

  getUserInfos = async () => {
    getCurrentUser()
      .then((user) => {
        this.setState({ userID: user.uid }, () => {
          this.beaconsPerdidos();
        });
      })
      .catch((e) => {
        console.log("erro ao get user", e);
      });
  };

  validaUltimaLeitura = () => {
    setInterval(() => {
      let atualizar = false;
      let utilizadores = this.state.utilizadores.map((uti) => {
        if (uti.ultimaLeitura && !uti.tempoLimite) {
          let valor = new Date().getTime() - uti.ultimaLeitura;
          if (valor > 10000) {
            uti.tempoLimite = true;
            atualizar = true;
          }
        }
        return uti;
      });
      if (atualizar) {
        this.setState({ utilizadores });
        this.enableAlert();
      }
    }, 5000);
  };

  getUtilizadores = () => {
    let beaconsList = [];
    getUtilizadores()
      .then(async (utilizadores) => {
        await Promise.all(
          utilizadores.map(async (util, i) => {
            if (util.beaconID) {
              let beacon = await getBeaconById(util.beaconID);
              if (util.ativo) {
                beaconsList.push(util.beaconID);
                if (this.state.utilizadores.length > 0) {
                  this.state.utilizadores.map((u) => {
                    if (u.uid === util.uid && u.distanciaAtual) {
                      utilizadores[i].distanciaAtual = u.distanciaAtual;
                    }
                  });
                }
              }
              utilizadores[i].beaconInfo = beacon;
            }
          })
        );
        utilizadores = this.orderUtilizadores(utilizadores);
        this.setState({
          utilizadores,
          beaconsList,
          isLoading: false,
        });
      })
      .catch((e) => {
        console.log("erro ao get utilizadores", e);
      });
  };

  onPressUtilizadores = () => {
    this.props.navigation.navigate("UtilizadorContainer");
  };

  onSelectCard = (item) => {
    if (item.beaconInfo && item.beaconInfo.status === "perdido") {
      this.setState(
        {
          title: "Escolha a ação desejada:",
          options: ["Cancelar", "Utilizador encontrado", "Configurações"],
          beaconSelecionado: item,
        },
        () => this.ActionSheet.show()
      );
    } else if (item.distanciaAtual > item.distancia || item.tempoLimite) {
      this.setState(
        {
          title: "Escolha a ação desejada:",
          options: ["Cancelar", "Notificar perda", "Configurações"],
          beaconSelecionado: item,
        },
        () => this.ActionSheet.show()
      );
    } else {
      this.goToConfigs(item);
    }
  };

  goToConfigs = (item) => {
    let utilizadorModel = { ...item };
    delete utilizadorModel["beaconID"];
    delete utilizadorModel["beaconInfo"];
    let beaconModel = item.beaconID
      ? {
          uid: item.beaconID,
          ...item.beaconInfo,
        }
      : {};

    this.props.navigation.navigate("EditarUtilizadorContainer", {
      utilizador: utilizadorModel,
      beacon: beaconModel,
    });
  };

  completeAction = (index) => {
    if (index === "Utilizador encontrado") {
      this.notificarEncontrado(this.state.beaconSelecionado);
    }

    if (index === "Notificar perda") {
      this.notificarPerdaModal();
    }

    if (index === "Configurações") {
      this.goToConfigs(this.state.beaconSelecionado);
    }
  };

  notificarPerdaModal = () => {
    this.setState({
      showModal: true,
      firstAction: "cancelar",
      secondAction: "enviar",
      titleModal: "Informe sobre o utilizador!",
      messageModal:
        "Descreva com o maior detalhamento possível o utilizador. Essas informações serão de grande ajuda para que outros usuários possam identificá-lo.",
      firstLabel: "Cancelar",
      secondLabel: "Enviar",
      isLoadingModal: false,
    });
  };

  notificarPerda = async () => {
    this.setState({ showModal: true, isLoadingModal: true });
    const { beaconSelecionado, inputModal } = this.state;
    let position = await getUserLocation();

    let model = {
      utilizador: beaconSelecionado.uid,
      location: position,
      beaconID: beaconSelecionado.beaconID,
      owner: beaconSelecionado.owner,
      imagem: beaconSelecionado.imagem,
      descricao: inputModal,
    };

    notificarPerdaUtilizador(model)
      .then(() => {
        this.getUtilizadores();
        this.setState({
          beaconSelecionado: null,
          inputModal: null,
          isLoadingModal: false,
          firstAction: "ok",
          secondAction: null,
          titleModal: "SUCESSO",
          messageModal:
            "Sua mensagem foi enviada na plataforma e os usuários já estão ajudando a encontrá-lo(a). \nEsperamos que tudo fique bem logo!",
          firstLabel: "OK",
          secondLabel: null,
        });
      })
      .catch(() => {
        this.getUtilizadores();
        this.setState({
          beaconSelecionado: null,
          inputModal: null,
          isLoadingModal: false,
          firstAction: "ok",
          secondAction: null,
          titleModal: "Ops...",
          messageModal:
            "Ocorreu uma falha ao relatar a perda do utilizador. Tente novamente!",
          firstLabel: "OK",
          secondLabel: null,
        });
      });
  };

  notificarEncontrado = async () => {
    this.setState({ showModal: true, isLoadingModal: true });
    const { beaconSelecionado } = this.state;

    let model = {
      utilizador: beaconSelecionado.uid,
      beaconID: beaconSelecionado.beaconID,
    };

    notificarEncontroUtilizador(model)
      .then(() => {
        this.getUtilizadores();
        this.setState({
          isLoadingModal: false,
          firstAction: "ok",
          secondAction: null,
          titleModal: "SUCESSO",
          messageModal:
            "Utilizador atualizado com sucesso! Ficamos felizes que tudo tenha se resolvido!",
          firstLabel: "OK",
          secondLabel: null,
        });
      })
      .catch(() => {
        this.getUtilizadores();
        this.setState({
          isLoadingModal: false,
          firstAction: "ok",
          secondAction: null,
          titleModal: "Ops...",
          messageModal:
            "Ocorreu uma falha ao relatar o encontro do utilizador. Tente novamente!",
          firstLabel: "OK",
          secondLabel: null,
        });
      });
  };

  orderUtilizadores = (lista) => {
    function ativosCBeacon(doc) {
      return doc.ativo && doc.beaconID;
    }
    function ativosSBeacon(doc) {
      return doc.ativo && !doc.beaconID;
    }
    function inativosCBeacon(doc) {
      return !doc.ativo && doc.beaconID;
    }
    function inativosSBeacon(doc) {
      return !doc.ativo && !doc.beaconID;
    }

    const acb = lista.filter(ativosCBeacon);
    const asb = lista.filter(ativosSBeacon);
    const icb = lista.filter(inativosCBeacon);
    const isb = lista.filter(inativosSBeacon);

    let utilizadores = acb.concat(asb, icb, isb);
    return utilizadores;
  };

  userLocation = async () => {
    let pos = await getUserLocation();
    if (pos) {
      let position = {
        latitude: pos.latitude,
        longitude: pos.longitude,
      };
      if (position !== this.state.position) {
        this.setState({ position });
        await updateUserLocation(position);
      }
    }
  };

  scanningBeacon = async ({ beacons }) => {
    let position = await getUserLocation();

    const {
      userID,
      beaconsList,
      beaconsPerdidos,
      salvarBeaconFirestore,
      notificarBeacon,
    } = this.state;

    let utilizadoresUser = this.state.utilizadores;
    let todosBeacons = beaconsList.concat(beaconsPerdidos);
    todosBeacons = cleanRepeatArray(todosBeacons);

    await Promise.all(
      beacons.map(async (beacon) => {
        let uuid = `${beacon.uuid}-${beacon.major}-${beacon.minor}`;

        if (todosBeacons.includes(uuid)) {
          utilizadoresUser = utilizadoresUser.map((u) => {
            if (u.beaconID === uuid) {
              let { getDistanciaBeacon } = this.state;
              let utilizador = { ...u };

              if (getDistanciaBeacon.length > 0) {
                let possuiHistorico = false;
                getDistanciaBeacon.map((hist, index) => {
                  if (hist.uuid === uuid) {
                    possuiHistorico = true;
                    if (new Date().getTime() - hist.data >= 10000) {
                      let distancias = [utilizador.distanciaAtual];
                      hist.coletas.map((v) => {
                        distancias.push(
                          getBeaconDistance(
                            v,
                            Platform.OS === "ios" ? true : false
                          )
                        );
                      });
                      //ordena e limpar extremos
                      distancias.sort((a, b) => a - b);
                      if (distancias.length > 2) distancias.pop();
                      if (distancias.length > 2) distancias.shift();

                      let distanciaMedia = 0;
                      distancias.map((v) => {
                        distanciaMedia += v;
                      });
                      distanciaMedia = distanciaMedia / distancias.length;

                      getDistanciaBeacon.splice(index, 1);
                      utilizador.distanciaAtual = distanciaMedia;
                    } else {
                      getDistanciaBeacon[index].coletas.push(beacon);
                    }
                  } else {
                    if (
                      !possuiHistorico &&
                      index === getDistanciaBeacon.length
                    ) {
                      let model = {
                        uuid: uuid,
                        coletas: [beacon],
                        data: new Date().getTime(),
                      };
                      getDistanciaBeacon.push(model);
                    }
                  }
                });
              } else {
                let model = {
                  uuid: uuid,
                  coletas: [beacon],
                  data: new Date().getTime(),
                };
                getDistanciaBeacon.push(model);
              }

              utilizador.distanciaAtual = Math.round(utilizador.distanciaAtual);
              utilizador.ultimaLeitura = new Date().getTime();
              utilizador.tempoLimite = false;
              return utilizador;
            } else {
              return u;
            }
          });

          let dataSalva = salvarBeaconFirestore.map((elem) => {
            if (elem.beacon === uuid) {
              return elem.data;
            } else {
              return false;
            }
          });
          dataSalva = dataSalva.filter((x) => x);

          if (
            dataSalva.length === 0 ||
            new Date().getTime() - dataSalva[0] > 30000
          ) {
            if (dataSalva.length === 0) {
              let data = salvarBeaconFirestore;
              data.push({ beacon: uuid, data: new Date().getTime() });
              this.setState({ salvarBeaconFirestore: data });
            } else {
              salvarBeaconFirestore.map((elem) => {
                if (elem.beacon === uuid) {
                  elem.data = new Date().getTime();
                }
              });
            }

            if (Platform.OS !== "ios") {
              let modelSave = {
                data: new Date(),
                dataTimestamp: new Date().getTime(),
                userRastreio: userID,
                position,
                beacon,
              };
              await saveBeaconLocation(uuid, modelSave);
            }
          }
          if (
            beaconsPerdidos.includes(uuid) &&
            !notificarBeacon.includes(uuid)
          ) {
            let data = notificarBeacon;
            data.push(uuid);
            this.setState({ notificarBeacon: data });
            let body = {
              beaconID: uuid,
            };
            await notificarUtilizadorVisualizado(body);
          }
        }
      })
    );

    this.setState({ utilizadores: utilizadoresUser });
    this.enableAlert();
  };

  enableAlert = async () => {
    let soma = 0;
    this.state.utilizadores.map((uti) => {
      if (uti.distanciaAtual > uti.distancia || uti.tempoLimite) {
        soma++;
      }
    });

    let alertar = false;
    if (soma > 0 && !this.state.alerting) {
      this.setState({ alerting: true });

      alertar = true;
    }
    if (!this.state.silenceAlert && alertar) {
      Vibration.vibrate([200, 200], true);

      playSampleSound({ url: SOUND });
      let idInterval = setInterval(() => {
        playSampleSound({ url: SOUND });
      }, 7000);
      this.setState({ alerting: idInterval });
    }

    if ((soma === 0 && this.state.alerting) || this.state.silenceAlert) {
      clearInterval(this.state.alerting);
      Vibration.cancel();
      this.setState({ alerting: false });
    }
  };

  onPressSilence = () => {
    console.log("clicou");
    this.setState({ silenceAlert: !this.state.silenceAlert });
  };

  closeModal = (acao) => {
    this.setState({ showModal: false });
    if (acao === "enviar") this.notificarPerda();
    if (acao === "cancelar") this.setState({ inputModal: null });
  };

  render() {
    return (
      <ScrollView contentContainerStyle={{ flex: 1 }} scrollEnabled={false}>
        <HomeComponent
          utilizadores={this.state.utilizadores}
          silenceAlert={this.state.silenceAlert}
          isLoading={this.state.isLoading}
          onPressUtilizadores={this.onPressUtilizadores}
          onSelectCard={this.onSelectCard}
          enableAlert={this.enableAlert}
          onPressSilence={this.onPressSilence}
          closeModal={this.closeModal}
          firstAction={this.state.firstAction}
          secondAction={this.state.secondAction}
          showModal={this.state.showModal}
          titleModal={this.state.titleModal}
          messageModal={this.state.messageModal}
          firstLabel={this.state.firstLabel}
          secondLabel={this.state.secondLabel}
          onChangeHandler={this.onChangeHandler}
          isLoadingModal={this.state.isLoadingModal}
          inputModal={this.state.inputModal}
        />
        <ActionSheet
          ref={(o) => (this.ActionSheet = o)}
          title={this.state.title}
          options={this.state.options}
          cancelButtonIndex={0}
          onPress={(index) => this.completeAction(this.state.options[index])}
        />
      </ScrollView>
    );
  }
}
const SOUND =
  "https://firebasestorage.googleapis.com/v0/b/tccsafefamily.appspot.com/o/sound%2Fy2mate%20(mp3cut.net).mp3?alt=media&token=f6b58766-b46d-4170-9bbd-a9ea259409c4";
