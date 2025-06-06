
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
