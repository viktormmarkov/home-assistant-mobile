import {mockData} from './serverMocks';
import ServiceBase from './serviceBase';
const MOCK = [
  {
    "id": 1,
    "name": "Milk",
  },
  {
    "id": 2,
    "name": "Chicken Wings",
  },
  {
    "id": 3,
    "name": "Pork Chops",
  }
]

class ProductsService extends ServiceBase {
    constructor() {
        super('products');
    }

    query() {
        return super.query().then(() => {}, () => mockData(MOCK));
    }
}

export default new ProductsService();
