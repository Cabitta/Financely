import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import 'react-native-get-random-values';

const generateId = () => Math.random().toString(36).substring(2, 9);

const INITIAL_MEMBERS = [
  { id: 'm1', name: 'Papá', avatar: '👨', color: '#3B82F6' },
  { id: 'm2', name: 'Mamá', avatar: '👩', color: '#EC4899' },
  { id: 'm3', name: 'Hijo 1', avatar: '👦', color: '#10B981' },
];

const INITIAL_CATEGORIES = [
  { id: 'c1', name: 'Supermercado', icon: '🛒', type: 'EXPENSE', budgetLimit: 600, color: '#F59E0B' },
  { id: 'c2', name: 'Servicios', icon: '⚡', type: 'EXPENSE', budgetLimit: 300, color: '#6366F1' },
  { id: 'c3', name: 'Salidas y Ocio', icon: '🍕', type: 'EXPENSE', budgetLimit: 250, color: '#EC4899' },
  { id: 'c4', name: 'Transporte', icon: '🚗', type: 'EXPENSE', budgetLimit: 200, color: '#8B5CF6' },
  { id: 'c5', name: 'Salario', icon: '💰', type: 'INCOME', budgetLimit: 0, color: '#10B981' },
  { id: 'c6', name: 'Otros', icon: '📦', type: 'EXPENSE', budgetLimit: 150, color: '#6B7280' },
];

const INITIAL_TRANSACTIONS = [
  {
    id: 't1',
    amount: 3200,
    type: 'INCOME',
    categoryId: 'c5',
    memberId: 'm1',
    note: 'Sueldo mensual',
    date: new Date(Date.now() - 86400000 * 2).toISOString(),
  },
  {
    id: 't2',
    amount: 145.80,
    type: 'EXPENSE',
    categoryId: 'c1',
    memberId: 'm1',
    note: 'Compra semanal de víveres',
    date: new Date(Date.now() - 86400000 * 1).toISOString(),
  },
  {
    id: 't3',
    amount: 85.00,
    type: 'EXPENSE',
    categoryId: 'c2',
    memberId: 'm2',
    note: 'Luz y Agua',
    date: new Date().toISOString(),
  },
  {
    id: 't4',
    amount: 42.50,
    type: 'EXPENSE',
    categoryId: 'c3',
    memberId: 'm3',
    note: 'Cine con amigos',
    date: new Date().toISOString(),
  },
];

export const useStore = create(
  persist(
    (set, get) => ({
      members: INITIAL_MEMBERS,
      categories: INITIAL_CATEGORIES,
      transactions: INITIAL_TRANSACTIONS,

      // --- Acciones de Transacciones ---
      addTransaction: (amount, type, categoryId, memberId, note = '') => set((state) => ({
        transactions: [
          {
            id: generateId(),
            amount: Number(amount),
            type,
            categoryId,
            memberId,
            note: note.trim(),
            date: new Date().toISOString()
          },
          ...state.transactions
        ]
      })),

      deleteTransaction: (id) => set((state) => ({
        transactions: state.transactions.filter(t => t.id !== id)
      })),

      // --- Acciones de Integrantes ---
      addMember: (name, avatar = '👤', color = '#3B82F6') => set((state) => ({
        members: [...state.members, { id: generateId(), name: name.trim(), avatar, color }]
      })),

      deleteMember: (id) => set((state) => {
        if (state.members.length <= 1) return state; // Mantener al menos un integrante
        return {
          members: state.members.filter(m => m.id !== id),
          transactions: state.transactions.filter(t => t.memberId !== id)
        };
      }),

      // --- Acciones de Categorías y Presupuestos ---
      updateCategoryBudget: (categoryId, newLimit) => set((state) => ({
        categories: state.categories.map(c => 
          c.id === categoryId ? { ...c, budgetLimit: Number(newLimit) } : c
        )
      })),

      addCategory: (name, icon = '🏷️', type = 'EXPENSE', budgetLimit = 100, color = '#3B82F6') => set((state) => ({
        categories: [...state.categories, { id: generateId(), name: name.trim(), icon, type, budgetLimit: Number(budgetLimit), color }]
      })),

      // --- Selectores y Métricas ---
      getTotalIncome: () => {
        const { transactions } = get();
        return transactions
          .filter(t => t.type === 'INCOME')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getTotalExpenses: () => {
        const { transactions } = get();
        return transactions
          .filter(t => t.type === 'EXPENSE')
          .reduce((sum, t) => sum + t.amount, 0);
      },

      getBalance: () => {
        const income = get().getTotalIncome();
        const expenses = get().getTotalExpenses();
        return income - expenses;
      },

      // Gastos por Integrante
      getExpensesByMember: () => {
        const { transactions, members } = get();
        const totalExpenses = get().getTotalExpenses() || 1; // Evitar división por cero

        return members.map(m => {
          const spent = transactions
            .filter(t => t.type === 'EXPENSE' && t.memberId === m.id)
            .reduce((sum, t) => sum + t.amount, 0);
          
          return {
            ...m,
            spent,
            percentage: Math.min(Math.round((spent / totalExpenses) * 100), 100)
          };
        }).sort((a, b) => b.spent - a.spent);
      },

      // Presupuesto y Gastos por Categoría
      getCategoryBudgetStatus: () => {
        const { transactions, categories } = get();

        return categories
          .filter(c => c.type === 'EXPENSE')
          .map(c => {
            const spent = transactions
              .filter(t => t.type === 'EXPENSE' && t.categoryId === c.id)
              .reduce((sum, t) => sum + t.amount, 0);
            
            const limit = c.budgetLimit || 0;
            const percentage = limit > 0 ? Math.round((spent / limit) * 100) : 0;
            
            let status = 'normal'; // green
            if (percentage >= 100) status = 'exceeded'; // red
            else if (percentage >= 80) status = 'warning'; // yellow

            return {
              ...c,
              spent,
              percentage,
              status
            };
          });
      }
    }),
    {
      name: 'financely-storage-v2',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
