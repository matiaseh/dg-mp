import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { API_BASE_URL } from '../constants/apiConstants';
import { RedirectLink } from '../pages/LoginPage/components/RegistrationForm';

const VerifyEmail = () => {
  const { token } = useParams<{ token: string }>(); // Get the token from the URL
  const [message, setMessage] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/user/verify/${token}`
        );
        setMessage(response.data);
      } catch (error: any) {
        setMessage(error.response?.data || 'Invalid token');
      }
    };

    verifyEmail();
  }, [token]);

  return (
    <div>
      <h1>Email Verification</h1>
      <div>
        {message && <p>{message}</p>}
        <RedirectLink
          onClick={() => {
            navigate('/');
          }}
        >
          Login here
        </RedirectLink>
      </div>
    </div>
  );
};

export default VerifyEmail;
