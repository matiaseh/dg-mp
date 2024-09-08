import React from 'react';
import {
  Alert,
  AlertDescription,
  AlertIcon,
  IconButton,
} from '@chakra-ui/react';
import { CloseIcon } from '@chakra-ui/icons';

interface AlertComponentProps {
  errorMessage: string | null;
  updateErrorMessage: (message: string | null) => void;
}

export const AlertComponent: React.FC<AlertComponentProps> = ({
  errorMessage,
  updateErrorMessage,
}) => {
  const closeErrorMessage = () => {
    updateErrorMessage(null);
  };
  return (
    <Alert status='error' style={{ position: 'absolute', zIndex: 1 }}>
      <AlertIcon />
      <AlertDescription>{errorMessage}</AlertDescription>
      <IconButton
        onClick={closeErrorMessage}
        isRound={true}
        size={'xs'}
        variant='ghost'
        colorScheme='black'
        aria-label='Close'
        ml={2}
        icon={<CloseIcon />}
      />
    </Alert>
  );
};

export default AlertComponent;
