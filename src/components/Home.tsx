import React, { useEffect, useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { ACCESS_TOKEN_NAME, API_BASE_URL } from '../constants/apiConstants';
import styled from '@emotion/styled';
import { Button } from '@chakra-ui/react';

const Container = styled.div`
  margin-top: 2rem;
`;

const Home: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  const redirectToLogin = useCallback(() => {
    navigate('/');
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('login_access_token');
    navigate('/');
  };

  useEffect(() => {
    const token = localStorage.getItem(ACCESS_TOKEN_NAME);
    axios
      .get(`${API_BASE_URL}/user/me`, { headers: { token: token } })
      .then(response => {
        if (response.status !== 200) {
          redirectToLogin();
        }
      })
      .catch(() => {
        redirectToLogin();
      })
      .finally(() => {
        setLoading(false);
      });
  }, [redirectToLogin]);

  if (loading) {
    return <div>Loading...</div>; // Display loading indicator while data is being fetched
  }

  return (
    <Container>
      <h1>Home page content</h1>
      <Button onClick={handleLogout}>Logout</Button>
    </Container>
  );
};

export default Home;
