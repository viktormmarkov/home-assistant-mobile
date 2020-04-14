import { createStore, combineReducers } from 'redux';
import productsReducer from '../reducers/products';
import appStoreReducer from '../reducers/appStore';

const rootReducer = combineReducers(
    { 
        products: productsReducer,
        app: appStoreReducer
    }
);

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;