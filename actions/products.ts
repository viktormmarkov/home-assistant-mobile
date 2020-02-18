import { PRODUCTS_LOADED } from '../constants';

export function loadProducts(products) {
    return {
        type: PRODUCTS_LOADED,
        payload: products
    }
};