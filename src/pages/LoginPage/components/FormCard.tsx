import { Box } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface StyledBoxProps {
  children: ReactNode;
}

const FormCard = ({ children }: StyledBoxProps) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      gap={4}
      p={4}
      borderWidth={1}
      borderRadius='md'
      bg='rgba(255, 255, 255, 0.2)'
      boxShadow='0 4px 30px rgba(0, 0, 0, 0.1)'
      backdropFilter='blur(5px)'
    >
      {children}
    </Box>
  );
};

export default FormCard;
