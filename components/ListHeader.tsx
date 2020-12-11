import React from "react";
import { ListItem } from "react-native-elements";
import styles from "../styles/base";

export function ListHeader(props) {
  return (
    <ListItem
      titleStyle={styles.labelStyle}
      containerStyle={{
        borderTopLeftRadius: 8,
        borderTopRightRadius: 8,
        alignItems: "center",
      }}
      leftIcon={{
        name: props.iconName,
        type: props.iconType || 'antdesign',
        size: 17,
        color: "#242424"
      }}
      bottomDivider
      {...props}
    />
  );
}
