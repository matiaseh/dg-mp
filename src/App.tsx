import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home';
import PrivateRoute from './utils/PrivateRoute';
import styled from '@emotion/styled';
import { ChakraProvider } from '@chakra-ui/react';
import VerifyEmail from './components/VerifyEmail';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Profile from './pages/MyProfile/MyProfilePage';
import { DiscProvider } from './contexts/DiscContext';

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
`;

const AppRoutes: React.FC = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Container>
      <Routes>
        <Route path='/' element={isAuthenticated ? <Home /> : <LoginPage />} />
        <Route element={<PrivateRoute />}>
          <Route path='profile' element={<Profile />} />
        </Route>
        <Route path='/verify/:token' element={<VerifyEmail />} />
      </Routes>
    </Container>
  );
};

const App: React.FC = () => (
  <ChakraProvider>
    <Router>
      <AuthProvider>
        <DiscProvider>
          <AppRoutes />
        </DiscProvider>
      </AuthProvider>
    </Router>
  </ChakraProvider>
);

export default App;
