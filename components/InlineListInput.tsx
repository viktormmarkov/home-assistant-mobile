import React from "react";
import { Input, Button } from "react-native-elements";
import { View } from "react-native";

export class InlineListInput extends React.Component {
  render() {
    return (
      <>
        <Input
          containerStyle={{
            backgroundColor: "white",
            paddingVertical: 14,
            paddingHorizontal: 14,
          }}
          labelStyle={{ fontWeight: "200", color: "#010101", paddingBottom: 5 }}
          {...this.props}
        />
        <View
          style={{
            flexDirection: "row",
            flex: 1,
            backgroundColor: "white",
          }}
        >
          <Button
            title="Cancel"
            type="clear"
            containerStyle={{ flex: 1, flexGrow: 1 }}
            onPress={this.props.cancel}
          />
          <Button
            title="Add"
            type="clear"
            containerStyle={{ flex: 1, flexGrow: 1 }}
            onPress={this.props.confirm}
          />
        </View>
      </>
    );
  }
}

