import React, { useState, useEffect } from 'react';
import { FiCircle, FiMail } from "react-icons/fi"; // Using FiMail for unread messages
import Avatardefault from "../../assets/avatar-default.png";
import { MdExitToApp } from 'react-icons/md';
import useWindowSize from '../../hooks/useWindowSize';

function UsersList({onSelectUser,users }) {
    const { width, height } = useWindowSize();
    const [userlisthide,Setuserlisthide]=useState(false);
    const loginUser = JSON.parse(localStorage.getItem('user'));
    const handleUserSelect = (user) => {
        let Mobile=width < 768 ;
        if(Mobile){
            Setuserlisthide(true);
        }
        // console.log(Mobile);
        onSelectUser(user);
    };


    function logout() {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    }

    const userListStyle = {
        boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
        margin: '0 auto',
        padding: '10px'
      };


      


    return (
        <>
        {!userlisthide &&
        <div  className="w-full md:h-[100%] md:w-1/4 lg:w-2/6 overflow-y-auto border-r border-gray-200" style={userListStyle}>
           
                <div className='w-[100%] flex items-center justify-between bg-[#e3f2fd] p-[10px] rounded-[5px] my-[10px]' style={{boxShadow: 'inset 0 1px 2px rgba(0,0,0,0.1)'}}>
                    <div className='flex gap-2'>
                        <img src={Avatardefault} alt="User avatar" style={{ width: '30px', height: '30px', borderRadius: '50%' }} />
                        <div style={{ marginLeft: '10px', fontWeight: 'bold', fontSize: '1.2rem', color: '#333' }}>
                            {loginUser.name}
                        </div>
                    </div>
                    <button  onClick={logout} style={{width:'fit-content', cursor: 'pointer', background: 'none', border: 'none' }}>
                        <MdExitToApp size="24px" title="Logout" />
                    </button>
                </div>
            {users.map(user => (
                <div key={user._id} style={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'space-between',
                    padding: '10px',
                    margin: '5px 0',
                    backgroundColor: '#f8f8f8',
                    cursor: 'pointer',
                    borderRadius: '5px',
                    boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
                    transition: 'background-color 0.3s',
                    ':hover': {
                        backgroundColor: '#e9eff5',
                    },
                }} onClick={() => handleUserSelect(user)} title={user.lastMessage ? user.lastMessage.content : 'No message'}>
                    <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 'bold', fontSize: '1.1rem' }}>{user.name}</div>
                        </div>
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            {user.isOnline ? <FiCircle style={{ color: '#4CAF50', marginRight: '10px' }} /> : <FiCircle style={{ color: '#9E9E9E', marginRight: '10px' }} />}
                            {user.unreadCount > 0 && (
                                <span style={{ display: 'flex', alignItems: 'center', color: '#f44336', fontWeight: 'bold' }}>
                                    <FiMail style={{ marginRight: '4px' }} />{user.unreadCount}
                                </span>
                            )}
                        </div>
                    </div>
                    {user.lastMessage && (
                        <div style={{ fontSize: '0.8rem', color: '#777', marginTop: '5px' }}>
                            <div>  {user.lastMessage && typeof user.lastMessage.content === 'string' && user.lastMessage ? user.lastMessage.content.substring(0, 20) + "..." : ''} </div>
                            {new Date(user.lastMessage.createdAt).toLocaleString()}
                        </div>
                    )}
                </div>
            ))}
        </div>}
        </>
    );
}

export default UsersList;
