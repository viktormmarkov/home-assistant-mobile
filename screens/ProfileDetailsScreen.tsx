import React from "react";
import _ from 'lodash';
import { AsyncStorage, ScrollView, View, Animated, Easing} from "react-native";
import { Input, Button, Text } from 'react-native-elements';
import userService from '../services/userService';
import styles from '../styles/base';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeUser } from '../actions/appStore';
import { TouchableOpacity } from "react-native-gesture-handler";

export class ProfileDetailsScreen extends React.Component<Props, State> {

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
    this.state = {
      errorMessage: "",
      email: "",
      user: {},
    };
  }

  componentDidMount = async () => {
    this.setHeader();
    // await this.getUser();
    this.getUserDetails();
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

  getUserDetails = async () => {
    const {user} = this.props;
    const userSaved = await AsyncStorage.getItem('user');
    userService.getItem(user || userSaved).then((res) => {
      this.setState({user: res});
    });
  }

  save = async () => {
    const {user: userId} = this.props;
    const {user} = this.state;
    const userSaved = await AsyncStorage.getItem('user');
    userService.updateItem(userId || userSaved, user);
  }

  render() {
    const safeAreaStyle = {...styles.container, ...styles.column}
    return (
      <View style={safeAreaStyle}>  
        <Input
          style={{ height: 40 }}
          label="Name"
          autoCompleteType='name'
          placeholder="email@address.com"
          onChangeText={name => this.setState({ user: {...this.state.user, name} })}
          value={this.state.user.name}
        />
        <Input
          style={{ height: 40 }}
          placeholder="Last Name"
          label="Last Name"
          autoCompleteType='name'
          onChangeText={name => this.setState({ user: {...this.state.user, lastName: name} })}
          value={this.state.user.lastName}
        />
        <View style={styles.cardBody}>
          <ScrollView style={{padding: 10}}>
          </ScrollView>
        </View>
       </View>
    );
  }
}
interface State { 
  errorMessage: string, 
  user: {},
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

export default connect(mapStateToProps, mapDispatchToProps)(ProfileDetailsScreen);
