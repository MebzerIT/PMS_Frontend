import withAuth from "../../hoc/withAuth";
import React, { useEffect, useState } from "react";
import SockJS from "sockjs-client";
import { Client } from '@stomp/stompjs';
import keycloak from '../keycloak/keycloak';
import "./chat.css";

const Chat = () => {

    const [client, setClient] = useState(null);
    const [stompClient, setStompClient] = useState(null);

    const [messages, setMessages] = useState([]);
    const [content, setContent] = useState('');

    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedUser, setSelectedUser] = useState(null);


    const loggedinUser = keycloak.tokenParsed;

    console.log("i am user", loggedinUser);

    const [users, setUsers] = useState([]);

    useEffect(() => {
        // Fetch users from API and update the users state
        const fetchUsers = async () => {
            try {
                const response = await fetch("http://localhost:8080/api/v1/users");
                const data = await response.json();
                setUsers(data);
            } catch (error) {
                console.error("Error fetching users:", error);
            }
        };

        fetchUsers();
    }, []);
    console.log("users data: ", users)

    const handleSearch = () => {
        const filtered = users.filter(user =>
            (user.firstName && user.firstName.toLowerCase().includes(searchTerm.toLowerCase())) ||
            (user.lastName && user.lastName.toLowerCase().includes(searchTerm.toLowerCase()))
        );
        setFilteredUsers(filtered);
        console.log("Filtered: ", filtered)
    }

    useEffect(() => {
        // Filter the users based on the search term
        handleSearch();
    }, [searchTerm, users]);


    const handleSearchInput = event => {
        setSearchTerm(event.target.value);
    };

    const handleUserSelection = user => {
        setSelectedUser(user);
        console.log("handlselection", user)
    };

    console.log("selectedUser", selectedUser)

    const connect = () => {
        const socket = new SockJS("http://localhost:8080/websocket-app");
        console.log("****", socket)
        const localStompClient = new Client({
            webSocketFactory: () => socket,  // use the SockJS object
            debug: (str) => {
                console.log(str);
            },
        });

        /* localStompClient.onConnect = () => {
            console.log("Connected");
            localStompClient.subscribe("/queue/reply", (payload) => {
                console.log("Received payload:", payload);
                onMessageReceived(payload)
            });
        }; */
        console.log("localstomecliant**", localStompClient)
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

    useEffect(() => {
        if (!stompClient) { connect(); }
    }, [connect, stompClient]);

    useEffect(() => {
        if (stompClient) {
            stompClient.onConnect = () => {
                console.log("###Connected");
                const userId = selectedUser.id;
                stompClient.subscribe(`/user/topic/reply/${userId}`, (payload) => {
                    console.log("Received payload:", payload);
                    onMessageReceived(payload)
                });
            };
        }
    }

    )

    const addUser = () => {
        if (stompClient) {
            stompClient.publish({
                destination: '/app/chat.addUser',
                body: JSON.stringify({ sender: loggedinUser.name, type: 'JOIN' })
            });
        } else {
            console.error('The Stomp client is not connected.');
        }
    };

    const onMessageReceived = (payload) => {
        const message = JSON.parse(payload.body);
        console.log("payload", payload)
        if (message.from && message.text) {
            setMessages([...messages, { sender: message.from, content: message.text }]);
        }
        console.log("Received message: ", message);
        // handle received message
    };

    const handleInput = (event) => {
        setContent(event.target.value); // Update the state with the current input value
    };

    const sendMessage = (msg) => {
        console.log("log stomand selectedUser", stompClient, selectedUser)
        if (stompClient && selectedUser) {
            console.log("**test")
            stompClient.publish({ destination: `/app/chat.sendMessage/${selectedUser.id}`, body: JSON.stringify({ from: loggedinUser.name, text: msg }) });
            setMessages([...messages, { sender: loggedinUser.name, content: msg }]);
            setContent('');
        } else {
            console.error('The Stomp client is not connected.');
        }
    }

    return (

        <div className="chat-container">
            <div className="chat-history">
                <h2>Chat historie</h2>
                <ul id="chat-history-list">
                    <li>John Doe: Hallo verden!</li>
                    <li>Jane Doe: Hei John, hvordan har du det?</li>
                </ul>
            </div>

            <div className="live-chat">

                <h2> </h2>
                <div id="search-display">
                    <div className="userSearchBtn">
                        <input type="text" id="search-input" placeholder="Søk etter brukere..." onChange={handleSearchInput} />
                        <button onClick={handleSearch}>Søk</button>
                    </div>
                    {searchTerm && !selectedUser && (
                        <div>
                            {filteredUsers.map(user => (
                                <p key={user.id} onClick={() => handleUserSelection(user)}>
                                    {user.firstName}
                                </p>
                            ))}
                        </div>
                    )}
                </div>
                <div id="live-chat-display">
                    {messages.map((msg, index) => (
                        <p key={index}>{msg.content}: {msg.sender}</p>
                    ))}
                </div>


                <div className="message-input">
                    <input
                        type="text"
                        id="chat-input"
                        placeholder="Skriv meldingen din her..."
                        onChange={handleInput}  // Update content on each change
                    />
                    <button id="send-button" onClick={() => sendMessage(content)}> Sende </button>
                </div>
            </div>
        </div>
    )
}
export default withAuth(Chat);
