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
    inviteUser = (id, email) => {
      return this.api.post(`${this.entity}/${id}/invite-user`, { email });
    }
    getUsers(id) {
      return this.api.get(`/${this.entity}/${id}/users`).then(res => res.data);
    }
}

export default new ShoppingListService();
