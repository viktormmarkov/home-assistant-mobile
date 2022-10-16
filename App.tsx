import {
  createAppContainer,
  createSwitchNavigator,
  SafeAreaView,
} from "react-navigation";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import i18n from "i18n-js";
import { Icon } from "react-native-elements";
import { StatusBar } from "react-native";
import "react-native-gesture-handler";

import HomeScreen from "./screens/HomeScreen";
import PromotionsScreen from "./screens/PromotionsScreen";
import ProfileScreen from "./screens/ProfileScreen";
import LoginScreen from "./screens/LoginScreen";
import RegisterScreen from "./screens/RegisterScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
import { Provider } from "react-redux";
import React, { Component } from "react";
import { translate } from "./l10n/translate";
import { primaryColor } from "./styles/colors";
import styles from "./styles/base";

import store from "./stores/configureStore";
import apiBase from "./services/apiBase";
import { Text } from "react-native";
import ProfileDetailsScreen from "./screens/ProfileDetailsScreen";
import NewHomeScreen from "./screens/NewHomeScreen";
import { NavigationContainer } from "@react-navigation/native";

const HIDDEN_HEADER_OPTIONS = {
  headerMode: "none",
  navigationOptions: {
    headerVisible: false,
  },
};

const AuthStack = createStackNavigator();

const AuthStackContainer = () => {
  return (
      <AuthStack.Navigator screenOptions={{headerShown: false}}>
        <AuthStack.Screen name="Login" component={LoginScreen} />
        <AuthStack.Screen name="Register" component={RegisterScreen} />
      </AuthStack.Navigator>
  );
};

// const ProfileStack = createStackNavigator({ Profile: ProfileScreen, ProfileDetails: ProfileDetailsScreen, ShoppingList: ShoppingListScreen});


const defaultTabBarOptions = {
  tabBarOptions: {
    showIcon: true,
    activeTintColor: primaryColor,
  },
};

const getIcon = ({ focused, tintColor }, icon) => (
  <Icon
    name={icon}
    size={focused ? 28 : 20}
    color={focused ? tintColor : "gray"}
  />
);

// HomeScreen.navigationOptions = {
//   ...defaultTabBarOptions,
//   tabBarLabel: "Home",
//   tabBarIcon: (options) => getIcon(options, "list")
// };

// PromotionsScreen.navigationOptions = {
//   ...defaultTabBarOptions,
//   tabBarLabel: "Promotions",
//   tabBarIcon: (options) => getIcon(options, "star")
// }

// ProfileStack.navigationOptions = {
//   ...defaultTabBarOptions,
//   tabBarLabel: "Profile",
//   tabBarIcon: (options) => getIcon(options, "person")
// }

const AppStack = createBottomTabNavigator();

const AppStackContainer = () => {
  return (
      <AppStack.Navigator>
        <AppStack.Screen name="Home" component={HomeScreen}></AppStack.Screen>
        <AppStack.Screen name="Promotions" component={PromotionsScreen}></AppStack.Screen>
      </AppStack.Navigator>
  )
}
// const MainNavigator = createSwitchNavigator(
//   {
//     AuthLoading: AuthLoadingScreen,
//     App: AppStackContainer,
//     Auth: AuthStackContainer,
//   },
//   { initialRouteName: "AuthLoading" }
// );

const MainNavigator = createStackNavigator();

const MainNavigatorContainer = () => {
  return (
    <NavigationContainer>
      <MainNavigator.Navigator initialRouteName="Auth">
        <MainNavigator.Screen name="AuthLoading" component={AuthLoadingScreen}></MainNavigator.Screen>
        <MainNavigator.Screen name="App" component={AppStackContainer}></MainNavigator.Screen>
        <MainNavigator.Screen name="Auth" component={AuthStackContainer}></MainNavigator.Screen>
      </MainNavigator.Navigator>
    </NavigationContainer>
  )
}

// const AppNavigation = createAppContainer(MainNavigatorContainer);

// const fetchLocale = (language) => apiBase.get('/locales').then(({data = []}) => {
//   const bg = data.find(l => l.language === language);
//   return bg.translations;
// });

// check cached locale
// fetch locale
// if not existing return default
// load locale

// const updateLabels = () => {
//   HomeScreen.navigationOptions.tabBarLabel = translate("Home");
//   PromotionsScreen.navigationOptions.tabBarLabel = translate("Promotions");
//   ProfileStack.navigationOptions.tabBarLabel = translate("Profile");
// }

// const setI18nConfig = () => {
//   fetchLocale('bulgarian').then(translations => {
//     const fallback = { languageTag: "bg", isRTL: false };

//     const { languageTag } = fallback;

//     translate.cache.clear();
//     i18n.translations = { [languageTag]: translations };
//     i18n.locale = languageTag;
//     i18n.missingTranslation = function (key) { return `${key}*`; };
//     // updateLabels();
//   })
// };

export default class App extends Component {
  constructor(props) {
    super(props);
    // setI18nConfig(); // set initial config
  }

  render() {
    return (
      <Provider store={store}>
        <StatusBar barStyle="light-content" backgroundColor={primaryColor} />
        <SafeAreaView style={styles.safeAreaView}>
            {/* <AppStackContainer /> */}
{/* <HomeScreen navigation={{}}></HomeScreen> */}
          {/* <Text>Open up App.js to start working on your app!</Text> */}
          <MainNavigatorContainer />
        </SafeAreaView>
      </Provider>
    );
  }
}
