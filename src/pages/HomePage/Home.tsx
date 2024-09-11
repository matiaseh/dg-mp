import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@chakra-ui/react';
import { useAuth } from '../../contexts/AuthContext';
import PostsList from './components/PostsList';
import NewPostCreator from './components/NewPostCreator';

const Home: React.FC = () => {
  const { handleLogout } = useAuth();
  const navigate = useNavigate();
  const [refreshKey, setRefreshKey] = useState(0);

  // Trigger a refetch on new post created
  const handlePostCreated = () => {
    setRefreshKey(prev => prev + 1);
  };

  return (
    <>
      <nav
        style={{
          position: 'sticky',
          top: '0',
          width: '100%',
          display: 'flex',
          gap: '1rem',
          justifyContent: 'space-evenly',
          alignItems: 'center',
          backgroundColor: 'rgba(0, 0, 0, 0.6)',
          zIndex: 1000,
          padding: '0.5rem 0',
        }}
      >
        <NewPostCreator onPostCreated={handlePostCreated} />
        <Button size='sm' onClick={() => navigate('/profile')}>
          my profile
        </Button>
        <Button size='sm' onClick={handleLogout}>
          Logout
        </Button>
      </nav>
      <PostsList refreshKey={refreshKey} />
    </>
  );
};

export default Home;
