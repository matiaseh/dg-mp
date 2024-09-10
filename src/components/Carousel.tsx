import React, { useState } from 'react';
import { Box, Button, Image, IconButton, Flex } from '@chakra-ui/react';
import { ChevronLeftIcon, ChevronRightIcon } from '@chakra-ui/icons';

interface CarouselProps {
  images: string[];
}

const Carousel: React.FC<CarouselProps> = ({ images }) => {
  const [currentIndex, setCurrentIndex] = useState(0);

  const handlePrev = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === 0 ? images.length - 1 : prevIndex - 1
    );
  };

  const handleNext = () => {
    setCurrentIndex(prevIndex =>
      prevIndex === images.length - 1 ? 0 : prevIndex + 1
    );
  };

  const showPrev = currentIndex > 0;
  const showNext = currentIndex < images.length - 1;

  return (
    <Box position='relative' overflow='hidden' width='100%'>
      <IconButton
        aria-label='Previous slide'
        icon={<ChevronLeftIcon />}
        position='absolute'
        top='50%'
        left='10px'
        transform='translateY(-50%)'
        onClick={handlePrev}
        zIndex={1}
        opacity={0.6}
        display={showPrev ? 'flex' : 'none'}
        isRound={true}
      />
      <IconButton
        aria-label='Next slide'
        icon={<ChevronRightIcon />}
        position='absolute'
        top='50%'
        right='10px'
        transform='translateY(-50%)'
        onClick={handleNext}
        zIndex={1}
        opacity={0.6}
        display={showNext ? 'flex' : 'none'}
        isRound={true}
      />
      <Box>
        <Image
          src={images[currentIndex]}
          alt={`Image ${currentIndex + 1}`}
          width='100%'
          height='auto'
          objectFit='contain'
        />
      </Box>
      {images.length > 1 && (
        <Flex
          position='absolute'
          bottom='0'
          left='50%'
          transform='translateX(-50%)'
          mb={2}
          justifyContent='center'
        >
          {images.map((_, index) => (
            <Box
              key={index}
              width='10px'
              height='10px'
              borderRadius='full'
              bg={index === currentIndex ? 'blue.500' : 'gray.300'}
              mx='2px'
              transition='background-color 0.3s'
              opacity={0.9}
            />
          ))}
        </Flex>
      )}
    </Box>
  );
};

export default Carousel;
