import React from "react";
import { Input, Icon } from "react-native-elements";
import { View } from "react-native";
import styles from '../styles/base';

export class FormInput extends React.Component {
  render() {
    return (
      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <View style={{ alignItems: "center", justifyContent: 'flex-start', marginLeft: 5, marginRight: 15}}>
          <Icon name={this.props.iconName} type={this.props.iconType || "antdesign"} />
        </View>

        <Input
          labelStyle={styles.labelStyle}
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          containerStyle={{
            paddingTop: 10,
            backgroundColor: "white",
            borderRadius: 4,
            marginVertical: 5,
            flex: 1,  
          }}
          {...this.props}
        />
      </View>
    );
  }
}
