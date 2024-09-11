import React from 'react';
import { useOutletContext } from 'react-router-dom';
import PostsList from './components/PostsList';

export interface LayoutContext {
  refreshKey: number;
}

const Home: React.FC = () => {
  const { refreshKey } = useOutletContext<LayoutContext>();

  return <PostsList refreshKey={refreshKey} />;
};

export default Home;
