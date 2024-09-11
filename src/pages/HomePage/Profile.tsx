import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { LayoutContext } from './Home';
import PostsList from './components/PostsList';

const Profile: React.FC = () => {
  const { refreshKey } = useOutletContext<LayoutContext>();

  return <PostsList showOwnPosts={true} refreshKey={refreshKey} />;
};

export default Profile;
