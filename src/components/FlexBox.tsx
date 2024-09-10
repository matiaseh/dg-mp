import { Box, BoxProps } from '@chakra-ui/react';
import { ReactNode } from 'react';

interface FlexProps extends BoxProps {
  children: ReactNode;
}

export const FlexRow: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Box
      display='flex'
      flexDirection='row'
      alignItems='center'
      justifyContent='center'
      {...props}
    >
      {children}
    </Box>
  );
};
export const FlexColumn: React.FC<FlexProps> = ({ children, ...props }) => {
  return (
    <Box
      display='flex'
      flexDirection='column'
      alignItems='center'
      justifyContent='center'
      {...props}
    >
      {children}
    </Box>
  );
};
