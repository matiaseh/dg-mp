import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/HomePage/Home';
import PrivateRoute from './utils/PrivateRoute';
import styled from '@emotion/styled';
import { ChakraProvider } from '@chakra-ui/react';
import VerifyEmail from './components/VerifyEmail';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage';
import { AuthProvider } from './contexts/AuthContext';
import Profile from './pages/HomePage/Profile';
import { DiscProvider } from './contexts/DiscContext';
import Layout from './pages/HomePage/Layout';

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  align-items: center;
`;

const AppRoutes: React.FC = () => {
  return (
    <Container>
      <Routes>
        <Route path='/login' element={<LoginPage />} />
        <Route path='/verify/:token' element={<VerifyEmail />} />
        <Route path='/' element={<PrivateRoute />}>
          <Route element={<Layout />}>
            <Route path='' element={<Home />} />
            <Route path='profile' element={<Profile />} />
          </Route>
        </Route>
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
