import React, { ReactNode, useState } from 'react';
import {
  Button,
  HStack,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay
} from '@chakra-ui/react';
import { FormattedMessage } from 'react-intl';
import { commonStrings } from '../utils/intl';

type Parameters = {
  header: ReactNode;
  body: ReactNode;
  onSubmit: () => Promise<any>;
  submitText?: ReactNode;
};

export const useConfirmationModal = ({
  header,
  body,
  onSubmit,
  submitText = <FormattedMessage {...commonStrings.submit} />
}: Parameters) => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const onClose = () => setIsOpen(false);
  const onOpen = () => setIsOpen(true);

  const wrappedSubmit = async () => {
    setIsLoading(true);
    await onSubmit();
    setIsLoading(false);
    onClose();
  };

  const ConfirmationModal = () => {
    return (
      <Modal onClose={onClose} isOpen={isOpen} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>{header}</ModalHeader>
          <ModalCloseButton />
          <ModalBody>{body}</ModalBody>
          <ModalFooter>
            <HStack>
              <Button onClick={onClose}>
                <FormattedMessage {...commonStrings.cancel} />
              </Button>
              <Button
                variant={'solid'}
                colorScheme="red"
                isLoading={isLoading}
                onClick={wrappedSubmit}
              >
                {submitText}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    );
  };

  return {
    onOpen,
    onClose,
    isLoading,
    ConfirmationModal
  };
};
