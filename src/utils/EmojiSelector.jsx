import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalBody,
} from "@chakra-ui/react";
import { FaFaceSmile } from "react-icons/fa6";
import EmojiPicker from "emoji-picker-react";

const EmojiSelector = ({ setMessage }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  return (
    <>
      <Button
        onClick={onOpen}
        bg={"transparent"}
        textColor={"white"}
        fontSize={"25px"}
        // marginLeft={"-20px"}
        // marginRight={"-4px"}
        _hover={{ bg: "transparent" }}
      >
        <FaFaceSmile />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"0b0405"}>
          <ModalBody margin={"auto"}>
            <EmojiPicker
              theme="dark"
              onEmojiClick={(emoji, onClick) => {
                onClick(setMessage((prevstate) => prevstate + emoji.emoji));
              }}
              autoFocusSearch={false}
              searchDisabled={true}
              emojiStyle="twitter"
              lazyLoadEmojis={true}
            />
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default EmojiSelector;
