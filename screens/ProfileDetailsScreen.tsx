import React from "react";
import _ from "lodash";
import { AsyncStorage, View } from "react-native";
import { Input, Text, Avatar, Button, Icon } from "react-native-elements";
import userService from "../services/userService";
import styles from "../styles/base";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { TouchableOpacity } from "react-native-gesture-handler";
import { FormInput } from "../components/FormInput";
export class ProfileDetailsScreen extends React.Component<Props, State> {
  static navigationOptions = (options) => {
    const { navigation } = options;
    const { params } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: "#5CA666",
      },
      headerRight: params && params.headerRight,
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
      headerLeft: (
        <TouchableOpacity
          onPress={() => {
            this.props.navigation.pop();
          }}
        >
          <Text
            style={{
              color: "white",
              padding: 15,
            }}
          >
            Back To Profile
          </Text>
        </TouchableOpacity>
      ),
    });
  };

  getUserDetails = () => {
    const { actions } = this.props;
    userService.getProfile().then((data) => {
      this.setState({ user: data });
      actions.loadProfile(data);
    });
  };

  save = async () => {
    const { user: userId, actions } = this.props;
    const { user } = this.state;
    const userSaved = await AsyncStorage.getItem("user");
    userService.updateItem(userId || userSaved, user).then(actions.loadProfile);
  };

  render() {
    const { profile } = this.props;
    const { user } = this.state;

    if (!profile) {
      return null;
    }
    return (
      <View style={styles.columnContainer}>
        <View
          style={{ alignItems: "center", paddingBottom: 15, paddingTop: 20 }}
        >
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
        <View
          style={{
            paddingHorizontal: 10,
            paddingVertical: 10,
            flex: 1,
          }}
        >
          <FormInput
            label="Name"
            autoCompleteType="name"
            onChangeText={(name) =>
              this.setState({ user: { ...this.state.user, name } })
            }
            iconName={"user"}
            value={user.name}
          />
          <FormInput
            label="Email"
            autoCompleteType="email"
            onChangeText={(name) =>
              this.setState({ user: { ...this.state.user, lastName: name } })
            }
            iconName={"mail"}
            value={user.email}
          />
          <View style={{ flexDirection: "column", flex: 1 }}>
            <Button
              style={{ alignSelf: "flex-end", marginVertical: 5 }}
              title={"Save"}
              onPress={() => this.save}
            />
          </View>
        </View>
      </View>
    );
  }
}
interface State {
  errorMessage: string;
  user: any;
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
