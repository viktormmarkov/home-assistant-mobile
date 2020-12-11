import React, { useState } from "react";
import { ListFooter } from "./ListFooter";
import { InlineListInput } from "./InlineListInput";
import PropTypes from 'prop-types';

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

AddListItem.propTypes = {
  newItemLabel: PropTypes.string,
  addTitle: PropTypes.string,
  add: PropTypes.func
}
