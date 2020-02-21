import React from 'react';
import _ from 'lodash';
import { ScrollView, Text, RefreshControl, View, StyleSheet, Dimensions} from 'react-native';
import { SearchBar, ListItem, Divider } from 'react-native-elements';
import {SafeAreaView} from 'react-navigation'
import BaseScreen from './BaseScreen';
import productsService from '../services/productsService';
import shoppingListService from '../services/shoppingListService';
import AppStore from '../stores/AppStore';
import styles from '../styles/base';
import { connect } from 'react-redux';
import { loadProducts } from '../actions/products';
import { bindActionCreators } from 'redux';
import { SwipeListView } from 'react-native-swipe-list-view';
import { TouchableOpacity } from 'react-native-gesture-handler';

function filterProducts(i, search) {
  return i.name.toLowerCase().indexOf(search.toLowerCase()) > -1;
}

class HomeScreen extends BaseScreen {

  state: { search: string; products: []; shoppingListItems: [], shoppingListId: string, loading: boolean};
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      products: [],
      shoppingListItems: [],
      shoppingListId: "",
      loading: true
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
    const {actions} = this.props;
    productsService.query().then((data) => {
      actions.loadProducts(data);
    })
  }
  loadShoppingCartItems = async () => {
    const shoppingList = AppStore.safeGet('shoppingList', {});
    this.setState({loading: true})
    if (shoppingList._id) {
      const {data: items} = await shoppingListService.getShoppingItems(shoppingList._id);
      this.setState({ shoppingListItems: items, loading: false})
    } else {
      this.setState({ shoppingListItems: [], loading: false})
    }
    
  }
  updateSearch = (text) => {
    this.setState({ search: text });
  };

  getProducts = (productsMeta = []) => {
    const products = _(productsMeta)
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
      .sort((a: any, b: any) => a.id - b.id);
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

  closeRow(rowMap, rowKey) {
    if (rowMap[rowKey]) {
        rowMap[rowKey].closeRow();
    }
  }

  removeItemFromCart(rowMap, item) {
    this.closeRow(rowMap, item._id);
    this.removeFromShoppingList(item);
  }


  render() {
    const { search, loading} = this.state;
    const { products: {items: productsMeta}} = this.props;
    const screenWidth = Math.round(Dimensions.get('window').width);
    const swipeWidth = -screenWidth * 0.4;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
        <SearchBar style={styles.searchbar}
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          lightTheme
          value={search}>
        </SearchBar>
        <ScrollView
         refreshControl={
          <RefreshControl refreshing={loading} onRefresh={this.loadShoppingCartItems} />
        }>
          <Divider></Divider>
          <SwipeListView
            data={this.getShoppingCartItems()}
            renderItem={ (data: any, rowMap:any) => {
              const {item} = data;
              return (
                <ListItem
                  key={item._id}
                  title={item.name}
                  bottomDivider
              />
            )}}
            renderHiddenItem={ (data, rowMap) => (
                <View style={stylesa.rowBack}>
                    <View style={stylesa.rowPlaceholder}></View>
                    <View style={stylesa.rowMenu}>
                      <TouchableOpacity onPress={() => this.removeItemFromCart(rowMap, data.item)}>
                        <Text>
                          Right
                        </Text>
                      </TouchableOpacity>
                      <TouchableOpacity onPress={() => this.removeItemFromCart(rowMap, data.item)}>
                        <Text>
                          Right-Left
                        </Text>
                      </TouchableOpacity>
                    </View>
                </View>
            )}
            rightOpenValue={swipeWidth}
        />
          <Divider></Divider>
          <Text>Products</Text>
          {this.getProducts(productsMeta)}
        </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

const mapStateToProps = state => ({
  products: state.products,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({loadProducts}, dispatch),
});

const stylesa = StyleSheet.create({
  rowBack: {
    alignItems: 'center',
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  rowPlaceholder: {
    flex: 0.6,
  },
  rowMenu: {
    flex: 0.4,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
  },
});

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
