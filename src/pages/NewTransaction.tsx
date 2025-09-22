import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Layout from '@/components/Layout';
import { useTransactions } from '@/contexts/TransactionContext';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { CalendarIcon, ArrowLeft, Plus } from 'lucide-react';
import { TRANSACTION_CATEGORIES } from '@/types';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { cn } from '@/lib/utils';
import { createTransaction } from '@/lib/api/transactionService';

const NewTransaction = () => {
  const { addTransaction } = useTransactions();
  const { toast } = useToast();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    amount: '',
    type: 'expense' as 'income' | 'expense',
    category: '',
    description: '',
    date: new Date()
  });

  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.amount || !formData.category || !formData.description) {
      toast({
        title: "Erro",
        description: "Preencha todos os campos obrigatórios.",
        variant: "destructive",
      });
      return;
    }

    if (parseFloat(formData.amount) <= 0) {
      toast({
        title: "Erro",
        description: "O valor deve ser maior que zero.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);

    try {
      // // Simulate API delay
      // await new Promise(resolve => setTimeout(resolve, 500));

      // addTransaction({
      //   amount: parseFloat(formData.amount),
      //   type: formData.type,
      //   category: formData.category,
      //   description: formData.description,
      //   date: formData.date.toISOString().split('T')[0]
      // });
      const userId = 1; // por enquanto, exemplo fixo

    await createTransaction(userId, {
      amount: parseFloat(formData.amount),
      type: formData.type,
      category: formData.category,
      description: formData.description,
      date: formData.date.toISOString().split('T')[0],
    });

      toast({
        title: "Transação criada",
        description: "A transação foi adicionada com sucesso.",
      });

      navigate('/transactions');
    } catch (error) {
      toast({
        title: "Erro",
        description: "Ocorreu um erro ao criar a transação.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const resetForm = () => {
    setFormData({
      amount: '',
      type: 'expense',
      category: '',
      description: '',
      date: new Date()
    });
  };

  return (
    <Layout>
      <div className="max-w-2xl mx-auto space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" size="sm" onClick={() => navigate('/transactions')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Voltar
          </Button>
          <h1 className="text-3xl font-bold text-foreground">Nova Transação</h1>
        </div>

        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Plus className="h-5 w-5" />
              <span>Adicionar Transação</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Amount and Type */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="amount">Valor *</Label>
                  <div className="relative">
                    <span className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground">
                      R$
                    </span>
                    <Input
                      id="amount"
                      type="number"
                      step="0.01"
                      placeholder="0,00"
                      value={formData.amount}
                      onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                      className="pl-12"
                      required
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <Label>Tipo *</Label>
                  <Select value={formData.type} onValueChange={(value: any) => setFormData({ ...formData, type: value, category: '' })}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="income">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-income"></div>
                          <span>Receita</span>
                        </div>
                      </SelectItem>
                      <SelectItem value="expense">
                        <div className="flex items-center space-x-2">
                          <div className="w-3 h-3 rounded-full bg-expense"></div>
                          <span>Despesa</span>
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Category */}
              <div className="space-y-2">
                <Label>Categoria *</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecione uma categoria" />
                  </SelectTrigger>
                  <SelectContent>
                    {TRANSACTION_CATEGORIES[formData.type].map((category) => (
                      <SelectItem key={category} value={category}>
                        {category}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Description */}
              <div className="space-y-2">
                <Label htmlFor="description">Descrição *</Label>
                <Textarea
                  id="description"
                  placeholder="Descreva a transação..."
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={3}
                  required
                />
              </div>

              {/* Date */}
              <div className="space-y-2">
                <Label>Data *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.date && "text-muted-foreground"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.date ? format(formData.date, "dd/MM/yyyy") : <span>Selecionar data</span>}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.date}
                      onSelect={(date) => date && setFormData({ ...formData, date })}
                      initialFocus
                      className="pointer-events-auto"
                    />
                  </PopoverContent>
                </Popover>
              </div>

              {/* Action Buttons */}
              <div className="flex space-x-4 pt-4">
                <Button 
                  type="submit" 
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Salvando...' : 'Salvar Transação'}
                </Button>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={resetForm}
                  className="flex-1"
                  disabled={isSubmitting}
                >
                  Limpar Formulário
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>

        {/* Quick Tips */}
        <Card className="shadow-card">
          <CardHeader>
            <CardTitle className="text-lg">Dicas Rápidas</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 text-sm text-muted-foreground">
              <p>• <span className="font-medium">Receitas</span> são valores que entram na sua conta (salário, vendas, etc.)</p>
              <p>• <span className="font-medium">Despesas</span> são valores que saem da sua conta (compras, contas, etc.)</p>
              <p>• Seja específico na descrição para facilitar o controle posterior</p>
              <p>• Categorize corretamente para ter relatórios mais precisos</p>
            </div>
          </CardContent>
        </Card>
      </div>
    </Layout>
  );
};

export default NewTransaction;