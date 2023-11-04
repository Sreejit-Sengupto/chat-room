import React from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { useAuth } from "../utils/AuthContext";
import { Spinner } from "@chakra-ui/react";

function Form() {
  const { user, login, loginSpinner } = useAuth();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (user) {
      navigate("/");
    }
  }, []);

  const [searchParams, setSearchParams] = useSearchParams();
  const [input, setInput] = React.useState({
    email: "",
    password: "",
  });

  const message = searchParams.get("message");
  function handleChange(event) {
    const { name, value } = event.target;
    setInput(function (prevstate) {
      return {
        ...prevstate,
        [name]: value,
      };
    });
  }

  const handleLogin = async (e) => {
    login(e, input);
  };
  return (
    <>
      {message && <p>{message}</p>}
      <div className="flex flex-col mobile lg:h-screen justify-center items-center">
        <p className="text-white font-lexend text-xl mb-5">
          Welcome to Helping Group{" "}
          <span className="text-xs text-blue-400 font-mono ml-1 border border-blue-700 px-2 rounded-sm">
            on web
          </span>
        </p>
        <div className="w-[80%] lg:w-[50%] h-[300px] bg-[#c8e0c4] mx-auto p-6 flex flex-col justify-center items-center text-[#12240a] rounded-md font-lexend">
          <h1 className="text-3xl">Login</h1>
          <input
            value={input.email}
            type="email"
            name="email"
            id="email"
            className="p-2 mt-5 w-[90%] lg:w-[60%] rounded-md focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Enter your Email"
            onChange={handleChange}
          />
          <input
            value={input.password}
            type="password"
            name="password"
            id="password"
            className="my-2 p-2 w-[90%] lg:w-[60%] rounded-md focus:outline-none focus:ring focus:ring-green-300"
            placeholder="Enter your password"
            onChange={handleChange}
          />

          <button
            disabled={!input.email || !input.password}
            type="button"
            className="bg-[#1e712d] w-[50%] lg:w-[20%] p-2 rounded-md text-white hover:bg-green-800 disabled:hover:bg-[#1e712d]"
            onClick={handleLogin}
          >
            {loginSpinner ? <Spinner color="white.500" /> : "Login"}
          </button>
        </div>
      </div>
    </>
  );
}

export default Form;
