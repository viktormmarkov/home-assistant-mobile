import { SHOPPING_LIST_CHANGED, USER_CHANGED } from '../constants';

export function changeShoppingList(shoppingListId: string) {
    return {
        type: SHOPPING_LIST_CHANGED,
        payload: shoppingListId
    }
};

export function changeUser(user: string) {
    return {
        type: USER_CHANGED,
        payload: user
    }
};