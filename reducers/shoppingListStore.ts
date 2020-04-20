import { ITEMS_LOADED, ITEM_CHANGED} from '../constants';
import _ from 'lodash';

const initialState = {
    items: [],
};

const shoppingListReducer = (state = initialState, action) => {
    switch(action.type) {
        case ITEMS_LOADED: 
            return {
                ...state,
                items: action.payload
            };
        case ITEM_CHANGED: {
            const item = action.payload;
            const items = [...state.items];
            const itemId = _.findIndex(state.items, i=> i._id === item._id);
            items[itemId] = item;
            return {
               ...state,
               items: items
            }
        }
        default: return state;
    }
}

export default shoppingListReducer;