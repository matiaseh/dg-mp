import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import {
  ACCESS_TOKEN_NAME,
  API_BASE_URL,
} from '../../../constants/apiConstants';
import {
  Box,
  Button,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
  VStack,
} from '@chakra-ui/react';
import { useDiscs } from '../../../contexts/DiscContext';

export interface Disc {
  _id: string;
  manufacturer: string;
  name: string;
  speed: number;
  glide: number;
  turn: number;
  fade: number;
}

const ImageUploadModal: React.FC<{ isOpen: boolean; onClose: () => void }> = ({
  isOpen,
  onClose,
}) => {
  const { discs } = useDiscs();

  const [search, setSearch] = useState<string>('');
  const [selectedDisc, setSelectedDisc] = useState<Disc | null>(null);
  const [filteredDiscs, setFilteredDiscs] = useState<Disc[]>([]);
  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);
  const [suggestListOpen, setSuggestListOpen] = useState(false);

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

  const handleDiscSelect = (disc: Disc) => {
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

    const { name, speed, glide, turn, fade } = selectedDisc;
    formData.append('title', name);
    formData.append(
      'flightNumbers',
      JSON.stringify({ speed, glide, turn, fade })
    );

    try {
      const token = localStorage.getItem(ACCESS_TOKEN_NAME);
      await axios.post(`${API_BASE_URL}/posts/create`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
          Authorization: `Bearer ${token}`,
        },
      });
      alert('Files uploaded successfully');
    } catch (err) {
      setUploadError('Failed to upload files');
    } finally {
      setUploading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Disc Search</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
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
                    p={2}
                    bg='white'
                    borderRadius='md'
                    shadow='md'
                    zIndex={1}
                  >
                    <ul>
                      {filteredDiscs.map(disc => (
                        <li
                          key={disc._id}
                          style={{ cursor: 'pointer' }}
                          onClick={() => handleDiscSelect(disc)}
                        >
                          {disc.manufacturer} {disc.name}
                        </li>
                      ))}
                    </ul>
                  </Box>
                )}
              </Box>
            </VStack>
          )}
          <p>
            {selectedDisc?.manufacturer} {selectedDisc?.name}
          </p>
          <p>{selectedDisc?.speed}</p>
          <p>{selectedDisc?.glide}</p>
          <p>{selectedDisc?.turn}</p>
          <p>{selectedDisc?.fade}</p>
          <input
            type='file'
            multiple
            accept='image/*'
            onChange={handleFileChange}
          />
          {imagePreviews.length > 0 && (
            <div>
              {imagePreviews.map((preview, index) => (
                <img
                  key={index}
                  src={preview}
                  alt={`Preview ${index}`}
                  style={{
                    width: '100px',
                    height: '100px',
                    objectFit: 'cover',
                    marginRight: '8px',
                  }}
                />
              ))}
            </div>
          )}
          <button onClick={handleUpload} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload Images'}
          </button>
          {uploadError && <div>{uploadError}</div>}
        </ModalBody>

        <ModalFooter>
          <Button colorScheme='blue' mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  );
};

const NewPostCreator: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  return (
    <>
      <Button onClick={onOpen}>Upload</Button>
      {isOpen && <ImageUploadModal isOpen={isOpen} onClose={onClose} />}
    </>
  );
};

export default NewPostCreator;
