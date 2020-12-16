
import ServiceBase from './serviceBase';

class UsersService extends ServiceBase {
    constructor() {
        super('users');
    }

    getProfile = () => {
        return this.api.get('users/current/profile').then(res => res.data);
    }

    saveProfile = (update) => {
        return this.api.put('users/current/profile', update).then(res => res.data);
    }

    saveProfilePicture = (image) => {
        const formData = new FormData();
        formData.append('image', {
          uri: image.uri,
          type: 'image/jpg',
          name: 'upload.jpg'
        }, 'upload.jpg');
        return this.api.post('users/current/profile/picture', formData).then(res => res.data);
    }
}

export default new UsersService();
