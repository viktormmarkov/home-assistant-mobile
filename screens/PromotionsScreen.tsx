import React from 'react';
import _ from 'lodash';
import { RefreshControl, View, Text} from 'react-native';
import { SafeAreaView } from 'react-navigation'
import { SearchBar } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { loadPromotions, loadRelatedPromotions, loadSavedPromotions} from '../actions/promotions';
import promotionsService from '../services/promotionsService';
import shoppingListService from '../services/shoppingListService';
import ItemsGroup from '../components/ItemsGroup';
import styles from '../styles/base';
import { TouchableOpacity } from 'react-native-gesture-handler';

function formatCurrency(number) {
  return `${number.toFixed(2)} лв`;
}

class PromotionsScreen extends React.Component<Props, State>{
  state: State
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      loading: false,
      sections: {
        saved: true,
        related: true,
        all: true
      }
    };
  }

  componentDidMount() {
    this.fetchPromotions();
  }

  componentDidUpdate = (props) => {
    if (props.shoppingListId !== this.props.shoppingListId) {
      this.fetchPromotions();
    }
  }
  
  fetchPromotions = () => {
    const {actions} = this.props;
    this.setState({loading: true});
    promotionsService.query().then((data) => {
      actions.loadPromotions(data);
      this.setState({loading: false })
    })
    this.getRelatedPromotions();
    this.getSavedPromotions();
  }

  getRelatedPromotions = () => {
    const {actions, shoppingListId} = this.props;
    shoppingListService.getRelatedPromotions(shoppingListId)
        .then((data) => {
          actions.loadRelatedPromotions(data);
        });
  }
  getSavedPromotions = () => {
    const {actions, shoppingListId} = this.props;
    shoppingListService.getSavedPromotions(shoppingListId)
        .then((data) => {
          actions.loadSavedPromotions(data)
        })
    }

  updateSearch = (text) => {
    this.setState({ search: text });
  };

  render() {
    const {promotions, related, saved, shoppingListId} = this.props;
    const {search, loading} = this.state;
    // related = hide all that are added in interested
    // 
    const sections = [
      {data: saved, title: 'Saved', key: 'saved', show: this.state.sections.saved},
      {data: related, title: 'Related', key: 'related', show: this.state.sections.related},
      {data: promotions, title: 'All', key: 'all', show: this.state.sections.all},
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
                return (
                  <TouchableOpacity onPress={() => config.tilePress(item, section, index)}>
                    <View style={styles.squareContainer} key={item._id}>
                        <Text style={[styles.itemName]}>{item.name}</Text>
                        <Text style={[styles.itemName]}>{item.price && formatCurrency(item.price)}</Text>
                    </View>
                  </TouchableOpacity>
                )
              }}
              config={{
                tilePress: (item, section, index) => {
                  if (shoppingListId) {
                    if (section.key !== 'saved') {
                      shoppingListService.addPromotion(shoppingListId, item).then(() => {
                        this.getSavedPromotions();
                      });
                    } else {
                      shoppingListService.removePromotion(shoppingListId, item._id).then(() => {
                        this.getSavedPromotions();
                      });
                    }
                  }
                },
                headerPress: (item) => {
                  const current = this.state.sections[item.section.key];
                  this.setState({
                    sections: {...this.state.sections, [item.section.key]: !current }
                  }); 
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
  sections: {
    saved: Boolean,
    related: Boolean,
    all: Boolean
  }
}
interface Props {
  promotions: Array<any>,
  saved: Array<any>
  related: Array<any>
  actions: any,
  navigation: any
  shoppingLists: Array<any>
  shoppingListId: string
}

const mapStateToProps = state => ({
  promotions: state.promotions.items,
  related: state.promotions.related,
  saved: state.promotions.saved,
  shoppingListId: state.app.shoppingList._id,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({
    loadPromotions, 
    loadRelatedPromotions,
    loadSavedPromotions
  }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(PromotionsScreen);
