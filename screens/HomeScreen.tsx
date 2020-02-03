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
    this.loadInitialData();
  }
  loadInitialData = async () => {
    const shoppingLists = await shoppingListService.query();
    const activeShoppingList = shoppingLists[0];
    AppStore.set('shoppingList', activeShoppingList);
    this.loadProducts();
    this.loadShoppingCartItems();
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
  updateSearch = (text) => {
    this.setState({ search: text });
  };

  getProducts = () => {
    const products = _(this.state.products)
      .filter(i => filterProducts(i, this.state.search))
      .reject((i: any) => this.state.shoppingListItems.find((li: any) => li.product === i._id))
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
    const shoppingList = AppStore.safeGet('shoppingList', {});
    shoppingListService.addProduct(shoppingList._id, item)
      .then(() => {
        this.loadShoppingCartItems()
      });
  }

  removeFromShoppingList = (item) => {
    const shoppingList = AppStore.safeGet('shoppingList', {});
    shoppingListService.removeItem(shoppingList._id, item._id)
      .then(this.loadShoppingCartItems);
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

