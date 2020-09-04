import React, {Component} from 'react';
import _ from 'lodash';
import { View, RefreshControl, AsyncStorage} from 'react-native';
import { SearchBar } from 'react-native-elements';
import productsService from '../services/productsService';
import shoppingListService from '../services/shoppingListService';
import styles from '../styles/base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadProducts } from '../actions/products';
import { changeShoppingList, changeUser } from '../actions/appStore';
import {shoppingListItemsLoaded} from '../actions/shoppingListItems';
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
      loading: true,
      sections: {
        shoppingList: true
      }
    };
  }
  componentDidMount() {
    this.loadInitialData();
  }

  getUser = async () => {
    const {user, actions} = this.props;
    const userSaved = await AsyncStorage.getItem('user');
    if (userSaved && !user) {
      actions.changeUser(userSaved);
    }
  }

  loadInitialData = async () => {
    await this.checkShoppingListLoaded();
    await this.getUser();
    this.loadProducts();
    this.loadShoppingCartItems();
  }

  componentDidUpdate = (props) => {
    if (props.shoppingList._id !== this.props.shoppingList._id) {
      this.loadShoppingCartItems();
    }
  }
  
  checkShoppingListLoaded = async () => {
    const {actions, shoppingList} = this.props;
    if (!shoppingList._id) {
      const shoppingLists = await shoppingListService.query();
      const activeShoppingList = shoppingLists[0];
      actions.changeShoppingList(activeShoppingList);
    }
  }

  loadProducts = () => {
    const {actions} = this.props;
    productsService.query().then((data) => {
      actions.loadProducts(data);
    })
  }

  loadShoppingCartItems = async () => {
    const {shoppingList, actions} = this.props;
    this.setState({loading: true})
    if (shoppingList._id) {
      const {data: items} = await shoppingListService.getShoppingItems(shoppingList._id);
      actions.shoppingListItemsLoaded(shoppingList._id, items);
      this.setState({ loading: false})
    } else {
      this.setState({ loading: false})
    }
    
  }

  updateSearch = (text) => {
    this.setState({ search: text });
  };

  filterProducts = (products) => {
    return _(products)
      .filter(i => filterProducts(i, this.state.search))
      .reject((i: any) => this.props.shoppingListItems.find((li: any) => li.product === i._id))
      .sortBy('_id')
      .value();
  }

  getShoppingCartItems = () => {
    return this.props.shoppingListItems
      .filter(i => filterProducts(i, this.state.search))
      .sort((a: any, b: any) => a.id - b.id);
  }

  addToShoppingList = (item) => {
    const {shoppingList} = this.props;
    shoppingListService.addProduct(shoppingList._id, item)
      .then(() => {
        this.loadShoppingCartItems()
      });
  }

  removeFromShoppingList = (item) => {
    const {shoppingList} = this.props;
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
    const { products, shoppingList, user} = this.props;
    const shoppingCartItems = this.getShoppingCartItems();
    const productsFiltered = this.filterProducts(products);
    const selectedProducts =  _(shoppingCartItems).map((sc: any) => sc.product).uniq().value();
    const currentShoppingList = shoppingList;
    const productsGrouped = [{
      data: shoppingCartItems, 
      title: `Shopping List - "${currentShoppingList && currentShoppingList.name || ''}"`, 
      key: 'shoppingList', 
      show: sections.shoppingList}, 
      ..._(productsFiltered)
        .groupBy('mainCategoryName')
        .map((grouped, key) => ({data: grouped, key, title: translate(key), show: sections[key]}))
        .value()
    ];
    return (
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
            <ItemsGroup items={[...products.filter(i => filterProducts(i, this.state.search)), {name: this.state.search}]}
              grid='flat'
              config={{
                tilePress: (item) => {
                  if (item._id) {
                    if (_.some(selectedProducts, product => item._id === product)){
                      const shoppingItem = shoppingCartItems.find((sc: any)=> sc.product === item._id);
                      this.removeFromShoppingList(shoppingItem);
                    } else {
                      this.addToShoppingList(item);
                    }
                    this.resetSearch();
                  } else {
                    productsService.addPersonalProduct(user, {name: this.state.search}).then((item) => {
                      this.addToShoppingList(item);
                      this.resetSearch();
                    });
                  }
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
    );
  }
}

interface State {
  search: string; 
  loading: boolean, 
  sections: any
}
interface Props {
  shoppingList: {
    _id: string,
    name: string
  },
  products: Array<any>
  shoppingListItems: [], 
  actions: any,
  navigation: any
  user: string
}

const mapStateToProps = state => ({
  products: state.products.items,
  shoppingList: state.app.shoppingList,
  shoppingListItems: state.shoppingListItems.items,
  user: state.app.user
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({loadProducts, changeShoppingList, changeUser, shoppingListItemsLoaded}, dispatch),
});


export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);