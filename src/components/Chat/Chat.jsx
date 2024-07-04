import React, { useState, useEffect } from 'react';
import UsersList from './UsersList';
import ChatInterface from './ChatInterface';
import './Chat.css';
import io from 'socket.io-client';
import Sound from "../../assets/whatsapp_notification.mp3";
import useWindowSize from '../../hooks/useWindowSize';

// let BaseUrl = process.env.REACT_APP_Base_Url;
let BaseUrl = VITE_Chat_Base_Url;
const socket = io(BaseUrl);


function Chat() {
    const [selectedUser, setSelectedUser] = useState(null);
    const [message, setMessage] = useState('');
    const [messages, setMessages] = useState([]);
    const [users, setUsers] = useState([]);
    const user = JSON.parse(localStorage.getItem('user'));
    const { width, height } = useWindowSize();

    useEffect(() => {
        const audio = new Audio(Sound);
        const playSound = () => {
            audio.play().catch(error => console.log("Audio play failed:", error));
        };

        if (user && user._id) {
            socket.emit('register', { userId: user._id });
            socket.emit('getUserDataWithMessages', { userId: user._id  });
        }

        socket.on('message', (newMessage) => {
            setMessages((prevMessages) => [...prevMessages, newMessage]);
            if (newMessage.senderId != user._id) {
                playSound();
            }

        });

        socket.on('messages', (historicalMessages) => {
            setMessages(historicalMessages);
            historicalMessages.forEach((msg) => {
                if (!msg.isRead && msg.receiverId == user._id) {
                    socket.emit('messageRead', { messageId: msg._id, userId: user._id });
                }
            });
        });


        socket.on('messageUpdated', (updatedMessage) => {
            setMessages((prevMessages) => prevMessages.map(msg => msg._id === updatedMessage._id ? updatedMessage : msg));
        });


        socket.on('messageDeleted', (deletedMessageId) => {
            setMessages((prevMessages) => prevMessages.filter(msg => msg._id !== deletedMessageId));
        });


        socket.on('userDataWithMessages', (userData) => {
            // console.log("in");
            // console.log(userData);
            const loginUser = JSON.parse(localStorage.getItem('user'));
            const filteredUsers = userData
                .filter(user => user._id !== loginUser._id)
                .map(user => ({
                    ...user,
                    lastMessage: user.lastMessage !== 'empty' ? {
                        content: user.lastMessage.content,
                        createdAt: user.lastMessage.createdAt,
                        isRead: user.lastMessage.isRead,
                    } : null,
                    unreadCount: user.unreadCount !== 0 ? user.unreadCount : null,
                    isOnline: user.isOnline,
                }));

            // Check if users array is different from filteredUsers
            const isDifferent = users.length !== filteredUsers.length || filteredUsers.some((filteredUser, index) => {
                const currentUser = users[index];
                return !currentUser ||
                    currentUser.lastMessage?.content !== filteredUser.lastMessage?.content ||
                    currentUser.unreadCount !== filteredUser.unreadCount;
            });

            if (isDifferent && !selectedUser) { 
                playSound();
            }

            setUsers(filteredUsers);
        });



        return () => {
            socket.off('message');
            socket.off('messages');
            socket.off('messageUpdated');
            socket.off('messageDeleted');
            socket.off('userDataWithMessages');
        };
    }, [user,messages]);

    const handleSendMessage = () => {
        if (message && selectedUser) {
            socket.emit('newMessage', {
                content: message,
                senderId: user._id,
                receiverId: selectedUser._id,
            });
            setMessage('');
        }
    };

    // Function to emit an event to edit a message
    const handleEditMessage = (messageId, newContent) => {
        socket.emit('editMessage', { messageId, newContent });
    };

    // Function to emit an event to delete a message
    const handleDeleteMessage = (messageId) => {
        socket.emit('deleteMessage', { messageId });
    };

    const handleSelectUser = (selectedUser) => {
        setSelectedUser(selectedUser);
        if (selectedUser && selectedUser._id) {
            socket.emit('fetchMessages', {
                senderId: user._id,
                receiverId: selectedUser._id,
            });
        }
    };

    return (
        <div className="flex flex-col md:flex-row  md:h-[88vh] overflow-hidden">
            <UsersList
                users={users}
                onSelectUser={handleSelectUser}
                selectedUser={selectedUser}
            />
            {selectedUser ? (

                <ChatInterface
                    className="flex-1 p-4"
                    socket={socket}
                    selectedUser={selectedUser}
                    messages={messages}
                    message={message}
                    setMessage={setMessage}
                    handleSendMessage={handleSendMessage}
                    handleEditMessage={handleEditMessage}
                    handleDeleteMessage={handleDeleteMessage}
                />
            ) : (
                <div style={{ display: width > 768 ? 'flex' : 'none' }} className="flex-1 items-center justify-center p-4 text-gray-500">
                    Hey there! 👋 Let's get started by choosing someone to chat with from the user list on the left.
                </div>

            )}
        </div>
    );
}

export default Chat;
