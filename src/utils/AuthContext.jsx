/* eslint-disable react/prop-types */
import React from "react";
import { createContext, useState, useEffect, useContext } from "react";
import { account, avatars, database } from "../appwrite config/appwriteConfig";
import { Permission, Role } from "appwrite";
import { useNavigate } from "react-router-dom";
import { Spinner, useToast } from "@chakra-ui/react";
import { RiSignalWifiOffLine } from "react-icons/ri";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const toast = useToast();
  const [loading, setLoading] = useState(true);
  const [logoutSpinner, setLogoutSpinner] = useState(false);
  const [loginSpinner, setLoginSpinner] = useState(false);
  const [updateSpinner, setUpdateSpinner] = useState(false);
  const [deleteSpinner, setDeleteSpinner] = useState(false);
  const [messageUpdateSpinner, setMessageUpdateSpinner] = useState(false);
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    getUser();
  }, []);

  const getUser = async () => {
    try {
      let user = await account.get();
      setUser(user);
    } catch (error) {
      console.log(error);
    }
    setLoading(false);
  };

  const login = async (e, credentials) => {
    e.preventDefault();
    setLoginSpinner(true);
    try {
      let response = await account.createEmailSession(
        credentials.email,
        credentials.password
      );
      console.log(response);
      let userDetails = await account.get();
      setUser(userDetails);
      toast({
        title: "Signed in successfully!",
        position: "top-right",
        status: "success",
        isClosable: true,
      });
      navigate("/");
    } catch (error) {
      console.log(error);
      toast({
        title: "Login failed! Please try again.",
        position: "top-right",
        status: "error",
        isClosable: true,
      });
    }
    setLoginSpinner(false);
  };

  const logout = async () => {
    setLogoutSpinner(true);
    const response = await account.deleteSession("current");
    console.log(response);
    setUser(null);
    setLogoutSpinner(false);
    toast({
      title: "Logged out",
      position: "top-right",
      status: "success",
      isClosable: true,
    });
  };

  const updateUsername = async (name) => {
    if (name == user.name) {
      toast({
        title: "Username cannot be the same",
        position: "top-right",
        status: "warning",
        isClosable: true,
      });
    } else {
      setUpdateSpinner(true);
      try {
        await account.updateName(name);
        let updatedDetails = await account.get();
        setUser(updatedDetails);
        toast({
          title: "Username updated successfully",
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Failed",
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      }
      setUpdateSpinner(false);
    }
  };

  const updateEmail = async (email, password) => {
    if (email == user.email) {
      toast({
        title: "Email cannot be the same",
        position: "top-right",
        status: "warning",
        isClosable: true,
      });
    } else {
      setUpdateSpinner(true);
      try {
        await account.updateEmail(email, password);
        let updatedDetails = await account.get();
        setUser(updatedDetails);
        toast({
          title: "Email updated successfully",
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Failed",
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      }
      setUpdateSpinner(false);
    }
  };

  const updatePassword = async (password, newPassword) => {
    if (password == newPassword) {
      toast({
        title: "Old password and new password cannot be the same",
        position: "top-right",
        status: "warning",
        isClosable: true,
      });
    } else {
      setUpdateSpinner(true);
      try {
        await account.updatePassword(newPassword, password);
        let updatedDetails = await account.get();
        setUser(updatedDetails);
        toast({
          title: "Password updated successfully",
          position: "top-right",
          status: "success",
          isClosable: true,
        });
      } catch (error) {
        toast({
          title: "Failed",
          position: "top-right",
          status: "error",
          isClosable: true,
        });
      }
      setUpdateSpinner(false);
    }
  };

  // Function to delete message
  const deleteMessage = async (db_id, collection_id, id) => {
    setDeleteSpinner(true);
    await database.deleteDocument(db_id, collection_id, id);
    setDeleteSpinner(false);
  };

  // Function to update message
  const updateMessage = async (db_id, collection_id, id, newMessage) => {
    setMessageUpdateSpinner(true);
    const permissions = [Permission.write(Role.user(user.$id))];
    await database.updateDocument(
      db_id,
      collection_id,
      id,
      {
        message: newMessage,
      },
      permissions
    );
    setMessageUpdateSpinner(false);
  };

  const avatar = (username) => {
    return avatars.getInitials(username);
  };

  const contextData = {
    user,
    login,
    logout,
    logoutSpinner,
    loginSpinner,
    updateSpinner,
    updateUsername,
    updatePassword,
    updateEmail,
    deleteMessage,
    deleteSpinner,
    updateMessage,
    messageUpdateSpinner,
    avatar,
  };

  // Check for internet connection
  const [online, setOnline] = React.useState(true);
  React.useEffect(() => {
    setOnline(navigator.onLine);
  }, []);
  window.addEventListener("online", () => {
    setOnline(true);
  });
  window.addEventListener("offline", () => {
    setOnline(false);
  });
  return (
    <AuthContext.Provider value={contextData}>
      {online ? (
        loading ? (
          <div className="h-[100dvh] lg:h-screen w-full flex flex-col justify-center items-center">
            <Spinner color="green.500" size={"xl"} />
          </div>
        ) : (
          children
        )
      ) : (
        <div className="h-[100dvh] lg:h-screen w-full flex flex-col justify-center items-center text-white text-3xl font-lexend">
            <RiSignalWifiOffLine className="text-5xl text-red-600" />
            <p className="">
              You are <span className="text-red-500">Offline!</span>
            </p>{" "}
        </div>
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
