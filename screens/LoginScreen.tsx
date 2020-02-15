import React from "react";
import { StyleSheet, View, AsyncStorage, Text } from "react-native";
import { Input, Button } from 'react-native-elements';
import BaseScreen from './BaseScreen';

import authenticationService from '../services/authenticationService';
import shoppingListService from '../services/shoppingListService';
import AppStore from '../stores/AppStore';

export default class Login extends BaseScreen {
  state: { email: string; password: string; errorMessage: string };
  constructor(props) {
    super(props);
    this.state = {
      email: "test@email.com",
      password: "123456",
      errorMessage: ""
    };
  }
  login = async () => {
    const {email, password} = this.state;
    const {navigate} = this.props.navigation;
    const credentials = {email, password};
    authenticationService.login(credentials)
      .then(async (res) => {
        const data = res && res.data;
        if (data && data._id) {
          await AsyncStorage.setItem('userToken', data._id);
          const shoppingLists = await shoppingListService.query();
          const activeShoppingList = shoppingLists[0];
          await AsyncStorage.setItem('shoppingListId', activeShoppingList._id);
          AppStore.set('shoppingList', activeShoppingList);
          navigate('AuthLoading')
        } else {
          this.setState({
            errorMessage: 'Something went wrong'
          })
        }
      }) 
      .catch(err => {
        this.setState({
          errorMessage: err.response || 'Something went wrong'
        });
      }) 
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>{this.state.errorMessage}</Text>
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
        <Input
          style={{ height: 40 }}
          placeholder="Password"
          label="Password"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          autoCompleteType='password'
          secureTextEntry
        />
        <Button
          title="Login"
          onPress={this.login}/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
    alignItems: "center",
    justifyContent: "center"
  }
});
