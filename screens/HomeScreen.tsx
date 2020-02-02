import React from 'react';
import _ from 'lodash';
import { StyleSheet, View, ScrollView, Text, AsyncStorage } from 'react-native';
import { SearchBar, ListItem, Divider, Header } from 'react-native-elements';
import {SafeAreaView} from 'react-navigation'
import BaseScreen from './BaseScreen';

import productsService from '../services/productsService';
import shoppingListService from '../services/shoppingListService';

import AppStore from '../store/AppStore';

function filterProducts(i, search) {
  return i.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
}
export default class HomeScreen extends BaseScreen {

  state: { search: string; products: []; shoppingListItems: [], shoppingListId: string};
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      products: [],
      shoppingListItems: [],
      shoppingListId: ""
    };
  }
  componentDidMount() {
    this.loadProducts();
    this.loadShoppingCartItems();
    this.testAsyncStorage();
  }
  loadProducts = () => {
    productsService.query().then((data) => {
      this.setState({ products: data })
    })
  }
  loadShoppingCartItems = async () => {
    const shoppingList = AppStore.safeGet('shoppingList', {});
    if (shoppingList._id) {
      const {data: items} = await shoppingListService.getShoppingItems(shoppingList._id);
      this.setState({ shoppingListItems: items })
    } else {
      this.setState({ shoppingListItems: [] })
    }
    
  }
  testAsyncStorage = async () => {
    const shoppingListId = await AsyncStorage.getItem('shoppingListId');
    this.setState({
      shoppingListId
    })
  }
  updateSearch = (text) => {
    this.setState({ search: text });
  };

  getProducts = () => {
    const products = _(this.state.products)
      .filter(i => filterProducts(i, this.state.search))
      .reject((i: any) => this.state.shoppingListItems.find((li: any) => li._id === i._id))
      .sortBy('_id')
      .value();
    return products.map((p: any, i) => (<ListItem
        key={i}
        title={p.name}
        bottomDivider
        onPress={() => this.addToShoppingList(p)}
      />))
  }

  getShoppingCartItems = () => {
    return this.state.shoppingListItems
      .filter(i => filterProducts(i, this.state.search))
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
    this.setState({shoppingListItems: _.reject(this.state.shoppingListItems, (li: any) => li._id === item._id)})
  }

  render() {
    const { search } = this.state;

    return (
      <SafeAreaView style={styles.container}>
        <SearchBar style={styles.searchbar}
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          lightTheme
          value={search}>
        </SearchBar>
        <ScrollView>
          <Text>AppStore: {AppStore.safeGet('shoppingList', {})._id}</Text>
          <Text>AsyncStore: {this.state.shoppingListId}</Text>

          <Divider></Divider>
          {this.getShoppingCartItems()}
          <Divider></Divider>
          <Text>Products</Text>
          {this.getProducts()}
        </ScrollView>
      </SafeAreaView>
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

