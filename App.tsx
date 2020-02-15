import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';
import { createBottomTabNavigator } from 'react-navigation-tabs';

import HomeScreen from "./screens/HomeScreen";
import PromotionsScreen from "./screens/PromotionsScreen";
import SettingsScreen from "./screens/SettingsScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";
const HIDDEN_HEADER_OPTIONS = {
  headerMode: 'none',
  navigationOptions: {
    headerVisible: false,
  }
};

const AuthStack = createStackNavigator({ LoginScreen: LoginScreen }, {...HIDDEN_HEADER_OPTIONS});
const AppStack = createBottomTabNavigator({ Home: HomeScreen, Promotions: PromotionsScreen, Settings: SettingsScreen}, {
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

const App = createAppContainer(MainNavigator);

export default App;
