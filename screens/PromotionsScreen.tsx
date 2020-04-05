import React from 'react';
import _ from 'lodash';
import { ScrollView, RefreshControl, View, Text} from 'react-native';
import { SafeAreaView } from 'react-navigation'
import BaseScreen from './BaseScreen';
import { SearchBar, ListItem, Button } from 'react-native-elements';
import promotionsService from '../services/promotionsService';
import styles from '../styles/base';
import ItemsGroup from '../components/ItemsGroup';
import translate from '../l10n/translate';
import { TouchableOpacity } from 'react-native-gesture-handler';
// items of interest
// all  promotions

function formatCurrency(number) {
  return `${number.toFixed(2)} лв`;
}
export default class PromotionsScreen extends BaseScreen {

  state: { search: string; promotions: []; shoppingListItems: []; loading: boolean };
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      promotions: [],
      shoppingListItems: [],
      loading: false
    };
  }

  componentDidMount() {
    this.loadPromotions();
  }

  loadPromotions = () => {
    this.setState({loading: true});
    promotionsService.query().then((data) => {
      this.setState({ promotions: data, loading: false })
    })
  }

  updateSearch = (text) => {
    this.setState({ search: text });
  };

  getPromotions = () => {
    return _(this.state.promotions)
      .map((p: any, i) => (<ListItem
        key={i}
        title={p.name}
        bottomDivider
      />))
      .value()
  }


  render() {
    const {search, loading, promotions} = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <SearchBar style={styles.searchbar}
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            lightTheme
            value={search}/>
            <ItemsGroup items={promotions}
              grid='flat'
              refreshControl = {
                <RefreshControl refreshing={loading} onRefresh={this.loadPromotions} />
              }
              renderItem={(config, {item, section, index}) => {
                const isSelected = config.isSelected(item);
                return (
                  <View style={styles.itemContainer} key={item._id}>
                    <View style={styles.cardHeader}>
                      {
                        isSelected ? ( <Button title={'Add to List'}></Button>) :
                        (<View style={styles.cardHeadline}><Text style={styles.itemName}>Sugested based on shopping list</Text></View>)
                      }
                     
                    </View>
                    <View style={styles.cardFooter}>
                      <Text style={[styles.itemName]}>{item.name}</Text>
                      <Text style={[styles.itemName]}>{formatCurrency(item.price)}</Text>
                    </View>
                  </View>
                )
              }}
              config={{
                tilePress: (item, section, index) => {},
                isSelected: (item) => {
                  return false;
                }
              }}
            />
        </View>
      </SafeAreaView>
    );
  }
}

