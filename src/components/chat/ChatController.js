import React, { Component } from "react";
import { connect } from "react-redux";

import ChatComponent from "./ChatComponent";
import { getUserInfos, getMensagens } from "../../helpers/databaseHelpers";

class ChatController extends Component {
  constructor(props) {
    super(props);
    this.state = {
      user: null,
    };
  }

  componentDidMount() {
    this.getUser();
  }

  getUser = async () => {
    let user = await getUserInfos();
    this.setState({ user: user });
  };

  goToMessage = (item) => {
    this.props.navigation.navigate("ChatDetailContainer", {
      chatID: item.chatID,
      user: this.state.user,
    });
  };

  render() {
    return (
      <ChatComponent
        mensagens={this.props.mensagens}
        user={this.state.user}
        isLoading={this.props.loading}
        goToMessage={this.goToMessage}
      />
    );
  }
}

const mapStateToProps = (state) => ({
  mensagens: state.mensagens.mensagens,
  loading: state.mensagens.loading,
});

export default connect(mapStateToProps)(ChatController);
