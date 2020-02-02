import ServiceBase from './serviceBase';

class ShoppingListService extends ServiceBase {
    constructor() {
        super('shoppingLists');
    }

    getShoppingItems(id) {
      return this.api.get(`/${this.entity}/${id}/items`);
    }
}

export default new ShoppingListService();
