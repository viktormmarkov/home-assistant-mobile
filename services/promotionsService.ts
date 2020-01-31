import ServiceBase from './serviceBase';

class PromotionsService extends ServiceBase {
    constructor() {
        super('promotions');
    }

    query() {
        return super.query();
    }
}

export default new PromotionsService();
