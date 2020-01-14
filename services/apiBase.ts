import axios from 'axios';
const baseURL = 'http://192.168.100.28:3031/'; 

export default axios.create({
    baseURL,
    withCredentials: true
});