import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PostsList from './components/PostsList';
import { Text } from '@chakra-ui/react';

export interface LayoutContext {
  refreshKey: number;
}

const Home: React.FC = () => {
  const { refreshKey } = useOutletContext<LayoutContext>();

  return (
    <div>
      <Text>Home</Text>
      <PostsList refreshKey={refreshKey} />
    </div>
  );
};

export default Home;
