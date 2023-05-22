import withAuth from "../../hoc/withAuth";
import { Link } from 'react-router-dom';
import { IoMdChatbubbles, IoIosNotifications } from 'react-icons/io';
import { MdGroup } from 'react-icons/md';
import "./chat.css";

const Chat = () => (
        <div class="chat-container">
            <div class="chat-history">
                <h2>Chat History</h2>
                <ul id="chat-history-list">
                    <li>John Doe: Hello World!</li>
                    <li>Jane Doe: Hi John, How are you?</li>
                </ul>
            </div>

            <div class="live-chat">
                <h2>Live Chat</h2>
                <div id="live-chat-display">
                    <p>John Doe: Hello, I need help with my project.</p>
                    <p>Jane Doe: Sure John, I'd be happy to help!</p>
                </div>

                <div class="message-input">
                    <input type="text" id="chat-input" placeholder="Type your message here..." />
                    <button id="send-button">Send</button>
                </div>
            </div>
         </div>
)
export default withAuth(Chat);

