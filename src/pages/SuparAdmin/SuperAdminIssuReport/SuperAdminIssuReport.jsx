import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete } from 'react-icons/md';
import SuperAdminSide from '../SuperAdminSide/SuperAdminSide';
import MobileNav from '../../../components/Mobile/MobileNav';
import SuperAdminNavbar from '../SuperAdminNav/SuperAdminNav';
import Urlprotected from '../../../components/Urlprotected';

const SuperAdminIssueReport = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedOption, setSelectedOption] = useState('Pending');
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [replyText, setReplyText] = useState('');
    const [newIssue, setNewIssue] = useState({ issue: '', repotedBy: '' });

    const token = JSON.parse(localStorage.getItem("token")) || "";
    const BaseUrl = process.env.REACT_APP_Base_Url;

    const dropdownOptions = ['Pending', 'Resolve', 'In Progress'];

    // Fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/api/user/issue-reports`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            setUsers(response.data);
            setFilteredUsers(response.data);
        } catch (error) {
            console.error('Error fetching data:', error);
        }
    };

    const openModal = (user) => {
        setCurrentUser(user);
        setIsModalOpen(true);
    };

    const closeModal = () => {
        setIsModalOpen(false);
        setReplyText('');
    };

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewIssue({ issue: '', repotedBy: '' });
    };

    const handleSendReply = async () => {
        // Handle the reply logic here
        try {
            await axios.patch(`${BaseUrl}/api/user/issue-reports/${currentUser._id}`, { reply: replyText }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Update the local state
            setUsers(users.map(user => user._id === currentUser._id ? { ...user, reply: replyText} : user));
            fetchData();
        } catch (error) {
            console.error('Error sending reply:', error);
        }
        closeModal();
    };

    const handleCreateIssue = async () => {
        // Handle the create issue logic here
        try {
            const response = await axios.post(`${BaseUrl}/api/user/issue-reports`, newIssue, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Update the local state
            fetchData();
            setFilteredUsers([...users, response.data]);
        } catch (error) {
            console.error('Error creating issue:', error);
        }
        closeCreateModal();
    };

    const handleDeleteIssue = async (id) => {
        try {
            await axios.delete(`${BaseUrl}/api/user/issue-reports/${id}`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Update the local state
            const updatedUsers = users.filter(user => user._id !== id);
            setUsers(updatedUsers);
            setFilteredUsers(updatedUsers);
        } catch (error) {
            console.error('Error deleting issue:', error);
        }
    };

    const handleChangeStatus = async (id, status) => {
        try {
            await axios.patch(`${BaseUrl}/api/user/issue-reports/${id}`, { status }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Update the local state
            setUsers(users.map(user => user._id === id ? { ...user, status } : user));
            
            setFilteredUsers(users.map(user => user._id === id ? { ...user, status } : user));
            fetchData();
        } catch (error) {
            console.error('Error updating status:', error);
        }
    };

    const handleSearch = (event) => {
        const searchValue = event.target.value.toLowerCase();
        setSearchTerm(searchValue);
        const filtered = users.filter(user =>
            user.issueId.toLowerCase().includes(searchValue) ||
            new Date(user.repotedTime).toLocaleString().toLowerCase().includes(searchValue) ||
            (user.repotedBy && user.repotedBy.name.toLowerCase().includes(searchValue)) ||
            (user.repotedBy && user.repotedBy.email.toLowerCase().includes(searchValue)) ||
            user.status.toLowerCase().includes(searchValue) ||
            (user.reply && user.reply.toLowerCase().includes(searchValue))
        );
        setFilteredUsers(filtered);
    };

    useEffect(() => {
        fetchData();
    }, [token, BaseUrl]);

    return (
        <Urlprotected path="Admin">
        <>
            <div className='flex gap-[30px] h-[100vh] md:overflow-y-hidden '>
                <div className="max-sm:hidden"> <SuperAdminSide /></div>
                <div className='w-[100%] mr-[12px] max-sm:ml-[10px] '>
                    <div className="sm:hidden ml-[10px]"> <MobileNav /> </div>
                    <div className='max-sm:hidden'> <SuperAdminNavbar Navtext={"Issue Reported"} /></div>
                    <p className='rounded font-bold pb-[12px] pr-[12px] pt-[12px] pl-[0px]'>All Reported Issues</p>
                    <div className='flex justify-end'>
                        <input
                            type="text"
                            placeholder="Search by issue ID..."
                            value={searchTerm}
                            onChange={handleSearch}
                            className="mb-4 mr-2 px-4 py-2 border border-gray-300 rounded "
                        />
                    </div>
                    <div className='shadow-md overflow-x-auto'>
                        <table className="w-full md:max-w-[calc(100% - 20px)] bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-2 bg-blue-500 text-white border-b">Sl No.</th>
                                    <th className="py-2 px-2 bg-blue-500 text-white border-b">Issue ID</th>
                                    <th className="py-2 px-2 bg-blue-500 text-white border-b">Issue</th>
                                    <th className="py-2 px-2 bg-blue-500 text-white border-b">Reported Time</th>
                                    <th className="py-2 px-2 bg-blue-500 text-white border-b">Reported By</th>
                                    <th className="py-2 px-2 bg-blue-500 text-white border-b">Action</th>
                                    <th className="py-2 px-2 bg-blue-500 text-white border-b">Send Reply</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers.map((user, index) => (
                                    <tr key={index}>
                                        <td className="py-2 px-4 border-b">{index + 1}</td>
                                        <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{user && user.issueId}</td>
                                        <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{user && user.issue}</td>
                                        <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{new Date(user.repotedTime).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{user && user.repotedBy && user.repotedBy.name} ({user && user.repotedBy && user.repotedBy.email})</td>
                                        <td className="py-2 px-4 border-b flex items-center">
                                            <div className="flex gap-2 items-center">
                                                <MdDelete className='text-red-500 cursor-pointer' onClick={() => handleDeleteIssue(user._id)} />
                                                <select
                                                    value={user.status}
                                                    onChange={(e) => handleChangeStatus(user._id, e.target.value)}
                                                    className="ml-2 border border-gray-300 rounded"
                                                >
                                                    {dropdownOptions.map((option) => (
                                                        <option key={option} value={option}>
                                                            {option}
                                                        </option>
                                                    ))}
                                                </select>
                                            </div>
                                        </td>
                                        <td className="py-2  border-b">
                                            <button
                                                onClick={() => openModal(user)}
                                                className="bg-blue-500 text-white px-2 py-1 rounded"
                                            >
                                                Send Reply
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-[500px]">
                        <h2 className="text-xl font-bold mb-4">Send Reply</h2>
                        <textarea
                            value={replyText}
                            onChange={(e) => setReplyText(e.target.value)}
                            className="w-full border border-gray-300 p-2 rounded mb-4"
                            rows="5"
                            placeholder="Type your reply here..."
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                onClick={closeModal}
                                className="bg-gray-500 text-white px-4 py-1 rounded mr-2 w-fit"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleSendReply}
                                className="bg-blue-500 text-white px-4 py-1 rounded w-fit"
                            >
                                Send
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {isCreateModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                    <div className="bg-white p-4 rounded shadow-lg w-[500px]">
                        <h2 className="text-xl font-bold mb-4">Create Issue</h2>
                        <textarea
                            value={newIssue.issue}
                            onChange={(e) => setNewIssue({ ...newIssue, issue: e.target.value })}
                            className="w-full border border-gray-300 p-2 rounded mb-4"
                            rows="5"
                            placeholder="Describe the issue here..."
                        ></textarea>
                        <div className="flex justify-end">
                            <button
                                onClick={closeCreateModal}
                                className="bg-gray-500 text-white px-4 py-1 rounded mr-2 w-fit"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleCreateIssue}
                                className="bg-green-500 text-white px-4 py-1 rounded w-fit"
                            >
                                Create
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
        </Urlprotected>
    );
};

export default SuperAdminIssueReport;
