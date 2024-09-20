import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import { API_BASE_URL } from '../../../constants/apiConstants';
import {
  Box,
  Button,
  FormLabel,
  IconButton,
  Input,
  InputGroup,
  InputRightAddon,
  List,
  ListItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  NumberInput,
  NumberInputField,
  Text,
  Textarea,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useDiscs } from '../../../contexts/DiscContext';
import FlightNumberStack from './FlightNumberStack';
import { CloseIcon } from '@chakra-ui/icons';
import { FlexColumn, FlexRow } from '../../../components/FlexBox';
import Carousel from '../../../components/Carousel';
import { useAuth } from '../../../contexts/AuthContext';

export interface Disc {
  _id: string;
  manufacturer: string;
  name: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
}

const PostCreatorModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { discs } = useDiscs();
  const { getAccessToken } = useAuth();

  const [search, setSearch] = useState<string>('');
  const [selectedDisc, setSelectedDisc] = useState<Disc | null>(null);
  const [filteredDiscs, setFilteredDiscs] = useState<Disc[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [suggestListOpen, setSuggestListOpen] = useState(false);

  const [price, setPrice] = useState<string>('');
  const [description, setDescription] = useState<string>('');

  const inputRef = useRef<HTMLInputElement>(null);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (discs) {
      if (search) {
        const keywords = search.toLowerCase().split(' ').filter(Boolean);
        setFilteredDiscs(
          discs.filter(disc => {
            const discString =
              `${disc.manufacturer} ${disc.name}`.toLowerCase();
            return keywords.every(keyword => discString.includes(keyword));
          })
        );
      } else {
        setFilteredDiscs([]);
      }
    }
  }, [search, discs]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        inputRef.current &&
        !inputRef.current.contains(event.target as Node) &&
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setSuggestListOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputChange = (input: string) => {
    setSearch(input);
    setSuggestListOpen(true);
  };

  const handleFocusChange = () => {
    setSuggestListOpen(true);
  };

  const handleDiscSelect = (disc: Disc | null) => {
    setSelectedDisc(disc);
    setSearch('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      const files = Array.from(event.target.files);

      const newImagePreviews = files.map(file => {
        return URL.createObjectURL(file);
      });

      setSelectedFiles(event.target.files);
      setImagePreviews(newImagePreviews);

      return () => {
        newImagePreviews.forEach(url => URL.revokeObjectURL(url));
      };
    }
  };

  const handleUpload = async () => {
    if (!selectedDisc || !selectedFiles || selectedFiles.length === 0) {
      setUploadError('Please select a disc and add at least one image.');
      return;
    }
    setUploading(true);
    setUploadError(null);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    formData.append('title', selectedDisc.name);
    formData.append('discId', selectedDisc._id);
    formData.append('price', price);
    formData.append('description', description);

    try {
      const token = await getAccessToken();
      await axios.post(`${API_BASE_URL}/posts/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (err) {
      setUploadError('Failed to upload files');
    } finally {
      setUploading(false);
      onClose();
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Create a new post</ModalHeader>
        <ModalBody display={'flex'} flexDirection={'column'} gap={'1rem'}>
          {!selectedDisc && (
            <VStack align='start' spacing={4}>
              <Box width='100%' position='relative'>
                <Input
                  autoComplete='off'
                  ref={inputRef}
                  type='text'
                  id='discSearch'
                  value={search}
                  onChange={e => handleInputChange(e.target.value)}
                  placeholder='Search for discs...'
                  onFocus={handleFocusChange}
                />
                {suggestListOpen && search && (
                  <Box
                    ref={dropdownRef}
                    position='absolute'
                    top='100%'
                    left='0'
                    right='0'
                    bg='white'
                    borderRadius='md'
                    shadow='md'
                    zIndex={1}
                    overflowY='auto'
                    maxH='calc(100vh - 180px)'
                  >
                    <List>
                      {filteredDiscs.map(disc => (
                        <ListItem
                          _hover={{
                            bg: 'gray.100',
                            color: 'blue.500',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                          }}
                          p={2}
                          key={disc._id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDiscSelect(disc)}
                        >
                          {disc.manufacturer} {disc.name}
                        </ListItem>
                      ))}
                    </List>
                  </Box>
                )}
              </Box>
            </VStack>
          )}
          {selectedDisc && (
            <FlexColumn>
              <FlexRow>
                <Text fontSize='lg'>
                  {selectedDisc?.manufacturer} {selectedDisc?.name}
                </Text>
                <IconButton
                  onClick={() => setSelectedDisc(null)}
                  size={'xs'}
                  variant='ghost'
                  colorScheme='black'
                  aria-label='Close'
                  ml={2}
                  icon={<CloseIcon />}
                />
              </FlexRow>
              <FlightNumberStack disc={selectedDisc} />
            </FlexColumn>
          )}
          <Box>
            <FormLabel htmlFor='price'>Price</FormLabel>
            <InputGroup width='100%'>
              <NumberInput
                id='price'
                width='100%'
                value={price}
                onChange={value => setPrice(value)}
              >
                <NumberInputField />
              </NumberInput>
              <InputRightAddon children='€' />
            </InputGroup>
          </Box>
          <Box>
            <FormLabel htmlFor='desc'>Description</FormLabel>
            <Textarea
              id='desc'
              onChange={e => setDescription(e.target.value)}
            />
          </Box>
          <FlexColumn gap={2}>
            {imagePreviews.length > 0 && <Carousel images={imagePreviews} />}
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={handleFileChange}
            />
          </FlexColumn>
        </ModalBody>

        <ModalFooter gap={'1rem'}>
          <Button
            onClick={handleUpload}
            disabled={uploading}
            colorScheme='blue'
          >
            {uploading ? 'Uploading...' : 'Post'}
          </Button>
          <Button mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
        {uploadError && <div>{uploadError}</div>}
      </ModalContent>
    </Modal>
  );
};

const NewPostCreator: React.FC<{ onPostCreated: () => void }> = ({
  onPostCreated,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button size='sm' onClick={onOpen}>
        Upload
      </Button>
      {isOpen && (
        <PostCreatorModal
          isOpen={isOpen}
          onClose={() => {
            onClose();
            onPostCreated();
          }}
        />
      )}
    </>
  );
};

export default NewPostCreator;
