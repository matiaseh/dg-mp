import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../constants/apiConstants';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../utils/errorHandling';
import styled from '@emotion/styled';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';

interface RegistrationFormProps {
  showError: (message: string | null) => void;
  updateTitle: (title: string) => void;
}

interface RegistrationFormState {
  email: string;
  password: string;
  confirmPassword: string;
  userName: string;
}

const Form = styled.form`
  min-height: 60vh;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

export const RedirectLink = styled.span`
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
`;

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  showError,
  updateTitle,
}) => {
  const [state, setState] = useState<RegistrationFormState>({
    email: '',
    password: '',
    confirmPassword: '',
    userName: '',
  });
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const sendDetailsToServer = async () => {
    if (state.email.length && state.password.length) {
      showError(null);
      const payload = {
        email: state.email,
        password: state.password,
        name: state.userName,
      };
      setLoading(true);
      try {
        const response = await axios.post(
          `${API_BASE_URL}/user/register`,
          payload
        );
        if (response.status === 200) {
          setState(prevState => ({
            ...prevState,
          }));
          localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
          redirectToHome();
          showError(null);
        } else {
          showError('Some error occurred');
        }
      } catch (error) {
        handleApiError(error, showError);
        console.error(error);
      } finally {
        setLoading(false);
      }
    } else {
      showError('Please enter a valid username and password');
    }
  };

  const redirectToHome = () => {
    updateTitle('Home');
    navigate('/home');
  };

  const redirectToLogin = () => {
    updateTitle('Login');
    navigate('/login');
  };

  const handleSubmitClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.password === state.confirmPassword) {
      await sendDetailsToServer();
    } else {
      showError('Passwords do not match');
    }
  };

  return (
    <>
      <Form onSubmit={handleSubmitClick}>
        <FormControl>
          <FormLabel>User Name</FormLabel>
          <Input
            type='text'
            id='userName'
            placeholder='Add User Name'
            value={state.userName}
            onChange={handleChange}
          />
          <FormLabel htmlFor='email'>Email address</FormLabel>
          <Input
            type='email'
            id='email'
            placeholder='Enter email'
            value={state.email}
            onChange={handleChange}
          />
          <FormLabel htmlFor='password'>Password</FormLabel>
          <Input
            type='password'
            id='password'
            placeholder='Password'
            value={state.password}
            onChange={handleChange}
          />
          <FormLabel htmlFor='confirmPassword'>Confirm Password</FormLabel>
          <Input
            type='password'
            id='confirmPassword'
            placeholder='Confirm Password'
            value={state.confirmPassword}
            onChange={handleChange}
          />
        </FormControl>
        <Button
          type='submit'
          colorScheme='blue'
          size={'lg'}
          isLoading={loading}
        >
          {loading ? 'Registering...' : 'Register'}
        </Button>
      </Form>
      <div>
        <span>Already have an account? </span>
        <RedirectLink onClick={redirectToLogin}>Login here</RedirectLink>
      </div>
    </>
  );
};

export default RegistrationForm;
