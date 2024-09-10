import React, { ChangeEvent, useState } from 'react';
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
  NumberDecrementStepper,
  NumberIncrementStepper,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  useDisclosure,
} from '@chakra-ui/react';

interface DiscInfoState {
  title: string;
  plastic: string;
  flightNumbers: {
    speed: number;
    glide: number;
    stability: number;
    fade: number;
  };
}

const ImageUpload: React.FC = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [selectedFiles, setSelectedFiles] = useState<FileList | null>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const [state, setState] = useState<DiscInfoState>({
    title: '',
    plastic: '',
    flightNumbers: {
      speed: 0,
      glide: 0,
      stability: 0,
      fade: 0,
    },
  });

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { id, value } = e.target;
    if (id in state.flightNumbers) {
      const parsedValue = value === '' ? 0 : parseFloat(value);
      setState(prevState => ({
        ...prevState,
        flightNumbers: {
          ...prevState.flightNumbers,
          [id]: isNaN(parsedValue) ? 0 : parsedValue,
        },
      }));
    } else {
      setState(prevState => ({
        ...prevState,
        [id]: value,
      }));
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files) {
      setSelectedFiles(event.target.files);
    }
  };

  const handleUpload = async () => {
    const { title, plastic } = state;
    if (!title || !plastic || !selectedFiles || selectedFiles.length === 0) {
      setError('Please fill out all fields and select at least one image.');
      return;
    }
    setUploading(true);
    setError(null);

    const formData = new FormData();
    for (let i = 0; i < selectedFiles.length; i++) {
      formData.append('images', selectedFiles[i]);
    }

    formData.append('title', state.title);
    formData.append('plastic', state.plastic);
    formData.append('flightNumbers', JSON.stringify(state.flightNumbers));

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
      setError('Failed to upload files');
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
          <ModalHeader>Modal Title</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <FormControl>
              <FormLabel htmlFor='title'>Title</FormLabel>
              <Input
                type='text'
                id='title'
                value={state.title}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl>
              <FormLabel htmlFor='plastic'>Plastic</FormLabel>
              <Input
                type='text'
                id='plastic'
                value={state.plastic}
                onChange={handleChange}
              />
            </FormControl>

            <FormControl mb={4}>
              <FormLabel htmlFor='speed'>Speed</FormLabel>
              <NumberInput
                id='speed'
                value={state.flightNumbers.speed}
                onChange={valueString =>
                  setState(prevState => ({
                    ...prevState,
                    flightNumbers: {
                      ...prevState.flightNumbers,
                      speed: valueString === '' ? 0 : parseFloat(valueString),
                    },
                  }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel htmlFor='glide'>Glide</FormLabel>
              <NumberInput
                id='glide'
                value={state.flightNumbers.glide}
                onChange={valueString =>
                  setState(prevState => ({
                    ...prevState,
                    flightNumbers: {
                      ...prevState.flightNumbers,
                      glide: valueString === '' ? 0 : parseFloat(valueString),
                    },
                  }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel htmlFor='stability'>Stability</FormLabel>
              <NumberInput
                id='stability'
                value={state.flightNumbers.stability}
                onChange={valueString =>
                  setState(prevState => ({
                    ...prevState,
                    flightNumbers: {
                      ...prevState.flightNumbers,
                      stability:
                        valueString === '' ? 0 : parseFloat(valueString),
                    },
                  }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>

            <FormControl mb={4}>
              <FormLabel htmlFor='fade'>Fade</FormLabel>
              <NumberInput
                id='fade'
                value={state.flightNumbers.fade}
                onChange={valueString =>
                  setState(prevState => ({
                    ...prevState,
                    flightNumbers: {
                      ...prevState.flightNumbers,
                      fade: valueString === '' ? 0 : parseFloat(valueString),
                    },
                  }))
                }
              >
                <NumberInputField />
                <NumberInputStepper>
                  <NumberIncrementStepper />
                  <NumberDecrementStepper />
                </NumberInputStepper>
              </NumberInput>
            </FormControl>
            <input
              type='file'
              multiple
              accept='image/*'
              onChange={handleFileChange}
            />
            <button onClick={handleUpload} disabled={uploading}>
              {uploading ? 'Uploading...' : 'Upload Images'}
            </button>
            {error && <div>{error}</div>}
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
