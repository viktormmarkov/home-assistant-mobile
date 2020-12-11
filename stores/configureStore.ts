import { createStore, combineReducers, applyMiddleware } from 'redux';
import productsReducer from '../reducers/products';
import promotionsReducer from '../reducers/promotions';
import appStoreReducer from '../reducers/appStore';
import shoppingListReducer from '../reducers/shoppingListStore';
import shoppingListItemsReducer from '../reducers/shoppingListItemsStore';
import { ofType, combineEpics, createEpicMiddleware } from 'redux-observable';
import { map, flatMap, mergeMap } from 'rxjs/operators';
import shoppingListService from '../services/shoppingListService';
import { from } from 'rxjs';
import userProfileReducer from '../reducers/userProfileStore';


const rootReducer = combineReducers(
    { 
        products: productsReducer,
        app: appStoreReducer,
        shoppingLists: shoppingListReducer,
        promotions: promotionsReducer,
        shoppingListItems: shoppingListItemsReducer,
        userProfile: userProfileReducer
    }
);
const epicMiddleware = createEpicMiddleware();
const shoppingListItem = action$ => 
    action$.pipe(
        ofType('SHOPPING_LIST_ITEMS_LOADED'),
        mergeMap(action => 
            from(shoppingListService.getRelatedPromotions(action.payload._id))
                .pipe(map(response => ({type: 'RELATED_PROMOTIONS_LOADED', payload: response})))
        )
);

const rootEpic = combineEpics(shoppingListItem); 
const rootStore = createStore(rootReducer, applyMiddleware(epicMiddleware));
epicMiddleware.run(rootEpic);

export default rootStore;