import React from "react";
import _ from "lodash";
import { View } from "react-native";
import { Avatar, Button } from "react-native-elements";
import userService from "../services/userService";
import styles from "../styles/base";
import { connect } from "react-redux";
import { bindActionCreators } from "redux";
import { FormInput } from "../components/FormInput";
import * as ImagePicker from 'expo-image-picker';
import Constants from 'expo-constants';

export class ProfileDetailsScreen extends React.Component<Props, State> {
  static navigationOptions = (options) => {
    const { navigation } = options;
    const { params } = navigation.state;
    return {
      headerStyle: {
        backgroundColor: "#5CA666",
      },
      headerLeft: params && params.headerLeft,
      headerTintColor: "#fff",
      headerTitle: ''
    };
  };

  state: State;
  constructor(props) {
    super(props);
    this.state = {
      errorMessage: "",
      email: "",
      user: {},
      image: {}
    };
  }

  getPermissionAsync = async () => {
    if (Constants.platform.ios) {
      const status = 'not-granted';
      // const { status } = await Permissions.askAsync(Permissions.CAMERA_ROLL);
      if (status !== 'granted') {
        alert('Sorry, we need camera roll permissions to make this work!');
      }
    }
  };

  _pickImage = async () => {
    try {
      let result = await ImagePicker.launchImageLibraryAsync({
        mediaTypes: ImagePicker.MediaTypeOptions.Images,
        allowsEditing: true,
        aspect: [4, 3],
        quality: 1,
      });
      if (!result.cancelled) {
        return userService.saveProfilePicture(result).then(this.props.actions.loadProfile);
      }
    } catch (e) {
      console.log(e);
    }
  };


  componentDidMount() {
    this.getUserDetails();
  }

  getUserDetails = () => {
    const { actions } = this.props;
    userService.getProfile().then((data) => {
      this.setState({ user: data });
      actions.loadProfile(data);
    });
  };

  save = async () => {
    const { actions } = this.props;
    const { user } = this.state;
    userService.saveProfile(user).then(actions.loadProfile);
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
            title={user && user.name && user.name[0]}
            size="xlarge"
            containerStyle={{ borderColor: "white", borderWidth: 4 }}
            rounded
            source={{uri: user.profilePicture}}
            showEditButton
            editButton={{
              onPress:this._pickImage
            }}
          >
          </Avatar>
        </View>
        <View
          style={{
            paddingHorizontal: 15,
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
          {/* <FormInput
            label="Email"
            autoCompleteType="email"
            onChangeText={(name) =>
              this.setState({ user: { ...this.state.user, lastName: name } })
            }
            iconName={"mail"}
            value={user.email}
          /> */}
          <Button
            style={{ alignSelf: "flex-end", marginVertical: 5 }}
            title={"Save"}
            onPress={this.save}
          />
        </View>
      </View>
    );
  }
}
interface State {
  errorMessage: string;
  user: any;
  email: string;
  image: any
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
