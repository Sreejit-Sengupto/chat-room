import { createContext, useState, useEffect, useContext } from "react";
import { account } from "../appwrite config/appwriteConfig";
import { useNavigate } from "react-router-dom";
import { Spinner, useToast } from "@chakra-ui/react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const toast = useToast();

  const [loading, setLoading] = useState(true); // State to show a loader when the app is loading (when the user data is not yet fetched).
  const [logoutSpinner, setLogoutSpinner] = useState(false); // To show a spinner when processing logout
  const [loginSpinner, setLoginSpinner] = useState(false); // To show a spinner when processing login
  const [updateSpinner, setUpdateSpinner] = useState(false); // To show a spinner when updating user details
  const [user, setUser] = useState(null); // State to store user information

  const navigate = useNavigate();

  // Get user information as soon as the app loads
  useEffect(() => {
    getUser();
  }, []);

  // Function to get user.
  const getUser = async () => {
    try {
      let user = await account.get();
      setUser(user);
    } catch (error) {
      console.log(error);
    }
    setLoading(false); // As soon as the user information is fetched, stop the loader
  };

  // Create login
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

  // Create logout
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

  // Update user information
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
        const response = await account.updateName(name);
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
        const response = await account.updateEmail(email, password);
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
        const response = await account.updatePassword(newPassword, password);
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
  //Update user information ends.

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
  };
  return (
    <AuthContext.Provider value={contextData}>
      {loading ? (
        <div className="h-[100dvh] lg:h-screen w-full flex flex-col justify-center items-center">
          <Spinner color="green.500" size={"xl"} />
        </div>
      ) : (
        children
      )}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};
export default AuthContext;
