import { HStack, Box } from '@chakra-ui/react';
import { Disc } from './NewPostCreator';

interface FlightNumberStackProps {
  disc: Disc;
}

const boxStyles = {
  w: '40px',
  h: '40px',
  bg: 'gray.200',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
};

const FlightNumberStack: React.FC<FlightNumberStackProps> = ({ disc }) => {
  const values = [disc.speed, disc.glide, disc.turn, disc.fade];
  return (
    <HStack spacing='1px' justifyContent={'center'}>
      {values.map((value, index) => (
        <Box key={index} {...boxStyles}>
          {value}
        </Box>
      ))}
    </HStack>
  );
};

export default FlightNumberStack;
