import { PROMOTIONS_LOADED, RELATED_PROMOTIONS_LOADED, INTERESTED_PROMOTIONS_LOADED} from '../constants';

export function loadPromotions(promotions) {
    return {
        type: PROMOTIONS_LOADED,
        payload: promotions
    }
};

export function loadRelatedPromotions(promotions) {
    return {
        type: RELATED_PROMOTIONS_LOADED,
        payload: promotions
    }
};

export function loadInterestedPromotions(promotions) {
    return {
        type: INTERESTED_PROMOTIONS_LOADED,
        payload: promotions
    }
};