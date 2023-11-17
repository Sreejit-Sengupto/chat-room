import React from "react";
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  Button,
  useDisclosure,
  Input,
} from "@chakra-ui/react";
import { AiFillEdit } from "react-icons/ai";
import { BsCheckLg } from "react-icons/bs";
import { useAuth } from "./AuthContext";

const UpdateMessage = ({ db_id, collection_id, id, message, setUpdateMessageId }) => {
  const [newMessage, setNewMessage] = React.useState(message);

  const handleChange = (event) => {
    setNewMessage(event.target.value);
  };

  const { isOpen, onOpen, onClose } = useDisclosure();
  const { updateMessage } = useAuth();
  return (
    <>
      <button
        onClick={() => {
          onOpen();
          setUpdateMessageId(id);
        }}
        className="text-gray-300 ml-auto w-4 text-lg bg-[#1b3012]"
      >
        <AiFillEdit />
      </button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent bg={"#0d1a21"} width={"90%"} margin={"auto"}>
          <ModalHeader></ModalHeader>
          {/* <ModalCloseButton color={"white"}/> */}
          <ModalBody
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {/* <Lorem count={2} /> */}
            <Input
              value={newMessage}
              onChange={handleChange}
              placeholder="Write your new message...."
              type="text"
              textColor={"white"}
            />
            <BsCheckLg
              className="text-3xl ml-2 text-green-500"
              onClick={() => {
                updateMessage(db_id, collection_id, id, newMessage);
                setNewMessage("");
                onClose();
              }}
              cursor={"pointer"}
            />
          </ModalBody>

          <ModalFooter>
            <Button colorScheme="blue" margin={"auto"} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateMessage;
