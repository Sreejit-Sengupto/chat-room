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
import { AiOutlineStar } from "react-icons/ai";
import { AiFillGithub } from "react-icons/ai";
import { VscVerifiedFilled } from "react-icons/vsc";
import { useAuth } from "./AuthContext";
import UpdateWindow from "./UpdateWindow";
import { Link } from "react-router-dom";

const ProfileWindow = () => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const {
    user,
    updateUsername,
    updateEmail,
    updatePassword,
    updateSpinner,
    avatar,
  } = useAuth();
  const avt = avatar(user.name);
  return (
    <>
      <Button
        onClick={onOpen}
        bg={"#0b0405"}
        textColor={"white"}
        _hover={{ bg: "#0b0405" }}
      >
        <img src={avt} alt={avt} className="w-8 rounded-full" />
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
            <p className="text-black p-3 rounded-l-lg text-center bg-white w-[70%]">
              <span className="text-red-600">Username: </span> {user.name}
            </p>
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

          <ModalFooter
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            <UpdateWindow type={"Password"} handleClick={updatePassword} />
              <Link to={"https://github.com/Sreejit-Sengupto/chat-room"} target="_blank" className="flex justify-center items-center mt-2">
                <AiOutlineStar className="mr-1 text-lg"/> Star the project on GitHub <AiFillGithub className="ml-1 text-xl" />
              </Link>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default ProfileWindow;
