import {
  useDisclosure,
  Button,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Spinner,
} from "@chakra-ui/react";
import { CgProfile } from "react-icons/cg";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useAuth } from "./AuthContext";
import UpdateWindow from "./UpdateWindow";

const ProfileWindow = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { user, updateUsername, updateEmail, updatePassword, updateSpinner } =
    useAuth();
  return (
    <>
      <Button
        onClick={onOpen}
        bg={"#0b0405"}
        textColor={"white"}
        _hover={{ bg: "#0b0405" }}
      >
        <CgProfile className="text-2xl mr-1 text-green-500" />
      </Button>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent
          bg={"#0d1a21"}
          width={"90%"}
          textColor={"gray.100"}
          fontFamily={"lexend"}
        >
          <ModalHeader
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <CgProfile className="text-2xl mr-1 text-green-500" />
            {user.name}{" "}
            {user.labels[0] == "verified" && (
              <VscVerifiedFilled className="text-[#1DCAFF] text-md mx-1" />
            )}{" "}
            {updateSpinner && <Spinner color="gray.500" marginLeft={"12px"} />}
          </ModalHeader>
          <ModalCloseButton color={"white"} />

          <ModalBody
            margin={"auto"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"full"}
          >
            {/* <Lorem count={2} /> */}
            <p className="text-black p-3 rounded-l-lg text-center bg-white w-[70%]">
              <span className="text-red-600">Username: </span> {user.name}
            </p>
            {/* <button className="bg-gray-700 px-3 py-4 text-xl rounded-r-lg"><FiEdit2 /></button> */}
            <UpdateWindow type={"Username"} handleClick={updateUsername} />
          </ModalBody>

          <ModalBody
            margin={"auto"}
            display={"flex"}
            justifyContent={"center"}
            alignItems={"center"}
            width={"full"}
          >
            <p className="text-black p-3 rounded-l-lg text-center bg-white min-w-[70%] overflow-x-auto">
              {user.email}
            </p>
            <UpdateWindow type={"Email"} handleClick={updateEmail} />
          </ModalBody>

          <ModalFooter>
            {/* <Button colorScheme="red" margin={"auto"} textColor={"white"} >
              Change password
            </Button> */}
            <UpdateWindow type={"Password"} handleClick={updatePassword} />
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileWindow;
