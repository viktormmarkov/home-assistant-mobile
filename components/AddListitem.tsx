import React, { useState } from "react";
import { ListFooter } from "./ListFooter";
import { InlineListInput } from "./InlineListInput";

export function AddListItem(props) {
  const [addItem, setAddItem] = useState(false);
  const [newItem, setNewItem] = useState("");
  const add = (newItem) => {
    return props.add(newItem).finally(resetState);
  };
  const resetState = () => {
    setAddItem(false);
    setNewItem("");
  };
  if (!addItem) {
    return (
      <ListFooter
        title={props.addTitle}
        iconName="plus"
        onPress={() => setAddItem(true)}
      ></ListFooter>
    );
  } else {
    return (
      <InlineListInput
        onChangeText={(name) => setNewItem(name)}
        value={newItem}
        label={props.newItemLabel}
        autoCapitalize="none"
        confirm={() => add(newItem)}
        cancel={resetState}
      ></InlineListInput>
    );
  }
}
