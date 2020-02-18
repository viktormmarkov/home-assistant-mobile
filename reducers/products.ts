import { PRODUCTS_LOADED } from '../constants';

const initialState = {
    items: []
};

const productsReducer = (state = initialState, action) => {
    switch(action.type) {
        case PRODUCTS_LOADED: 
            return {
                ...state,
                items: action.payload
            };
        default: return state;
    }
}

export default productsReducer;