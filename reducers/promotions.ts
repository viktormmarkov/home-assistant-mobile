import { PROMOTIONS_LOADED, RELATED_PROMOTIONS_LOADED, INTERESTED_PROMOTIONS_LOADED } from '../constants';

const initialState = {
    items: [],
    related: [],
    interested: []
};

const promotionsLoaded = (state = initialState, action) => {
    switch(action.type) {
        case PROMOTIONS_LOADED: 
            return {
                ...state,
                items: action.payload
            };
        case RELATED_PROMOTIONS_LOADED: 
            return {
                ...state,
                related: action.payload
            };
        case INTERESTED_PROMOTIONS_LOADED: 
            return {
                ...state,
                interested: action.payload
            };
        default: return state;
    }
}

export default promotionsLoaded;