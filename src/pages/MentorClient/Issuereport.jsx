import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { MdDelete, MdEdit } from 'react-icons/md';
import Urlprotected from '../../components/Urlprotected';
import ClientSidebar from './ClientSidebar/ClientSidebar';
import ClientNavbar from './ClientNavbar/ClientNavbar';


const ClientIssueReport = () => {
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
    const [isEditModalOpen, setIsEditModalOpen] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [newIssue, setNewIssue] = useState({ issue: '', repotedBy: '' });
    const [editIssue, setEditIssue] = useState('');

    const token = JSON.parse(localStorage.getItem("token")) || "";
    const BaseUrl = process.env.REACT_APP_Base_Url;

    // Fetch data from the backend
    const fetchData = async () => {
        try {
            const response = await axios.get(`${BaseUrl}/api/user/issue-reportsbyuser`, {
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

    const openCreateModal = () => {
        setIsCreateModalOpen(true);
    };

    const closeCreateModal = () => {
        setIsCreateModalOpen(false);
        setNewIssue({ issue: '', repotedBy: '' });
    };

    const openEditModal = (user) => {
        setCurrentUser(user);
        setEditIssue(user.issue);
        setIsEditModalOpen(true);
    };

    const closeEditModal = () => {
        setIsEditModalOpen(false);
        setEditIssue('');
    };

    const handleCreateIssue = async () => {
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

    const handleEditIssue = async () => {
        try {
            await axios.patch(`${BaseUrl}/api/user/issue-reports/${currentUser._id}`, { issue: editIssue }, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            // Update the local state
            setUsers(users.map(user => user._id === currentUser._id ? { ...user, issue: editIssue } : user));
            fetchData();
        } catch (error) {
            console.error('Error editing issue:', error);
        }
        closeEditModal();
    };

    const handleDeleteIssue = async (id) => {
        const confirmed = window.confirm("Are you sure you want to delete this issue?");
        if (confirmed) {
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
        <Urlprotected path="Client">
            <div className="Calender flex gap-[30px] flex-col md:flex-row">
                <div className="hidden md:block">
                    <ClientSidebar liname={"IssueReport"} />
                </div>
                <div className="flex-1 mr-[15px]">
                    <ClientNavbar Navtext="IssueReport" />
                    <h2 className="text-xl text-center font-bold mt-[10px] text-gray-900">Issue Report</h2>
                    <div className="p-4 h-[80vh] overflow-y-auto">

                        <div className='flex justify-between'>

                            <button
                                onClick={openCreateModal}
                                className="bg-green-500 text-white px-4 py-2 rounded mb-4 w-fit"
                            >
                                Create Issue
                            </button>
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
                                        <th className="py-2 px-2 bg-blue-500 text-white border-b">Status</th>
                                        <th className="py-2 px-2 bg-blue-500 text-white border-b">Reported Time</th>
                                        <th className="py-2 px-2 bg-blue-500 text-white border-b">Reply</th>
                                        <th className="py-2 px-2 bg-blue-500 text-white border-b">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredUsers.map((user, index) => (
                                        <tr key={index}>
                                            <td className="py-2 px-4 border-b">{index + 1}</td>
                                            <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{user && user.issueId}</td>
                                            <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{user && user.issue}</td>
                                            <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{user && user.status}</td>
                                            <td className="py-2 px-4 border-b max-w-[200px] overflow-hidden overflow-ellipsis">{new Date(user.repotedTime).toLocaleString()}</td>
                                            <td className="py-2 px-4 border-b max-w-[200px] max-h-[100px] overflow-y-auto overflow-hidden">{user && user.reply ? user.reply : 'Admin has not yet sent any reply'}</td>
                                            <td className="py-2 px-4 border-0 flex items-center">
                                                <div className="flex gap-2 items-center">
                                                    <MdEdit className='text-blue-500 cursor-pointer' onClick={() => openEditModal(user)} />
                                                    <MdDelete className='text-red-500 cursor-pointer' onClick={() => handleDeleteIssue(user._id)} />
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>

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

                        {isEditModalOpen && (
                            <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                                <div className="bg-white p-4 rounded shadow-lg w-[500px]">
                                    <h2 className="text-xl font-bold mb-4">Edit Issue</h2>
                                    <textarea
                                        value={editIssue}
                                        onChange={(e) => setEditIssue(e.target.value)}
                                        className="w-full border border-gray-300 p-2 rounded mb-4"
                                        rows="5"
                                        placeholder="Edit the issue here..."
                                    ></textarea>
                                    <div className="flex justify-end">
                                        <button
                                            onClick={closeEditModal}
                                            className="bg-gray-500 text-white px-4 py-1 rounded mr-2 w-fit"
                                        >
                                            Cancel
                                        </button>
                                        <button
                                            onClick={handleEditIssue}
                                            className="bg-blue-500 text-white px-4 py-1 rounded w-fit"
                                        >
                                            Save
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Urlprotected>
    );
};

export default ClientIssueReport;
