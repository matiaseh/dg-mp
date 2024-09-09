import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import { useAuthCheck } from '../../hooks/useAuthCheck';
import PostsList from './components/PostsList';
import ImageUpload from './components/ImageUploader';

const Container = styled.div`
  width: 100%;
`;

const Home: React.FC = () => {
  const { isAuthenticated, loading } = useAuthCheck();
  const { handleLogout } = useAuth();

  const navigate = useNavigate();
  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) return <div>Redirecting to login...</div>; // Optionally show a message or a loading state

  return (
    <Container>
      <nav
        style={{ display: 'flex', gap: '1rem', justifyContent: 'space-evenly' }}
      >
        <ImageUpload />
        <Button onClick={() => navigate('/profile')}>my profile</Button>
      </nav>
      <PostsList />
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Home;
