import { createContext, useContext, useEffect, useState, type ReactNode } from 'react';
import { readStorage, writeStorage, removeStorage } from '@/lib/storage';

export type SubscriptionPlan = 'free' | 'pro_monthly' | 'pro_quarterly';

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  plan: SubscriptionPlan;
  dailyLimit: number;
  monthlyLimit: number;
  dailyUsed: number;
  monthlyUsed: number;
  joinedAt: number;
}

interface AuthContextValue {
  user: AuthUser | null;
  isAuthenticated: boolean;
  login: (email: string, name?: string) => void;
  logout: () => void;
  upgradePlan: (plan: SubscriptionPlan) => void;
}

const AUTH_STORAGE_KEY = 'auth_user';

const AuthContext = createContext<AuthContextValue | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    return readStorage<AuthUser | null>(AUTH_STORAGE_KEY, null);
  });

  useEffect(() => {
    if (user) {
      writeStorage(AUTH_STORAGE_KEY, user);
    } else {
      removeStorage(AUTH_STORAGE_KEY);
    }
  }, [user]);

  const login = (email: string, name?: string) => {
    const derivedName = name || email.split('@')[0] || 'Pengembang';
    const newUser: AuthUser = {
      id: `usr_${Math.random().toString(36).slice(2, 9)}`,
      name: derivedName,
      email,
      plan: 'free',
      dailyLimit: 1,
      monthlyLimit: 5,
      dailyUsed: 0,
      monthlyUsed: 0,
      joinedAt: Date.now(),
    };
    setUser(newUser);
  };

  const logout = () => {
    setUser(null);
  };

  const upgradePlan = (plan: SubscriptionPlan) => {
    if (!user) return;
    const isPro = plan === 'pro_monthly' || plan === 'pro_quarterly';
    const updatedUser: AuthUser = {
      ...user,
      plan,
      dailyLimit: isPro ? 999999 : 1,
      monthlyLimit: isPro ? 999999 : 5,
    };
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: Boolean(user),
        login,
        logout,
        upgradePlan,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextValue {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
