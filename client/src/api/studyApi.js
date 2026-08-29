import axios from 'axios';

const api = axios.create({ 
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', 
  timeout: 60000 
});

export const fetchUserData = (userId = 'default_user', signal) =>
  api.get('/user-data', { params: { userId }, signal }).then(({ data }) => data);

export const sendChatIntake = (messages, currentProfile, userId = 'default_user', signal) =>
  api.post('/chat-intake', { messages, currentProfile, userId }, { signal }).then(({ data }) => data);

export const generateRoadmap = (profile, userId = 'default_user', signal) =>
  api.post('/roadmap', { profile, userId }, { signal }).then(({ data }) => data);

export const updateModuleStatus = (moduleId, status, roadmapId, userId = 'default_user', signal) =>
  api.post('/module-progress', { moduleId, status, roadmapId, userId }, { signal }).then(({ data }) => data);

export const explainModule = (moduleTitle, userQuestion, learnerGoal, signal) =>
  api.post('/explain-module', { moduleTitle, userQuestion, learnerGoal }, { signal }).then(({ data }) => data);

export const createStudySet = (notes, signal) =>
  api.post('/study-set', { notes }, { signal }).then(({ data }) => data);

export const uploadPdfFile = (file, signal) => {
  const formData = new FormData();
  formData.append('file', file);
  return api.post('/upload-pdf', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
    signal
  }).then(({ data }) => data);
};

export const getErrorMessage = (error) => {
  if (axios.isCancel(error) || error.name === 'CanceledError') return null;
  if (error.code === 'ECONNABORTED') return 'The request timed out. Please try again.';
  if (!error.response) return 'Unable to connect to NeuroNova AI service. Check connection.';
  return error.response.data?.error || 'Something went wrong processing your request.';
};
