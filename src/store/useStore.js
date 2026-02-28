import { create } from 'zustand';
import { mockMembers, generateMockPayments, generateId, CONTRIBUTION_RATES } from '../utils/mockData';

const initialPayments = generateMockPayments(mockMembers);

const useStore = create((set, get) => ({
  // Auth
  isAuthenticated: false,
  adminUser: null,
  login: (username, password) => {
    if (username === 'admin' && password === 'ppme2024') {
      set({ isAuthenticated: true, adminUser: { username: 'admin', name: 'Administrator', role: 'Admin' } });
      return true;
    }
    if (username === 'penningmeester' && password === 'ppme2024') {
      set({ isAuthenticated: true, adminUser: { username: 'penningmeester', name: 'Penningmeester', role: 'Treasurer' } });
      return true;
    }
    return false;
  },
  logout: () => set({ isAuthenticated: false, adminUser: null }),

  // Members
  members: mockMembers,

  addMember: (memberData) => {
    const newMember = {
      ...memberData,
      id: generateId(),
      contributietarief: CONTRIBUTION_RATES[memberData.burgerlijke_staat] || 10,
      registratie_datum: new Date().toISOString().split('T')[0],
      status: 'Active',
    };
    set(state => ({ members: [...state.members, newMember] }));
    // Generate current month payment for new member
    const now = new Date();
    const newPayment = {
      id: generateId(),
      member_id: newMember.id,
      month: now.getMonth() + 1,
      year: now.getFullYear(),
      amount_due: newMember.contributietarief,
      amount_paid: 0,
      payment_date: null,
      payment_method: '',
      reference_note: '',
      status: 'Unpaid',
    };
    set(state => ({ payments: [...state.payments, newPayment] }));
    return newMember;
  },

  updateMember: (id, updates) => {
    set(state => ({
      members: state.members.map(m =>
        m.id === id
          ? { ...m, ...updates, contributietarief: CONTRIBUTION_RATES[updates.burgerlijke_staat || m.burgerlijke_staat] }
          : m
      )
    }));
  },

  deleteMember: (id) => {
    set(state => ({
      members: state.members.filter(m => m.id !== id),
      payments: state.payments.filter(p => p.member_id !== id),
    }));
  },

  // Payments
  payments: initialPayments,

  updatePayment: (paymentId, updates) => {
    set(state => ({
      payments: state.payments.map(p => {
        if (p.id !== paymentId) return p;
        const updated = { ...p, ...updates };
        // Recalculate status
        if (updated.amount_paid >= updated.amount_due) updated.status = 'Paid';
        else if (updated.amount_paid === 0) updated.status = 'Unpaid';
        else updated.status = 'Partial';
        return updated;
      })
    }));
  },

  markAsPaid: (memberId, month, year) => {
    const { payments, members } = get();
    const member = members.find(m => m.id === memberId);
    const existing = payments.find(p => p.member_id === memberId && p.month === month && p.year === year);

    if (existing) {
      get().updatePayment(existing.id, {
        amount_paid: existing.amount_due,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: member?.betaal_methode || 'Bank Transfer',
        status: 'Paid',
      });
    } else {
      const newPayment = {
        id: generateId(),
        member_id: memberId,
        month,
        year,
        amount_due: member?.contributietarief || 10,
        amount_paid: member?.contributietarief || 10,
        payment_date: new Date().toISOString().split('T')[0],
        payment_method: member?.betaal_methode || 'Bank Transfer',
        reference_note: '',
        status: 'Paid',
      };
      set(state => ({ payments: [...state.payments, newPayment] }));
    }
  },

  bulkMarkPaid: (memberIds, month, year) => {
    memberIds.forEach(mid => get().markAsPaid(mid, month, year));
  },

  addPayment: (paymentData) => {
    const newPayment = { id: generateId(), ...paymentData };
    if (newPayment.amount_paid >= newPayment.amount_due) newPayment.status = 'Paid';
    else if (newPayment.amount_paid === 0) newPayment.status = 'Unpaid';
    else newPayment.status = 'Partial';
    set(state => ({ payments: [...state.payments, newPayment] }));
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

export default useStore;
