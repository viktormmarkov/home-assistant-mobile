import { PROMOTIONS_LOADED } from '../constants';

const initialState = {
    items: []
};

const promotionsLoaded = (state = initialState, action) => {
    switch(action.type) {
        case PROMOTIONS_LOADED: 
            return {
                ...state,
                items: action.payload
            };
        default: return state;
    }
}

export default promotionsLoaded;