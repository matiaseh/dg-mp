import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import PostsList from './components/PostsList';
import NewPostCreator from './components/NewPostCreator';

const Home: React.FC = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();

  return (
    <>
      <nav
        style={{
          position: 'sticky', // Make the navbar sticky
          top: '0', // Stick it to the top
          width: '100%',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000, // Ensure it is above other content
          padding: '0.5rem 0', // Add some padding for better appearance
        }}
      >
        <NewPostCreator />
        <Button size='sm' onClick={() => navigate('/profile')}>
          my profile
        </Button>
        <Button size='sm' onClick={handleLogout}>
          Logout
        </Button>
      </nav>
      <PostsList />
    </>
  );
};

export default Home;
