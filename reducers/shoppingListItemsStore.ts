import _ from 'lodash';

const initialState = {
    items: [],
};

const shoppingListItemsReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'SHOPPING_LIST_ITEMS_LOADED': 
            return {
                ...state,
                items: action.payload.items
            };
        default: return state;
    }
}

export default shoppingListItemsReducer;