import React, { PureComponent } from "react";
import {
  View,
  StyleSheet,
  Text,
  Vibration,
  TouchableOpacity,
  Image
} from "react-native";
import PropTypes from "prop-types";
import { Colors } from "../../assets/theme";
import { RNCamera } from "react-native-camera";
import { ASSETS } from "../../assets";
import { statusBarHeight } from "../../helpers/utils";

const flashModeOrder = {
  off: "torch",
  torch: "off"
};

export default class QRCodeController extends PureComponent {
  static propTypes = {
    onRead: PropTypes.func.isRequired,
    reactivate: PropTypes.bool,
    reactivateTimeout: PropTypes.number
  };

  static defaultProps = {
    onRead: () => console.log("QR code scanned!"),
    reactivate: true,
    reactivateTimeout: 1000
  };

  constructor(props) {
    super(props);

    this.state = {
      scanning: false,
      flash: "off"
    };
    this.timeout = null;
    this._handleBarCodeRead = this._handleBarCodeRead.bind(this);
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.subs = [
      navigation.addListener("didFocus", () => this._setScanning(false)),
      navigation.addListener("willBlur", () => this._componentWillUnmount())
    ];
  }

  _componentWillUnmount() {
    this.setState({ scanning: true, flash: "off" });
  }

  _setScanning(value) {
    this.setState({ scanning: value });
  }

  _handleBarCodeRead(e) {
    if (!this.state.scanning) {
      Vibration.vibrate();
      this._setScanning(true);
      this.props.onRead(e);
    }
  }

  toggleFlash() {
    this.setState({
      flash: flashModeOrder[this.state.flash]
    });
  }

  styleView = StyleSheet.create({
    contentScan: {
      flexDirection: "row",
      flex: 1.5,
      backgroundColor: "transparent"
    },
    top: {
      flex: 0.5,
      backgroundColor: "black",
      opacity: 0.8,
      alignItems: "center",
      flexDirection: "column",
      justifyContent: "center",
      paddingBottom: "5%",
      paddingTop: statusBarHeight + 10
    },
    contentFooter: {
      flexDirection: "row",
      flex: 0.7,
      alignItems: "center",
      justifyContent: "center",
      backgroundColor: "black",
      opacity: 0.8
    },
    detailFooter: {
      flex: 0.7,
      height: "100%",
      alignItems: "center",
      justifyContent: "center"
    },
    margin: {
      flex: 0.7,
      backgroundColor: "black",
      opacity: 0.8
    },
    scanArea: {
      borderWidth: 3,
      borderColor: Colors.redPrimary,
      flex: 4,
      margin: "1%"
    }
  });

  styleText = StyleSheet.create({
    info: {
      color: Colors.gray,
      textAlign: "center",
      fontSize: 14,
      alignSelf: "center"
    }
  });

  styleImage = StyleSheet.create({
    logo: {
      resizeMode: "contain",
      width: "90%",
      height: "85%",
      marginBottom: 30,
      tintColor: Colors.gray
    }
  });

  styleTouchable = StyleSheet.create({
    buttonClose: {
      alignSelf: "flex-start",
      marginTop: "15%",
      marginLeft: "5%"
    },
    btLanternaContainer: {
      borderWidth: 1,
      borderColor: Colors.gray,
      borderRadius: 14,
      alignItems: "center",
      justifyContent: "center",
      width: 51,
      height: 51,
      marginTop: "5%"
    },
    btLanterna: {
      tintColor: Colors.gray,
      width: 41,
      height: 41
    }
  });

  styleCamera = StyleSheet.create({
    container: {
      flex: 1,
      flexDirection: "column"
    }
  });

  _renderScanArea() {
    return <View style={this.styleView.scanArea} />;
  }

  render() {
    const { onClose } = this.props;
    return (
      <RNCamera
        style={this.styleCamera.container}
        accessibilityLabel="qRCodeScanner"
        flashMode={this.state.flash}
        onBarCodeRead={this._handleBarCodeRead.bind(this)}
        captureAudio={false}
      >
        <View style={this.styleView.top}>
          <TouchableOpacity
            style={this.styleTouchable.buttonClose}
            onPress={() => onClose()}
          >
            <Image source={ASSETS.icons.arrow} />
          </TouchableOpacity>
          <Image source={ASSETS.images.logo} style={this.styleImage.logo} />
        </View>
        <View style={this.styleView.contentScan}>
          <View style={this.styleView.margin} />
          {this._renderScanArea()}
          <View style={this.styleView.margin} />
        </View>
        <View style={this.styleView.contentFooter}>
          <View style={this.styleView.detailFooter}>
            <Text style={this.styleText.info}>
              Posicione o QR code no centro da marcação acima.
            </Text>
            <TouchableOpacity
              onPress={this.toggleFlash.bind(this)}
              style={this.styleTouchable.btLanternaContainer}
            >
              <Image
                source={ASSETS.icons.flash}
                style={this.styleTouchable.btLanterna}
              />
            </TouchableOpacity>
          </View>
        </View>
      </RNCamera>
    );
  }
}
