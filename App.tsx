import {createAppContainer, createSwitchNavigator} from 'react-navigation';
import {createStackNavigator} from 'react-navigation-stack';
import HomeScreen from './HomeScreen';

const MainNavigator = createSwitchNavigator({
  Home: {screen: HomeScreen},
},  { initialRouteName: 'Home'});

const App = createAppContainer(MainNavigator);

export default App;