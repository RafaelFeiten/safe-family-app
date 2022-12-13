import React, { Component } from "react";
import ScreenLayout from "../components/ScreenLayout";
import ChatController from "../components/chat/ChatController";

export default class ChatContainer extends Component {
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
        <ChatController navigation={this.props.navigation} />
      </ScreenLayout>
    );
  }
}
