import * as _ from 'lodash'
import React from 'react';
import { Text, View} from 'react-native';
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../styles/base';
import {translate} from '../l10n/translate'

export default class ProductsGroup extends React.Component {
    render() {
        const { products, grid = 'flat', config} = this.props
        const Grid = grid === 'flat' ? FlatGrid : SectionGrid;
        const {selectedClass = 'isSelected'} = config;
        return (
            <Grid
              style={styles.gridView}
              itemDimension={100}
              sections={products}
              items={products}
              renderItem={({ item, section, index }) => {
                const isSelected = config.isSelected(item);
                const touchableStlyes = _.compact([styles.itemContainer, isSelected ? styles[selectedClass]: null]);
                return (<TouchableOpacity style={touchableStlyes} onPress={() => config.tilePress(item, section, index)}>
                  <View key={item._id}>
                    <Text style={styles.itemName}>{translate(item.name)}</Text>
                  </View>
                </TouchableOpacity>);
              }
             }
              renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
              )}
            />
        )
    }
}