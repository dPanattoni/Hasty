import axios from 'axios';
import { onGlobalError, onGlobalSuccess, API_HOST_PREFIX } from './serviceHelpers';

const endpoint = `${API_HOST_PREFIX}/api/listings`;

const filterPaginate = (pageIndex, pageSize, payload) => {
  const config = {
    method: 'POST',
    url: `${endpoint}/filter?pageIndex=${pageIndex}&pageSize=${pageSize}`,
    data: payload,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const listingService = {
  filterPaginate,
};

export default listingService;
