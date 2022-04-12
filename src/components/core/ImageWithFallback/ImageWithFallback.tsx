import React, { useEffect, useState } from 'react';
import { Center, ChakraComponent, Text } from '@chakra-ui/react';
import Image from 'next/image';

const fallbackUrl = '/image-not-found.webp';

type Props = ChakraComponent<'div', { imgUrl?: string; imgAlt?: string }>;
const ImageWithFallback: Props = ({ imgUrl, imgAlt = '', ...props }) => {
  const [url, setUrl] = useState<string | undefined>(imgUrl);

  useEffect(() => {
    setUrl(imgUrl);
  }, [imgUrl]);
  const onError = () => setUrl(fallbackUrl);

  return url ? (
    <Center bg="gray.200" {...props}>
      <Image
        alt={imgAlt}
        src={url}
        layout="fill"
        objectFit="cover"
        onError={onError}
      />
    </Center>
  ) : (
    <Center bg="gray.200" {...props}>
      <Text color="gray.500">No Image</Text>
    </Center>
  );
};
export default ImageWithFallback;
