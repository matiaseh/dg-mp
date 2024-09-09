import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import PostsList from '../HomePage/components/PostsList';
import { useAuthCheck } from '../../hooks/useAuthCheck';

const Container = styled.div`
  margin-top: 2rem;
`;

const Profile: React.FC = () => {
  const { isAuthenticated, loading } = useAuthCheck();
  const { handleLogout } = useAuth();

  const navigate = useNavigate();

  if (loading) {
    return <div>Loading...</div>;
  }
  if (!isAuthenticated) return <div>Redirecting to login...</div>; // Optionally show a message or a loading state

  return (
    <Container>
      <Button onClick={() => navigate('/home')}></Button>
      <PostsList showOwn={true} />
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Profile;
