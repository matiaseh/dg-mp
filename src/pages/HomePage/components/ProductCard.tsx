import React from 'react';
import FlightNumberStack from './FlightNumberStack';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Divider,
  Heading,
  Stack,
  Text,
} from '@chakra-ui/react';
import Carousel from '../../../components/Carousel';
import { Post } from './PostsList';

interface ProductCardProps {
  post: Post;
}

const ProductCard: React.FC<ProductCardProps> = ({ post }) => {
  return (
    <Card maxW='sm' borderRadius='xl' overflow='hidden'>
      <CardBody p={0}>
        <Carousel images={post.images} />
        <Stack mt='6' spacing='3'>
          <Heading size='md'>{post.title}</Heading>
          <FlightNumberStack disc={post.disc} />
          {post.description && <Text>{post.description}</Text>}
          <Text color='blue.600' fontSize='2xl'>
            {post.price} €
          </Text>
        </Stack>
      </CardBody>
      <Divider color='gray' />
      <CardFooter>
        <Button variant='solid' colorScheme='blue'>
          Buy now
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ProductCard;
