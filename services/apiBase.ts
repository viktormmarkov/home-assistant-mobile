import axios from 'axios';
const localURL = 'http://localhost:3031/'; 
const baseURL = 'http://ec2-13-53-171-61.eu-north-1.compute.amazonaws.com/'; 

// const ngrok = ' https://d73eeb77c519.eu.ngrok.io'; 

export default axios.create({
    baseURL: baseURL,
    withCredentials: true
});