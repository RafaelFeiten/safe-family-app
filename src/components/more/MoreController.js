import React, { PureComponent } from "react";
import MoreComponent from "./MoreComponent";
import { logout, getUserInfos, teste } from "../../helpers/databaseHelpers";
class MoreController extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      content: [
        { action: "profile", thumb: "user", label: "Editar Cadastro" },
        { action: "password", thumb: "key", label: "Trocar Senha" },
        { action: "permission", thumb: "permission", label: "Permissões" },
        { action: "logout", thumb: "logout", label: "Sair" },
      ],
      profile: null,
    };
    this.getUserInfos();
  }

  componentDidMount() {
    const { navigation } = this.props;
    this.subs = [navigation.addListener("didFocus", () => this.getUserInfos())];
  }

  getUserInfos = async () => {
    getUserInfos()
      .then((user) => {
        this.setState({ profile: user });
      })
      .catch((e) => {
        console.log("erro ao get user", e);
      });
  };

  actionPress = (action) => {
    switch (action) {
      case "profile":
        this.props.navigation.navigate("ProfileContainer");
        break;

      case "notification":
        this.props.navigation.navigate("NotificationsContainer");
        break;

      case "permission":
        this.props.navigation.navigate("PermissionsContainer");
        break;

      case "password":
        this.props.navigation.navigate("ChangePasswordContainer");
        break;

      case "logout":
        this.logout();
        break;
    }
  };

  logout = () => {
    logout()
      .then(() => this.props.navigation.navigate("Login"))
      .catch((e) => console.log("e", e));
  };

  render() {
    return (
      <MoreComponent
        actionPress={this.actionPress}
        content={this.state.content}
        profile={this.state.profile}
      />
    );
  }
}

export default MoreController;
