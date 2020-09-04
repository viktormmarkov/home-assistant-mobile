import React from "react";
import _ from 'lodash';
import { AsyncStorage, ScrollView, View, Animated, Easing} from "react-native";
import { Input, Button, Text } from 'react-native-elements';
import shoppingListService from '../services/shoppingListService';
import styles from '../styles/base';
import { ListItem } from 'react-native-elements';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeUser } from '../actions/appStore';
import { saveShoppingItem } from '../actions/shoppingLists';
import { TouchableOpacity } from "react-native-gesture-handler";

export class ShoppingListScreen extends React.Component<Props, State> {

  static navigationOptions = (options) => {
    const { navigation } = options
    return {
      headerStyle: {
        backgroundColor: '#5CA666',
      },
      headerLeft: navigation.state.params && navigation.state.params.headerLeft,
      headerRight: navigation.state.params && navigation.state.params.headerRight,
      headerTintColor: '#fff',
    }
  }

  state: State;
  constructor(props) {
    super(props);
    const params = this.props?.navigation?.state?.params;
    this.state = {
      _id: params._id,
      name: params.name,
      shoppingList: params,
      errorMessage: "",
      email: "",
      users: [],
      inviteUser: false,
      inputContainerStyle: { borderBottomWidth: 0}
    };
  }

  componentDidMount() {
    this.setHeader();
    this.getUser();
    this.loadUsers();
  }

  setHeader = () => {
    this.props.navigation.setParams({
      headerRight: (<TouchableOpacity onPress={this.save}><Text style={{
          color: 'white',
          padding: 5 }}>
            Update
          </Text>
        </TouchableOpacity>),
      headerLeft: (<TouchableOpacity onPress={() => {
        this.props.navigation.pop();
      }}><Text style={{ 
        color: 'white',
         padding: 5}}>
        Back
        </Text>
      </TouchableOpacity>)
    });
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
      this.setState({users});
    })
  }

  save = () => {
    const {actions} = this.props;
    const {_id, name} = this.state;
    shoppingListService.updateItem(_id, {name}).then(res => {
      actions.saveShoppingItem(res.data);
    });
  }

  invite = () => {
    const {_id, email} = this.state;
    shoppingListService.inviteUser(_id, email);
  }

  cancel = () => {
    this.setState({inviteUser: false, email: null});
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
    const safeAreaStyle = {...styles.container, ...styles.column}
    const {shoppingList, inviteUser} = this.state;
    return (
      <View style={safeAreaStyle}>  
        <View style={styles.cardHeader}>
          <View style={{flex: 0.9}}>

          </View>
          <Input
            inputStyle={{color: 'white', fontSize: 30}}
            inputContainerStyle={this.state.inputContainerStyle}
            style={{ height: 90 }}
            onChangeText={name => this.setState({ name })}
            value={this.state.name}
            autoCapitalize='none'
          />
          <Text style={{color: 'white', padding: 10}}>
            Last updated on {new Date(shoppingList.updatedAt).toDateString()}
          </Text>
        </View>
        <View style={styles.cardBody}>
          <ListItem 
                key={'members'}
                title={'Members'}
                bottomDivider
          />
          <ScrollView style={{padding: 10}}>
            {!inviteUser && <ListItem 
                key={'add'}
                title={'Invite a friend'}
                bottomDivider
                leftIcon={{name: 'add'}}
                onPress={() => {
                  this.setState({inviteUser: true})
                }} />}
            {inviteUser && <View style={{backgroundColor: 'white'}}>
             <Input
                style={{ height: 40 }}
                onChangeText={email => this.setState({ email })}
                value={this.state.email}
                label="Enter email to share with"
                autoCompleteType='email'
                keyboardType='email-address'
                autoCapitalize='none'
              />
              <View style={{ 
                flexDirection: 'row',
                flex: 1,
              }}>
                <Button
                  title="Cancel"
                  type="clear"
                  containerStyle={{flex: 1,  flexGrow: 1,}}
                  onPress={this.cancel}
                />
                <Button
                  title="Add"
                  type="clear"
                  containerStyle={{flex: 1,  flexGrow: 1,}}
                  onPress={this.invite}
                />
              </View>
            </View>}
            {!inviteUser && this.getUsers()}
          </ScrollView>
        </View>
      </View>
    );
  }
}
interface State { 
  name: string,
  inputContainerStyle: any,
  errorMessage: string, 
  _id: string, 
  users: [], 
  email: string, 
  shoppingList: any,
  inviteUser: boolean
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
  actions: bindActionCreators({changeUser, saveShoppingItem}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListScreen);
