import React from 'react';
import axios from 'axios';
import {
  ACCESS_TOKEN_NAME,
  API_BASE_URL,
} from '../../../constants/apiConstants';
import { useQuery } from '@tanstack/react-query';
import { SimpleGrid } from '@chakra-ui/react';
import { FlexColumn } from '../../../components/FlexBox';
import { Disc } from './NewPostCreator';
import ProductCard from './ProductCard';

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
}

const fetchPosts = async (onlyOwn?: boolean) => {
  const token = localStorage.getItem(ACCESS_TOKEN_NAME);

  const postsUrl = onlyOwn
    ? `${API_BASE_URL}/posts/me`
    : `${API_BASE_URL}/posts/`;

  const response = await axios.get(postsUrl, {
    headers: { Authorization: `Bearer ${token}` },
  });
  return response.data;
};

const PostsList: React.FC<PostListProps> = ({ showOwnPosts }) => {
  const {
    data: posts,
    error,
    isLoading,
  } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(showOwnPosts),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching posts: {error.message}</p>;

  return (
    <FlexColumn gap={2}>
      <h1>All Posts</h1>
      {!posts || posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <SimpleGrid columns={{ base: 1, sm: 2, md: 3, lg: 3 }} spacing={4}>
          {posts.map(post => (
            <ProductCard key={post._id} post={post} />
          ))}
        </SimpleGrid>
      )}
    </FlexColumn>
  );
};

export default PostsList;
