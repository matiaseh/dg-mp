import axios from 'axios';
import React, {
  createContext,
  useContext,
  useState,
  ReactNode,
  useEffect,
  useCallback,
} from 'react';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../constants/apiConstants';

interface AuthContextType {
  isAuthenticated: boolean;
  loading: boolean;
  handleLogin: (token: string) => void;
  handleLogout: () => void;
  getAccessToken: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  const refreshAccessToken = async (): Promise<string | null> => {
    try {
      const response = await axios.post(
        `${API_BASE_URL}/user/refresh-token`,
        {},
        { withCredentials: true }
      );
      if (response.status === 200) {
        const { token } = response.data;
        localStorage.setItem(ACCESS_TOKEN_NAME, token);
        return token;
      }
    } catch (err) {
      setIsAuthenticated(false);
    }
    return null;
  };

  const getAccessToken = useCallback(async (): Promise<string | null> => {
    let token = localStorage.getItem(ACCESS_TOKEN_NAME);
    if (token) {
      const tokenExpiry = JSON.parse(atob(token.split('.')[1])).exp;
      const now = Math.floor(Date.now() / 1000);
      if (tokenExpiry < now) {
        token = await refreshAccessToken();
      }
    }
    return token;
  }, []);

  useEffect(() => {
    const verifyToken = async () => {
      const token = await getAccessToken();
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/users/me`, {
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
  }, [getAccessToken]);

  const handleLogin = (token: string) => {
    localStorage.setItem(ACCESS_TOKEN_NAME, token);
    setIsAuthenticated(true);
  };

  const handleLogout = async () => {
    await axios.post(
      `${API_BASE_URL}/user/logout`,
      {},
      { withCredentials: true }
    );

    localStorage.removeItem(ACCESS_TOKEN_NAME);
    setIsAuthenticated(false);
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        loading,
        handleLogin,
        handleLogout,
        getAccessToken,
      }}
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
