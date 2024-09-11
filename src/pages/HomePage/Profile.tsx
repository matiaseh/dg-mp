import React from 'react';
import { useOutletContext } from 'react-router-dom';
import { LayoutContext } from './Home';
import PostsList from './components/PostsList';
import { Text } from '@chakra-ui/react';

const Profile: React.FC = () => {
  const { refreshKey } = useOutletContext<LayoutContext>();

  return (
    <div>
      <Text>My profile</Text>
      <PostsList showOwnPosts={true} refreshKey={refreshKey} />
    </div>
  );
};

export default Profile;
