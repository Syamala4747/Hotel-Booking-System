import axiosClient from './axiosClient';

export interface Room {
  id: number;
  room_number: string;
  room_type: string[];
  cost: number;
  capacity: number;
  description: string;
  is_active: boolean;
  images: string[];
}

export interface CreateRoomData {
  room_number: string;
  room_type: string[];
  cost: number;
  capacity: number;
  description: string;
  images?: string[];
}

export const getRooms = async () => {
  const response = await axiosClient.get('/rooms');
  return response.data;
};

export const getRoomById = async (id: number) => {
  const response = await axiosClient.get(`/rooms/${id}`);
  return response.data;
};

export const createRoom = async (data: CreateRoomData) => {
  const response = await axiosClient.post('/rooms', data);
  return response.data;
};

export const updateRoom = async (id: number, data: Partial<CreateRoomData>) => {
  const response = await axiosClient.patch(`/rooms/${id}`, data);
  return response.data;
};

export const deleteRoom = async (id: number) => {
  const response = await axiosClient.delete(`/rooms/${id}`);
  return response.data;
};

export const getRoomFeedback = async (roomId: number) => {
  const response = await axiosClient.get(`/rooms/${roomId}/feedback`);
  return response.data;
};
