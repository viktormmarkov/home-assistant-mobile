import ServiceBase from './serviceBase';

class ShopService extends ServiceBase {
    constructor() {
        super('shops');
    }
}

export default new ShopService();
