import React, { useEffect, useState } from 'react';
import axios from 'axios';
import {
  ACCESS_TOKEN_NAME,
  API_BASE_URL,
} from '../../../constants/apiConstants';
import {
  Button,
  FormControl,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  useDisclosure,
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

const ImageUpload: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { discs } = useDiscs();

  const [search, setSearch] = useState<string>('');
  const [selectedDisc, setSelectedDisc] = useState<Disc | null>(null);
  const [filteredDiscs, setFilteredDiscs] = useState<Disc[]>([]);

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [uploadError, setUploadError] = useState<string | null>(null);

  useEffect(() => {
    if (discs) {
      if (search) {
        // Split the search into keywords and show suggested filtered discs
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

  const handleDiscSelect = (disc: Disc) => {
    setSelectedDisc(disc);
    setSearch('');
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
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
    <>
      <Button onClick={onOpen}>Upload</Button>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Disc Search</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor='discSearch'>Search Discs</FormLabel>
              <Input
                type='text'
                id='discSearch'
                value={search}
                onChange={e => setSearch(e.target.value)}
                placeholder='Search for discs...'
              />
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
            </FormControl>
            <h2>{selectedDisc?.name}</h2>
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
    </>
  );
};

export default ImageUpload;
