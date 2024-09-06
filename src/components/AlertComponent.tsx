import React, { useState, useEffect, useCallback } from 'react';
import styled from '@emotion/styled';

interface AlertComponentProps {
  errorMessage: string | null;
  hideError: (message: string | null) => void;
}

const AlertMessage = styled.div`
  min-width: 200px;
  display: flex;
  justify-content: space-between;
`;

export const AlertComponent: React.FC<AlertComponentProps> = ({
  errorMessage,
  hideError,
}) => {
  const [modalDisplay, toggleDisplay] = useState<'none' | 'block'>('none');

  const openModal = useCallback(() => {
    toggleDisplay('block');
  }, []);

  const closeModal = useCallback(() => {
    toggleDisplay('none');
    hideError(null);
  }, [hideError]);

  useEffect(() => {
    if (errorMessage !== null) {
      openModal();
    } else {
      closeModal();
    }
  }, [errorMessage, openModal, closeModal]);

  return (
    <div role='alert' id='alertPopUp' style={{ display: modalDisplay }}>
      <AlertMessage>
        <span>{errorMessage}</span>
        <button type='button' aria-label='Close' onClick={closeModal}>
          <span aria-hidden='true'>&times;</span>
        </button>
      </AlertMessage>
    </div>
  );
};

export default AlertComponent;
