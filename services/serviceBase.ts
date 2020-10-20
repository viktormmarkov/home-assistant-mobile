import apiBase from './apiBase';

const encodeParams = (filter) => {
    let params = [];
    for (let key in filter) {
        params.push(`${key}=${filter[key]}`);
    }
    return params.join('&');
}

class ServiceBase {
    protected entity: String;
    protected api: any;

    constructor(entity) {
        this.entity = entity;
        this.api = apiBase
    }

    query(filter = {}) {
        const params = encodeParams(filter);
        return this.api.get(`/${this.entity}${params ? '?' + params : ''}`)
            .then(res => res.data);
    }
    getItem(id) {
        return this.api.get(`/${this.entity}/${id}`).then(res => res.data);
    }
    addItem(item) {
        return this.api.post(`/${this.entity}`, [item]);
    }
    updateItem(id, item) {
        return this.api.put(`/${this.entity}/${id}`, item);
    }
    deleteItem(id) {
        return this.api.delete(`/${this.entity}/${id}`);
    }
}

export default ServiceBase;