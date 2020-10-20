
import ServiceBase from './serviceBase';

class UsersService extends ServiceBase {
    constructor() {
        super('users');
    }
}

export default new UsersService();
