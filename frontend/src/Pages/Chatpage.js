// @ts-nocheck
import React, { useState } from "react";
import "../components/styles.css";
import Chatbox from "../components/Chatbox";
import MyChats from "../components/MyChats";
import SideDrawer from "../components/miscellaneous/SideDrawer";
import { ChatState } from "../Context/ChatProvider";
import MetaData from "../components/layouts/MetaData/Metadata";

const Chatpage = () => {
  const [fetchAgain, setFetchAgain] = useState(false);
  const { user } = ChatState();

  return (
    <>
      <MetaData title="LetsChat" />
      <div className="chatpage-wrapper">
        {user && <SideDrawer fetchAgain={fetchAgain} />}
        <div className="chat-shell-content">
          {user && (
            <div className="chat-header-left">
              <MyChats fetchAgain={fetchAgain} />
            </div>
          )}
          {user && (
            <div className="chat-body">
              <Chatbox fetchAgain={fetchAgain} setFetchAgain={setFetchAgain} />
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Chatpage;
