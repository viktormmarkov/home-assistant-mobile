import React from 'react';
import _ from 'lodash';
import { ScrollView, View, Button} from 'react-native';
import { ListItem } from 'react-native-elements';
import {SafeAreaView} from 'react-navigation'
import styles from '../styles/base';

import BaseScreen from './BaseScreen';
import authenticationService from '../services/authenticationService';
import shoppingListService from '../services/shoppingListService';

export default class SettingsScreen extends BaseScreen {
  state: { shoppingLists: []};
  constructor(props) {
    super(props);
    this.state = {
      shoppingLists: []
    }
  }
  componentDidMount() {
    shoppingListService.query().then(data => {
     this.setState({shoppingLists: data})
    });
  }

  getShoppingLists = () => {
    const { navigate } = this.props.navigation;
    const {shoppingLists} = this.state; 
    return shoppingLists.map((p: any, i) => (<ListItem
        key={i}
        title={p.name}
        bottomDivider
        onPress={() => {
          navigate('ShoppingList', p)
        }}
      />))
  }
  render() {
    const { navigate } = this.props.navigation;

    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <ScrollView>
            {this.getShoppingLists()}
          </ScrollView>
          <Button
            color='red'
            title="Sign Out"
            onPress={async () => {
              await authenticationService.logout().then(res => {
                navigate('AuthLoading')
              }, err => {
                navigate('AuthLoading')
              })
            }}
          />
        </View>
      </SafeAreaView>
    );
  }
}
