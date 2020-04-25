import { createStore, combineReducers } from 'redux';
import productsReducer from '../reducers/products';
import promotionsReducer from '../reducers/promotions';
import appStoreReducer from '../reducers/appStore';
import shoppingListReducer from '../reducers/shoppingListStore';

const rootReducer = combineReducers(
    { 
        products: productsReducer,
        app: appStoreReducer,
        shoppingLists: shoppingListReducer,
        promotions: promotionsReducer
    }
);

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;