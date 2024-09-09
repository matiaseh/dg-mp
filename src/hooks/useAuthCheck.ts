import { useEffect, useState, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../constants/apiConstants';

export const useAuthCheck = () => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const redirectToLogin = useCallback(() => {
    navigate('/');
  }, [navigate]);

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem(ACCESS_TOKEN_NAME);
      if (token) {
        try {
          const response = await axios.get(`${API_BASE_URL}/user/me`, {
            headers: { token },
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

    checkAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated === false) {
      redirectToLogin();
    }
  }, [isAuthenticated, redirectToLogin]);

  return { isAuthenticated, loading };
};
