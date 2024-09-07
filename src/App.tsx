import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/Home';
import PrivateRoute from './utils/PrivateRoute';
import AlertComponent from './components/AlertComponent';
import styled from '@emotion/styled';
import { ChakraProvider } from '@chakra-ui/react';
import VerifyEmail from './components/VerifyEmail';
import './App.css';
import LoginPage from './pages/LoginPage/LoginPage';

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const App: React.FC = () => {
  return (
    <ChakraProvider>
      <Router>
        <Container>
          <Routes>
            <Route path='/' element={<LoginPage />} />
            <Route
              path='/home'
              element={
                <PrivateRoute>
                  <Home />
                </PrivateRoute>
              }
            />
            <Route path='/verify/:token' element={<VerifyEmail />} />
          </Routes>
        </Container>
      </Router>
    </ChakraProvider>
  );
};

export default App;
