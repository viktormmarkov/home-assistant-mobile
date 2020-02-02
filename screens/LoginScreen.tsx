import React from "react";
import { StyleSheet, View, AsyncStorage, Text } from "react-native";
import authenticationService from '../services/authenticationService';
import BaseScreen from './BaseScreen';
import { Input, Button } from 'react-native-elements';

export default class Login extends BaseScreen {
  state: { email: string; password: string; errorMessage: string };
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: "",
      errorMessage: ""
    };
  }
  login = async () => {
    const {email, password} = this.state;
    const {navigate} = this.props.navigation;
    const credentials = {email, password};
    authenticationService.login(credentials)
      .then(async (res: any) => {
        if (res._id) {
          await AsyncStorage.setItem('userToken', res.data._id);
          navigate('AuthLoading')
        } else {
          this.setState({
            errorMessage: 'Something went wrong'
          })
        }
      }) 
      .catch(err => {
        this.setState({
          errorMessage: err.response.data.message
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
