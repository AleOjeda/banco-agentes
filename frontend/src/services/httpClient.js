import axios from 'axios';
import { API_URL } from '../constants/api.js';

const httpClient = axios.create({
  baseURL: API_URL,
  timeout: 10000
});

export default httpClient;
