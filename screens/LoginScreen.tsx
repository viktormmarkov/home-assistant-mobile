import React from "react";
import { StyleSheet, View, AsyncStorage, Text } from "react-native";
import { Input, Button } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeShoppingList, changeUser } from '../actions/appStore';
import authenticationService from '../services/authenticationService';
import shoppingListService from '../services/shoppingListService';
import {USER, CURRENT_SHOPPING_LIST_ID} from '../stores/AppStoreKeys';
import styles from '../styles/base';
import { primaryColor } from '../styles/colors';

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
        <View style={screenStyles.halfScreen}>
          <Text style={screenStyles.logoText}>Shopper</Text>
        </View>
        <View style={screenStyles.loginContainer}>
          <View style={screenStyles.loginForm}>
            <Input
              placeholder="email@address.com"
              onChangeText={email => this.setState({ email })}
              value={this.state.email}
              autoCompleteType='email'
              keyboardType='email-address'
              autoCapitalize='none'
              inputContainerStyle={screenStyles.roundedInputStyle}
              containerStyle={{marginVertical: 5}}
            />
            <Input
              placeholder="Password"
              onChangeText={password => this.setState({ password })}
              value={this.state.password}
              autoCompleteType='password'
              inputContainerStyle={screenStyles.roundedInputStyle}
              secureTextEntry
              containerStyle={{marginVertical: 5}}
            />
            <Text style={screenStyles.errorText}>
              {this.state.errorMessage}
            </Text>
            <Button
              title="Login"
              buttonStyle={{backgroundColor: primaryColor}}
              containerStyle={{alignSelf: 'stretch', paddingHorizontal: 10}}
              onPress={this.login}/>
          </View>
          <View style={{flex: 0.5}}>
        </View>
        </View>
       
      </View>
    );
  }
}

const screenStyles = StyleSheet.create({
  halfScreen: {
    flex: 0.5,
    backgroundColor: primaryColor,
    justifyContent: "center",
    alignItems: "center",
  },
  logoText: {
    fontSize: 40,
    color: '#ffffff',
    fontWeight: "900"
  },
  errorText: {
    color: '#ff0000',
    paddingHorizontal: 10
  },
  loginForm: {
    flex: 1,
    paddingTop: 10,
    justifyContent: 'flex-start'
  },
  loginContainer: {
    flex: 1,
    padding: 10
  },
  roundedInputStyle: {
    backgroundColor: '#fff',
    borderBottomWidth: 0,
    paddingVertical: 5,
    paddingHorizontal: 15,
    borderRadius: 5
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
