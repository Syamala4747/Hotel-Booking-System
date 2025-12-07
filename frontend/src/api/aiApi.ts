import axiosClient from './axiosClient';

export const checkAiHealth = async () => {
  const response = await axiosClient.get('/ai/health');
  return response.data;
};

export const analyzeRoomFeedbacks = async (roomId: number) => {
  const response = await axiosClient.get(`/ai/analyze-room/${roomId}`);
  return response.data;
};

export const analyzeAllFeedbacks = async () => {
  const response = await axiosClient.get('/ai/analyze-all');
  return response.data;
};

export const getRoomSummary = async (roomId: number) => {
  const response = await axiosClient.get(`/ai/room-summary/${roomId}`);
  return response.data;
};

export const chatWithBot = async (message: string) => {
  const response = await axiosClient.post('/ai/chat', { message });
  return response.data;
};
