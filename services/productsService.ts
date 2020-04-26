
import ServiceBase from './serviceBase';

class ProductsService extends ServiceBase {
    constructor() {
        super('products');
    }
    addPersonalProduct(id, product) {
      return this.api.post(`${this.entity}/personal/${id}`, product).then(res => res.data);
    }
}

export default new ProductsService();
