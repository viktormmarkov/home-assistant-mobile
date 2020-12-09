const initialState = {};

const userProfileReducer = (state = initialState, action) => {
    switch(action.type) {
        case 'PROFILE_LOADED': 
            return {
                ...state,
                ...action.payload
            };
        default: return state;
    }
}

export default userProfileReducer;