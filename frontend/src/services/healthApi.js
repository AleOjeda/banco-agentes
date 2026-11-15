import httpClient from './httpClient.js';

export async function fetchHealth() {
  const response = await httpClient.get('/health');
  return response.data;
}
