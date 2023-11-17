// import React from 'react'
import ProfileWindow from '../../utils/ProfileWindow';
import { useAuth } from '../../utils/AuthContext';
import { Spinner } from '@chakra-ui/react';
import { FiLogOut } from 'react-icons/fi';

const HeadPanel = () => {
    const { logout, logoutSpinner } = useAuth();
  return (
    <div className="flex justify-between items-center font-lexend sticky top-0 px-2 py-2 bg-[#0b0405]">
        <ProfileWindow />
        <p className="lg:w-80 cursor-default lg:text-2xl flex justify-center items-center text-[#f2dee1] text-center">
          Chat room{" "}
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
  )
}

export default HeadPanel
