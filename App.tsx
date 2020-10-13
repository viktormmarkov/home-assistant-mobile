import { createAppContainer, createSwitchNavigator, SafeAreaView} from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';
import i18n from "i18n-js";
import { Icon } from 'react-native-elements';

import HomeScreen from "./screens/HomeScreen";
import PromotionsScreen from "./screens/PromotionsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import { Provider } from 'react-redux';
import React, {Component} from 'react';
import { translate } from './l10n/translate'
import { primaryColor } from './styles/colors';
import styles from './styles/base';

import store from './stores/configureStore';
import apiBase from "./services/apiBase";

const HIDDEN_HEADER_OPTIONS = {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
};

const AuthStack = createStackNavigator({ LoginScreen: LoginScreen }, {...HIDDEN_HEADER_OPTIONS});
const SettingsStack = createStackNavigator({ Settings: SettingsScreen, ShoppingList: ShoppingListScreen});

const defaultTabBarOptions = {
  tabBarOptions: {
    showIcon: true,
    activeTintColor: primaryColor
  },
};

const getIcon = ({focused, tintColor}, icon) => (
  <Icon
    name={icon}
    size = {focused ? 28 : 20}
    color={focused ? tintColor : 'gray'}
  />
)

HomeScreen.navigationOptions = {
  ...defaultTabBarOptions,
  tabBarLabel: "Home",
  tabBarIcon: (options) => getIcon(options, "list")
};

PromotionsScreen.navigationOptions = {
  ...defaultTabBarOptions,
  tabBarLabel: "Promotions",
  tabBarIcon: (options) => getIcon(options, "star")
}


SettingsStack.navigationOptions = {
  ...defaultTabBarOptions,
  tabBarLabel: "Settings",
  tabBarIcon: (options) => getIcon(options, "settings")
}

const AppStack = createBottomTabNavigator({
   Home: HomeScreen, 
   Promotions: PromotionsScreen, 
   Settings: SettingsStack,
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

const fetchLocale = (language) => apiBase.get('/locales').then(({data = []}) => {
  const bg = data.find(l => l.language === language);
  return bg.translations;
});

// check cached locale 
// fetch locale
// if not existing return default
// load locale

const updateLabels = () => {
  HomeScreen.navigationOptions.tabBarLabel = translate("Home");
  PromotionsScreen.navigationOptions.tabBarLabel = translate("Promotions");
  SettingsStack.navigationOptions.tabBarLabel = translate("Settings");
}

const setI18nConfig = () => {
  fetchLocale('bulgarian').then(translations => {
    const fallback = { languageTag: "bg", isRTL: false };

    const { languageTag } = fallback;
  
    translate.cache.clear();
    i18n.translations = { [languageTag]: translations };
    i18n.locale = languageTag;
    i18n.missingTranslation = function (key) { return `${key}*`; };
    updateLabels();
  })
};

export default class App extends Component {
  constructor(props) {
    super(props);
    setI18nConfig(); // set initial config
  }

  render() {
    return (
      <Provider store={store}>
        <SafeAreaView style={styles.safeAreaView}>
          <AppNavigation />
        </SafeAreaView>
      </Provider>
    );
  }
}