import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  Image,
  FlatList,
  TouchableOpacity,
} from "react-native";
import { Colors } from "../../assets/theme";
import { ASSETS } from "../../assets";
import ModalStyled from "../Modal";
import LinearGradient from "react-native-linear-gradient";
import ButtonComponent from "../ButtonComponent";
import LoadingComponent from "../LoadingComponent";
import {
  responsiveSize,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../../helpers/utils";
export default class HomeComponent extends Component {
  getDistanceColor = (atual, limite) => {
    if (!atual && atual !== 0) {
      return Colors.darkGray;
    }
    if (Math.round((atual / limite) * 100) <= 30) {
      return Colors.green;
    }

    if (Math.round((atual / limite) * 100) <= 60) {
      return "orange";
    }

    if (Math.round((atual / limite) * 100) > 60) {
      return Colors.red;
    }
  };

  renderDistancia = (item) => {
    if (!item.beaconID) {
      return (
        <View style={styles.distanciaContainer}>
          <Text
            style={{
              fontSize: responsiveSize(1.6),
              color: Colors.black,
              textAlign: "center",
            }}
          >
            {`Nenhum Beacon\nassociado`}
          </Text>
        </View>
      );
    }

    if (item.beaconInfo && item.beaconInfo.status === "perdido") {
      return (
        <View style={styles.distanciaContainer}>
          <Image style={styles.alertIcon} source={ASSETS.icons.alert} />
          <Text
            style={{
              fontSize: responsiveSize(2.4),
              textAlign: "center",
              color: Colors.red,
            }}
          >
            {`UTILIZADOR\nPERDIDO!`}
          </Text>
        </View>
      );
    }

    if (item.tempoLimite) {
      return (
        <View style={styles.distanciaContainer}>
          <Image style={styles.alertIcon} source={ASSETS.icons.alert} />

          <Text
            style={{
              fontSize: responsiveSize(2.4),
              textAlign: "center",
              color: Colors.red,
            }}
          >
            {`Perda da\nleitura!`}
          </Text>
        </View>
      );
    }

    if (!item.distanciaAtual && item.distanciaAtual !== 0 && item.ativo) {
      return (
        <View style={styles.distanciaContainer}>
          <Text
            style={{
              fontSize: responsiveSize(2),
              fontWeight: "400",
              textAlign: "center",
              color: this.getDistanceColor(item.distanciaAtual, item.distancia),
            }}
          >
            {`Beacon não\nencontrado`}
          </Text>
        </View>
      );
    }

    if (!item.ativo) {
      return (
        <View style={styles.distanciaContainer}>
          <Text
            style={{
              fontSize: responsiveSize(2),
              fontWeight: "400",
              textAlign: "center",
              color: this.getDistanceColor(item.distanciaAtual, item.distancia),
            }}
          >
            {`Ative o\nutilizador`}
          </Text>
        </View>
      );
    }
    if (item.distanciaAtual > item.distancia) {
      return (
        <View style={styles.distanciaContainer}>
          <Image style={styles.alertIcon} source={ASSETS.icons.alert} />
          <Text
            style={{
              fontSize: responsiveSize(3.4),
              fontWeight: "600",
              color: this.getDistanceColor(item.distanciaAtual, item.distancia),
            }}
          >
            {`${item.distanciaAtual || "-"} m`}
          </Text>
          <Text
            style={{
              fontSize: responsiveSize(2),
              color: this.getDistanceColor(item.distanciaAtual, item.distancia),
            }}
          >
            {`Limite excedido!`}
          </Text>
        </View>
      );
    }

    return (
      <View style={styles.distanciaContainer}>
        <Text
          style={{
            fontSize: responsiveSize(3.4),
            fontWeight: "600",
            color: this.getDistanceColor(item.distanciaAtual, item.distancia),
          }}
        >
          {`${item.distanciaAtual < 1 ? "<1" : item.distanciaAtual || "-"} m`}
        </Text>
      </View>
    );
  };

  renderItem = ({ item, index }) => {
    const { onSelectCard } = this.props;
    return (
      <TouchableOpacity onPress={() => onSelectCard(item)}>
        <View style={styles.cardContainerAbsolute} />
        <View style={styles.cardContainer}>
          <View
            style={{
              flexDirection: "row",
              justifyContent: "space-evenly",
              flex: 1,
            }}
          >
            <View style={styles.leftContainer}>
              <Text style={styles.nameText} numberOfLines={2}>
                {item.nome}
              </Text>
              {item.beaconID && item.beaconInfo.descricao && (
                <Text style={styles.beaconText}>
                  {item.beaconInfo.descricao}
                </Text>
              )}
            </View>

            {this.renderDistancia(item)}

            <View style={styles.rightContainer}>
              <View>
                <Text style={[styles.keyText, { color: Colors.red }]}>
                  {item.ativo ? "Ativo" : "Inativo"}
                </Text>
              </View>
              <View style={{ alignItems: "center" }}>
                <Text
                  style={[
                    styles.valueText,
                    {
                      color: Colors.lightBlack,
                      fontSize: responsiveSize(1.5),
                    },
                  ]}
                >
                  {`Limite`}
                </Text>
                <Text
                  style={[
                    styles.valueText,
                    {
                      color: Colors.black,
                      fontSize: responsiveSize(2.2),
                    },
                  ]}
                >
                  {`${item.distancia} m`}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const {
      onPressUtilizadores,
      isLoading,
      utilizadores,
      silenceAlert,
      onPressSilence,
    } = this.props;
    const {
      closeModal,
      firstAction,
      secondAction,
      showModal,
      titleModal,
      messageModal,
      firstLabel,
      secondLabel,
      isLoadingModal,
      inputModal,
      onChangeHandler,
    } = this.props;
    return (
      <View style={styles.general}>
        <View style={styles.listContainer}>
          <LinearGradient
            colors={[Colors.darkTertiary, Colors.lightGray]}
            start={{ x: 0, y: 0.75 }}
            end={{ x: 0, y: 1 }}
            style={styles.headerContainerAbsolute}
          />
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}> Meus Utilizadores</Text>

            <View
              style={{
                position: "absolute",
                right: screenWidthPercentage(8),
                zIndex: 5,
              }}
            >
              <TouchableOpacity
                onPress={() => onPressSilence()}
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <Image
                  style={{
                    height: responsiveSize(3),
                    width: responsiveSize(3),
                    tintColor: Colors.black,
                  }}
                  source={
                    silenceAlert ? ASSETS.icons.soundOFF : ASSETS.icons.soundON
                  }
                />
                <Text
                  style={{
                    fontSize: responsiveSize(1.2),
                    color: Colors.black,
                  }}
                >
                  Alertas
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {isLoading ? (
            <View style={styles.generalLoader}>
              <LoadingComponent
                size={"large"}
                label={"Buscando Utilizadores..."}
                labelStyle={{ color: Colors.darkGray }}
              />
            </View>
          ) : utilizadores.length === 0 ? (
            <View style={styles.loaderContainer}>
              <Text style={styles.mensagemText}>
                Nenhum Utilizador encontrado...
              </Text>

              <View
                style={{
                  position: "absolute",
                  bottom: 0,
                  alignItems: "center",
                }}
              >
                <Text
                  style={[
                    styles.mensagemText,
                    { fontSize: responsiveSize(2.5) },
                  ]}
                >
                  Cadastre um aqui
                </Text>
                <Image source={ASSETS.icons.down} style={styles.iconHome} />
              </View>
            </View>
          ) : (
            <FlatList
              data={utilizadores}
              renderItem={(item) => this.renderItem(item)}
              keyExtractor={(item, index) => item.uid}
              ListHeaderComponent={
                <View style={{ height: screenHeightPercentage(14) }} />
              }
              ListFooterComponent={
                <View style={{ height: screenHeightPercentage(5) }} />
              }
            />
          )}
        </View>

        <View style={styles.buttonContainer}>
          <ButtonComponent
            label="Novo Utilizador"
            paddingHorizontal={50}
            onPress={() => onPressUtilizadores()}
            clickable={true}
          />
        </View>
        <ModalStyled
          showModal={showModal}
          forceButton={true}
          firstAction={firstAction}
          secondAction={secondAction}
          firstLabel={firstLabel}
          secondLabel={secondLabel}
          inputModal={inputModal}
          onChangeHandler={onChangeHandler}
          closeModal={closeModal}
          titleModal={titleModal}
          messageModal={messageModal}
          isLoading={isLoadingModal}
          height={secondLabel ? screenHeightPercentage(40) : false}
          showInput={secondLabel ? true : false}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
  },
  generalLoader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  separator: {
    height: 1,
    backgroundColor: Colors.lightBlack,
  },
  cardContainer: {
    paddingHorizontal: responsiveSize(2),
    paddingVertical: responsiveSize(1),
    marginBottom: screenHeightPercentage(2),
    height: screenHeightPercentage(18),
    elevation: 5,
  },
  cardContainerAbsolute: {
    height: screenHeightPercentage(18),
    width: screenWidthPercentage(96),
    position: "absolute",
    alignSelf: "center",
    borderRadius: 10,
    backgroundColor: Colors.white,
    opacity: 0.6,
    elevation: 4,
    shadowColor: Colors.tertiary,
    shadowOffset: { height: 0, width: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  keyText: {
    color: Colors.black,
    fontSize: responsiveSize(2),
    fontWeight: "500",
  },
  beaconText: {
    color: Colors.black,
    fontSize: responsiveSize(1.6),
    marginTop: 5,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: screenHeightPercentage(8),
  },
  nameText: {
    color: Colors.darkTertiary,
    fontSize: responsiveSize(2.4),
    fontWeight: "500",
  },
  valueText: {
    color: Colors.darkGray,
    fontSize: responsiveSize(2),
  },
  itemLine: {
    flexDirection: "row",
    marginVertical: responsiveSize(1),
    marginEnd: screenWidthPercentage(6),
  },
  listContainer: {
    flex: 1,
  },
  buttonContainer: {
    alignSelf: "center",
    bottom: 0,
    position: "absolute",
  },
  headerContainer: {
    marginTop: screenHeightPercentage(4),
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: screenHeightPercentage(3),
    position: "absolute",
    zIndex: 3,
    height: screenHeightPercentage(13),
    width: screenWidthPercentage(100),
  },
  headerContainerAbsolute: {
    position: "absolute",
    zIndex: 2,
    height: screenHeightPercentage(13),
    backgroundColor: Colors.white,
    width: screenWidthPercentage(100),
    opacity: 0.8,
  },
  headerText: {
    fontSize: responsiveSize(3.4),
    fontFamily: "Roboto-Bold",
    color: Colors.white,
    // textDecorationLine: "underline",
    shadowColor: Colors.darkGray,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.78,
    shadowRadius: 3,
    elevation: 5,
  },
  rightContainer: {
    justifyContent: "space-between",
    alignItems: "flex-end",
  },
  leftContainer: {
    justifyContent: "space-between",
    alignItems: "flex-start",
    maxWidth: screenWidthPercentage(25),
  },
  distanciaContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  alertIcon: {
    height: responsiveSize(2.5),
    width: responsiveSize(2.5),
    tintColor: Colors.red,
  },
  iconHome: {
    width: responsiveSize(8),
    height: responsiveSize(8),
    resizeMode: "contain",
    tintColor: Colors.darkGray,
  },
  mensagemText: {
    fontSize: responsiveSize(3.4),
    fontFamily: "Roboto-Medium",
    color: Colors.darkGray,
    textAlign: "center",
  },
});
