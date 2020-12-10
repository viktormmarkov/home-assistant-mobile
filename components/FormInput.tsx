import React from "react";
import { Input, Icon } from "react-native-elements";
import { View } from "react-native";

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
        <View style={{ alignItems: "center", justifyContent: 'flex-start', flex: 0.2}}>
          <Icon name={this.props.iconName} type={"antdesign"} />
        </View>

        <Input
          labelStyle={{
            fontWeight: "200", color: "#010101",
          }}
          inputContainerStyle={{
            borderBottomWidth: 0,
          }}
          containerStyle={{
            paddingTop: 10,
            backgroundColor: "white",
            borderRadius: 4,
            marginVertical: 5,
            flex: 1,
            marginLeft: 10
          }}
          {...this.props}
        />
      </View>
    );
  }
}
