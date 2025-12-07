import axiosClient from './axiosClient';

export interface SignupData {
  name: string;
  email: string;
  password: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export const signup = async (data: SignupData) => {
  const response = await axiosClient.post('/auth/signup', data);
  return response.data;
};

export const login = async (data: LoginData) => {
  const response = await axiosClient.post('/auth/login', data);
  return response.data;
};
