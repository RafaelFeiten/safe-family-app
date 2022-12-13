import React from "react";
import { createBottomTabNavigator, BottomTabBar } from "react-navigation";
import { ASSETS } from "../assets";
import { Colors } from "../assets/theme";
import NavigationTabItem from "./NavigationTabItem";
import LinearGradient from "react-native-linear-gradient";

import MapaContainer from "../containers/MapaContainer";
import {
  MoreStack,
  HomeStack,
  CadastrarStack,
  ChatStack,
} from "./StackNavigation";

const TabBarComponent = (props) => <BottomTabBar {...props} />;

export const TabsStackMain = createBottomTabNavigator(
  {
    Home: {
      screen: HomeStack,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => (
          <NavigationTabItem
            selectedColor={Colors.white}
            baseColor={Colors.black}
            tabIcon={ASSETS.icons.home}
            focused={focused}
            marginBottom={6}
            tabLabel={"Home"}
          />
        ),
      }),
    },
    Cadastro: {
      screen: CadastrarStack,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => (
          <NavigationTabItem
            selectedColor={Colors.white}
            baseColor={Colors.black}
            tabIcon={ASSETS.icons.add}
            focused={focused}
            size={28}
            marginBottom={3}
            tabLabel={"Beacons"}
          />
        ),
      }),
    },
    Maps: {
      screen: MapaContainer,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => (
          <NavigationTabItem
            selectedColor={Colors.white}
            baseColor={Colors.black}
            tabIcon={ASSETS.icons.maps}
            focused={focused}
            tabLabel={"Rede"}
            qrcode={true}
          />
        ),
      }),
    },
    Chat: {
      screen: ChatStack,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => (
          <NavigationTabItem
            selectedColor={Colors.white}
            baseColor={Colors.black}
            tabIcon={ASSETS.icons.chat}
            focused={focused}
            tabLabel={"Chat"}
          />
        ),
      }),
    },
    Mais: {
      screen: MoreStack,
      navigationOptions: ({ navigation }) => ({
        tabBarIcon: ({ focused }) => (
          <NavigationTabItem
            selectedColor={Colors.white}
            baseColor={Colors.black}
            tabIcon={ASSETS.icons.more}
            focused={focused}
            tabLabel={"Mais"}
          />
        ),
      }),
    },
  },
  {
    animationEnabled: false,
    swipeEnabled: false,
    tabBarOptions: {
      showIcon: true,
      showLabel: false,
      style: {
        shadowColor: Colors.black,
        shadowOffset: { height: 0 },
      },
    },
    tabBarComponent: (props) => {
      return (
        <LinearGradient
          colors={[Colors.tertiary, Colors.darkTertiary]}
          start={{ x: 0, y: 0.2 }}
          end={{ x: 0, y: 0.9 }}
          style={{
            backgroundColor: Colors.transparent,
            shadowColor: Colors.black,
            shadowOffset: { height: 0 },
            shadowOpacity: 0.6,
            shadowRadius: 8,
            elevation: 5,
            borderTopWidth: 0,
          }}
        >
          <TabBarComponent
            {...props}
            style={{
              backgroundColor: Colors.transparent,
              opacity: 0.98,
            }}
          />
        </LinearGradient>
      );
    },
  }
);
