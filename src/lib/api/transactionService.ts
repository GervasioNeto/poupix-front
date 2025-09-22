import axios from 'axios';

const API_URL = 'http://localhost:3002/api/transactions';

export interface Transaction {
  id: string;
  userId: string;
  amount: number;
  type: 'income' | 'expense';
  category: string;
  description: string;
  date: string;
  createdAt: string;
}

export const getAllTransactions = async (): Promise<Transaction[]> => {
  const { data } = await axios.get<Transaction[]>(API_URL);
  return data;
};

// Função principal para criar transações vinculadas a um usuário
export const createTransaction = async (
  userId: number,
  transaction: Omit<Transaction, 'id' | 'createdAt' | 'userId'>
): Promise<Transaction> => {
  const { data } = await axios.post<Transaction>(`${API_URL}?userId=${userId}`, transaction);
  return data;
};

export const updateTransaction = async (id: string, transaction: Partial<Transaction>): Promise<Transaction> => {
  const { data } = await axios.put<Transaction>(`${API_URL}/${id}`, transaction);
  return data;
};

export const deleteTransaction = async (id: string): Promise<void> => {
  await axios.delete(`${API_URL}/${id}`);
};
