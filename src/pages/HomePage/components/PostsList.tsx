import React from 'react';
import axios from 'axios';
import styled from '@emotion/styled';
import {
  ACCESS_TOKEN_NAME,
  API_BASE_URL,
} from '../../../constants/apiConstants';
import { useQuery } from '@tanstack/react-query';

interface Post {
  _id: string;
  title: string;
  plastic: string;
  flightNumbers: {
    speed: number;
    glide: number;
    stability: number;
    fade: number;
  };
  images: string[];
  user: {
    _id: string;
    username: string;
  };
}

interface PostListProps {
  showOwn?: boolean;
}

const Container = styled.div`
  margin-top: 2rem;
`;

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

const PostsList: React.FC<PostListProps> = ({ showOwn }) => {
  const {
    data: posts,
    error,
    isLoading,
  } = useQuery<Post[], Error>({
    queryKey: ['posts'],
    queryFn: () => fetchPosts(showOwn),
  });

  if (isLoading) return <p>Loading...</p>;
  if (error) return <p>Error fetching posts: {error.message}</p>;

  return (
    <Container>
      <h1>All Posts</h1>
      {!posts || posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <ul>
          {posts.map(post => (
            <li key={post._id}>
              <h2>{post.title}</h2>
              <p>Plastic: {post.plastic}</p>
              <p>Flight Numbers:</p>
              <ul>
                <li>Speed: {post.flightNumbers.speed}</li>
                <li>Glide: {post.flightNumbers.glide}</li>
                <li>Stability: {post.flightNumbers.stability}</li>
                <li>Fade: {post.flightNumbers.fade}</li>
              </ul>
              <div>
                {post.images.map((image, index) => (
                  <img
                    key={index}
                    src={image}
                    alt={`Post Image ${index}`}
                    style={{ width: '100px', height: '100px' }}
                  />
                ))}
              </div>
            </li>
          ))}
        </ul>
      )}
    </Container>
  );
};

export default PostsList;
