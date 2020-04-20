import { createStore, combineReducers } from 'redux';
import productsReducer from '../reducers/products';
import appStoreReducer from '../reducers/appStore';
import shoppingListReducer from '../reducers/shoppingListStore';

const rootReducer = combineReducers(
    { 
        products: productsReducer,
        app: appStoreReducer,
        shoppingLists: shoppingListReducer
    }
);

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;