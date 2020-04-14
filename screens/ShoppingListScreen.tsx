import React from "react";
import _ from 'lodash';
import { AsyncStorage, ScrollView } from "react-native";
import { Input, Button } from 'react-native-elements';
import shoppingListService from '../services/shoppingListService';
import {SafeAreaView} from 'react-navigation'
import styles from '../styles/base';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeUser } from '../actions/appStore';

export class ShoppingListScreen extends React.Component<Props, State> {
  state: State;
  constructor(props) {
    super(props);
    const params = this.props?.navigation?.state?.params;
    this.state = {
      _id: params._id,
      name: params.name,
      errorMessage: "",
      email: "",
      users: []
    };
  }

  componentDidMount() {
    this.getUser();
    this.loadUsers();
  }

  getUser = async () => {
    const {user, actions} = this.props;
    const userSaved = await AsyncStorage.getItem('user');
    if (userSaved && !user) {
      actions.changeUser(userSaved);
    }
  }

  loadUsers = () => {
    const {_id} = this.state;
    shoppingListService.getUsers(_id).then(async users => {
      this.setState({users})
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
    const {users} = this.state; 
    const {user: currentUser} = this.props;
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
interface State { 
  name: string,
  errorMessage: string, 
  _id: string, 
  users: [], 
  email: string, 
}

interface Props {
  navigation: any,
  actions: any,
  user: string
}

const mapStateToProps = state => ({
  user: state.app.user,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({changeUser}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListScreen);
