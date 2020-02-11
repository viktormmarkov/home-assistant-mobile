import React from 'react';
import _ from 'lodash';
import { StyleSheet, View, Button, AsyncStorage } from 'react-native';
import BaseScreen from './BaseScreen';
import authenticationService from '../services/authenticationService';

export default class SettingsScreen extends BaseScreen {
  render() {
    const { navigate } = this.props.navigation;

    return (
      <React.Fragment>
        <View style={styles.container}>
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
      </React.Fragment>
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

