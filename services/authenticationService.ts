import apiBase from './apiBase';
import {success} from './serverMocks';
class AuthenticationService {
    login(credentials) {
        return apiBase.post('/login', credentials);
    }
    logout(){
        return apiBase.get('/logout');
    }
    register(user) {
        return apiBase.post('/register', user);
    }
    checkToken() {
        return apiBase.get('/checkToken');
    }
}

export default new AuthenticationService();
