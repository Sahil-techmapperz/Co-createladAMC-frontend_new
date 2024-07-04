import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt } from 'react-icons/fa';

const MessageDisplay = ({ messages, onSendMessage, selectedUsername, onlineUsers, selectedUserId, typingUser, onTyping, onEditMessage, onDeleteMessage }) => {
  const [newMessage, setNewMessage] = useState('');
  const [editingMessage, setEditingMessage] = useState(null);

  const user = JSON.parse(localStorage.getItem('user'));

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (newMessage.trim()) {
      if (editingMessage) {
        onEditMessage(editingMessage._id, newMessage);
        setEditingMessage(null);
      } else {
        onSendMessage(newMessage);
      }
      setNewMessage('');
      onTyping(false);
    }
  };

  const handleTyping = (e) => {
    setNewMessage(e.target.value);
    onTyping(true);
  };

  const handleEditClick = (message) => {
    setNewMessage(message.content);
    setEditingMessage(message);
  };

  const handleDeleteClick = (messageId) => {
    const isConfirmed = window.confirm('The message will be deleted permanently and cannot be restored. Do you want to proceed?');
    if (isConfirmed) {
      onDeleteMessage(messageId);
    }
  };

  useEffect(() => {
    const typingTimeout = setTimeout(() => {
      onTyping(false);
    }, 2000);

    return () => clearTimeout(typingTimeout);
  }, [newMessage, onTyping]);

  const formatDate = (date) => {
    if (!date) return '';
    const formattedDate = new Date(date);
    return isNaN(formattedDate) ? '' : formattedDate.toLocaleString();
  };

  const isMessageRead = (message) => {
    return message.readBy.some(read => read.userId === selectedUserId);
  };

  return (
    <div className="bg-white p-4 md:w-[60vw] h-[80vh] flex flex-col">
      <h2 className="text-xl font-semibold mb-4">
        {selectedUsername && `Chat with ${selectedUsername}`}
      </h2>
      {selectedUsername && (
        <div className={`text-sm mb-2 ${onlineUsers.includes(selectedUserId) ? 'text-green-500' : 'text-red-500'}`}>
          {onlineUsers.includes(selectedUserId) ? 'Online' : 'Offline'}
        </div>
      )}
      <h2 className="text-xl font-semibold mb-4">Messages</h2>
      <div className="flex-grow overflow-y-auto mb-4">
        {messages.length > 0 ? (
          messages.map((message, index) => (
            <div
              key={index}
              className={`mb-4 flex ${message.senderId._id === user._id ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`p-2 rounded-md ${message.senderId._id === user._id ? 'bg-blue-100 text-right' : 'bg-gray-100 text-left'}`}
              >
                <div className="font-bold">{message.senderId.username}</div>
                <div className="text-gray-700">{message.content}</div>
                <div className="text-gray-500 text-sm">
                  
                  {message.isEdited ? (
                    <span className="text-xs text-gray-400"> (edited at {formatDate(message.updatedAt)})</span>
                  ):(formatDate(message.createdAt))}
                </div>
                {message.senderId._id === user._id && (
                  <div className="flex justify-end">
                    <button
                      className="text-blue-500 hover:text-blue-700 mr-2 w-fit"
                      onClick={() => handleEditClick(message)}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="text-red-500 hover:text-red-700 w-fit"
                      onClick={() => handleDeleteClick(message._id)}
                    >
                      <FaTrashAlt />
                    </button>
                  </div>
                )}
                {isMessageRead(message) && (
                  <div className="text-green-500 text-xs">Read</div>
                )}
              </div>
            </div>
          ))
        ) : (
          <div>No messages</div>
        )}
      </div>
      {typingUser && typingUser !== user._id && (
        <div className="text-gray-500 text-sm mb-2">
          {`${typingUser === selectedUserId ? selectedUsername : 'Someone'} is typing...`}
        </div>
      )}
      <form onSubmit={handleSendMessage} className="flex">
        <input
          type="text"
          value={newMessage}
          onChange={handleTyping}
          className="flex-grow p-2 border border-gray-300 rounded mr-2"
          placeholder="Type a message..."
        />
        <button type="submit" className="bg-blue-500 w-fit text-white p-2 rounded">
          {editingMessage ? 'Edit' : 'Send'}
        </button>
      </form>
    </div>
  );
};

export default MessageDisplay;
