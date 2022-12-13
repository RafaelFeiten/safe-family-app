import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import ChatDetailController from "../components/chatDetail/ChatDetailController";
import NavigationHeader from "../navigation/NavigationHeader";

export default class ChatDetailContainer extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <ScreenLayout
        hidePaddingTop={true}
        showImage={true}
        backgroundColor={"white"}
      >
        <NavigationHeader
          title={"Mensagem Particular"}
          showBackButton
          pressBackButton={this.props.navigation.pop}
        />
        <ChatDetailController
          navigation={this.props.navigation}
          chatID={this.props.navigation.getParam("chatID")}
          user={this.props.navigation.getParam("user")}
        />
      </ScreenLayout>
    );
  }
}
