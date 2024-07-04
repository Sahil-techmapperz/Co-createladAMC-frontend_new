import React, { useEffect, useRef, useState } from 'react';
import { MdEdit, MdDelete } from "react-icons/md"; // Add MdInsertEmoticon for the emoji icon
import useWindowSize from '../../hooks/useWindowSize';
function ChatInterface({ selectedUser, messages, message, setMessage, handleSendMessage, handleEditMessage, handleDeleteMessage }) {
    const user = JSON.parse(localStorage.getItem('user'));
    const [editingMessageId, setEditingMessageId] = useState(null);
    const [editedContent, setEditedContent] = useState("");
    const [hoveredMessageId, setHoveredMessageId] = useState(null);
    const { width, height } = useWindowSize();

    // Inline styles
    const chatInterfaceStyle = {
        display: width > 768 ? (selectedUser != null ? 'flex' : 'none') : "flex",
        border: '1px solid #ccc',
        borderRadius: '4px',
        padding: '20px',
        margin: '0 auto',
        flexDirection: 'column',
        width: width > 768? '70%':"100%",
        maxWidth:width > 768? '70%':"100%",
        backgroundPosition: 'center',
        fontFamily: "'Roboto', sans-serif",
    };


    const headingStyle = {
        color: '#333',
        fontSize: '1.5rem',
        fontWeight: 500,
        marginBottom: '20px',
        padding: '10px 0',
        borderBottom: '2px solid #eee',
        textAlign: 'center',
    };

    const messagesStyle = {
        display: 'flex',
        flexDirection: 'column',
        flexGrow: 1,
        overflowY: 'auto',
        padding: '10px',
        marginBottom: '20px',
        border: '1px solid #ddd',
        borderRadius: '4px',
        backgroundColor: '#e3f2fd',
        backgroundSize: 'cover',
        minHeight: '50vh',
    };

    const messageStyle = {
        maxWidth: "60%",
        padding: '10px',
        margin: '5px 0',
        borderRadius: '10px',
        color: "black",
    };

    const messageStyleSent = {
        ...messageStyle,
        backgroundColor: '#D9FDD3',
        alignSelf: 'flex-end',
    };

    const messageStyleReceived = {
        ...messageStyle,
        backgroundColor: '#EFEFEF',
        alignSelf: 'flex-start',
    };

    const inputStyle = {
        flexGrow: 1,
        padding: '12px',
        margin: '0 8px',
        borderRadius: '4px',
        border: '1px solid #ccc',
        outline: 'none',
    };

    const buttonStyle = {
        width: "max-content",
        padding: '10px 20px',
        borderRadius: '4px',
        backgroundColor: '#007bff',
        color: 'white',
        cursor: 'pointer',
        border: 'none',
        outline: 'none',
        transition: 'background-color 0.3s',
    };

    const editedLabelStyle = {
        fontSize: '0.75rem',
        color: '#ff9800',
        marginLeft: '10px',
    };

    const messageInputStyle = {
        display: 'flex',
        alignItems: 'center',
    };

    const messageTimeStyle = {
        fontSize: '0.75rem',
        color: 'black',
        marginTop: '5px',
        textAlign: 'right',
    };

    const readStatusLabelStyle = {
        fontSize: '0.75rem',
        marginLeft: '10px',
        fontStyle: 'italic',
    };

    const actionButtonStyle = {
        marginLeft: '10px',
        padding: '5px 10px',
        fontSize: '0.8rem',
        borderRadius: '4px',
        cursor: 'pointer',
        width: 'fit-content'
    };

    const editButtonStyle = {
        ...actionButtonStyle,
        backgroundColor: '#FFCA28',
        color: 'black',

    };

    const deleteButtonStyle = {
        ...actionButtonStyle,
        backgroundColor: '#F44336',
        color: 'white',
    };



    

    // New function to handle mouse enter and leave
    const handleMouseEnter = (msgId) => {
        setHoveredMessageId(msgId);
    };

    const handleMouseLeave = () => {
        setHoveredMessageId(null);
    };

    const formatMessageTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleString();
    };

    // Function to handle message editing UI
    const startEdit = (msg) => {
        setEditingMessageId(msg._id);
        setEditedContent(msg.content);
    };

    // Function to cancel editing
    const cancelEdit = () => {
        setEditingMessageId(null);
        setEditedContent("");
    };

    // Function to save edited message
    const saveEdit = (msgId) => {
        handleEditMessage(msgId, editedContent);
        setEditingMessageId(null);
        setEditedContent("");
    };



    const enhancedHandleSendMessage = () => {
        handleSendMessage();
    };

    const handleback = () => {
        // Logic to execute on button click
        // console.log('Button clicked');
        // For example, navigate back or any custom logic
         window.location.reload(); // Uncomment this if you want to go back to the previous page
    };

    return (

        <div style={chatInterfaceStyle}>
            {selectedUser && (
                <div className='flex justify-between px-2'>
                    <h2 style={headingStyle}>Chat with {selectedUser.name}</h2>
                    <button onClick={handleback} className="bg-blue-500 hover:bg-blue-700 md:hidden text-white font-bold py-2 px-4 rounded h-[fit-content] w-[fit-content]">
                        Back
                    </button>
                </div>
            )}


            <div style={messagesStyle}>
                {messages.map((msg) => (
                    (msg.senderId === selectedUser._id && msg.receiverId === user._id) ||
                        (msg.senderId === user._id && msg.receiverId === selectedUser._id) ? (
                        <div
                            key={msg._id}
                            style={msg.senderId === user._id ? messageStyleSent : messageStyleReceived}
                            onMouseEnter={() => handleMouseEnter(msg._id)}
                            onMouseLeave={handleMouseLeave}
                        >
                            <div>
                                <div>{msg.content}</div>
                                {msg.isUpdate && <span style={editedLabelStyle}>(Edited) {formatMessageTime(msg.updatedAt)}</span>}
                            </div>

                            <div style={messageTimeStyle}>{formatMessageTime(msg.createdAt)}</div>
                            {/* Read status, edit, and delete actions */}
                            {msg.senderId === user._id && (
                                <span style={readStatusLabelStyle}>
                                    {msg.isRead ? "Read" : "Unread"}
                                </span>
                            )}
                            {msg.senderId === user._id && hoveredMessageId === msg._id && (
                                <div>
                                    {editingMessageId === msg._id ? (
                                        <>
                                            <input
                                                type="text"
                                                value={editedContent}
                                                onChange={(e) => setEditedContent(e.target.value)}
                                                style={{ width: '100%', marginBottom: '10px' }}
                                            />
                                            <button style={editButtonStyle} onClick={() => saveEdit(msg._id)}>Save</button>
                                            <button style={deleteButtonStyle} onClick={cancelEdit}>Cancel</button>
                                        </>
                                    ) : (
                                        <>
                                            {msg.fileUrl && msg.fileUrl.trim() !== "" ? "" : <button style={editButtonStyle} onClick={() => startEdit(msg)}><MdEdit /></button>}
                                            <button style={deleteButtonStyle} onClick={() => handleDeleteMessage(msg._id)}><MdDelete /></button>
                                        </>
                                    )}
                                </div>
                            )}
                        </div>
                    ) : null
                ))}
            </div>
            <div style={messageInputStyle}>
                <input
                    type="text"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    style={inputStyle}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter' && !e.shiftKey) {
                            e.preventDefault(); // Prevents the default action of the enter key which is to insert a new line
                            enhancedHandleSendMessage();
                        }
                    }}
                />
                <button onClick={enhancedHandleSendMessage} style={buttonStyle}>
                    Send
                </button>
            </div>
        </div>

    );
}

export default ChatInterface;
