import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
  API_BASE_URL,
  ACCESS_TOKEN_NAME,
} from '../../../constants/apiConstants';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../../../utils/errorHandling';
import styled from '@emotion/styled';
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react';
import FormCard from './FormCard';
import { useAuth } from '../../../contexts/AuthContext';

interface LoginFormProps {
  showError: (message: string | null) => void;
  flipCard: () => void;
}

interface LoginFormState {
  email: string;
  password: string;
  successMessage: string | null;
}

export const Form = styled.form`
  min-height: 60vh;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  padding: 1rem;
`;

export const FormFooter = styled.div``;

export const FlipCard = styled.span`
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
`;

const LoginForm: React.FC<LoginFormProps> = ({ showError, flipCard }) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: '',
    successMessage: null,
  });

  const { login } = useAuth();
  const navigate = useNavigate();
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const handleSubmitClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);
    const payload = {
      email: state.email,
      password: state.password,
    };

    try {
      const response = await axios.post(`${API_BASE_URL}/user/login`, payload);
      if (response.status === 200) {
        const { token } = response.data;
        login();
        localStorage.setItem(ACCESS_TOKEN_NAME, token);

        setState(prevState => ({
          ...prevState,
          successMessage: 'Login successful. Redirecting to home page..',
        }));
        navigate('/home');
        showError(null);
      }
    } catch (error) {
      handleApiError(error, showError);
    } finally {
      setLoading(false);
    }
  };

  return (
    <FormCard>
      <Form onSubmit={handleSubmitClick}>
        <FormControl>
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
          <Button type='submit' colorScheme='blue' mt={4} isLoading={loading}>
            Login
          </Button>
        </FormControl>
        <div>
          <span>Don't have an account? </span>
          <FlipCard onClick={flipCard}>Register</FlipCard>
        </div>
      </Form>
    </FormCard>
  );
};

export default LoginForm;
