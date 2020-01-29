import React from 'react';
import { StyleSheet, View, Button, AsyncStorage } from 'react-native';
import BaseScreen from './BaseScreen';
import { SearchBar } from 'react-native-elements';


export default class HomeScreen extends BaseScreen {
  state: { search: string; };
  constructor(props) {
    super(props);
    this.state = {
      search: "",
    };
  }

  componentDidMount() {
    // get shoppinglist
    // get shoppinglist items
    // get products
  }
  updateSearch = (v) => {
    this.setState({search: v});
    console.log(v);
  };

  render () {
    const {navigate} = this.props.navigation;
    const {search} = this.state;
    return (
      <View style={styles.container}>
        <SearchBar style={styles.searchbar}
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          lightTheme
          value={search}>  
        </SearchBar>
        <Button
          color='red'
          title="Sign Out"
          onPress={async () => {
            await AsyncStorage.removeItem('userToken');
            navigate('AuthLoading')
          }}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  searchbar: {
    flex: 1
  }
});

