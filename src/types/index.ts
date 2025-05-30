
export interface Participant {
  id: string;
  name: string;
  cardNumber: string;
  qrCode: string;
  balance: number;
  initialBalance: number;
  createdAt: string;
  isActive: boolean;
  phone?: string; // Novo campo
}

export interface Transaction {
  id: string;
  participantId: string;
  type: 'credit' | 'debit';
  amount: number;
  description: string;
  booth?: string;
  timestamp: string;
  operatorName: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  booth: string;
  isActive: boolean;
  isFree?: boolean; // Add isFree property
}

export interface ClosingOption {
  participantId: string;
  option: 'refund' | 'gift' | 'donation';
  amount: number;
  cardReturned: boolean;
  depositRefunded: boolean;
  timestamp: string;
  notes?: string;
}

export interface Booth {
  id: string;
  name: string;
  isActive: boolean;
  totalSales: number;
}

export interface AppState {
  participants: Participant[];
  transactions: Transaction[];
  products: Product[];
  booths: Booth[];
  closingOptions: ClosingOption[];
  festivalActive: boolean;
}

// Tipos do Supabase
export interface SupabaseBooth {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface SupabaseProduct {
  id: string;
  name: string;
  description: string | null;
  price: number;
  booth_id: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}
