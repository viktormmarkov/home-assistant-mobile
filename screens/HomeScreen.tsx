import React from 'react';
import _ from 'lodash';
import { StyleSheet, View, ScrollView, Button, Text, AsyncStorage } from 'react-native';
import BaseScreen from './BaseScreen';
import { SearchBar, ListItem, Divider, Header } from 'react-native-elements';
import productsService from '../services/productsService';
import shoppingListService from '../services/shoppingListService';

function filterProducts(i, search) {
  return i.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
}
export default class HomeScreen extends BaseScreen {

  state: { search: string; products: []; shoppingListItems: [] };
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      products: [],
      shoppingListItems: []
    };
  }

  componentDidMount() {
    this.loadProducts();
    this.loadShoppingCartItems();
  }
  loadProducts = () => {
    productsService.query().then(({ data }) => {
      this.setState({ products: data })
    })
  }
  loadShoppingCartItems = () => {
    shoppingListService.query().then(({ data }) => {
      this.setState({ shoppingListItems: data })
    })
  }
  updateSearch = (text) => {
    this.setState({ search: text });
  };

  getProducts = () => {
    return this.state.products
      .filter(i => filterProducts(i, this.state.search))
      .filter((i: any) => !this.state.shoppingListItems.find((li: any) => li.id === i.id))
      .sort((a: any, b: any) => a.id - b.id)
      .map((p: any, i) => (<ListItem
        key={i}
        title={p.name}
        bottomDivider
        onPress={() => this.addToShoppingList(p)}
      />))
  }

  getShoppingCartItems = () => {
    return this.state.shoppingListItems
      .sort((a: any, b: any) => a.id - b.id)
      .map((p: any, i) => (<ListItem
        key={i}
        title={p.name}
        bottomDivider
        onPress={() => this.removeFromShoppingList(p)}
      />))
  }

  addToShoppingList = (item) => {
    this.setState({shoppingListItems: [...this.state.shoppingListItems, item]})
  }

  removeFromShoppingList = (item) => {
    this.setState({shoppingListItems: _.reject(this.state.shoppingListItems, (li: any) => li.id === item.id)})
  }

  render() {
    const { navigate } = this.props.navigation;
    const { search, products = [] } = this.state;

    console.log(products);
    return (
      <React.Fragment>
        <SearchBar style={styles.searchbar}
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          lightTheme
          value={search}>
        </SearchBar>
        <ScrollView>
          <Text>Shopping Items</Text>
          <Divider></Divider>
          {this.getShoppingCartItems()}
          <Divider></Divider>
          <Text>Products</Text>
          {this.getProducts()}
        </ScrollView>
        <Button
          color='red'
          title="Sign Out"
          onPress={async () => {
            await AsyncStorage.removeItem('userToken');
            navigate('AuthLoading')
          }}
        />
      </React.Fragment>
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

