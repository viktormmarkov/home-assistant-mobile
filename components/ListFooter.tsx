import React from "react";
import { ListItem } from "react-native-elements";
import { primaryColor } from "../styles/colors";

export function ListFooter(props) {
  return (
    <ListItem
      containerStyle={{
        borderBottomLeftRadius: 8,
        borderBottomRightRadius: 8,
        alignItems: "center",
      }}
      leftIcon={{
        name: props.iconName,
        type: props.iconType || 'antdesign',
        size: 17,
        color: primaryColor
      }}
      titleStyle={{ color: primaryColor }}
      bottomDivider
      {...props}
    />
  );
}
