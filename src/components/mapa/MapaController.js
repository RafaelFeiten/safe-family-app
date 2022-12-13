import React, { Component } from "react";
import { View } from "react-native";
import styled from "@emotion/native";
import firestore from "@react-native-firebase/firestore";
import MapView from "./MapaComponent";
import { getUserLocation } from "../../helpers/beaconsHelper";
import { getCurrentUser } from "../../helpers/databaseHelpers";
import { Colors } from "../../assets/theme";

const Map = styled(MapView)({
  flex: 1,
});

export default class MapaController extends Component {
  constructor(props) {
    super(props);

    this.state = {
      loading: false,
      latitudeLocal: 0,
      longitudeLocal: 0,
      beacons: null,
      error: null,
      user: null,
      users: [],
      beacons: [],
      showUsuarios: props.esconderUsuarios ? false : true,
      showBeaconsPerdidos: props.esconderBeaconsPerdidos ? false : true,
    };
  }

  componentWillMount = async () => {
    let userLocation = await getUserLocation();
    this.setState({
      latitudeLocal: userLocation.latitude,
      longitudeLocal: userLocation.longitude,
    });
  };

  componentDidMount() {
    getCurrentUser().then((user) => {
      this.setState({ user });
    });
    this.fetchUsers();
    this.getUtilizadoresPerdidos();
  }

  fetchUsers = () => {
    firestore()
      .collection("users")
      .onSnapshot(
        (snapshot) => {
          let users = snapshot.docs.map((doc) => {
            let data = doc.data();
            if (
              data.lastLocation &&
              data.autorizaMapa &&
              doc.id !== this.state.user.uid
            ) {
              let model = {
                lastLocation: data.lastLocation,
                nome: data.nomeMapa,
              };
              return model;
            } else {
              return null;
            }
          });
          users = users.filter((x) => x);
          this.setState({ users });
        },
        (err) => {
          console.log(`Erro ao buscar usuários: ${err}`);
        }
      );
  };

  getUtilizadoresPerdidos = async () => {
    let user = await getCurrentUser();
    let uid = user.uid;
    firestore()
      .collection("beacons")
      .where("owner", "==", uid)
      .where("status", "==", "perdido")
      .onSnapshot(
        async (snapshot) => {
          let beacons = await Promise.all(
            snapshot.docs.map((doc) => {
              return new Promise((resolve, reject) => {
                firestore()
                  .collection("utilizadores")
                  .where("beaconID", "==", doc.id)
                  .get()
                  .then((snapshot) => {
                    snapshot.docs.map((doc) => {
                      resolve({ ...doc.data(), uid: doc.id });
                    });
                  });
              });
            })
          );
          this.setState({ beacons: [] }, () => {
            this.beaconLastLocation(beacons);
          });
        },
        (err) => {
          console.log(`Erro ao buscar beacons perdidos: ${err}`);
        }
      );
  };

  beaconLastLocation = async (beacons) => {
    await Promise.all(
      beacons.map((beacon) => {
        firestore()
          .collection(`beacons/${beacon.beaconID}/locations`)
          .where("dataTimestamp", ">=", beacon.chatID)
          .onSnapshot(
            (snapshot) => {
              if (snapshot.docs.length > 0) {
                let locations = snapshot.docs.map((doc) => {
                  let data = doc.data();
                  if (data.userRastreio === this.state.user.uid) {
                    return false;
                  }
                  let model = {
                    utilizador: beacon.nome,
                    beacon: beacon.beaconID,
                    dataRastreio: data.dataTimestamp,
                    position: data.position,
                  };

                  return model;
                });

                locations = locations.filter((x) => x);
                let newBeacons = this.state.beacons.map((beaconState) => {
                  if (beaconState.beacon === locations[0].beacon) {
                    return false;
                  } else {
                    return beaconState;
                  }
                });
                newBeacons = newBeacons.filter((x) => x);
                newBeacons = newBeacons.concat(locations);
                this.setState({ beacons: newBeacons });
              } else {
                let newBeacons = this.state.beacons.map((beaconState) => {
                  if (beaconState.beacon === beacon.beaconID) {
                    return false;
                  } else {
                    return beaconState;
                  }
                });
                newBeacons = newBeacons.filter((x) => x);
                this.setState({ beacons: newBeacons });
              }
            },
            (err) => {
              console.log(`Erro ao buscar beacons perdidos: ${err}`);
            }
          );
      })
    );
  };

  changeStatus = (param) => {
    this.setState({ [param]: !this.state[param] });
  };

  render() {
    return (
      <View style={{ flex: 1, backgroundColor: Colors.black }}>
        <Map
          latitude={this.state.latitudeLocal}
          longitude={this.state.longitudeLocal}
          users={this.state.users}
          beacons={this.state.beacons}
          showUsuarios={this.state.showUsuarios}
          showBeaconsPerdidos={this.state.showBeaconsPerdidos}
          changeStatus={this.changeStatus}
        />
      </View>
    );
  }
}
