import React from 'react';
import _ from 'lodash';
import { ScrollView, View, Button, AsyncStorage} from 'react-native';
import { ListItem, Input} from 'react-native-elements';
import {SafeAreaView} from 'react-navigation'
import styles from '../styles/base';

import authenticationService from '../services/authenticationService';
import shoppingListService from '../services/shoppingListService';
import { connect } from 'react-redux';
import { changeShoppingList } from '../actions/appStore';
import { bindActionCreators } from 'redux';

class SettingsScreen extends React.Component<Props, State> {
  state: State;
  constructor(props) {
    super(props);
    this.state = {
      addShoppingList: false,
      shoppingLists: [],
      name: ''
    }
  }
  componentDidMount() {
    shoppingListService.query().then(data => {
     this.setState({shoppingLists: data})
    });
  }

  getShoppingLists = () => {
    const {shoppingListId, actions} = this.props;
    const { navigate } = this.props.navigation;
    const {shoppingLists} = this.state; 
    return shoppingLists.map((p: any, i) => (<ListItem
        key={i}
        title={`${p.name}`}
        bottomDivider
        rightIcon={{name: p._id === shoppingListId ? 'stars' : null}}
        onPress={() => {
          navigate('ShoppingList', p)
        }}
        onLongPress={() => {
          if (p._id !== shoppingListId) {
            actions.changeShoppingList(p._id);
          }
        }}
      />))
  }
  addShoppingList = () => {
    return shoppingListService.addItem({name: this.state.name})
      .then(() => {}, (err) => {console.log(err)})
      .finally(() => {
        this.setState({addShoppingList: false});
      });
    
  }
  render() {
    const { navigate } = this.props.navigation;
    const {addShoppingList} = this.state;
    return (
      <SafeAreaView style={styles.safeAreaView}>
        <View style={styles.container}>
          <ScrollView>
            {this.getShoppingLists()}
            {!addShoppingList ? <ListItem 
              key={'add'}
              title={'Add Shopping List'}
              onPress={() => {
                this.setState({addShoppingList: true})
              }} /> : null
            }
            {addShoppingList ? <React.Fragment>
             <Input
                style={{ height: 40 }}
                onChangeText={name => this.setState({ name })}
                value={this.state.name}
                label="Shopping List Name"
                autoCapitalize='none'
              />
              <Button
                title="Add"
                onPress={this.addShoppingList}
              />
               </React.Fragment> : null
              }
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

interface State { 
  shoppingLists: Array<any>, 
  addShoppingList: boolean,
  name: string
}
interface Props {
  shoppingListId: string,
  actions: any,
  navigation: any
}

const mapStateToProps = state => ({
  products: state.products.items,
  shoppingListId: state.app.shoppingListId,
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({changeShoppingList}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);