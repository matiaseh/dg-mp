import React, {
  createContext,
  useContext,
  useEffect,
  useState,
  ReactNode,
} from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConstants';
import { Disc } from '../pages/HomePage/components/NewPostCreator';

interface DiscContextType {
  discs: Disc[] | null;
  loading: boolean;
  error: string | null;
}

const DiscContext = createContext<DiscContextType | undefined>(undefined);

export const DiscProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [discs, setDiscs] = useState<Disc[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDiscs = async () => {
      try {
        const response = await axios.get(`${API_BASE_URL}/discs`);
        setDiscs(response.data);
      } catch (err) {
        setError('Failed to fetch disc data');
      } finally {
        setLoading(false);
      }
    };

    fetchDiscs();
  }, []);

  return (
    <DiscContext.Provider value={{ discs, loading, error }}>
      {children}
    </DiscContext.Provider>
  );
};

export const useDiscs = () => {
  const context = useContext(DiscContext);
  if (context === undefined) {
    throw new Error('useDiscs must be used within a DiscProvider');
  }
  return context;
};
