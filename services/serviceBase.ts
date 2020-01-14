import apiBase from './apiBase';

class ServiceBase {
    private entity: String;
    private api: any;

    constructor(entity) {
        this.entity = entity;
        this.api = apiBase
    }

    query() {
        return this.api.get(`/${this.entity}`)
            .then(res => {
                return res.data;
            });
    }
    getItem(id) {
        return this.api.get(`/${this.entity}/${id}`);
    }
    addItem(item) {
        return this.api.post(`/${this.entity}`, item);
    }
    updateItem(id, item) {
        return this.api.put(`/${this.entity}/${id}`, item);
    }
    deleteItem(id) {
        return this.api.delete(`/${this.entity}/${id}`);
    }
}

export default ServiceBase;