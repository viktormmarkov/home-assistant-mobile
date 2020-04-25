import React from 'react';
import _ from 'lodash';
import { RefreshControl, View, Text} from 'react-native';
import { SafeAreaView } from 'react-navigation'
import { SearchBar } from 'react-native-elements';
import promotionsService from '../services/promotionsService';
import styles from '../styles/base';
import ItemsGroup from '../components/ItemsGroup';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPromotions } from '../actions/promotions';

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
    const {actions} = this.props;
    this.setState({loading: true});
    promotionsService.query().then((data) => {
      actions.loadPromotions(data);
      this.setState({loading: false })
    })
  }

  updateSearch = (text) => {
    this.setState({ search: text });
  };

  render() {
    const {promotions} = this.props;
    const {search, loading} = this.state;
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
                }
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
  promotions: Array<any>
  actions: any,
  navigation: any
  shoppingLists: Array<any>
}

const mapStateToProps = state => ({
  promotions: state.promotions.items,
  shoppingListId: state.app.shoppingListId,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({loadPromotions}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsScreen);
