import ServiceBase from './serviceBase';

class ShoppingListService extends ServiceBase {
    constructor() {
        super('shoppingLists');
    }

    getShoppingItems(id) {
      return this.api.get(`/${this.entity}/${id}/items`);
    }
    addProduct(id, product) {
      return this.api.put(`/${this.entity}/${id}/add-product`, product);
    }
    removeItem(id, itemId) {
      return this.api.delete(`/${this.entity}/${id}/items/${itemId}`);
    }
}

export default new ShoppingListService();
