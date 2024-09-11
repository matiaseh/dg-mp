import { Modal, ModalOverlay, ModalContent, Image } from '@chakra-ui/react';

const ImageOverlay: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  imageUrl: string;
}> = ({ isOpen, onClose, imageUrl }) => (
  <Modal isOpen={isOpen} onClose={onClose} size='xl'>
    <ModalOverlay />
    <ModalContent
      width='auto'
      overflow='hidden'
      display='flex'
      alignItems='center'
      justifyContent='center'
    >
      <Image
        src={imageUrl}
        alt='Large view'
        maxW='100vw'
        maxH='80vh'
        objectFit='contain'
        display='block'
      />
    </ModalContent>
  </Modal>
);

export default ImageOverlay;
