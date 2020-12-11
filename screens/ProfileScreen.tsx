import React from "react";
import _ from "lodash";
import { View, Text } from "react-native";
import { ListItem, Button, Avatar } from "react-native-elements";
import styles from "../styles/base";
import shoppingListService from "../services/shoppingListService";
import { connect } from "react-redux";
import { changeShoppingList } from "../actions/appStore";
import { loadShoppingItems } from "../actions/shoppingLists";
import { bindActionCreators } from "redux";
import { translate } from "../l10n/translate";
import { ScrollView } from "react-native-gesture-handler";
import { InlineListInput } from "../components/InlineListInput";
import { ListHeader } from "../components/ListHeader";
import userService from "../services/userService";
import { ListFooter } from "../components/ListFooter";

class ProfileScreen extends React.Component<Props, State> {
  static navigationOptions = () => {
    return {
      headerTitle: translate("Profile"),
      headerStyle: {
        backgroundColor: "#5CA666",
      },
      headerTintColor: "#fff",
    };
  };
  state: State;
  constructor(props) {
    super(props);
    this.state = {
      addShoppingList: false,
      name: "",
    };
  }

  fetchShoppinglists = () => {
    const { actions } = this.props;

    shoppingListService.query().then((data) => {
      actions.loadShoppingItems(data);
    });
  };

  fetchUserData = () => {
    const { actions } = this.props;
    userService.getProfile().then((data) => {
      actions.loadProfile(data);
    });
  };

  componentDidMount() {
    this.fetchShoppinglists();
    this.fetchUserData();
  }

  getShoppingLists = () => {
    const { shoppingListId, actions, shoppingLists } = this.props;
    const { navigate } = this.props.navigation;
    return shoppingLists.map((p: any, i) => (
      <ListItem
        key={i}
        title={`${p.name}`}
        bottomDivider
        rightIcon={{ name: p._id === shoppingListId ? "stars" : null }}
        onPress={() => {
          navigate("ShoppingList", p);
        }}
        onLongPress={() => {
          if (p._id !== shoppingListId) {
            actions.changeShoppingList(p);
          }
        }}
      />
    ));
  };

  add = () => {
    return shoppingListService
      .addItem({ name: this.state.name })
      .then(this.fetchShoppinglists)
      .finally(() => {
        this.setState({ addShoppingList: false });
      });
  };

  cancel = () => {
    this.setState({ name: "", addShoppingList: false });
  };

  render() {
    const { navigate } = this.props.navigation;
    const { addShoppingList } = this.state;
    const { profile } = this.props;
    return (
      <ScrollView style={styles.container}>
        <View
          style={{
            alignItems: "center",
            paddingHorizontal: 15,
            paddingVertical: 10,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <Text style={{ fontSize: 24 }}>Hello, {profile && profile.name}</Text>
          <Button
            type="outline"
            title={translate("Edit Details")}
            onPress={() => navigate("ProfileDetails")}
          />
        </View>
        <View style={{ alignItems: "center", paddingBottom: 15 }}>
          <Avatar
            size="xlarge"
            containerStyle={{ borderColor: "white", borderWidth: 4 }}
            rounded
            source={{
              uri:
                "https://s3.amazonaws.com/uifaces/faces/twitter/ladylexy/128.jpg",
            }}
          />
        </View>

        <View style={{ padding: 15, flex: 1 }}>
          <ListHeader
            key={"shopping-list-head"}
            title={translate("Shopping Lists")}
            iconType={"entypo"}
            iconName={"list"}
          />
          {this.getShoppingLists()}
          {!addShoppingList ? (
            <ListFooter
              title={translate("Add Shopping List")}
              iconName="plus"
              onPress={() => {this.setState({ addShoppingList: true });}}
            />
          ) : null}
          {addShoppingList ? (
            <InlineListInput
              onChangeText={(name) => this.setState({ name })}
              value={this.state.name}
              label="Shopping List Name"
              autoCapitalize="none"
              confirm={this.add}
              cancel={this.cancel}
            />
          ) : null}
        </View>
      </ScrollView>
    );
  }
}

interface State {
  addShoppingList: boolean;
  name: string;
}
interface Props {
  shoppingListId: string;
  actions: any;
  navigation: any;
  shoppingLists: Array<any>;
  profile: any;
}

const mapStateToProps = (state) => ({
  products: state.products.items,
  shoppingListId: state.app.shoppingList._id,
  shoppingLists: state.shoppingLists.items,
  profile: state.userProfile,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    {
      changeShoppingList,
      loadShoppingItems,
      loadProfile: (data) => ({ type: "PROFILE_LOADED", payload: data }),
    },
    dispatch
  ),
});

export default connect(mapStateToProps, mapDispatchToProps)(ProfileScreen);
