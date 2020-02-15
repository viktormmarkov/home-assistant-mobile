import React from 'react';
import _ from 'lodash';
import { ScrollView, RefreshControl, View } from 'react-native';
import { SafeAreaView } from 'react-navigation'
import BaseScreen from './BaseScreen';
import { SearchBar, ListItem } from 'react-native-elements';
import promotionsService from '../services/promotionsService';
import styles from '../styles/base';
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
    const {search, loading} = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <SearchBar style={styles.searchbar}
            placeholder="Type Here..."
            onChangeText={this.updateSearch}
            lightTheme
            value={search}></SearchBar>
            <ScrollView
              refreshControl={
                <RefreshControl refreshing={loading} onRefresh={this.loadPromotions} />
              }>
            {this.getPromotions()}

          </ScrollView>
        </View>
      </SafeAreaView>
    );
  }
}

