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
import listMenu, { SWIPE_MENU_SIZE } from '../components/ListMenu'
import ProductGroup from './ProductsGroups';


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

  filterProducts = (products) => {
    return _(products)
      .filter(i => filterProducts(i, this.state.search))
      .reject((i: any) => this.state.shoppingListItems.find((li: any) => li.product === i._id))
      .sortBy('_id')
      .value();
  }

  getProducts = (productsMeta = []) => {
    const products = this.filterProducts(productsMeta);
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

  removeItemFromCart(rowMap, item) {
    this.removeFromShoppingList(item);
  }

  render() {
    const { search, loading} = this.state;
    const { products: {items: allProducts}} = this.props;
    const shoppingCartItems = this.getShoppingCartItems();
    const productsFiltered = this.filterProducts(allProducts);
    const selectedProducts =  _(shoppingCartItems).map((sc: any) => sc.product).uniq().value()
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <SearchBar style={styles.searchbar}
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            lightTheme
            value={search}>
          </SearchBar>
          {
            !search ? <ProductGroup products={[
              {data: shoppingCartItems, title: 'My List', key: 'shoppinglist'}, 
              {data: productsFiltered, title: 'Products', key: 'products'}]}
              grid='section'
              config={{
                tilePress: (item, section, index) => {
                  if (section.key === 'products') {
                    this.addToShoppingList(item);
                  } else {
                    this.removeFromShoppingList(item);
                  }
                },
                isSelected: (item) => {
                  return _.some(selectedProducts, product => item.product === product);
                }
              }}
            >  
            </ProductGroup> : 
            <ProductGroup products={allProducts.filter(i => filterProducts(i, this.state.search))}
              grid='flat'
              config={{
                tilePress: (item) => {
                  this.addToShoppingList(item);
                },
                isSelected: (item) => {
                  return _.some(selectedProducts, product => item._id === product);
                }
              }}
            ></ProductGroup>
          }
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

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
