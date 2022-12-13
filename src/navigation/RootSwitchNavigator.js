import { createSwitchNavigator } from "react-navigation";
import { TabsStackMain, TabGrad } from "./TabNavigation";
import { AuthStack } from "./StackNavigation";

const RootSwitchNavigator = createSwitchNavigator(
  {
    Login: AuthStack,
    Home: TabsStackMain,
  },
  {
    defaultNavigationOptions: {
      header: null,
    },
    initialRoute: "Login",
  }
);

export default RootSwitchNavigator;
