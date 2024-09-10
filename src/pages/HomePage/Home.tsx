import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import PostsList from './components/PostsList';
import NewPostCreator from './components/NewPostCreator';

const Container = styled.div`
  width: 100%;
`;

const Home: React.FC = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <nav
        style={{ display: 'flex', gap: '1rem', justifyContent: 'space-evenly' }}
      >
        <NewPostCreator />
        <Button onClick={() => navigate('/profile')}>my profile</Button>
      </nav>
      <PostsList />
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Home;
