import { SHOPPING_LIST_CHANGED, USER_CHANGED} from '../constants';

const initialState = {
    shoppingListId: '',
    user: ''
};

const appStoreReducer = (state = initialState, action) => {
    switch(action.type) {
        case SHOPPING_LIST_CHANGED: 
            return {
                ...state,
                shoppingListId: action.payload
            };
        case USER_CHANGED: 
            return {
                ...state,
                user: action.payload
            };
        default: return state;
    }
}

export default appStoreReducer;