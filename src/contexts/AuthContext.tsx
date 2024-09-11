import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
} from 'react';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../constants/apiConstants';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const verifyToken = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_NAME);
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/user/me`, {
            headers: { Authorization: `Bearer ${token}` },
          });
          if (response.status === 200) {
            setIsAuthenticated(true);
          } else {
            setIsAuthenticated(false);
          }
        } catch {
          setIsAuthenticated(false);
        }
      } else {
        setIsAuthenticated(false);
      }
      setLoading(false);
    };

    verifyToken();
  }, []);

  const handleLogin = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_NAME, token);
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    localStorage.removeItem(ACCESS_TOKEN_NAME);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{ isAuthenticated, loading, handleLogin, handleLogout }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
