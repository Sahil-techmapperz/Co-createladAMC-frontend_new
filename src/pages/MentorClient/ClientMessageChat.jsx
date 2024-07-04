import React, { useState, useEffect, useRef } from 'react';
import Navbar from '../../components/Navbar.jsx';
import UserList from '../../components/Newchat/UserList.jsx';
import MessageDisplay from '../../components/Newchat/MessageDisplay.jsx';
import { Link } from 'react-router-dom';
import { io } from 'socket.io-client';
import ClientSidebar from './ClientSidebar/ClientSidebar.jsx';
import Urlprotected from '../../components/Urlprotected.jsx';
const BaseUrl = process.env.REACT_APP_Base_Url;
const ChatUrl = process.env.REACT_APP_Chat_Base_Url;

const ClientMessageChat = () => {
  const [users, setUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [selectedUserId, setSelectedUserId] = useState(null);
  const [selectedUsername, setSelectedUsername] = useState(null);
  const [isConnected, setIsConnected] = useState(false);
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [typingUser, setTypingUser] = useState(null);
  const user = JSON.parse(localStorage.getItem('user'));
  const token = JSON.parse(localStorage.getItem('token'));
  const socketRef = useRef(null);

  useEffect(() => {
    const socket = io(`${ChatUrl}`, {
      transports: ['websocket'],
      auth: {
        token, // Send JWT token
      },
    });

    socketRef.current = socket;

    socket.on('connect', () => {
      console.log('Connected to server');
      setIsConnected(true);
      socket.emit('register', { userId: user._id }); // Register the user
    });

    socket.on('disconnect', () => {
      console.log('Disconnected from server');
      setIsConnected(false);
    });

    socket.on('connect_error', (error) => {
      console.error('Connection error:', error);
      setIsConnected(false);
    });

    fetch(`${BaseUrl}/api/user/users`, {
      headers: {
        "Content-Type": "application/json",
        "Authorization": `Bearer ${token}`
      }
    })
      .then(response => response.json())
      .then(data => setUsers(Array.isArray(data) ? data : []))
      .catch(error => console.error('Error fetching users:', error));

    socket.on('message', (newMessage) => {
      console.log('New message:', newMessage);
      let data= [...messages, newMessage];
      const sortedMessages = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      sortedMessages.forEach(message => {
        if (message.receiverId._id === user._id && !message.readBy.some(read => read.userId === user._id)) {
          socket.emit('messageRead', { messageId: message._id, userId: user._id });
          socketRef.current.emit('fetchMessages', { senderId: user._id, receiverId: selectedUserId });
        }
      });
      setMessages(sortedMessages);
    });

    socket.on('messages', (fetchedMessages) => {
      const sortedMessages = fetchedMessages.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
      console.log('Sorted messages:', sortedMessages);
      setMessages(sortedMessages);

      // Mark all messages as read
      sortedMessages.forEach(message => {
        if (message.receiverId._id === user._id && !message.readBy.some(read => read.userId === user._id)) {
          socket.emit('messageRead', { messageId: message._id, userId: user._id });
        }
      });
    });

    socket.on('onlineUsers', (onlineUsers) => {
      setOnlineUsers(onlineUsers);
    });

    socket.on('typing', ({ userId, isTyping }) => {
      if (isTyping) {
        setTypingUser(userId);
      } else {
        setTypingUser(null);
      }
    });

    socket.on('messageUpdated', (updatedMessage) => {
      setMessages((prevMessages) =>
        prevMessages.map((msg) => (msg._id === updatedMessage._id ? updatedMessage : msg))
      );
    });

    socket.on('messageDeleted', (deletedMessageId) => {
      setMessages((prevMessages) => prevMessages.filter((msg) => msg._id !== deletedMessageId));
    });

    return () => {
      socket.disconnect();
      socket.off('connect');
      socket.off('disconnect');
      socket.off('connect_error');
      socket.off('message');
      socket.off('messages');
      socket.off('onlineUsers');
      socket.off('typing');
      socket.off('messageUpdated');
      socket.off('messageDeleted');
    };
  }, [token, user._id]);

  useEffect(() => {
    if (selectedUserId) {
      fetch(`${BaseUrl}/api/user/messages/${selectedUserId}`, {
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        }
      })
        .then(response => response.json())
        .then(data => {
          const sortedMessages = data.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
          setMessages(Array.isArray(sortedMessages) ? sortedMessages : [])

          // Mark all messages as read
          sortedMessages.forEach(message => {
            if (message.receiverId._id === user._id && !message.readBy.some(read => read.userId === user._id)) {
              socketRef.current.emit('messageRead', { messageId: message._id, userId: user._id });
            }
          });
        })
        .catch(error => console.error('Error fetching messages:', error));

      socketRef.current.emit('joinRoom', { userId: selectedUserId });

      return () => {
        socketRef.current.emit('leaveRoom', { userId: selectedUserId });
      };
    }
  }, [selectedUserId, token, user._id]);

  const handleSelectUser = (userId, username) => {
    console.log(username);
    setSelectedUsername(username);
    setSelectedUserId(userId);
  };

  const handleSendMessage = (content) => {
    if (!user) {
      console.error('User not logged in');
      return;
    }

    const messageData = {
      senderId: user._id,
      content,
      receiverId: selectedUserId,
      groupId: null,
    };

    socketRef.current.emit('newMessage', messageData, (acknowledgment) => {
      console.log(acknowledgment, "message sent");
      // Trigger fetchMessages after sending a message
      socketRef.current.emit('fetchMessages', { senderId: user._id, receiverId: selectedUserId });
      socketRef.current.emit('typing', { userId: user._id, isTyping: false, receiverId: selectedUserId });
    });
  };

  const handleEditMessage = (messageId, newContent) => {
    socketRef.current.emit('editMessage', { messageId, newContent, userId: user._id }, (acknowledgment) => {
      socketRef.current.emit('fetchMessages', { senderId: user._id, receiverId: selectedUserId });
      console.log(acknowledgment, "message edited");
    });
  };

  const handleDeleteMessage = (messageId) => {
    socketRef.current.emit('deleteMessage', { messageId, userId: user._id }, (acknowledgment) => {
      socketRef.current.emit('fetchMessages', { senderId: user._id, receiverId: selectedUserId });
      console.log(acknowledgment, "message deleted");
    });
  };

  const handleTyping = (isTyping) => {
    if (selectedUserId) {
      socketRef.current.emit('typing', { userId: user._id, isTyping, receiverId: selectedUserId });
    }
  };

  return (
    <Urlprotected path="Client">
    <div className='md:flex md:gap-2'>
      <div className='max-sm:hidden'>
        <ClientSidebar liname={"chatMessage"} />
      </div>
      <div className='md:h-[100vh] md:overflow-y-auto md:w-[84vw] '>
        <Navbar Navtext={'Message'} />
        <div className='mt-[10px] text-[18px] font-[600]'>
          <Link to={"/"}>Dashboard</Link> &gt; Messages
        </div>
        <div className="md:flex md:gap-4 mt-4">
          <UserList users={users} onSelectUser={handleSelectUser} selectedUserId={selectedUserId} onlineUsers={onlineUsers} />
          <MessageDisplay
            messages={messages}
            selectedUsername={selectedUsername}
            onSendMessage={handleSendMessage}
            onEditMessage={handleEditMessage}
            onDeleteMessage={handleDeleteMessage}
            onlineUsers={onlineUsers}
            selectedUserId={selectedUserId}
            typingUser={typingUser}
            onTyping={handleTyping}
          />
        </div>
        <div className='mt-2'>
          {isConnected ? (
            <div className='text-green-500'>Connected to the server</div>
          ) : (
            <div className='text-red-500'>Disconnected from the server</div>
          )}
        </div>
      </div>
    </div>
    </Urlprotected>
  );
};

export default ClientMessageChat;
