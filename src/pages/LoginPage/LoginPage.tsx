import React, { useState } from 'react';
import LoginForm from './components/LoginForm';
import RegistrationForm from './components/RegistrationForm';
import './LoginPage.css';
import AlertComponent from '../../components/AlertComponent';

const LoginPage: React.FC = () => {
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [errorMessage, updateErrorMessage] = useState<string | null>(null);

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
          <LoginForm showError={updateErrorMessage} onClick={handleFlip} />
        </div>
        <div className='flip-back'>
          <RegistrationForm
            showError={updateErrorMessage}
            onClick={handleFlip}
          />
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
