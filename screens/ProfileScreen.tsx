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
import { ListHeader } from "../components/ListHeader";
import userService from "../services/userService";
import { primaryColor } from "../styles/colors";
import { AddListItem } from "../components/AddListitem";

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
        rightIcon={{
          name: p._id === shoppingListId ? "stars" : null,
          color: primaryColor,
        }}
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

  add = (newListName) => {
    return shoppingListService
      .addItem({ name: newListName })
      .then(this.fetchShoppinglists);
  };

  render() {
    const { navigate } = this.props.navigation;
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
            title={profile && profile.name && profile.name[0]}
            size="xlarge"
            containerStyle={{ borderColor: "white", borderWidth: 4 }}
            rounded
            source={{ uri: profile.profilePicture }}
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
          <AddListItem
            addTitle={translate("Add Shopping List")}
            newItemLabel="Shopping List Name"
            add={this.add}
          ></AddListItem>
        </View>
      </ScrollView>
    );
  }
}

interface State {}

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
