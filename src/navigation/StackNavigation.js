import { createStackNavigator } from "react-navigation";
import LoginContainer from "../containers/LoginContainer";
import MoreContainer from "../containers/MoreContainer";
import ProfileContainer from "../containers/ProfileContainer";
import ProfileRegistrationContainer from "../containers/ProfileRegistrationContainer";
import ForgotPassContainer from "../containers/ForgotPassContainer";
import PermissionsContainer from "../containers/PermissionsContainer";
import ChangePasswordContainer from "../containers/ChangePasswordContainer";
import HomeContainer from "../containers/HomeContainer";
import QRCodeContainer from "../containers/QRCodeContainer";
import UtilizadorContainer from "../containers/UtilizadorContainer";
import EditarUtilizadorContainer from "../containers/EditarUtilizadorContainer";
import CadastrarContainer from "../containers/CadastrarContainer";
import CadastrarContainer2 from "../containers/CadastrarContainer2";
import ListaContainer from "../containers/ListaContainer";
import ChatContainer from "../containers/ChatContainer";
import TermosContainer from "../containers/TermosContainer";
import ChatDetailContainer from "../containers/ChatDetailContainer";

export const AuthStack = createStackNavigator({
  Login: {
    screen: LoginContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  signIn: {
    screen: ProfileRegistrationContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  ForgotPass: {
    screen: ForgotPassContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  Termos: {
    screen: TermosContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  initialRouterName: "Login",
  headerMode: "screen",
});

export const MoreStack = createStackNavigator({
  MoreContainer: {
    screen: MoreContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  PermissionsContainer: {
    screen: PermissionsContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  ProfileContainer: {
    screen: ProfileContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  ChangePasswordContainer: {
    screen: ChangePasswordContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  initialRouterName: "MoreContainer",
  headerMode: "screen",
});

MoreStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const HomeStack = createStackNavigator({
  HomeContainer: {
    screen: HomeContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  CadastrarContainer2: {
    screen: CadastrarContainer2,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  UtilizadorContainer: {
    screen: UtilizadorContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  EditarUtilizadorContainer: {
    screen: EditarUtilizadorContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  ListaContainer: {
    screen: ListaContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  Termos: {
    screen: TermosContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  initialRouterName: "HomeContainer",
  headerMode: "screen",
});

HomeStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const CadastrarStack = createStackNavigator({
  CadastrarContainer: {
    screen: CadastrarContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  QRCodeContainer: {
    screen: QRCodeContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  ListaContainer: {
    screen: ListaContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  initialRouterName: "CadastrarContainer",
  headerMode: "screen",
});

CadastrarStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};

export const ChatStack = createStackNavigator({
  ChatContainer: {
    screen: ChatContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  ChatDetailContainer: {
    screen: ChatDetailContainer,
    navigationOptions: ({ navigation }) => ({
      header: null,
    }),
  },
  initialRouterName: "ChatContainer",
  headerMode: "screen",
});

ChatStack.navigationOptions = ({ navigation }) => {
  let tabBarVisible = true;
  if (navigation.state.index > 0) {
    tabBarVisible = false;
  }
  return {
    tabBarVisible,
  };
};
