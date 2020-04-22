import * as _ from 'lodash'
import React from 'react';
import { Text, View} from 'react-native';
import { Icon} from 'react-native-elements';
import { SectionGrid, FlatGrid,  } from 'react-native-super-grid';
import { TouchableOpacity } from 'react-native-gesture-handler';
import styles from '../styles/base';
import {translate} from '../l10n/translate'
import SectionList from './SectionList';

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
        const Grid = grid === 'flat' ? FlatGrid : SectionList;
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
                  if (!options.section || options.section && options.section.show) {
                    return renderItem(config, options);
                  } else {
                    return null;
                  }
                }
              }}
              renderSectionHeader={(item) => {
                const icon = item.section.show ? 'keyboard-arrow-up' : 'keyboard-arrow-down';
                return (
                    <TouchableOpacity style={{
                      flex: 1,
                      flexGrow: 1,
                      flexDirection: 'row',
                      justifyContent: 'space-between',
                      backgroundColor: '#636e72',
                    }} onPress={()=>{config.headerPress(item)}} >
                    <Text style={styles.sectionHeader}>{item.section.title}</Text>
                    <Icon 
                    name={icon}
                    color="#ffffff"
                    containerStyle={{
                      padding: 5
                    }}
                    >
                     </Icon>
                    </TouchableOpacity>
                  );
              }}
            />
        )
    }
}