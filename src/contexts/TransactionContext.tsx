import React, { createContext, useContext, useState, useEffect } from 'react';
import { Transaction, TransactionContextType } from '@/types';
import { useAuth } from './AuthContext';

const TransactionContext = createContext<TransactionContextType | undefined>(undefined);

export const useTransactions = () => {
  const context = useContext(TransactionContext);
  if (context === undefined) {
    throw new Error('useTransactions must be used within a TransactionProvider');
  }
  return context;
};

export const TransactionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { user } = useAuth();
  const [transactions, setTransactions] = useState<Transaction[]>([]);

  useEffect(() => {
    if (user) {
      loadTransactions();
    } else {
      setTransactions([]);
    }
  }, [user]);

  const loadTransactions = () => {
    if (!user) return;
    
    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const userTransactions = allTransactions.filter((t: Transaction) => t.userId === user.id);
    setTransactions(userTransactions);
  };

  const saveTransactions = (newTransactions: Transaction[]) => {
    const allTransactions = JSON.parse(localStorage.getItem('transactions') || '[]');
    const otherUsersTransactions = allTransactions.filter((t: Transaction) => t.userId !== user?.id);
    const updatedTransactions = [...otherUsersTransactions, ...newTransactions];
    localStorage.setItem('transactions', JSON.stringify(updatedTransactions));
  };

  const addTransaction = (transactionData: Omit<Transaction, 'id' | 'userId' | 'createdAt'>) => {
    if (!user) return;

    const newTransaction: Transaction = {
      ...transactionData,
      id: `transaction-${Date.now()}`,
      userId: user.id,
      createdAt: new Date().toISOString()
    };

    const updatedTransactions = [...transactions, newTransaction];
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const updateTransaction = (id: string, transactionData: Partial<Transaction>) => {
    const updatedTransactions = transactions.map(t => 
      t.id === id ? { ...t, ...transactionData } : t
    );
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const deleteTransaction = (id: string) => {
    const updatedTransactions = transactions.filter(t => t.id !== id);
    setTransactions(updatedTransactions);
    saveTransactions(updatedTransactions);
  };

  const getBalance = (): number => {
    return transactions.reduce((balance, transaction) => {
      return transaction.type === 'income' 
        ? balance + transaction.amount 
        : balance - transaction.amount;
    }, 0);
  };

  const getMonthlyBalance = (year: number, month: number) => {
    const monthTransactions = transactions.filter(t => {
      const transactionDate = new Date(t.date);
      return transactionDate.getFullYear() === year && transactionDate.getMonth() === month;
    });

    const income = monthTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expense = monthTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expense, balance: income - expense };
  };

  const filterTransactions = (type?: 'income' | 'expense', month?: string): Transaction[] => {
    let filtered = transactions;

    if (type) {
      filtered = filtered.filter(t => t.type === type);
    }

    if (month) {
      const [year, monthNum] = month.split('-').map(Number);
      filtered = filtered.filter(t => {
        const transactionDate = new Date(t.date);
        return transactionDate.getFullYear() === year && transactionDate.getMonth() === monthNum - 1;
      });
    }

    return filtered.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
  };

  return (
    <TransactionContext.Provider value={{
      transactions,
      addTransaction,
      updateTransaction,
      deleteTransaction,
      getBalance,
      getMonthlyBalance,
      filterTransactions
    }}>
      {children}
    </TransactionContext.Provider>
  );
};