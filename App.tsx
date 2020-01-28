import { createAppContainer, createSwitchNavigator } from "react-navigation";
import { createStackNavigator } from 'react-navigation-stack';

import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import AuthLoadingScreen from "./screens/AuthLoadingScreen";

const AuthStack = createStackNavigator({ LoginScreen: LoginScreen });
const AppStack = createStackNavigator({ Home: HomeScreen });

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
