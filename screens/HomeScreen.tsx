import React, {Component} from 'react';
import _ from 'lodash';
import { View, RefreshControl, AsyncStorage} from 'react-native';
import { SearchBar } from 'react-native-elements';
import {SafeAreaView} from 'react-navigation'
import productsService from '../services/productsService';
import shoppingListService from '../services/shoppingListService';
import styles from '../styles/base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadProducts } from '../actions/products';
import { changeShoppingList } from '../actions/appStore';
import ItemsGroup from '../components/ItemsGroup';
import { translate } from '../l10n/translate'

function filterProducts(i, search) {
  const original = i.name.toLowerCase();
  const localized = translate(i.name).toLowerCase();
  return original.concat(` ${localized}`).indexOf(search.toLowerCase()) > -1;
}

class HomeScreen extends Component<Props, State> {
  state: State;
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      shoppingListItems: [],
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
    await this.loadShoppingList();
    this.loadProducts();
    this.loadShoppingCartItems();
  }
  
  loadShoppingList = async () => {
    const {actions, shoppingListId} = this.props;
    if (!shoppingListId) {
      const shoppingLists = await shoppingListService.query();
      const activeShoppingList = shoppingLists[0];
      actions.changeShoppingList(activeShoppingList._id);
    }
  }

  loadProducts = () => {
    const {actions} = this.props;
    productsService.query().then((data) => {
      actions.loadProducts(data);
    })
  }
  loadShoppingCartItems = async () => {
    const {shoppingListId} = this.props;
    this.setState({loading: true})
    if (shoppingListId) {
      const {data: items} = await shoppingListService.getShoppingItems(shoppingListId);
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
    const {shoppingListId} = this.props;
    shoppingListService.addProduct(shoppingListId, item)
      .then(() => {
        this.loadShoppingCartItems()
      });
  }
  removeFromShoppingList = (item) => {
    const {shoppingListId} = this.props;
    shoppingListService.removeItem(shoppingListId, item._id)
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
    const { products } = this.props;
    const shoppingCartItems = this.getShoppingCartItems();
    const productsFiltered = this.filterProducts(products);
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
        <View style={{...styles.container}}>
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
            <ItemsGroup items={products.filter(i => filterProducts(i, this.state.search))}
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

interface State {
  search: string; 
  shoppingListItems: [], 
  loading: boolean, 
  sections: any
}
interface Props {
  shoppingListId: string,
  products: Array<any>
  actions: any,
  navigation: any
}

const mapStateToProps = state => ({
  products: state.products.items,
  shoppingListId: state.app.shoppingListId,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({loadProducts, changeShoppingList}, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);
