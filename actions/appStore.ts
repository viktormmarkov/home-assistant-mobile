import { SHOPPING_LIST_CHANGED, USER_CHANGED } from '../constants';

export function changeShoppingList(shoppingList) {
    return {
        type: SHOPPING_LIST_CHANGED,
        payload: shoppingList
    }
};

export function changeUser(user: string) {
    return {
        type: USER_CHANGED,
        payload: user
    }
};