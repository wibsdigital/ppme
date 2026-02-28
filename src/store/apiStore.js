import { create } from 'zustand';
import { CONTRIBUTION_RATES } from '../utils/mockData';

const API_BASE = '/api';

const apiStore = create((set, get) => ({
  // Auth
  isAuthenticated: false,
  adminUser: null,
  
  login: async (username, password) => {
    try {
      console.log('Attempting login with:', username);
      const response = await fetch(`${API_BASE}/auth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      });
      
      console.log('Auth response status:', response.status);
      const data = await response.json();
      console.log('Auth response data:', data);
      
      if (response.ok && data.success) {
        set({ 
          isAuthenticated: true, 
          adminUser: data.user 
        });
        return true;
      }
      return false;
    } catch (error) {
      console.error('Login failed:', error);
      return false;
    }
  },
  
  logout: () => set({ isAuthenticated: false, adminUser: null }),

  // Members
  members: [],
  loading: false,
  
  fetchMembers: async () => {
    set({ loading: true });
    try {
      const response = await fetch(`${API_BASE}/members`);
      if (response.ok) {
        const members = await response.json();
        set({ members, loading: false });
      }
    } catch (error) {
      console.error('Failed to fetch members:', error);
      set({ loading: false });
    }
  },
  
  addMember: async (memberData) => {
    try {
      const response = await fetch(`${API_BASE}/members`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...memberData,
          contributietarief: CONTRIBUTION_RATES[memberData.burgerlijke_staat] || 10
        })
      });
      
      if (response.ok) {
        const newMember = await response.json();
        set(state => ({ members: [...state.members, newMember] }));
        
        // Generate current month payment for new member
        const now = new Date();
        await get().addPayment({
          member_id: newMember.id,
          month: now.getMonth() + 1,
          year: now.getFullYear(),
          amount_due: newMember.contributietarief,
          amount_paid: 0,
          status: 'Unpaid'
        });
        
        return newMember;
      }
    } catch (error) {
      console.error('Failed to add member:', error);
    }
  },

  updateMember: async (id, updates) => {
    try {
      const response = await fetch(`${API_BASE}/members/${id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...updates,
          contributietarief: CONTRIBUTION_RATES[updates.burgerlijke_staat] || 10
        })
      });
      
      if (response.ok) {
        const updatedMember = await response.json();
        set(state => ({
          members: state.members.map(m => m.id === id ? updatedMember : m)
        }));
      }
    } catch (error) {
      console.error('Failed to update member:', error);
    }
  },

  deleteMember: async (id) => {
    try {
      const response = await fetch(`${API_BASE}/members/${id}`, {
        method: 'DELETE'
      });
      
      if (response.ok) {
        set(state => ({
          members: state.members.filter(m => m.id !== id),
          payments: state.payments.filter(p => p.member_id !== id)
        }));
      }
    } catch (error) {
      console.error('Failed to delete member:', error);
    }
  },

  // Payments
  payments: [],
  
  fetchPayments: async () => {
    try {
      const response = await fetch(`${API_BASE}/payments`);
      if (response.ok) {
        const payments = await response.json();
        set({ payments });
      }
    } catch (error) {
      console.error('Failed to fetch payments:', error);
    }
  },
  
  addPayment: async (paymentData) => {
    try {
      const response = await fetch(`${API_BASE}/payments`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(paymentData)
      });
      
      if (response.ok) {
        const newPayment = await response.json();
        set(state => ({ payments: [...state.payments, newPayment] }));
      }
    } catch (error) {
      console.error('Failed to add payment:', error);
    }
  },

  updatePayment: async (paymentId, updates) => {
    try {
      const response = await fetch(`${API_BASE}/payments/${paymentId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      });
      
      if (response.ok) {
        const updatedPayment = await response.json();
        set(state => ({
          payments: state.payments.map(p => p.id === paymentId ? updatedPayment : p)
        }));
      }
    } catch (error) {
      console.error('Failed to update payment:', error);
    }
  },

  markAsPaid: async (memberId, month, year) => {
    const { payments, members } = get();
    const member = members.find(m => m.id === memberId);
    const existing = payments.find(p => p.member_id === memberId && p.month === month && p.year === year);

    if (existing) {
      await get().updatePayment(existing.id, {
        amount_paid: existing.amount_due,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: member?.betaal_methode || 'Bank Transfer',
        status: 'Paid',
      });
    } else {
      await get().addPayment({
        member_id: memberId,
        month,
        year,
        amount_due: member?.contributietarief || 10,
        amount_paid: member?.contributietarief || 10,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: member?.betaal_methode || 'Bank Transfer',
        status: 'Paid',
      });
    }
  },

  bulkMarkPaid: async (memberIds, month, year) => {
    for (const memberId of memberIds) {
      await get().markAsPaid(memberId, month, year);
    }
  },

  // UI state
  sidebarOpen: true,
  toggleSidebar: () => set(state => ({ sidebarOpen: !state.sidebarOpen })),
  currentPage: 'dashboard',
  setCurrentPage: (page) => set({ currentPage: page }),

  // Settings
  settings: {
    organizationName: 'PPME Al Ikhlash Amsterdam',
    contributionMarried: 20,
    contributionSingle: 10,
    currency: 'EUR',
    defaultPaymentMethod: 'Bank Transfer',
    language: 'nl',
  },
  updateSettings: (updates) => set(state => ({ settings: { ...state.settings, ...updates } })),
}));

export default apiStore;
