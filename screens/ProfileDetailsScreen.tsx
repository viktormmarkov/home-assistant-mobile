import React from "react";
import _ from "lodash";
import { AsyncStorage, View } from "react-native";
import { Input, Text } from "react-native-elements";
import userService from "../services/userService";
import styles from "../styles/base";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TouchableOpacity } from "react-native-gesture-handler";

export class ProfileDetailsScreen extends React.Component<Props, State> {
  static navigationOptions = (options) => {
    const { navigation } = options;
    return {
      headerStyle: {
        backgroundColor: "#5CA666",
      },
      headerLeft: navigation.state.params && navigation.state.params.headerLeft,
      headerRight:
        navigation.state.params && navigation.state.params.headerRight,
      headerTintColor: "#fff",
    };
  };

  state: State;
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      email: "",
      user: {},
    };
  }

  componentDidMount() {
    this.setHeader();
    this.getUserDetails();
  }

  setHeader = () => {
    this.props.navigation.setParams({
      headerRight: (
        <TouchableOpacity onPress={this.save}>
          <Text
            style={{
              color: "white",
              padding: 5,
            }}
          >
            Update
          </Text>
        </TouchableOpacity>
      ),
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.pop();
          }}
        >
          <Text
            style={{
              color: "white",
              padding: 5,
            }}
          >
            Back
          </Text>
        </TouchableOpacity>
      ),
    });
  };

  getUserDetails = () => {
    const { actions } = this.props;
    userService.getProfile().then((data) => {
      this.setState({user: data});
      actions.loadProfile(data);
    });
  };

  save = async () => {
    const { user: userId, actions } = this.props;
    const { user } = this.state;
    const userSaved = await AsyncStorage.getItem("user");
    userService.updateItem(userId || userSaved, user)
      .then(actions.loadProfile)
  };

  render() {
    const safeAreaStyle = { ...styles.container, ...styles.column };
    const { profile } = this.props;
    const { user } = this.state;

    if (!profile) {
      return null;
    }
    return (
      <View style={safeAreaStyle}>
        <Input
          style={{ height: 40 }}
          label="Name"
          autoCompleteType="name"
          placeholder="email@address.com"
          onChangeText={(name) =>
            this.setState({ user: { ...this.state.user, name } })
          }
          value={user.name}
        />
        <Input
          style={{ height: 40 }}
          placeholder="Last Name"
          label="Last Name"
          autoCompleteType="name"
          onChangeText={(name) =>
            this.setState({ user: { ...this.state.user, lastName: name } })
          }
          value={user.lastName}
        />
      </View>
    );
  }
}
interface State {
  errorMessage: string;
  user: {};
  email: string;
}

interface Props {
  navigation: any;
  actions: any;
  user: string;
  profile: any;
}

const mapStateToProps = (state) => ({
  user: state.app.user,
  profile: state.userProfile,
});

const mapDispatchToProps = (dispatch) => ({
  actions: bindActionCreators(
    { loadProfile: (data) => ({ type: "PROFILE_LOADED", payload: data }) },
    dispatch
  ),
});

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(ProfileDetailsScreen);
