import React, { useState } from 'react';
import Layout from '@/components/Layout';
import { useTransactions } from '@/contexts/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { TrendingUp, TrendingDown, Edit, Trash2, Filter, CalendarIcon, Plus } from 'lucide-react';
import { Transaction, TRANSACTION_CATEGORIES } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { Link } from 'react-router-dom';

const Transactions = () => {
  const { filterTransactions, updateTransaction, deleteTransaction } = useTransactions();
  const { toast } = useToast();
  
  const [typeFilter, setTypeFilter] = useState<'all' | 'income' | 'expense'>('all');
  const [monthFilter, setMonthFilter] = useState<string>('all');
  const [searchFilter, setSearchFilter] = useState('');
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null);
  const [editFormData, setEditFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    date: new Date()
  });

  const getFilteredTransactions = () => {
    let filtered = filterTransactions(
      typeFilter === 'all' ? undefined : typeFilter,
      monthFilter === 'all' ? undefined : monthFilter
    );

    if (searchFilter) {
      filtered = filtered.filter(t => 
        t.description.toLowerCase().includes(searchFilter.toLowerCase()) ||
        t.category.toLowerCase().includes(searchFilter.toLowerCase())
      );
    }

    return filtered;
  };

  const transactions = getFilteredTransactions();

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL',
    }).format(value);
  };

  const getMonthOptions = () => {
    const months = [];
    const now = new Date();
    
    for (let i = 11; i >= 0; i--) {
      const date = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const value = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
      const label = date.toLocaleDateString('pt-BR', { month: 'long', year: 'numeric' });
      months.push({ value, label: label.charAt(0).toUpperCase() + label.slice(1) });
    }
    
    return months;
  };

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction);
    setEditFormData({
      amount: transaction.amount.toString(),
      type: transaction.type,
      category: transaction.category,
      description: transaction.description,
      date: new Date(transaction.date)
    });
  };

  const handleSaveEdit = () => {
    if (!editingTransaction) return;

    if (!editFormData.amount || !editFormData.category || !editFormData.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    updateTransaction(editingTransaction.id, {
      amount: parseFloat(editFormData.amount),
      type: editFormData.type,
      category: editFormData.category,
      description: editFormData.description,
      date: editFormData.date.toISOString().split('T')[0]
    });

    toast({
      title: "Transação atualizada",
      description: "A transação foi atualizada com sucesso.",
    });

    setEditingTransaction(null);
  };

  const handleDelete = (transaction: Transaction) => {
    deleteTransaction(transaction.id);
    toast({
      title: "Transação excluída",
      description: "A transação foi removida com sucesso.",
    });
  };

  return (
    <Layout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold text-foreground">Transações</h1>
          <Link to="/new-transaction">
            <Button className="flex items-center space-x-2">
              <Plus className="h-4 w-4" />
              <span>Nova Transação</span>
            </Button>
          </Link>
        </div>

        {/* Filters */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Filter className="h-5 w-5" />
              <span>Filtros</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4 md:grid-cols-4">
              <div className="space-y-2">
                <Label>Buscar</Label>
                <Input
                  placeholder="Descrição ou categoria..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select value={typeFilter} onValueChange={(value: any) => setTypeFilter(value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    <SelectItem value="income">Receitas</SelectItem>
                    <SelectItem value="expense">Despesas</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Mês</Label>
                <Select value={monthFilter} onValueChange={setMonthFilter}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">Todos</SelectItem>
                    {getMonthOptions().map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setTypeFilter('all');
                    setMonthFilter('all');
                    setSearchFilter('');
                  }}
                  className="w-full"
                >
                  Limpar Filtros
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Transactions List */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle>
              Lista de Transações ({transactions.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            {transactions.length > 0 ? (
              <div className="space-y-4">
                {transactions.map((transaction) => (
                  <div key={transaction.id} className="flex items-center justify-between p-4 border border-border rounded-lg hover:bg-muted/50 transition-colors">
                    <div className="flex items-center space-x-4 flex-1">
                      <div className={`p-3 rounded-full ${
                        transaction.type === 'income' ? 'bg-income/10' : 'bg-expense/10'
                      }`}>
                        {transaction.type === 'income' ? (
                          <TrendingUp className="h-5 w-5 text-income" />
                        ) : (
                          <TrendingDown className="h-5 w-5 text-expense" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2 mb-1">
                          <h3 className="font-medium text-foreground">{transaction.description}</h3>
                          <Badge variant={transaction.type === 'income' ? 'default' : 'destructive'}>
                            {transaction.type === 'income' ? 'Receita' : 'Despesa'}
                          </Badge>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          {transaction.category} • {new Date(transaction.date).toLocaleDateString('pt-BR')}
                        </p>
                      </div>
                      <div className={`font-bold text-lg ${
                        transaction.type === 'income' ? 'text-income' : 'text-expense'
                      }`}>
                        {transaction.type === 'income' ? '+' : '-'}{formatCurrency(transaction.amount)}
                      </div>
                    </div>
                    
                    <div className="flex items-center space-x-2 ml-4">
                      <Dialog>
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleEdit(transaction)}
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                        </DialogTrigger>
                        <DialogContent>
                          <DialogHeader>
                            <DialogTitle>Editar Transação</DialogTitle>
                          </DialogHeader>
                          <div className="space-y-4">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <Label>Valor</Label>
                                <Input
                                  type="number"
                                  step="0.01"
                                  placeholder="0.00"
                                  value={editFormData.amount}
                                  onChange={(e) => setEditFormData({ ...editFormData, amount: e.target.value })}
                                />
                              </div>
                              <div className="space-y-2">
                                <Label>Tipo</Label>
                                <Select value={editFormData.type} onValueChange={(value: any) => setEditFormData({ ...editFormData, type: value, category: '' })}>
                                  <SelectTrigger>
                                    <SelectValue />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="income">Receita</SelectItem>
                                    <SelectItem value="expense">Despesa</SelectItem>
                                  </SelectContent>
                                </Select>
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <Label>Categoria</Label>
                              <Select value={editFormData.category} onValueChange={(value) => setEditFormData({ ...editFormData, category: value })}>
                                <SelectTrigger>
                                  <SelectValue placeholder="Selecione uma categoria" />
                                </SelectTrigger>
                                <SelectContent>
                                  {TRANSACTION_CATEGORIES[editFormData.type].map((category) => (
                                    <SelectItem key={category} value={category}>
                                      {category}
                                    </SelectItem>
                                  ))}
                                </SelectContent>
                              </Select>
                            </div>

                            <div className="space-y-2">
                              <Label>Descrição</Label>
                              <Textarea
                                placeholder="Descreva a transação..."
                                value={editFormData.description}
                                onChange={(e) => setEditFormData({ ...editFormData, description: e.target.value })}
                              />
                            </div>

                            <div className="space-y-2">
                              <Label>Data</Label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={cn(
                                      "w-full justify-start text-left font-normal",
                                      !editFormData.date && "text-muted-foreground"
                                    )}
                                  >
                                    <CalendarIcon className="mr-2 h-4 w-4" />
                                    {editFormData.date ? format(editFormData.date, "dd/MM/yyyy") : <span>Selecionar data</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <Calendar
                                    mode="single"
                                    selected={editFormData.date}
                                    onSelect={(date) => date && setEditFormData({ ...editFormData, date })}
                                    initialFocus
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div className="flex space-x-2">
                              <Button onClick={handleSaveEdit} className="flex-1">
                                Salvar Alterações
                              </Button>
                              <Button variant="outline" onClick={() => setEditingTransaction(null)} className="flex-1">
                                Cancelar
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>

                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="outline" size="sm">
                            <Trash2 className="h-4 w-4 text-expense" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Confirmar exclusão</AlertDialogTitle>
                            <AlertDialogDescription>
                              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancelar</AlertDialogCancel>
                            <AlertDialogAction onClick={() => handleDelete(transaction)}>
                              Excluir
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <TrendingUp className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                <h3 className="text-lg font-medium text-foreground mb-2">Nenhuma transação encontrada</h3>
                <p className="text-muted-foreground mb-4">
                  {typeFilter !== 'all' || monthFilter !== 'all' || searchFilter
                    ? 'Tente ajustar os filtros para ver mais resultados.'
                    : 'Comece adicionando sua primeira transação.'}
                </p>
                <Link to="/new-transaction">
                  <Button>
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar Transação
                  </Button>
                </Link>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default Transactions;