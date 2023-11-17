/* eslint-disable react/prop-types */
import { useAuth } from "../../utils/AuthContext";
import rolling from '../../assets/typing-indicator.svg'

const TypingInfo = ({ typingInfo }) => {
  const { avatar } = useAuth();
  return (
    <div className="flex justify-start items-center mr-auto">
      <img
        src={avatar(typingInfo.name)}
        alt={avatar(typingInfo.name)}
        className="w-8 rounded-full mr-2 mb-auto"
      />
      <div className="bg-[#0d1a21] text-[#f2dee1] w-[15rem] px-5 py-2 rounded-r-2xl rounded-bl-2xl mr-auto my-3">
        <p>{typingInfo.name}</p>
        <img src={rolling} alt="typing svg" className="w-12"/>
      </div>
    </div>
  );
};

export default TypingInfo;
