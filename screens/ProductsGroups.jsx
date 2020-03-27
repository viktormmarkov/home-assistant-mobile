import React from 'react';
import { Text, View} from 'react-native';
import { SectionGrid, FlatGrid } from 'react-native-super-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../styles/base';


export default class ProductsGroup extends React.Component {
    render() {
        const { products, grid = 'flat', config} = this.props
        const Grid = grid === 'flat' ? FlatGrid : SectionGrid;

        return (
            <Grid
              style={styles.gridView}
              itemDimension={100}
              sections={products}
              items={products}
              renderItem={({ item, section, index }) => 
              (<TouchableOpacity style={[styles.itemContainer]} onPress={() => config.tilePress(item, section, index)}>
                <View key={item._id}>
                  <Text style={styles.itemName}>{item.name}</Text>
                </View>
              </TouchableOpacity>)}
              renderSectionHeader={({ section }) => (
                <Text style={styles.sectionHeader}>{section.title}</Text>
              )}
            />
        )
    }
}