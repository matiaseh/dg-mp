import React, { useState, ChangeEvent, FormEvent } from 'react';
import axios from 'axios';
import {
  API_BASE_URL,
  ACCESS_TOKEN_NAME,
} from '../../../constants/apiConstants';
import { handleApiError } from '../../../utils/errorHandling';
import { Button, FormControl, FormLabel, Input } from '@chakra-ui/react';
import { FormFooter, FlipCard, Form } from './LoginForm';
import FormCard from './FormCard';

interface RegistrationFormProps {
  showError: (message: string | null) => void;
  flipCard: () => void;
}

interface RegistrationFormState {
  userEmail: string;
  userPassword: string;
  confirmUserPassword: string;
  userName: string;
}

const RegistrationForm: React.FC<RegistrationFormProps> = ({
  showError,
  flipCard,
}) => {
  const [state, setState] = useState<RegistrationFormState>({
    userEmail: '',
    userPassword: '',
    confirmUserPassword: '',
    userName: '',
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    setState(prevState => ({
      ...prevState,
      [id]: value,
    }));
  };

  const sendDetailsToServer = async () => {
    if (state.userEmail.length && state.userPassword.length) {
      showError(null);
      const payload = {
        email: state.userEmail,
        password: state.userPassword,
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
          flipCard();
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

  const handleSubmitClick = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (state.userPassword === state.confirmUserPassword) {
      await sendDetailsToServer();
    } else {
      showError('Passwords do not match');
    }
  };

  return (
    <FormCard>
      <Form onSubmit={handleSubmitClick}>
        <FormControl>
          <FormLabel htmlFor='userName'>User Name</FormLabel>
          <Input
            type='text'
            id='userName'
            placeholder='Add User Name'
            value={state.userName}
            onChange={handleChange}
          />
          <FormLabel htmlFor='userEmail'>Email address</FormLabel>
          <Input
            type='email'
            id='userEmail'
            placeholder='Enter email'
            value={state.userEmail}
            onChange={handleChange}
          />
          <FormLabel htmlFor='userPassword'>Password</FormLabel>
          <Input
            type='password'
            id='userPassword'
            placeholder='Password'
            value={state.userPassword}
            onChange={handleChange}
          />
          <FormLabel htmlFor='confirmUserPassword'>Confirm Password</FormLabel>
          <Input
            type='password'
            id='confirmUserPassword'
            placeholder='Confirm Password'
            value={state.confirmUserPassword}
            onChange={handleChange}
          />
          <Button type='submit' colorScheme='blue' isLoading={loading} mt={4}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </FormControl>
        <FormFooter>
          <span>Already have an account? </span>
          <FlipCard onClick={flipCard}>Log in</FlipCard>
        </FormFooter>
      </Form>
    </FormCard>
  );
};

export default RegistrationForm;
