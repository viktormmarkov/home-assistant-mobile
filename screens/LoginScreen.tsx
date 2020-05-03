import React from "react";
import { StyleSheet, View, AsyncStorage, Text } from "react-native";
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeShoppingList, changeUser } from '../actions/appStore';
import authenticationService from '../services/authenticationService';
import shoppingListService from '../services/shoppingListService';
import {USER, CURRENT_SHOPPING_LIST_ID} from '../stores/AppStoreKeys';

export class Login extends React.Component<Props, State>{
  state: State
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
    const {actions} = this.props;
    const {navigate} = this.props.navigation;
    const credentials = {email, password};
    authenticationService.login(credentials)
      .then(async (res) => {
        const data = res && res.data;
        if (data && data._id) {
          await AsyncStorage.setItem(USER, data._id);
          actions.changeUser(data._id);
          const shoppingListId = await AsyncStorage.getItem(CURRENT_SHOPPING_LIST_ID);
          if (!shoppingListId) {
            const shoppingLists = await shoppingListService.query();
            const activeShoppingList = shoppingLists[0];
            await AsyncStorage.setItem(CURRENT_SHOPPING_LIST_ID, activeShoppingList._id);
            actions.changeShoppingList(activeShoppingList);
          } else {
            actions.changeShoppingList(shoppingListId);
          }
   
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

interface State { 
  email: string; 
  password: string; 
  errorMessage: string 
};

interface Props {
  navigation: any,
  actions: any
}

const mapStateToProps = state => ({
  shoppingListId: state.app.shoppingListId,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({changeShoppingList, changeUser}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(Login);
