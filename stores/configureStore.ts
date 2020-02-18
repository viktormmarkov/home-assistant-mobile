import { createStore, combineReducers } from 'redux';
import productsReducer from '../reducers/products';

const rootReducer = combineReducers(
    { products: productsReducer }
);

const configureStore = () => {
    return createStore(rootReducer);
}

export default configureStore;