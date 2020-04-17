import { StyleSheet } from 'react-native';
import { primaryColor } from './colors';

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F2F2F2',
    },
    column: {
        flexDirection: 'column',
        justifyContent: 'flex-start',
    },
    safeAreaView: {
        flex: 1,
        backgroundColor: '#c1c1c1',
        justifyContent: 'center',
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
    squareContainer: {
        justifyContent: 'flex-end',
        borderRadius: 4,
        padding: 5,
        height: 130,
        backgroundColor: '#c1c1c1'
    },
    itemContainer: {
        borderRadius: 4,
        height: 130,
        flexDirection: 'column',
        backgroundColor: '#c1c1c1'
    },
    cardHeader: {
        flex: 0.3,
        padding: 5,
        backgroundColor: primaryColor
    },
    cardBody: {
        flex: 0.7
    },
    isSelected: {
        backgroundColor: '#6aa52c'
    },
    itemName: {
        fontSize: 12,
        color: '#fff',
        fontWeight: '600',
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