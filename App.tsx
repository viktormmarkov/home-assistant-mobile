import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import i18n from "i18n-js";

import HomeScreen from "./screens/HomeScreen";
import PromotionsScreen from "./screens/PromotionsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import { Provider } from 'react-redux';
import React, {Component} from 'react';
import { translate } from './l10n/translate'

import configureStore from './stores/configureStore';

const store = configureStore();

const HIDDEN_HEADER_OPTIONS = {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
};

const AuthStack = createStackNavigator({ LoginScreen: LoginScreen }, {...HIDDEN_HEADER_OPTIONS});
const SettingsStack = createStackNavigator({ Settings: SettingsScreen, ShoppingList: ShoppingListScreen});
const AppStack = createBottomTabNavigator({ Home: HomeScreen, Promotions: PromotionsScreen, Settings: SettingsStack}, {
  tabBarOptions: {
    style: {
      borderTopWidth: 0 ,
    },
  }
});

const MainNavigator = createSwitchNavigator(
  {
    AuthLoading: AuthLoadingScreen,
    App: AppStack,
    Auth: AuthStack,
  },
  { initialRouteName: "AuthLoading" }
);

const AppNavigation = createAppContainer(MainNavigator);

const translationGetters = {
  // lazy requires (metro bundler does not support symlinks)
  bg: () => require("./l10n/bg.json"),
};

const setI18nConfig = () => {
  const fallback = { languageTag: "bg", isRTL: false };

  const { languageTag } = fallback;

  translate.cache.clear();
  i18n.translations = { [languageTag]: translationGetters[languageTag]() };
  i18n.locale = languageTag;
  i18n.missingTranslation = function (key) { return `${key}*`; };
};

export default class App extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }

  render() {
    return (
      <Provider store={store}>
          <AppNavigation />
      </Provider>
    );
  }
}