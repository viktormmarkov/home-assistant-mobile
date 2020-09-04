import React from 'react';
import _ from 'lodash';
import { ScrollView, View, AsyncStorage} from 'react-native';
import { ListItem, Input, Button} from 'react-native-elements';
import styles from '../styles/base';

import authenticationService from '../services/authenticationService';
import shoppingListService from '../services/shoppingListService';
import { connect } from 'react-redux';
import { changeShoppingList } from '../actions/appStore';
import { loadShoppingItems } from '../actions/shoppingLists';
import { bindActionCreators } from 'redux';

class SettingsScreen extends React.Component<Props, State> {
  state: State;
  constructor(props) {
    super(props);
    this.state = {
      addShoppingList: false,
      name: ''
    }
  }
  componentDidMount() {
    const { actions } = this.props;
    shoppingListService.query().then(data => {
      actions.loadShoppingItems(data);
    });
  }

  getShoppingLists = () => {
    const {shoppingListId, actions, shoppingLists} = this.props;
    const { navigate } = this.props.navigation; 
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
            actions.changeShoppingList(p);
          }
        }}
      />))
  }
  add = () => {
    return shoppingListService.addItem({name: this.state.name})
      .then(() => {}, (err) => {console.log(err)})
      .finally(() => {
        this.setState({addShoppingList: false});
      });
  }
  cancel = () => {
    this.setState({name: '', addShoppingList: false});
  }
  render() {
    const { navigate } = this.props.navigation;
    const {addShoppingList} = this.state;
    return (
        <View style={{...styles.container, ...styles.column}}>
          <ScrollView>
            {this.getShoppingLists()}
            {!addShoppingList ? <ListItem 
              key={'add'}
              title={'Add Shopping List'}
              bottomDivider
              leftIcon={{name: 'add'}}
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
                  onPress={this.add}
                />
              </View>
               </React.Fragment> : null
              }
          </ScrollView>
          <Button
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
    );
  }
}

interface State { 
  addShoppingList: boolean,
  name: string
}
interface Props {
  shoppingListId: string,
  actions: any,
  navigation: any,
  shoppingLists: Array<any>,
}

const mapStateToProps = state => ({
  products: state.products.items,
  shoppingListId: state.app.shoppingList._id,
  shoppingLists: state.shoppingLists.items
});

const mapDispatchToProps = dispatch => ({
  actions: bindActionCreators({changeShoppingList, loadShoppingItems}, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettingsScreen);