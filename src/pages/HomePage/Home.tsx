import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import PostsList from './components/PostsList';
import { useAuth } from '../../contexts/AuthContext';

const Container = styled.div`
  margin-top: 2rem;
`;

const Home: React.FC = () => {
  const { isAuthenticated, logout } = useAuth();
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const redirectToLogin = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  useEffect(() => {
    if (!isAuthenticated) {
      redirectToLogin();
    } else {
      setLoading(false);
    }
  }, [isAuthenticated, redirectToLogin]);

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <Container>
      <h1>Home page content</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Home;
