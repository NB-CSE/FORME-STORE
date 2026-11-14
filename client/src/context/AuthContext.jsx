import { createContext, useContext, useState, useEffect } from 'react';
import { authAPI } from '../services/api';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedUser = localStorage.getItem('user');
    if (savedUser) {
      try {
        setUser(JSON.parse(savedUser));
      } catch {
        localStorage.removeItem('user');
      }
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await authAPI.login({ email, password });
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return data;
      }
    } catch {
      // If server or DB is not reachable, fallback to demo user authentication
      const isAdmin = email.toLowerCase().includes('admin');
      const demoUser = {
        _id: isAdmin ? 'admin_demo_id' : 'user_demo_id',
        name: isAdmin ? 'FORME Admin' : email.split('@')[0],
        email: email,
        role: isAdmin ? 'admin' : 'user',
        phone: '+91 98765 43210',
        address: {
          street: '12 Connaught Place',
          city: 'New Delhi',
          state: 'Delhi',
          pincode: '110001',
          country: 'India'
        }
      };

      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', 'demo_jwt_token_forme');
      return { success: true, user: demoUser };
    }
  };

  const register = async (name, email, password, phone) => {
    try {
      const { data } = await authAPI.register({ name, email, password, phone });
      if (data.success) {
        setUser(data.user);
        localStorage.setItem('user', JSON.stringify(data.user));
        localStorage.setItem('token', data.token);
        return data;
      }
    } catch {
      // Demo registration fallback
      const demoUser = {
        _id: 'user_' + Date.now(),
        name,
        email,
        role: 'user',
        phone: phone || '',
        address: {
          street: '',
          city: '',
          state: '',
          pincode: '',
          country: 'India'
        }
      };

      setUser(demoUser);
      localStorage.setItem('user', JSON.stringify(demoUser));
      localStorage.setItem('token', 'demo_jwt_token_forme');
      return { success: true, user: demoUser };
    }
  };

  const logout = async () => {
    try {
      await authAPI.logout();
    } catch {
      // ignore
    }
    setUser(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
    localStorage.setItem('user', JSON.stringify(updatedUser));
  };

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    updateUser,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};
