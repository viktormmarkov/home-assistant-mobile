import React from 'react';
import { View, StyleSheet} from 'react-native';
import { TouchableHighlight } from 'react-native-gesture-handler';
import Icon from 'react-native-vector-icons/FontAwesome';
export const SWIPE_MENU_SIZE = 0.3;

export default function listMenu(config) {
  return (data, rowMap) => (
    <View style={style.rowBack}>
        <View style={style.rowPlaceholder}></View>
        <View style={style.rowMenu}>
          <View style={{...style.remove, ...style.menuIcon}}> 
            <TouchableHighlight onPress={() => config.reject(rowMap, data.item)}>
              <Icon name="trash" size={14} color='white'>
              </Icon>
            </TouchableHighlight>
          </View>
          <View style={{...style.add, ...style.menuIcon}}>
            <TouchableHighlight onPress={() => config.confirm(rowMap, data.item)}>
                <Icon name="check" size={14} color='white'>
                </Icon>
            </TouchableHighlight>
          </View>
        </View>
    </View>
)
}


const style = StyleSheet.create({
  rowBack: {
    backgroundColor: '#DDD',
    flex: 1,
    flexDirection: 'row',
  },
  rowPlaceholder: {
    flex: 1 - SWIPE_MENU_SIZE,
  },
  rowMenu: {
    flex: SWIPE_MENU_SIZE,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'stretch',
    alignContent: 'stretch',
    flexWrap: 'wrap'
  },
  menuIcon: {
    flex: 1,
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
    alignSelf: 'stretch'
    // flexDirection: 'row',
    // justifyContent: 'center',
    // alignItems: 'center'
  },
  remove: {
    backgroundColor: 'red',
  },
  add: {
    backgroundColor: 'green',
  }
});