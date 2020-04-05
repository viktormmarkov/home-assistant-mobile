import * as _ from 'lodash'
import React from 'react';
import { Text, View} from 'react-native';
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../styles/base';
import {translate} from '../l10n/translate'
function renderItem (config, { item, section, index }) {
  const isSelected = config.isSelected(item);
  const { selectedClass = 'isSelected' } = config;
  const touchableStlyes = _.compact([styles.squareContainer, isSelected ? styles[selectedClass]: null]);
  return (<TouchableOpacity style={touchableStlyes} onPress={() => config.tilePress(item, section, index)}>
    <View key={item._id}>
      <Text style={styles.itemName}>{translate(item.name)}</Text>
    </View>
  </TouchableOpacity>);
}
export default class ItemsGroup extends React.Component {
    render() {
        const { items, grid = 'flat', config, refreshControl} = this.props
        const Grid = grid === 'flat' ? FlatGrid : SectionGrid;
        return (
            <Grid
              refreshControl={refreshControl}
              style={styles.gridView}
              itemDimension={100}
              sections={items}
              items={items}
              renderItem={(options) => {
                if (this.props.renderItem) {
                  return this.props.renderItem(config, options)
                } else {
                  return renderItem(config, options);
                }
              }}
              renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
              )}
            />
        )
    }
}