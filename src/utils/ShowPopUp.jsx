import React from 'react';
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Text,
} from '@chakra-ui/react';

import { BsThreeDotsVertical } from 'react-icons/bs';
import { GoSignIn } from 'react-icons/go';

const ShowPopUp = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();

  const [show, setShow] = React.useState(true);

  const popup = () => {
    if (show) {
      onOpen();
    }
  };

  React.useEffect(() => {
    popup();
  }, []);

  return (
    <>
      {setTimeout(() => {
        onOpen();
      }, 3600000)}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          width={'90%'}
          margin={'auto'}
          bg={'#0d1a21'}
          textColor={'#f2dee1'}
          fontFamily={'lexend'}
        >
          <ModalHeader textColor={'yellow.400'} margin={'auto'}>
            Add to Home Screen
          </ModalHeader>
          <ModalCloseButton onClick={() => setShow(false)} />
          <ModalBody textAlign={'center'}>
            {/* Now you can add the app to your homescreen. Head over to browser menu and click add to homescreen. */}
            <Text textColor={'green.200'}>
              For a better experience add the App to your Homescreen
            </Text>
            <Text
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
              marginTop={'12px'}
            >
              1. Head over to Browser Menu <BsThreeDotsVertical />
            </Text>
            <Text
              display={'flex'}
              justifyContent={'center'}
              alignItems={'center'}
            >
              2. Click Add to Homescreen <GoSignIn className="ml-2" />
            </Text>
          </ModalBody>

          <ModalFooter></ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ShowPopUp;
