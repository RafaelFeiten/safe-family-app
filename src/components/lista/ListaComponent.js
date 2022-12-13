import React, { Component } from "react";
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  FlatList,
} from "react-native";
import styled from "@emotion/native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import ModalStyled from "../Modal";

import { Colors } from "../../assets/theme";
import ButtonComponent from "../ButtonComponent";
import {
  responsiveSize,
  screenHeightPercentage,
  screenWidthPercentage,
} from "../../helpers/utils";

const TextFieldContainer = styled.View({}, ({ color }) => ({
  width: "90%",
  borderRadius: 4,
  marginBottom: responsiveSize(2),
  justifyContent: "center",
  height: 50,
  borderWidth: 1,
  backgroundColor: Colors.white,
  borderColor: color,
  position: "relative",
}));

const Title = styled.Text({}, ({ color }) => ({
  color,
  fontSize: 12,
  fontWeight: "600",
  left: 10,
}));

const TextField = styled.TextInput({
  alignSelf: "flex-start",
  width: "96%",
  top: 4,
  marginHorizontal: 10,
  textAlignVertical: "center",
  padding: 0,
  color: Colors.darkGray,
  fontSize: 16,
});

export default class ListaComponent extends Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  getColor = (key) => {
    const { keyOnFocus } = this.props;
    if (key === keyOnFocus) {
      return Colors.tertiary;
    }
    return Colors.darkGray;
  };

  renderItem = ({ item, index }) => {
    const { indexOnFocus } = this.props;
    return (
      <View style={styles.itemContainer}>
        <TouchableOpacity onPress={() => this.props.setIndex(index)}>
          {this.renderStatus(item.owner)}

          <View style={styles.itemLine}>
            <Text style={styles.keyText}>major: </Text>
            <Text style={styles.valueText}>{item.major}</Text>
          </View>
          <View style={styles.itemLine}>
            <Text style={styles.keyText}>minor: </Text>
            <Text style={styles.valueText}>{item.minor}</Text>
          </View>
          <View style={styles.itemLine}>
            <Text style={styles.keyText}>uuid: </Text>

            <Text style={styles.valueText} numberOfLines={1}>
              {item.uuid}
            </Text>
          </View>
        </TouchableOpacity>
        {indexOnFocus === index && (
          <View style={{ alignItems: "center", marginTop: 10 }}>
            <TextFieldContainer color={this.getColor("descricao")}>
              <Title color={this.getColor("descricao")}>Descrição</Title>
              <TextField
                value={this.props.descricao}
                placeholder={"Ex: pulseira rosa"}
                onChangeText={(data) =>
                  this.props.onChangeHandler("descricao", data)
                }
                selectionColor={Colors.tertiary}
                onFocus={() => this.props.onFocus("descricao")}
                onBlur={() => this.props.onBlur()}
                keyboardType={"default"}
                returnKeyType={"send"}
                onSubmitEditing={() => {
                  this.props.cadastrarBeacon(item);
                }}
                ref={(input) => {
                  this.nomeInput = input;
                }}
              />
            </TextFieldContainer>
            <ButtonComponent
              label="Cadastrar"
              // paddingHorizontal={50}
              onPress={() => this.props.cadastrarBeacon(item)}
              clickable={true}
            />
          </View>
        )}
      </View>
    );
  };

  renderHeader = () => {
    return (
      <View style={styles.headerFlatlist}>
        <Text style={styles.headerText}> Selecione um BEACON:</Text>
      </View>
    );
  };

  renderFooter = () => {
    return (
      <View style={styles.footerFlatlist}>
        <Text style={styles.footerText}>
          Estes são todos os beacons encontrados...
        </Text>
      </View>
    );
  };

  renderStatus = (status) => {
    const { userId } = this.props;
    if (!status) {
      return (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: Colors.green }]}>
            Beacon disponível para cadastro
          </Text>
        </View>
      );
    }
    if (status === userId) {
      return (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: Colors.blue }]}>
            Beacon já cadastrado por você
          </Text>
        </View>
      );
    }
    if (status !== userId) {
      return (
        <View style={styles.statusContainer}>
          <Text style={[styles.statusText, { color: Colors.red }]}>
            Beacon já cadastrado por outro usuário
          </Text>
        </View>
      );
    }
  };

  render() {
    const {
      beaconList,
      closeModal,
      firstAction,
      secondAction,
      showModal,
      titleModal,
      messageModal,
      firstLabel,
      secondLabel,
      isLoadingModal,
    } = this.props;
    return (
      <KeyboardAwareScrollView
        extraScrollHeight={screenHeightPercentage(12)}
        enableOnAndroid={true}
      >
        <View style={styles.general}>
          <FlatList
            data={beaconList}
            ListHeaderComponent={() => this.renderHeader()}
            ListFooterComponent={() => this.renderFooter()}
            renderItem={(item) => this.renderItem(item)}
            keyExtractor={(item, index) => index}
          />

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
      </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  general: {
    flex: 1,
  },
  itemContainer: {
    backgroundColor: Colors.white,
    borderRadius: 15,
    marginHorizontal: screenWidthPercentage(3),
    marginTop: screenHeightPercentage(1.8),
    paddingHorizontal: responsiveSize(1),
    paddingVertical: responsiveSize(2),
    shadowColor: Colors.darkGray,
    shadowOffset: { height: 0 },
    shadowOpacity: 1,
    shadowRadius: 8,
    elevation: 5,
    borderColor: Colors.gray,
    borderWidth: 2,
  },
  keyText: {
    color: Colors.black,
    fontSize: responsiveSize(1.8),
    fontWeight: "500",
  },
  valueText: {
    color: Colors.darkGray,
    fontSize: responsiveSize(1.8),
  },
  itemLine: {
    flexDirection: "row",
    marginBottom: responsiveSize(1),
    marginEnd: screenWidthPercentage(8),
  },
  statusText: {
    fontSize: responsiveSize(1.9),
    fontWeight: "600",
    textDecorationLine: "underline",
  },
  statusContainer: {
    alignItems: "center",
    marginBottom: responsiveSize(2),
  },
  headerFlatlist: {
    alignItems: "center",
    marginTop: screenHeightPercentage(3),
  },
  headerText: {
    fontFamily: "Roboto-Medium",
    fontSize: responsiveSize(2.5),
  },
  footerFlatlist: {
    alignItems: "center",
    marginTop: screenHeightPercentage(1),
  },
  footerText: {
    // fontSize: responsiveSize()
    color: Colors.blue,
    fontStyle: "italic",
  },
});
