import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
  Image,
} from "react-native";
import TimeAgo from "react-native-timeago";
import { Colors } from "../../assets/theme";
import LoadingComponent from "../LoadingComponent";
import LinearGradient from "react-native-linear-gradient";

import {
  responsiveSize,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../../helpers/utils";
import { ASSETS } from "../../assets";

export default class ChatComponent extends Component {
  renderItem = ({ item, index }) => {
    if (item.showOnChat)
      return (
        <TouchableOpacity
          onPress={() => {
            this.props.goToMessage(item);
          }}
        >
          <View
            style={{
              marginHorizontal: screenWidthPercentage(2),
              flexDirection: "row",
              alignItems: "center",
              paddingVertical: responsiveSize(1),
            }}
          >
            <View
              style={[
                styles.avatarImageContainer,
                {
                  borderColor: item.ativo ? Colors.tertiary : Colors.red,
                },
              ]}
            >
              <Image source={ASSETS.icons.userAvatar} style={styles.avatar} />
            </View>
            <View
              style={{
                flexDirection: "column",
                marginLeft: screenWidthPercentage(3),
              }}
            >
              <View
                style={{
                  marginBottom: responsiveSize(1),
                  marginRight: screenWidthPercentage(33),
                }}
              >
                {item.mensagens && (
                  <Text style={{ fontWeight: "bold" }} numberOfLines={1}>
                    {item.mensagens[item.mensagens.length - 1].autor ===
                    this.props.user.uid
                      ? "Você"
                      : item.mensagens[item.mensagens.length - 1].nome}
                  </Text>
                )}
              </View>
              <View>
                {item.mensagens && (
                  <Text
                    style={{
                      fontWeight: "200",
                      fontSize: responsiveSize(1.6),
                      marginRight: screenWidthPercentage(33),
                    }}
                    numberOfLines={1}
                  >
                    {item.created === item.ultimaMensagem
                      ? item.mensagens[0].texto
                      : item.mensagens[item.mensagens.length - 1].texto}
                  </Text>
                )}
              </View>
            </View>
            <View
              style={{
                position: "absolute",
                right: screenWidthPercentage(2),
                top: screenHeightPercentage(2),
              }}
            >
              <TimeAgo
                style={{
                  fontSize: responsiveSize(1.5),
                  color: Colors.lightBlack,
                  fontWeight: "100",
                }}
                time={item.ultimaMensagem}
                interval={60000}
              />
            </View>
            <View
              style={{
                position: "absolute",
                right: screenWidthPercentage(10),
                top: screenHeightPercentage(5.5),
              }}
            >
              {item.naoLidasMensagem && item.naoLidasMensagem > 0 ? (
                <View style={styles.notifContainer}>
                  <Text style={styles.notifText}>{item.naoLidasMensagem}</Text>
                </View>
              ) : null}
            </View>
          </View>
          <View style={styles.separator} />
        </TouchableOpacity>
      );
  };

  renderSeparator = () => {
    return <View style={styles.separator} />;
  };

  render() {
    const { mensagens, isLoading, user } = this.props;
    if (isLoading || !user) {
      return (
        <View style={styles.general}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}> Notificações</Text>
          </View>
          <View style={styles.loaderContainer}>
            <LoadingComponent
              size={"large"}
              label={"Buscando mensagens..."}
              labelStyle={{ color: Colors.darkGray }}
            />
          </View>
        </View>
      );
    }
    if (mensagens.length === 0) {
      return (
        <View style={styles.general}>
          <View style={styles.headerContainer}>
            <Text style={styles.headerText}> Notificações</Text>
          </View>
          <View style={styles.loaderContainer}>
            <Image source={ASSETS.icons.chat} style={styles.iconChat} />
            <Text style={styles.mensagemText}>
              Nenhuma mensagem encontrada...
            </Text>
          </View>
        </View>
      );
    }
    return (
      <View style={styles.general}>
        <LinearGradient
          colors={[Colors.darkTertiary, Colors.white]}
          start={{ x: 0, y: 0.75 }}
          end={{ x: 0, y: 1 }}
          style={styles.headerContainerAbsolute}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}> Notificações</Text>
        </View>

        <FlatList
          data={mensagens}
          renderItem={(item) => this.renderItem(item)}
          keyExtractor={(item, index) => index.toString()}
          ListHeaderComponent={
            <View style={{ height: screenHeightPercentage(14) }} />
          }
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
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
  mensagemText: {
    fontSize: responsiveSize(3.4),
    fontFamily: "Roboto-Medium",
    color: Colors.darkGray,
    textAlign: "center",
  },
  headerContainer: {
    marginTop: screenHeightPercentage(4),
    justifyContent: "center",
    alignSelf: "center",
    flexDirection: "row",
    marginBottom: screenHeightPercentage(3),
    position: "absolute",
    zIndex: 3,
  },
  headerContainerAbsolute: {
    position: "absolute",
    zIndex: 2,
    height: screenHeightPercentage(13),
    backgroundColor: Colors.white,
    width: screenWidthPercentage(100),
    opacity: 0.8,
  },
  loaderContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  itemContainer: {
    flexDirection: "row",
  },
  avatarImageContainer: {
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 120 / 2,
    borderWidth: 2.5,
    opacity: 0.5,
    width: responsiveSize(7),
    height: responsiveSize(7),
  },
  avatar: {
    width: responsiveSize(5),
    height: responsiveSize(5),
    borderRadius: 57,
    tintColor: Colors.tertiary,
    resizeMode: "contain",
  },
  iconChat: {
    width: responsiveSize(10),
    height: responsiveSize(10),
    resizeMode: "contain",
    tintColor: Colors.darkGray,
  },
  separator: {
    marginVertical: screenHeightPercentage(1),
    height: 1.2,
    backgroundColor: Colors.tertiary,
    opacity: 0.5,
    elevation: 1,
    marginRight: screenWidthPercentage(6),
    marginHorizontal: screenWidthPercentage(20),
  },
  notifContainer: {
    position: "absolute",
    top: 1,
    right: responsiveSize(-2),
    backgroundColor: Colors.tertiary,
    height: responsiveSize(3),
    width: responsiveSize(3.5),
    borderRadius: responsiveSize(1.5),
    justifyContent: "center",
    alignItems: "center",
    opacity: 0.7,
  },
  notifText: {
    fontSize: responsiveSize(1.4),
    textAlign: "center",
    textAlignVertical: "center",
    color: Colors.black,
  },
});
