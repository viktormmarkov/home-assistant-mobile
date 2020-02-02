import {mockData} from './serverMocks';
import ServiceBase from './serviceBase';
const MOCK = [
  {
    "id": 1,
    "categories": [
      "5de114955bf11d56db11febe"
    ],
    "name": "Milk",
  },
  {
    "id": 2,
    "categories": [],
    "name": "Chicken Wings",
  },
  // {
  //   "id": 3,  
  //   "categories": [
  //     "5e08eff2f12f6037684f032e"
  //   ],
  //   "tags": [],
  //   "name": "Pork Chops",
  // }
]

class ShoppingListService extends ServiceBase {
    constructor() {
        super('shoppingLists');
    }
}

export default new ShoppingListService();
