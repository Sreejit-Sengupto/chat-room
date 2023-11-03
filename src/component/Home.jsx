import React, { useRef } from "react";

// Appwrite
import client, { database } from "../appwrite config/appwriteConfig";
import { Query, Permission, Role, ID } from "appwrite";

// From utils directory
import { useAuth } from "../utils/AuthContext";
import ProfileWindow from "../utils/ProfileWindow";
import TypingIndicator from "../utils/TypingIndicator";

// React Icons
import { FiLogOut } from "react-icons/fi";
import { VscVerifiedFilled } from "react-icons/vsc";

// ChakraUI components
import { Spinner } from "@chakra-ui/react";
import EmojiSelector from "../utils/EmojiSelector";

const Home = () => {
  const bottomRef = useRef(null); // Ref to trigger automatic scroll when a new message is added/loaded.

  // Secrets from .env file
  const db_id = import.meta.env.VITE_DATABASE_ID;
  const collection_id = import.meta.env.VITE_MESSAGE_COLLECTION_ID;
  const typing_collection_id = import.meta.env.VITE_TYPING_COLLECTION_ID;
  const typing_doc_id = import.meta.env.VITE_TYPING_COLLECTION_DOCUMENT_ID;

  const [message, setMessage] = React.useState(""); // State to manage message typed into the input box.
  const [messageList, setMessageList] = React.useState([]); // State to store all the message fetched from the database.
  const [loading, setLoading] = React.useState(false); // Loading state to trigger spinners
  const [typing, setTyping] = React.useState(false); // State to get typing status of the user

  // State to store details of currently typing user
  const [typingInfo, setTypingInfo] = React.useState({
    name: "",
    id: "",
    typing: false,
  });

  const { user, logout, logoutSpinner } = useAuth(); // Datas from AuthContext.

  // Verification Badge
  const [verified, setVerified] = React.useState(false);
  React.useEffect(() => {
    if (user.labels[0] == "verified") {
      setVerified(true);
    }
  }, []);

  // Scroll to bottom every time messages change or when someone is typing
  React.useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList, typingInfo]);

  // Gets all the messages from the database and checks for realtime changes in the database and updates the messageList accordingly.
  React.useEffect(() => {
    setLoading(true);
    getMessages();
    // Appwrite Realtime API, checks for any changes (create, delete) and updates the messsageList.
    const unsubscribe = client.subscribe(
      `databases.${db_id}.collections.${collection_id}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.create"
          )
        ) {
          console.log("A MESSAGE WAS CREATED");
          setMessageList((prevState) => [...prevState, response.payload]);
        }

        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.delete"
          )
        ) {
          console.log("A MESSAGE WAS DELETED!!!");
          setMessageList((prevState) =>
            prevState.filter(
              (messageList) => messageList.$id !== response.payload.$id
            )
          );
        }
      }
    );

    // Cleanup function
    console.log("unsubscribe:", unsubscribe);
    setLoading(false);
    return () => {
      unsubscribe();
    };
  }, []);

  // Gets currently typing user
  let typingTimeout;
  const handleChange = (event) => {
    setTyping(true);
    setMessage(event.target.value);
    clearTimeout(typingTimeout);
    typingTimeout = setTimeout(() => {
      setTyping(false);
    }, 4000);
  };

  React.useEffect(() => {
    sendTypingStatus();
  }, [typing]);

  const sendTypingStatus = async () => {
    const permissions = [Permission.write(Role.user(user.$id))];
    const payload = {
      user_id: user.$id,
      username: user.name,
      isTyping: typing,
    };
    const response = await database.updateDocument(
      db_id,
      typing_collection_id,
      typing_doc_id,
      payload,
      permissions
    );
  };

  // Using appwrite realtime API to check for any changes in the database and update the UI for a typing indicator
  React.useEffect(() => {
    const unsubscribe = client.subscribe(
      `databases.${db_id}.collections.${typing_collection_id}.documents`,
      (response) => {
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          console.log("Someone is typing");
          // Set the typing info with the currently typing user
          setTypingInfo({
            name: response.payload.username,
            id: response.payload.user_id,
            typing: response.payload.isTyping,
          });
        }
      }
    );
    return () => {
      unsubscribe();
    };
  }, []);

  // Function to get messages from the database
  const getMessages = async () => {
    const response = await database.listDocuments(db_id, collection_id, [
      Query.orderAsc("$createdAt"),
      Query.limit(10000),
    ]);
    setMessageList(response.documents);
  };

  // Function to send message
  const sendMessage = async (e) => {
    setLoading(true);
    e.preventDefault();

    const permissions = [Permission.write(Role.user(user.$id))];

    const payload = {
      user_id: user.$id,
      username: user.name,
      message: message,
      verified: verified,
    };

    const response = await database.createDocument(
      db_id,
      collection_id,
      ID.unique(),
      payload,
      permissions
    );
    console.log(response);
    setMessage("");
    setLoading(false);
  };

  return (
    <>
      <div className="flex justify-between items-center font-lexend sticky top-0 px-2 py-2 bg-[#0b0405]">
        <ProfileWindow />
        <p className="lg:w-80 cursor-default lg:text-2xl flex justify-center items-center text-[#f2dee1] text-xs text-center">
          Chat Room{" "}
          <span className="text-xs text-blue-700 font-mono ml-1 border border-blue-700 px-1 rounded-sm">
            on web
          </span>
        </p>
        <button
          className="text-red-600"
          onClick={() => {
            logout();
          }}
        >
          <div className="flex justify-center items-center">
            {logoutSpinner ? (
              <Spinner color="red.500" />
            ) : (
              <>
                <span className="mr-1">Logout</span>
                <FiLogOut className="font-bold" />
              </>
            )}
          </div>
        </button>
      </div>
      <div className="w-full flex flex-col justify-end items-center p-5 font-lexend">
        <div className="flex flex-col justify-center items-end w-full overflow-scroll">
          {messageList.map((item) => (
            <div
              key={item.$id}
              className={
                item.user_id !== user.$id ? "mr-auto my-3" : "my-3 mr-2"
              }
            >
              <div
                className={
                  item.user_id !== user.$id
                    ? "bg-[#0d1a21] text-[#f2dee1] w-[20rem] px-5 py-2 rounded-r-2xl rounded-tl-2xl"
                    : "bg-[#47b36b] text-[#f2dee1] w-[20rem] px-5 py-2 rounded-l-2xl rounded-tr-2xl"
                }
              >
                <p
                  className={
                    item.verified
                      ? "text-yellow-500 flex justify-start items-center"
                      : "text-lime-500 flex justify-start items-center"
                  }
                >
                  {item.user_id === user.$id ? (
                    <span
                      className={
                        item.verified ? "text-yellow-500" : "text-black"
                      }
                    >
                      You
                    </span>
                  ) : (
                    item.username
                  )}

                  {/* To provide verification badge, goto to appwrite and add the label of 'verified' to the user */}
                  {item.verified && (
                    <span className="flex justify-center items-center ml-1">
                      <VscVerifiedFilled className="text-[#1DCAFF] text-md" />
                      <small className="text-[10px] ml-1 text-gray-400">
                        OG
                      </small>
                    </span>
                  )}
                </p>
                <p className="lg:text-xl">{item.message}</p>
              </div>
              <p className="text-xs flex justify-end items-center text-gray-500">
                {new Date(item.$createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        {typingInfo.typing && typingInfo.id != user.$id && (
          <div className="bg-[#0d1a21] text-[#f2dee1] w-[20rem] px-5 py-2 rounded-r-2xl rounded-tl-2xl mr-auto my-3">
            <p>{typingInfo.name}</p>
            <TypingIndicator />
          </div>
        )}
        <div className="mb-20"></div>
        <div ref={bottomRef} />
        <div className="w-[90%] fixed bottom-4 flex justify-center items-center">
          <div>
            <EmojiSelector setMessage={setMessage} />
          </div>
          <input
            value={message}
            onChange={handleChange}
            type="text"
            name="message"
            id="message"
            placeholder="Say something..."
            className="w-[80%] lg:w-[90%] p-5 rounded-l-full focus:outline-none focus:ring focus:ring-[#3a9283] transition"
          />
          <button
            className="w-[20%] lg:w-[10%] bg-[#3a9283] p-5 rounded-r-full text-white flex justify-center items-center"
            onClick={sendMessage}
            disabled={!message}
          >
            {loading ? <Spinner color="gray.500" /> : "Send"}
          </button>
        </div>
      </div>
    </>
  );
};

export default Home;
