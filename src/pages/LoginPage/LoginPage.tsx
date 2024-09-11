import React, { useEffect, useState } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import './LoginPage.css';
import AlertComponent from '../../components/AlertComponent';
import { useAuth } from '../../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

const LoginPage: React.FC = () => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [errorMessage, updateErrorMessage] = useState<string | null>(null);

  // Redirect to home if already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      navigate('/');
    }
  }, [isAuthenticated, navigate]);

  const handleFlip = () => {
    setShowRegisterForm(!showRegisterForm);
  };

  return (
    <div className={`flip-container ${showRegisterForm ? 'flipped' : ''}`}>
      {errorMessage && (
        <AlertComponent
          errorMessage={errorMessage}
          updateErrorMessage={updateErrorMessage}
        />
      )}
      <div className='flip-inner'>
        <div className='flip-front'>
          <LoginForm showError={updateErrorMessage} flipCard={handleFlip} />
        </div>
        <div className='flip-back'>
          <RegistrationForm
            showError={updateErrorMessage}
            flipCard={handleFlip}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
