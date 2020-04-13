import React from "react";
import _ from 'lodash';
import { StyleSheet, View, AsyncStorage, Text, ScrollView } from "react-native";
import { Input, Button } from 'react-native-elements';
import BaseScreen from './BaseScreen';
import shoppingListService from '../services/shoppingListService';
import {SafeAreaView} from 'react-navigation'
import styles from '../styles/base';
import { ListItem } from 'react-native-elements';


export default class ShoppingListScreen extends BaseScreen {
  state: { name: string; errorMessage: string, _id: string, users: [], email: string, currentUser: string };
  constructor(props) {
    super(props);
    const params = this.getScreenParams();
    this.state = {
      _id: params._id,
      name: params.name,
      errorMessage: "",
      currentUser: "",
      email: "",
      users: []
    };
  }

  componentDidMount() {
    const {_id} = this.state;
    shoppingListService.getUsers(_id).then(async users => {
      const userToken = await AsyncStorage.getItem('userToken');
      this.setState({users, currentUser: userToken})
    })
  }

  save = () => {
    const {_id, name} = this.state;
    shoppingListService.updateItem(_id, {name});
  }

  invite = () => {
    const {_id, email} = this.state;
    shoppingListService.inviteUser(_id, email);
  }


  getUsers = () => {
    const {users, currentUser} = this.state; 
    return users.map((p: any, i) => (<ListItem
        key={i}
        title={p.name}
        bottomDivider
        rightIcon={{name: p._id === currentUser ? 'stars' : null}}
      />))
  }

  render() {
    return (
      <SafeAreaView style={styles.container}>
        <Input
          style={{ height: 40 }}
          onChangeText={name => this.setState({ name })}
          value={this.state.name}
          label="Name"
          autoCapitalize='none'
        />
        <Button
          title="Save"
          onPress={this.save}/>
        <Input
          style={{ height: 40 }}
          placeholder="email@address.com"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          autoCompleteType='email'
          keyboardType='email-address'
          label="Email"
          autoCapitalize='none'
        />
        <Button
          title="Invite"
          onPress={this.invite}/>
        <ScrollView>
          {this.getUsers()}
        </ScrollView>
      </SafeAreaView>
    );
  }
}