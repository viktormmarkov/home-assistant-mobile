import {ITEMS_LOADED, ITEM_CHANGED } from '../constants';

export function loadShoppingItems(items: []) {
    return {
        type: ITEMS_LOADED,
        payload: items
    }
};

export function saveShoppingItem(item) {
    return {
        type: ITEM_CHANGED,
        payload: item 
    }
}