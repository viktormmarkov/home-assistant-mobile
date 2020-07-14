
export function shoppingListItemsLoaded(_id, items) {
    return {
        type: 'SHOPPING_LIST_ITEMS_LOADED',
        payload: {
            items,
            _id
        }
    }
};