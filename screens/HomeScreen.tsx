import React from 'react';
import _ from 'lodash';
import { View, RefreshControl} from 'react-native';
import { SearchBar } from 'react-native-elements';
import {SafeAreaView} from 'react-navigation'
import BaseScreen from './BaseScreen';
import productsService from '../services/productsService';
import shoppingListService from '../services/shoppingListService';
import AppStore from '../stores/AppStore';
import styles from '../styles/base';
import { connect } from 'react-redux';
import { loadProducts } from '../actions/products';
import { bindActionCreators } from 'redux';
import ItemsGroup from '../components/ItemsGroup';
import {translate} from '../l10n/translate'


function filterProducts(i, search) {
  const original = i.name.toLowerCase();
  const localized = translate(i.name).toLowerCase();
  return original.concat(` ${localized}`).indexOf(search.toLowerCase()) > -1;
}

class HomeScreen extends BaseScreen {

  state: { search: string; products: []; shoppingListItems: [], shoppingListId: string, loading: boolean, sections: any};
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      products: [],
      shoppingListItems: [],
      shoppingListId: "",
      loading: true,
      sections: {
        shoppingList: true
      }
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

  resetSearch() {
    this.setState({search: ''});
  }

  render() {
    const { search, loading, sections} = this.state;
    const { products: {items: allProducts}} = this.props;
    const shoppingCartItems = this.getShoppingCartItems();
    const productsFiltered = this.filterProducts(allProducts);
    const selectedProducts =  _(shoppingCartItems).map((sc: any) => sc.product).uniq().value()
    const productsGrouped = [
      {data: shoppingCartItems, title: 'My List', key: 'shoppingList', show: sections.shoppingList}, 
      ..._(productsFiltered)
        .groupBy('mainCategoryName')
        .map((grouped, key) => ({data: grouped, key, title: key, show: sections[key]}))
        .value()
    ];
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
            !search ? <ItemsGroup items={productsGrouped}
              grid='section'
              refreshControl = {
                <RefreshControl refreshing={loading} onRefresh={this.loadShoppingCartItems} />
              }
              config={{
                tilePress: (item, section, index) => {
                  if (section.key !== 'shoppingList') {
                    this.addToShoppingList(item);
                  } else {
                    this.removeFromShoppingList(item);
                  }
                },
                isSelected: (item) => {
                  return _.some(selectedProducts, product => item.product === product);
                },
                headerPress: (item) => {
                  const current = this.state.sections[item.section.key];
                  this.setState({
                    sections: {...this.state.sections, [item.section.key]: !current }
                  }); 
                }
              }}
            >  
            </ItemsGroup> : 
            <ItemsGroup items={allProducts.filter(i => filterProducts(i, this.state.search))}
              grid='flat'
              config={{
                tilePress: (item) => {
                  if (_.some(selectedProducts, product => item._id === product)){
                    const shoppingItem = shoppingCartItems.find((sc: any)=> sc.product === item._id);
                    this.removeFromShoppingList(shoppingItem);
                  } else {
                    this.addToShoppingList(item);
                  }
                  this.resetSearch();
                },
                isSelected: (item) => {
                  return _.some(selectedProducts, product => item._id === product);
                },
                headerPress: (item) => {
                  item.section.show = !item.section.show;
                }
              }}
            ></ItemsGroup>
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
