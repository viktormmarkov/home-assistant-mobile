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
    }
});

export default styles;