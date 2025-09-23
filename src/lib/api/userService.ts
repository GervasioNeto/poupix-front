import axios from 'axios';

const API_URL = 'http://localhost:3002/api/users';

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export const getAllUsers = async (): Promise<User[]> => {
  const { data } = await axios.get<User[]>(API_URL);
  return data;
};

export const createUser = async (user: Omit<User, 'id' | 'createdAt'>): Promise<User> => {
  const { data } = await axios.post<User>(API_URL, user);
  return data;
};

export const updateUser = async (id: string, user: Partial<User>): Promise<User> => {
  const { data } = await axios.put<User>(`${API_URL}/${id}`, user);
  return data;
};

export const deleteUser = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};

// Função para login
export const loginUser = async (email: string, password: string): Promise<User> => {
  const { data } = await axios.post<User>(`${API_URL}/login`, { email, password });
  return data;
};
