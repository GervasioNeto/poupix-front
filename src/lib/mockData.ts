// Mock data for testing the application
export const initializeMockData = () => {
  // Check if mock data already exists
  if (localStorage.getItem('mockDataInitialized')) {
    return;
  }

  // Create a test user
  const testUser = {
    id: 'user-1',
    name: 'João Silva',
    email: 'joao@teste.com',
    password: '123456',
    createdAt: new Date().toISOString()
  };

  // Save test user
  localStorage.setItem('users', JSON.stringify([testUser]));

  // Create sample transactions
  const sampleTransactions = [
    {
      id: 'transaction-1',
      userId: 'user-1',
      amount: 5000,
      type: 'income',
      category: 'Salário',
      description: 'Salário mensal',
      date: new Date(2024, new Date().getMonth(), 1).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: 'transaction-2',
      userId: 'user-1',
      amount: 500,
      type: 'expense',
      category: 'Alimentação',
      description: 'Compras do supermercado',
      date: new Date(2024, new Date().getMonth(), 3).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: 'transaction-3',
      userId: 'user-1',
      amount: 800,
      type: 'expense',
      category: 'Moradia',
      description: 'Aluguel do apartamento',
      date: new Date(2024, new Date().getMonth(), 5).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: 'transaction-4',
      userId: 'user-1',
      amount: 300,
      type: 'expense',
      category: 'Transporte',
      description: 'Combustível e manutenção',
      date: new Date(2024, new Date().getMonth(), 7).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: 'transaction-5',
      userId: 'user-1',
      amount: 1200,
      type: 'income',
      category: 'Freelance',
      description: 'Projeto de desenvolvimento web',
      date: new Date(2024, new Date().getMonth(), 10).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
    {
      id: 'transaction-6',
      userId: 'user-1',
      amount: 150,
      type: 'expense',
      category: 'Lazer',
      description: 'Cinema e jantar',
      date: new Date(2024, new Date().getMonth(), 12).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    },
        {
      id: 'transaction-7',
      userId: 'user-1',
      amount: 200,
      type: 'expense',
      category: 'Lazer',
      description: 'Vestuário3',
      date: new Date(2024, new Date().getMonth(), 12).toISOString().split('T')[0],
      createdAt: new Date().toISOString()
    }
  ];

  // Save sample transactions
  localStorage.setItem('transactions', JSON.stringify(sampleTransactions));

  // Mark mock data as initialized
  localStorage.setItem('mockDataInitialized', 'true');
};

// Call this function when the app starts
initializeMockData();