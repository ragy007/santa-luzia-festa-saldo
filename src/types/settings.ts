
export interface FestivalSettings {
  name: string;
  date: string;
  location: string;
  logoUrl?: string;
  phone?: string;
  title?: string;
  subtitle?: string;
  religiousMessage?: string;
  isActive: boolean;
  startTime: string;
  endTime: string;
  primaryIcon?: string;
  secondaryIcon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Add the Settings interface that SettingsContext expects
export interface Settings {
  name: string;
  location: string;
  logoUrl: string;
  primaryColor: string;
  secondaryColor: string;
  theme: string;
  date: string;
  startTime: string;
  endTime: string;
  isActive: boolean;
  phone?: string;
  title?: string;
  subtitle?: string;
  religiousMessage?: string;
  primaryIcon?: string;
  secondaryIcon?: string;
  colors: {
    primary: string;
    secondary: string;
    accent: string;
  };
}

// Update Booth interface to match the one in index.ts
export interface Booth {
  id: string;
  name: string;
  isActive: boolean;
  totalSales: number;
}

export interface UserAccount {
  id: string;
  email: string;
  password: string;
  name: string;
  role: 'admin' | 'operator';
  boothId?: string;
  isActive: boolean;
  createdAt: string;
}
