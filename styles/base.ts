import { StyleSheet, Platform } from 'react-native';
import Constants from 'expo-constants';
const statusBarHeight = Constants.statusBarHeight

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'center',
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#c1c1c1',
        justifyContent: 'center',
        paddingTop: Platform.OS === 'ios' ? 0 : statusBarHeight
    },
    searchbar: {
        flex: 1
    },
    gridView: {
        flexGrow: 1,
        flexWrap: 'nowrap'
    },
    scrollview: {
        flex: 1,
        flexDirection: 'column',
        flexGrow: 1,
        flexWrap: 'nowrap'
    },
    itemContainer: {
        justifyContent: 'flex-end',
        borderRadius: 4,
        padding: 5,
        height: 130,
        backgroundColor: '#c1c1c1'
    },
    isSelected: {
        backgroundColor: '#6aa52c'
    },
    itemName: {
        fontSize: 16,
        color: '#fff',
        fontWeight: '600',
    },
    itemCode: {
        fontWeight: '600',
        fontSize: 12,
        color: '#fff',
    },
    sectionHeader: {
        flex: 1,
        fontSize: 15,
        fontWeight: '600',
        alignItems: 'center',
        backgroundColor: '#636e72',
        color: 'white',
        padding: 10,
    },
});

export default styles;