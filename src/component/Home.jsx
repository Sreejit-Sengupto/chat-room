import React, { useRef } from "react";
import client, { database } from "../appwrite config/appwriteConfig";
import { Query, Permission, Role, ID } from "appwrite";
import { useAuth } from "../utils/AuthContext";
import { FiLogOut } from "react-icons/fi";
import { Spinner } from "@chakra-ui/react";
import ProfileWindow from "../utils/ProfileWindow";

const Home = () => {
  const bottomRef = useRef(null);
  const db_id = import.meta.env.VITE_DATABASE_ID;
  const collection_id = import.meta.env.VITE_MESSAGE_COLLECTION_ID;
  const [message, setMessage] = React.useState("");
  const [messageList, setMessageList] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const { user, logout, logoutSpinner } = useAuth();
  console.log(message);

  React.useEffect(() => {
    // Scroll to bottom every time messages change
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messageList]);

  const handleChange = (event) => {
    setMessage(event.target.value);
  };

  React.useEffect(() => {
    setLoading(true);
    getMessages();
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

    console.log("unsubscribe:", unsubscribe);
    setLoading(false);
    return () => {
      unsubscribe();
    };
  }, []);

  const getMessages = async () => {
    const response = await database.listDocuments(db_id, collection_id, [
      Query.orderAsc("$createdAt"),
      Query.limit(100),
    ]);
    setMessageList(response.documents);
  };

  const sendMessage = async (e) => {
    setLoading(true);
    e.preventDefault();

    const permissions = [Permission.write(Role.user(user.$id))];

    const payload = {
      user_id: user.$id,
      username: user.name,
      message: message,
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
        {/* <p className="flex justify-center items-center cursor-default text-[#f2dee1]">
          <CgProfile className="text-2xl mr-1 text-purple-700" />
          {user.name}
        </p> */}

        <ProfileWindow />
        <p className="lg:w-80 cursor-default lg:text-2xl flex justify-center items-center text-[#f2dee1] text-xs text-center">
          Helping Group{" "}
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
        <div className="flex flex-col justify-center items-end w-full overflow-scroll mb-20">
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
                    : "bg-[#3a9283] text-[#f2dee1] w-[20rem] px-5 py-2 rounded-l-2xl rounded-tr-2xl"
                }
              >
                <p className="text-white">
                  {item.username === user.name ? "You" : item.username}
                </p>
                <p className="lg:text-xl">{item.message}</p>
              </div>
              <p className="text-xs flex justify-end items-center text-gray-500">
                {new Date(item.$createdAt).toLocaleString()}
              </p>
            </div>
          ))}
        </div>
        <div ref={bottomRef} />
        <div className="w-[90%] fixed bottom-4 flex justify-center items-center">
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
            className="w-[20%] lg:w-[10%] bg-[#47b36b] p-5 rounded-r-full text-white flex justify-center items-center"
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
