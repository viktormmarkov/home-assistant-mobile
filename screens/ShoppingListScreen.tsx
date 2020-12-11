import React from "react";
import _ from "lodash";
import { AsyncStorage, ScrollView, View } from "react-native";
import { Button, Text } from "react-native-elements";
import shoppingListService from "../services/shoppingListService";
import styles from "../styles/base";
import { ListItem } from "react-native-elements";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { changeUser } from "../actions/appStore";
import { saveShoppingItem } from "../actions/shoppingLists";
import { FormInput } from "../components/FormInput";
import { ListHeader } from "../components/ListHeader";
import { AddListItem } from "../components/AddListitem";

export class ShoppingListScreen extends React.Component<Props, State> {
  static navigationOptions = (options) => {
    const { navigation } = options;
    const { params } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: "#5CA666",
      },
      headerTintColor: "#fff",
    };
  };

  state: State;
  constructor(props) {
    super(props);
    const params = this.props?.navigation?.state?.params;
    this.state = {
      _id: params._id,
      name: params.name,
      shoppingList: params,
      users: [],
    };
  }

  componentDidMount() {
    this.setHeader();
    this.getUser();
    this.loadUsers();
  }

  setHeader = () => {
    this.props.navigation.setParams({
      headerTitle: this.state.name,
    });
  };

  getUser = async () => {
    const { user, actions } = this.props;
    const userSaved = await AsyncStorage.getItem("user");
    if (userSaved && !user) {
      actions.changeUser(userSaved);
    }
  };

  loadUsers = () => {
    const { _id } = this.state;
    shoppingListService.getUsers(_id).then(async (users) => {
      this.setState({ users });
    });
  };

  save = () => {
    const { actions } = this.props;
    const { _id, name } = this.state;
    shoppingListService.updateItem(_id, { name }).then((res) => {
      actions.saveShoppingItem(res.data);
    });
  };

  invite = (email) => {
    const { _id } = this.state;
    return shoppingListService.inviteUser(_id, email);
  };

  getUsers = () => {
    const { users } = this.state;
    const { user: currentUser } = this.props;
    return users.map((p: any, i) => (
      <ListItem
        key={i}
        title={`${p.name}`}
        rightElement={() => {
          return (p._id === currentUser ? 
            <Text style={styles.labelStyle}>That's you</Text>
           : null);
        }}
        bottomDivider
      />
    ));
  };

  render() {
    return (
      <View style={styles.columnContainer}>
        <View style={{ flexDirection: "column", padding: 15 }}>
          <FormInput
            onChangeText={(name) => this.setState({ name })}
            value={this.state.name}
            autoCapitalize="none"
            label="Name"
            iconName="form"
          />
          <Button
            style={{ alignSelf: "flex-end", marginVertical: 10 }}
            title={"Update"}
            onPress={() => this.save}
          />
        </View>
        <ScrollView style={{ paddingHorizontal: 15 }}>
          <ListHeader
            key={"members"}
            title={"Members"}
            iconType={"feather"}
            iconName={"users"}
          />
          {this.getUsers()}
          <AddListItem
            addTitle="Invite a friend"
            add={this.invite}
            newItemLabel="Enter user email"
          />
        </ScrollView>
      </View>
    );
  }
}
interface State {
  name: string;
  _id: string;
  users: [];
  shoppingList: any;
}

interface Props {
  navigation: any;
  actions: any;
  user: string;
}

const mapStateToProps = (state) => ({
  user: state.app.user,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators({ changeUser, saveShoppingItem }, dispatch),
});

export default connect(mapStateToProps, mapDispatchToProps)(ShoppingListScreen);
