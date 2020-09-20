import ServiceBase from './serviceBase';

class PromotionsService extends ServiceBase {
    constructor() {
        super('promotions');
    }
}

export default new PromotionsService();
