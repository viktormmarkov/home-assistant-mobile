import React from "react";
import { StyleSheet, Text, View, TextInput, Button } from "react-native";
import authenticationService from '../services/authenticationService';


export default class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: "",
      password: ""
    };
  }
  login = () => {
    const {email, password} = this.state;
    const user = {email, password};
    authenticationService.login(user)
      .then(res => {
        const {status} = res;
        if (status === 302 || status === 200) {
          console.log('SUCCESS')
        } else {
          const error = new Error(res.error);
          throw error;
        }
      }) 
      .catch(err => {
        console.log('err:', err);
      }) 
  }

  render() {
    return (
      <View style={styles.container}>
        <Text>Login</Text>
        <TextInput
          style={{ height: 40 }}
          placeholder="Type here to translate!"
          onChangeText={email => this.setState({ email })}
          value={this.state.email}
          autoCompleteType='email'
          keyboardType='email-address'
        />
        <TextInput
          style={{ height: 40 }}
          placeholder="Type here to translate!"
          onChangeText={password => this.setState({ password })}
          value={this.state.password}
          autoCompleteType='password'
          secureTextEntry
        />
        <Button
        title="Login"
        onPress={this.login}>

        </Button>
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
