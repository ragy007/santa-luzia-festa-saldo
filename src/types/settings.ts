
export interface FestivalSettings {
  name: string;
  date: string;
  location: string;
  logoUrl?: string;
  phone?: string;
  title?: string;
  subtitle?: string;
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
