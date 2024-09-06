import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import { API_BASE_URL, ACCESS_TOKEN_NAME } from '../constants/apiConstants';
import { useNavigate } from 'react-router-dom';
import { handleApiError } from '../utils/errorHandling';
import styled from '@emotion/styled';
import { FormControl, FormLabel, Input, Button } from '@chakra-ui/react';

interface LoginFormProps {
  showError: (message: string | null) => void;
  updateTitle: (title: string) => void;
}

interface LoginFormState {
  email: string;
  password: string;
  successMessage: string | null;
}

const Form = styled.form`
  min-height: 60vh;
  max-width: 400px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
`;

const RegisterMessage = styled.div`
  margin-top: 10vh;
`;

const RegisterLink = styled.span`
  color: #007bff;
  font-weight: bold;
  cursor: pointer;
`;

const LoginForm: React.FC<LoginFormProps> = ({ showError, updateTitle }) => {
  const [loading, setLoading] = useState(false);
  const [state, setState] = useState<LoginFormState>({
    email: '',
    password: '',
    successMessage: null,
  });

  const navigate = useNavigate();
  console.log(API_BASE_URL);
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
        setState(prevState => ({
          ...prevState,
          successMessage: 'Login successful. Redirecting to home page..',
        }));
        localStorage.setItem(ACCESS_TOKEN_NAME, response.data.token);
        redirectToHome();
        showError(null);
      }
    } catch (error) {
      handleApiError(error, showError);
    } finally {
      setLoading(false);
    }
  };

  const redirectToHome = () => {
    updateTitle('Home');
    navigate('/home');
  };

  const redirectToRegister = () => {
    navigate('/register');
    updateTitle('Register');
  };

  return (
    <Form onSubmit={handleSubmitClick}>
      <FormControl>
        <FormLabel mt={4}>Email address</FormLabel>
        <Input
          type='email'
          id='email'
          placeholder='Enter email'
          value={state.email}
          onChange={handleChange}
        />
        <FormLabel mt={4}>Password</FormLabel>
        <Input
          type='password'
          id='password'
          placeholder='Password'
          value={state.password}
          onChange={handleChange}
        />
      </FormControl>
      <Button type='submit' colorScheme='blue' size={'lg'} isLoading={loading}>
        Login
      </Button>
      <RegisterMessage>
        <span>Don't have an account? </span>
        <RegisterLink onClick={redirectToRegister}>Register</RegisterLink>
      </RegisterMessage>
    </Form>
  );
};

export default LoginForm;
