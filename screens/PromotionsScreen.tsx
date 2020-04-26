import React from 'react';
import _ from 'lodash';
import { RefreshControl, View, Text} from 'react-native';
import { SafeAreaView } from 'react-navigation'
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPromotions, loadRelatedPromotions} from '../actions/promotions';
import promotionsService from '../services/promotionsService';
import shoppingListService from '../services/shoppingListService';
import ItemsGroup from '../components/ItemsGroup';
import styles from '../styles/base';

function formatCurrency(number) {
  return `${number.toFixed(2)} лв`;
}

class PromotionsScreen extends React.Component<Props, State>{
  state: State
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      loading: false
    };
  }

  componentDidMount() {
    this.fetchPromotions();
  }

  fetchPromotions = () => {
    const {actions, shoppingListId} = this.props;
    this.setState({loading: true});
    promotionsService.query().then((data) => {
      actions.loadPromotions(data);
      this.setState({loading: false })
    })
    shoppingListService.getRelatedPromotions(shoppingListId).then((data) => {
      actions.loadRelatedPromotions(data);
    })
  }

  updateSearch = (text) => {
    this.setState({ search: text });
  };

  render() {
    const {promotions, related} = this.props;
    const {search, loading} = this.state;
    const sections = [
      {data: related, title: 'Related', key: 'related', show: true},
      {data: promotions, title: 'All', key: 'all', show: true},
    ];
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <SearchBar style={styles.searchbar}
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            lightTheme
            value={search}/>
            <ItemsGroup items={sections}
              grid='section'
              refreshControl = {
                <RefreshControl refreshing={loading} onRefresh={this.fetchPromotions} />
              }
              renderItem={(config, {item, section, index}) => {
                const isSelected = config.isSelected(item);
                return (
                  <View style={styles.squareContainer} key={item._id}>
                      <Text style={[styles.itemName]}>{item.name}</Text>
                      <Text style={[styles.itemName]}>{formatCurrency(item.price)}</Text>
                  </View>
                )
              }}
              config={{
                tilePress: (item, section, index) => {},
                isSelected: (item) => {
                  return false;
                },
                headerPress: () => {}
              }}
            />
        </View>
      </SafeAreaView>
    );
  }
}

interface State {
  search: string; 
  loading: boolean, 
}
interface Props {
  promotions: Array<any>,
  related: Array<any>
  actions: any,
  navigation: any
  shoppingLists: Array<any>
  shoppingListId: string
}

const mapStateToProps = state => ({
  promotions: state.promotions.items,
  related: state.promotions.related,
  shoppingListId: state.app.shoppingListId,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    loadPromotions, 
    loadRelatedPromotions
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsScreen);
