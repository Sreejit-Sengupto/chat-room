/* eslint-disable react/prop-types */
import React from "react";
import { useAuth } from "../../utils/AuthContext";
import { Spinner } from "@chakra-ui/react";
import { AiFillDelete } from "react-icons/ai";
import { VscVerifiedFilled } from "react-icons/vsc";
import UpdateMessage from "../../utils/UpdateMessage";

const MessageList = ({ messageList, db_id, collection_id }) => {
  const { user, avatar, deleteMessage, deleteSpinner, messageUpdateSpinner } =
    useAuth();
  const [singleMessageId, setSingleMessageId] = React.useState(""); // State to get id of a single message.
  const [updateMessageId, setUpdateMessageId] = React.useState(""); // State to get id of a message that is being updated.
  return (
    <div className="flex flex-col justify-center items-end w-full overflow-scroll">
      {messageList.map((item) => (
        <div
          key={item.$id}
          className={
            item.user_id !== user.$id
              ? "mr-auto my-3 flex justify-center items-center"
              : "my-3 mr-2 flex justify-center items-center"
          }
        >
          {item.user_id == user.$id && (
            <button
              className="text-red-500 mr-2 text-2xl"
              onClick={() => {
                deleteMessage(db_id, collection_id, item.$id);
                setSingleMessageId(item.$id); // As prop
              }}
            >
              {deleteSpinner && item.$id == singleMessageId ? (
                <Spinner color="red.500" />
              ) : (
                <AiFillDelete />
              )}
            </button>
          )}

          {item.user_id != user.$id && (
            <img
              src={avatar(item.username)}
              alt={avatar(item.username)}
              className="w-8 rounded-full mr-2 mb-auto"
            />
          )}

          <div>
            <div
              className={
                item.user_id !== user.$id
                  ? "bg-[#0d1a21] text-[#f2dee1] w-fit min-w-[10rem] max-w-[15rem] lg:max-w-[20rem] px-5 py-2 rounded-r-2xl rounded-bl-2xl"
                  : "bg-[#1b3012] text-[#f2dee1] w-fit min-w-[10rem] max-w-[15rem] lg:max-w-[20rem] px-5 py-2 rounded-l-2xl rounded-tr-2xl"
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
                    className={item.verified ? "text-yellow-500" : "text-white"}
                  >
                    You
                  </span>
                ) : (
                  item.username
                )}
                {item.verified && (
                  <span className="flex justify-center items-center ml-1">
                    <VscVerifiedFilled className="text-[#1DCAFF] text-md" />
                    <small className="text-[10px] ml-1 text-gray-400">
                      HG-OG
                    </small>
                  </span>
                )}
                {item.user_id == user.$id && (
                  <UpdateMessage
                    db_id={db_id} // As prop
                    collection_id={collection_id} // As prop
                    id={item.$id}
                    message={item.message}
                    setUpdateMessageId={setUpdateMessageId} // As prop
                  />
                )}
              </p>
              <p className="lg:text-xl">
                {item.message}{" "}
                {updateMessageId == item.$id && messageUpdateSpinner && (
                  <Spinner color="gray.800" />
                )}
              </p>
            </div>
            <p
              className={
                item.user_id != user.$id
                  ? "text-xs flex justify-start items-center text-gray-500"
                  : "text-xs flex justify-end items-center text-gray-500"
              }
            >
              {new Date(item.$createdAt).toLocaleString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default MessageList;
