import React from 'react';
import { useNavigate } from 'react-router-dom';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import PostsList from '../HomePage/components/PostsList';

const Container = styled.div`
  margin-top: 2rem;
`;

const Profile: React.FC = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <Container>
      <Button onClick={() => navigate('/home')}></Button>
      <PostsList showOwnPosts={true} />
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Profile;
