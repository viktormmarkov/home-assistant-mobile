import React from 'react';
import _ from 'lodash';
import { StyleSheet, View, ScrollView, Button, Text, AsyncStorage } from 'react-native';
import BaseScreen from './BaseScreen';
import { SearchBar, ListItem, Header } from 'react-native-elements';
import promotionsService from '../services/promotionsService';

export default class PromotionsScreen extends BaseScreen {

  state: { search: string; promotions: []; shoppingListItems: [] };
  constructor(props) {
    super(props);
    this.state = {
      search: "",
      promotions: [],
      shoppingListItems: []
    };
  }

  componentDidMount() {
    this.loadPromotions();
  }

  loadPromotions = () => {
    promotionsService.query().then((data) => {
      this.setState({ promotions: data })
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
    const {search} = this.state;
    return (
      <View>
        <Header></Header>
        <SearchBar style={styles.searchbar}
          placeholder="Type Here..."
          onChangeText={this.updateSearch}
          lightTheme
          value={search}></SearchBar>
        {this.getPromotions()}
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    justifyContent: 'center',
  },
  searchbar: {
    flex: 1
  }
});

