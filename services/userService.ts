
import ServiceBase from './serviceBase';

class UsersService extends ServiceBase {
    constructor() {
        super('users');
    }

    getProfile = () => {
        return this.api.get('users/current/profile').then(res => res.data);
    }
}

export default new UsersService();
