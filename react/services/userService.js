import axios from 'axios';
const endpoint = { userUrls: `${API_HOST_PREFIX}/api/users` };

const updateUserStatus = (id, statusId) => {
  const config = {
    method: 'PUT',
    url: `${endpoint.userUrls}/status?id=${id}&statusId=${statusId}`,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

const getSearchUsers = (pageIndex, pageSize, query) => {
  const config = {
    method: 'GET',
    url: `${endpoint.userUrls}/search?pageIndex=${pageIndex}&pageSize=${pageSize}&query=${query}`,
    crossdomain: true,
    headers: { 'Content-Type': 'application/json' },
  };
  return axios(config).then(onGlobalSuccess).catch(onGlobalError);
};

export {
  updateUserStatus,
  getSearchUsers,
};
