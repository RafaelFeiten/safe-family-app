import { AppRegistry } from "react-native";
import { name } from "./app.json";
import MainContainer from "./src/containers/MainContainer";
console.disableYellowBox = true;
AppRegistry.registerComponent(name, () => MainContainer);
