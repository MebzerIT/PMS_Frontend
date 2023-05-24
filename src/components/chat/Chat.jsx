import withAuth from "../../hoc/withAuth";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import "./chat.css";

const Chat = () => {
    
    const [client, setClient] = useState(null);
    const [stompClient, setStompClient] = useState(null);

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState(''); 

    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        connect();
    }, []);

    
    const connect = () => {
        const socket = new SockJS("http://localhost:8080/websocket-app");
        const localStompClient = new Client({
            webSocketFactory: () => socket,  // use the SockJS object
            debug: (str) => {
                console.log(str);
            },
        });
        
        localStompClient.onConnect = () => {
            console.log("Connected");
            localStompClient.subscribe("/topic/public", onMessageReceived);
        };
        
        localStompClient.onStompError = onError;
        localStompClient.activate();
        setStompClient(localStompClient);
    };
    const onConnected = () => {
        console.log('onConnected function called');
    };
 
    const onError = (error) => {
        console.log("Could not connect. " + error);
    };
    
    const addUser = (username) => {
        if (stompClient) {
            stompClient.publish({ 
                destination: '/app/chat.addUser', 
                body: JSON.stringify({ sender: username, type: 'JOIN' }) 
            });
        } else {
            console.error('The Stomp client is not connected.');
        }
    };

    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        if(message.from && message.text){
            setMessages([...messages, { sender: message.from, content: message.text}]);
          }
          console.log("Received message: ", message);
        // handle received message
    };

    const handleInput = (event) => {
        setContent(event.target.value); // Update the state with the current input value
      };

    const sendMessage = (msg) => {
        if (stompClient) {
            stompClient.publish({ destination: '/app/chat.sendMessage', body: JSON.stringify({ from: 'test', text: msg }) });
            setMessages([...messages, { sender: 'test2', content: msg}]);
            setContent('');
        } else {
            console.error('The Stomp client is not connected.');
        }
    }

    const handleSearchInput = (event) => {
        setSearchTerm(event.target.value);
      }
      
     const handleSearch = () => {
        // The search functionality will go here
        // You could filter your users list based on the search term
       // const filteredUsers = users.filter(user => user.name.includes(searchTerm));
      
        // You can now use 'filteredUsers' for your user list
     }

    return (

        <div className="chat-container">
            <div className="chat-history">
                <h2>Chat History</h2>
                <ul id="chat-history-list">
                    <li>John Doe: Hello World!</li>
                    <li>Jane Doe: Hi John, How are you?</li>
                </ul>
            </div>

            <div className="live-chat">

                <h2>Live Chat</h2>

                <div className="userSearchBtn">
                    <input type="text" id="search-input" placeholder="Search users..." onChange={handleSearchInput} />
                    <button onClick={handleSearch}>Search</button>
                </div> 
                {/* <div>
                    {filteredUsers.map(user => (
                        <p key={user.id}>{user.name}</p>
                    ))}
                </div> */}

                <div id="live-chat-display">
                {messages.map((msg, index) => (
                    <p key={index}>{msg.sender}: {msg.content}</p>
                ))}
                </div>

                <div className="message-input">
                    <input 
                        type="text" 
                        id="chat-input" 
                        placeholder="Type your message here..." 
                        onChange={handleInput}  // Update content on each change
                    />
                    <button id="send-button" onClick={() => sendMessage(content)}> Send </button>
                </div>
            </div>
        </div>
    )
}
export default withAuth(Chat);

