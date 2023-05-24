import Notifications from './NotificationsComp'; 
import Chat from './Chat'; 
import Groups from './Groups'; 
import withAuth from "../../hoc/withAuth";
import { IoMdChatbubbles, IoIosNotifications } from 'react-icons/io';
import { MdGroup } from 'react-icons/md';
import { useState } from 'react';
import "./chat.css";


function ChatNav() {

  const [selectedComponent, setSelectedComponent] = useState(null);

  const renderComponent = () => {
    switch(selectedComponent) {
      case 'notifications':
        return <Notifications />;
      case 'chat':
        return <Chat/>;
      case 'groups':
        return <Groups/>;
      default:
        return <Chat />;
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-nav">
        <ul id="chat-Nav-list">
          <li onClick={() => setSelectedComponent('notifications')}><IoIosNotifications /></li>
          <li onClick={() => setSelectedComponent('chat')}><IoMdChatbubbles /></li>
          <li onClick={() => setSelectedComponent('groups')}><MdGroup /></li>
        </ul>
      </div>
      <div>
        {renderComponent()}
      </div>
    </div>
  );
}

export default ChatNav;