import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  FlatList,
  Image,
  TouchableOpacity,
} from "react-native";

import { Colors } from "../../assets/theme";
import ButtonComponent from "../ButtonComponent";
import {
  responsiveSize,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../../helpers/utils";
import LoadingComponent from "../LoadingComponent";
import { ASSETS } from "../../assets";
import LinearGradient from "react-native-linear-gradient";

import ModalStyled from "../Modal";

export default class CadastrarComponent extends Component {
  renderItem = ({ item, index }) => {
    const { deleteBeacon, modoSelecao, selectBeacon } = this.props;
    return (
      <TouchableOpacity
        onPress={() => selectBeacon(item)}
        disabled={!modoSelecao}
      >
        <View style={styles.cardContainerAbsolute} />

        <View style={styles.cardContainer}>
          <View style={{ flexDirection: "row" }}>
            <View>
              <View style={styles.itemLine}>
                <Text style={styles.keyText}>Descrição: </Text>
                <Text
                  style={[
                    styles.valueText,
                    {
                      color: Colors.lightBlack,
                    },
                  ]}
                >
                  {item.descricao}
                </Text>
              </View>
              <View style={styles.itemLine}>
                <Text style={styles.keyText}>Status: </Text>
                <Text
                  style={[
                    styles.valueText,
                    {
                      color: modoSelecao
                        ? item.ativo
                          ? Colors.red
                          : Colors.green
                        : item.ativo
                        ? Colors.green
                        : Colors.red,
                      fontWeight: "600",
                    },
                  ]}
                >
                  {modoSelecao
                    ? item.ativo
                      ? "EM USO"
                      : "DISPONÍVEL"
                    : item.ativo
                    ? "ATIVO"
                    : "DESATIVADO"}
                </Text>
              </View>
            </View>
            {modoSelecao ? null : (
              <View style={styles.logoContainer}>
                <TouchableOpacity
                  style={styles.touchable}
                  onPress={() => deleteBeacon(item, index)}
                >
                  <Image source={ASSETS.icons.close} style={styles.logo} />
                  <Text style={{ color: "red", fontSize: responsiveSize(1.5) }}>
                    Excluir
                  </Text>
                </TouchableOpacity>
              </View>
            )}
          </View>
          <View style={styles.itemLine}>
            <Text style={styles.keyText}>UUID: </Text>
            <Text style={styles.valueText} numberOfLines={1}>
              {item.uid}
            </Text>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  render() {
    const { onPressButton, beacons, isLoading, modoSelecao } = this.props;
    const {
      showModal,
      closeModal,
      firstAction,
      firstLabel,
      secondAction,
      secondLabel,
      isLoadingModal,
      titleModal,
      messageModal,
    } = this.props;
    return (
      <View style={styles.general}>
        {!modoSelecao && (
          <>
            <LinearGradient
              colors={[Colors.darkTertiary, Colors.lightGray]}
              start={{ x: 0, y: 0.75 }}
              end={{ x: 0, y: 1 }}
              style={styles.headerContainerAbsolute}
            />
            <View style={styles.headerContainer}>
              <Text style={styles.headerText}> Meus Beacons</Text>
            </View>
          </>
        )}
        {isLoading ? (
          <View style={styles.generalLoader}>
            <LoadingComponent
              size={"large"}
              label={"Buscando beacons..."}
              labelStyle={{ color: Colors.darkGray }}
            />
          </View>
        ) : beacons.length === 0 ? (
          <View style={styles.loaderContainer}>
            <Text style={styles.mensagemText}>
              {`Nenhum Beacon \nencontrado...`}
            </Text>

            <View
              style={{
                position: "absolute",
                bottom: 0,
                alignItems: "center",
              }}
            >
              <Text
                style={[styles.mensagemText, { fontSize: responsiveSize(2.5) }]}
              >
                Cadastre um aqui
              </Text>
              <Image source={ASSETS.icons.down} style={styles.iconHome} />
            </View>
          </View>
        ) : (
          <FlatList
            data={beacons}
            renderItem={(item) => this.renderItem(item)}
            keyExtractor={(item, index) => item.uid}
            ListHeaderComponent={
              <View style={{ height: screenHeightPercentage(14) }} />
            }
            ListFooterComponent={
              <View
                style={{
                  height: modoSelecao
                    ? screenHeightPercentage(10)
                    : screenHeightPercentage(5),
                }}
              />
            }
          />
        )}

        <View style={styles.buttonContainer}>
          <View style={{ alignItems: "center" }}>
            <ButtonComponent
              label="Novo Beacon"
              paddingHorizontal={50}
              onPress={() => onPressButton(1)}
              clickable={true}
            />
          </View>
        </View>
        <ModalStyled
          showModal={showModal}
          forceButton={true}
          firstAction={firstAction}
          secondAction={secondAction}
          firstLabel={firstLabel}
          secondLabel={secondLabel}
          closeModal={closeModal}
          titleModal={titleModal}
          messageModal={messageModal}
          isLoading={isLoadingModal}
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
  cardContainer: {
    padding: responsiveSize(2),
    marginBottom: screenHeightPercentage(2),
    elevation: 5,
    height: screenHeightPercentage(20),
  },
  cardContainerAbsolute: {
    height: screenHeightPercentage(20),
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
    flex: 0.8,
  },
  buttonContainer: {
    alignSelf: "center",
    bottom: 0,
    position: "absolute",
  },
  headerContainerAbsolute: {
    position: "absolute",
    zIndex: 2,
    height: screenHeightPercentage(13),
    backgroundColor: Colors.white,
    width: screenWidthPercentage(100),
    opacity: 0.8,
  },
  headerContainer: {
    marginTop: screenHeightPercentage(4),
    justifyContent: "center",
    position: "absolute",
    alignSelf: "center",
    zIndex: 3,
  },
  headerText: {
    fontSize: responsiveSize(3.4),
    fontFamily: "Roboto-Bold",
    color: Colors.white,
    shadowColor: Colors.darkGray,
    shadowOffset: { height: 2 },
    shadowOpacity: 0.78,
    shadowRadius: 3,
    elevation: 5,
  },
  logo: {
    height: 30,
    width: 30,
    tintColor: "red",
  },
  logoContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "flex-end",
  },
  touchable: {
    height: 50,
    width: 50,
    justifyContent: "center",
    alignItems: "center",
  },
  textEscolha: {
    textAlign: "center",
    marginBottom: 10,
    color: Colors.darkTertiary,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: screenHeightPercentage(8),
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
