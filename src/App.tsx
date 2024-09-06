import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Header from './components/Header';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import Home from './components/Home';
import PrivateRoute from './utils/PrivateRoute';
import AlertComponent from './components/AlertComponent';
import styled from '@emotion/styled';
import { ChakraProvider } from '@chakra-ui/react';
import VerifyEmail from './components/VerifyEmail';
import './App.css';

const Container = styled.div`
  text-align: center;
  display: flex;
  flex-direction: column;
  min-height: 100vh;
`;

const Content = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  flex: 1;
`;

const App: React.FC = () => {
  const [title, updateTitle] = useState<string>();
  const [errorMessage, updateErrorMessage] = useState<string | null>(null);

  return (
    <ChakraProvider>
      <Router>
        <Container>
          <Header title={title} />
          <Content>
            <Routes>
              <Route
                path='/'
                element={
                  <LoginForm
                    showError={updateErrorMessage}
                    updateTitle={updateTitle}
                  />
                }
              />
              <Route
                path='/register'
                element={
                  <RegistrationForm
                    showError={updateErrorMessage}
                    updateTitle={updateTitle}
                  />
                }
              />
              <Route
                path='/login'
                element={
                  <LoginForm
                    showError={updateErrorMessage}
                    updateTitle={updateTitle}
                  />
                }
              />
              <Route
                path='/home'
                element={
                  <PrivateRoute>
                    <Home />
                  </PrivateRoute>
                }
              />
              <Route
                path='/verify/:token'
                element={<VerifyEmail updateTitle={updateTitle} />}
              />
            </Routes>
            <AlertComponent
              errorMessage={errorMessage}
              hideError={updateErrorMessage}
            />
          </Content>
        </Container>
      </Router>
    </ChakraProvider>
  );
};

export default App;
