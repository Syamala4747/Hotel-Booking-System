import axiosClient from './axiosClient';

export interface CreateFeedbackData {
  rating: number;
  comment: string;
}

export const createFeedback = async (roomId: number, data: CreateFeedbackData) => {
  const response = await axiosClient.post(`/rooms/${roomId}/feedback`, data);
  return response.data;
};

export const updateFeedback = async (feedbackId: number, data: CreateFeedbackData) => {
  const response = await axiosClient.put(`/feedback/${feedbackId}`, data);
  return response.data;
};

export const deleteFeedback = async (feedbackId: number) => {
  const response = await axiosClient.delete(`/feedback/${feedbackId}`);
  return response.data;
};
