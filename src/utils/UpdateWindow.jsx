import React from "react";
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
} from "@chakra-ui/react";
import { FiEdit2 } from "react-icons/fi";

const UpdateWindow = ({ type, handleClick }) => {
  const { isOpen, onOpen, onClose } = useDisclosure();
  const [input, setInput] = React.useState({
    username: "",
    email: "",
    password: "",
    newPassword: "",
  });
  console.log(input);
  const handleChange = (event) => {
    const { name, value } = event.target;
    setInput((prevstate) => {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  };

  const setDefault = () => {
    setInput({
      username: "",
      email: "",
      password: "",
      newPassword: "",
    });
  };
  return (
    <>
      <>
        {type == "Password" ? (
          <Button
            onClick={onOpen}
            bg={"red.600"}
            textColor={"white"}
            _hover={{ bg: "red.500" }}
            margin={"auto"}
          >
            Change Password
          </Button>
        ) : (
          <Button
            onClick={onOpen}
            bg={"gray.600"}
            textColor={"white"}
            _hover={{ bg: "#0b0405" }}
            paddingX={"12px"}
            fontSize={"20px"}
            lineHeight={"28px"}
            height={"50px"}
            borderLeftRadius={"0px"}
            borderRightRadius={"8px"}
          >
            <FiEdit2 />
          </Button>
        )}
      </>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent width={"90%"}>
          <ModalHeader margin={"auto"}>Update {type}</ModalHeader>
          <ModalCloseButton color={"black"} onClick={setDefault} />
          <ModalBody
            width={"full"}
            display={"flex"}
            flexDirection={"column"}
            justifyContent={"center"}
            alignItems={"center"}
          >
            {type == "Username" && (
              <input
                value={input.username}
                name="username"
                onChange={handleChange}
                type="text"
                placeholder={`Enter your new ${type}`}
                className="p-4 border border-black rounded-xl w-[80%]"
              />
            )}
            {type == "Email" && (
              <>
                <input
                  value={input.email}
                  name="email"
                  onChange={handleChange}
                  type="email"
                  placeholder={`Enter your new ${type}`}
                  className="p-4 border border-black rounded-xl w-[80%] mt-2"
                />
                <input
                  value={input.password}
                  name="password"
                  onChange={handleChange}
                  type="password"
                  placeholder={`Enter password`}
                  className="p-4 border border-black rounded-xl w-[80%] mt-2"
                />
              </>
            )}
            {type == "Password" && (
              <>
                <input
                  value={input.password}
                  name="password"
                  onChange={handleChange}
                  type="password"
                  placeholder={`Enter your old password`}
                  className="p-4 border border-black rounded-xl w-[80%] mt-2"
                />
                <input
                  value={input.newPassword}
                  name="newPassword"
                  onChange={handleChange}
                  type="password"
                  placeholder={`Enter your new password`}
                  className="p-4 border border-black rounded-xl w-[80%] mt-2"
                />
              </>
            )}
          </ModalBody>

          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => {
                if (type == "Username") {
                  handleClick(input.username);
                }
                if (type == "Email") {
                  handleClick(input.email, input.password);
                }
                if (type == "Password") {
                  handleClick(input.password, input.newPassword);
                }
                setDefault();
                onClose();
              }}
              margin={"auto"}
            >
              Update
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default UpdateWindow;
