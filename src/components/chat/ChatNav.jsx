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
      case 'varsler':
        return <Notifications />;
      case 'chat':
        return <Chat/>;
      case 'grupper':
        return <Groups/>;
      default:
        return <Chat />;
    }
  }

  return (
    <div className="chat-container">
      <div className="chat-nav">
        <ul id="chat-Nav-list">
          <li onClick={() => setSelectedComponent('varsler')}><IoIosNotifications /></li>
          <li onClick={() => setSelectedComponent('chat')}><IoMdChatbubbles /></li>
          <li onClick={() => setSelectedComponent('grupper')}><MdGroup /></li>
        </ul>
      </div>
      <div>
        {renderComponent()}
      </div>
    </div>
  );
}

export default ChatNav;