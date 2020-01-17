import { createAppContainer, createSwitchNavigator } from "react-navigation";
import HomeScreen from "./views/HomeScreen";
import LoginScreen from "./views/LoginScreen";

const MainNavigator = createSwitchNavigator(
  {
    Home: { screen: HomeScreen },
    Login: { screen: LoginScreen }
  },
  { initialRouteName: "Home" }
);

const App = createAppContainer(MainNavigator);

export default App;
