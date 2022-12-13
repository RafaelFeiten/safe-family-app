import React from "react";
import TermosComponent from "./TermosComponent";
import { getUserInfos, updateUserByParam } from "../../helpers/databaseHelpers";

export default class TermosController extends React.Component {
  render() {
    return <TermosComponent title={this.props.title} body={this.props.body} />;
  }
}
