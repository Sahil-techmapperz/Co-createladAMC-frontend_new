import React from 'react';

const UserList = ({ users, onSelectUser, selectedUserId, onlineUsers }) => {
  return (
    <div className="bg-gray-100 p-4 md:w-[20vw] h-[80vh] overflow-y-auto">
      <h2 className="text-xl font-semibold mb-4">Users</h2>
      <ul>
        {users.map(user => (
          <li
            key={user._id}
            className={`p-2 mb-2 cursor-pointer rounded ${selectedUserId === user._id ? 'bg-blue-500 text-white' : 'bg-white'}`}
            onClick={() => onSelectUser(user._id, user.name)}
          >
            <div>{user.name}</div>
            <div className={`text-sm ${onlineUsers.includes(user._id) ? 'text-green-500' : 'text-red-500'}`}>
              {onlineUsers.includes(user._id) ? 'Online' : 'Offline'}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default UserList;
