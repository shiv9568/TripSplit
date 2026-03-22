export interface Member {
  _id?: string;
  name: string;
  email?: string;
}

export interface Trip {
  _id: string;
  name: string;
  description?: string;
  members: Member[];
  budget?: number; // Optional trip budget in ₹
  categoryBudgets?: Record<string, number>;
  pendingMembers?: Member[];
  createdBy: string;
  inviteCode: string;
  createdAt: string;
  updatedAt: string;
}

export interface Expense {
  _id: string;
  tripId: string;
  title: string;
  amount: number;
  paidBy: string;
  splitBetween: string[];
  category: 'food' | 'petrol' | 'hotel' | 'tickets' | 'entertainment' | 'shopping' | 'travel' | 'other';
  receiptUrl?: string;
  date: string;
  createdAt: string;
}

export interface TripSummary {
  totalAmount: number;
  perPerson: number;
  memberCount: number;
  paidBy: Record<string, number>;
  spent: Record<string, number>;
  balances: Record<string, number>;
  settlements: { from: string; to: string; amount: number }[];
  categoryBreakdown: Record<string, { amount: number; count: number }>;
  expenseCount: number;
}
