import axios from 'axios';

let url =
  process.env.NODE_ENV === 'development'
    ? '/api'
    : 'https://fund-it-host.herokuapp.com/api';

const instance = axios.create({ baseURL: url });

instance.interceptors.request.use(
  (config) => {
    const token = window.localStorage.getItem('token');

    if (token) config.headers.authenticate = token;
    return config;
  },
  (error) => {
    Promise.reject(error);
  }
);

export default instance;
