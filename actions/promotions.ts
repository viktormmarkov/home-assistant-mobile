import { PROMOTIONS_LOADED } from '../constants';

export function loadPromotions(promotions) {
    return {
        type: PROMOTIONS_LOADED,
        payload: promotions
    }
};