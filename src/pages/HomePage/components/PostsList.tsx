import React, { useEffect } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../constants/apiConstants';
import { useQuery } from '@tanstack/react-query';
import { SimpleGrid } from '@chakra-ui/react';
import { Disc } from './NewPostCreator';
import ProductCard from './ProductCard';
import { useAuth } from '../../../contexts/AuthContext';

export interface Post {
  _id: string;
  title: string;
  disc: Disc;
  price: string;
  description?: string;
  images: string[];
  user: {
    _id: string;
    username: string;
  };
}

interface PostListProps {
  showOwnPosts?: boolean;
  refreshKey?: any;
}

const fetchPosts = async (
  getAccessToken: () => Promise<string | null>,
  onlyOwn?: boolean
) => {
  const token = await getAccessToken();

  const postsUrl = onlyOwn
    ? `${API_BASE_URL}/posts/me`
    : `${API_BASE_URL}/posts`;

  const response = await axios.get(postsUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const PostsList: React.FC<PostListProps> = ({ showOwnPosts, refreshKey }) => {
  const { getAccessToken } = useAuth();
  const {
    data: posts,
    error,
    isLoading,
    refetch,
  } = useQuery<Post[], Error>({
    queryKey: ['posts', showOwnPosts],
    queryFn: () => fetchPosts(getAccessToken, showOwnPosts),
    staleTime: 60000,
    refetchOnWindowFocus: false,
  });

  useEffect(() => {
    refetch();
  }, [refreshKey, refetch]);

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching posts: {error.message}</p>;

  return (
    <SimpleGrid
      margin={4}
      columns={{ base: 1, sm: 2, md: 3, lg: 3 }}
      spacing={4}
    >
      {!posts || posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        posts.map(post => <ProductCard key={post._id} post={post} />)
      )}
    </SimpleGrid>
  );
};

export default PostsList;
