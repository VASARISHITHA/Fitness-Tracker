import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:5000/api',
});

export const signup = async (formData) => {
  const response = await api.post('/users/signup', formData);
  return response.data;
};

export const googleSignup = async (tokenId) => {
  const response = await api.post('/google-login', { tokenId });
  return response.data;
};

export const inviteTrainee = async (inviteData) => {
  const response = await api.post('/invite', inviteData);
  return response.data;
};
export const verifyInvite = async (token) => {
  const response = await api.get(`/invite/verify/${token}`);
  return response.data;
};

export const acceptInvite = async (token, userId) => {
  const response = await api.post(`/invite/accept/${token}`, { userId });
  return response.data;
};

export const createGroup = async (groupData) => {
  const response = await api.post('/group/create', groupData);
  return response.data;
};
// Fetch all groups
export const getGroups = async () => {
  const response = await api.get('/groups');
  return response.data;
};

export const getGroupDetails = async (groupId) => {
  const response = await api.get(`/group/${groupId}`);
  return response.data;
};

export const getPlans = async () => {
  const response = await api.get('/plans');
  return response.data;
};
export const getAssignedPlan = async (traineeId) => {
  const response = await api.get(`/trainee-plans/assigned/${traineeId.trim()}`);
  return response.data;
};
export default api;