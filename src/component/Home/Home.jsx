import React, { useRef } from "react";

// Appwrite
import client, { database } from "../../appwrite config/appwriteConfig";
import { Query, Permission, Role, ID } from "appwrite";

// From utils directory
import { useAuth } from "../../utils/AuthContext";
import EmojiSelector from "../../utils/EmojiSelector";

// React Icons
import { IoSend } from "react-icons/io5";

// ChakraUI components
import { Spinner } from "@chakra-ui/react";
import HeadPanel from "./HeadPanel";
import MessageList from "./MessageList";
import TypingInfo from "./TypingInfo";

// import GIFSection from "./GIFSection";

const Home = () => {
  const bottomRef = useRef(null); // Ref to trigger automatic scroll when a new message is added/loaded.

  React.useEffect(() => {
    console.log("re-rendered");
  }, []);

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

  const { user } = useAuth(); // Datas from AuthContext.

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
        if (
          response.events.includes(
            "databases.*.collections.*.documents.*.update"
          )
        ) {
          console.log("A MESSAGE WAS UPDATED!!!");
          getMessages();
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
    await database.updateDocument(
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

    await database.createDocument(
      db_id,
      collection_id,
      ID.unique(),
      payload,
      permissions
    );
    setMessage("");
    setLoading(false);
  };

  return (
    <>
      {/* <ShowPopUp /> */}

      <HeadPanel />

      <div className="w-full flex flex-col justify-end items-center p-5 font-lexend">
        {/* Message List */}
        <MessageList
          messageList={messageList}
          db_id={db_id}
          collection_id={collection_id}
        />

        {typingInfo.typing && typingInfo.id != user.$id && (
          <TypingInfo typingInfo={typingInfo} />
        )}

        <div className="mb-20"></div>
        <div ref={bottomRef} />

        {/* <GIFSection /> */}

        {/* Input section */}
        <div className="w-[90%] fixed bottom-4 flex justify-center items-center">
          <div>
            <EmojiSelector setMessage={setMessage} />
          </div>
          <input
            value={message}
            onChange={handleChange}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                sendMessage(event);
              }
            }}
            type="text"
            name="message"
            id="message"
            placeholder="Say something..."
            className="w-[80%] lg:w-[90%] p-5 rounded-l-full focus:outline-none focus:ring focus:ring-[#3a9283] transition"
          />
          <button
            className="w-[20%] lg:w-[10%] bg-[#3a9283] p-5 rounded-r-full text-white flex justify-center items-center text-2xl"
            onClick={sendMessage}
            disabled={!message}
          >
            {loading ? <Spinner color="gray.700" /> : <IoSend />}
          </button>
        </div>
        {/* Input section */}
      </div>
    </>
  );
};

export default Home;
