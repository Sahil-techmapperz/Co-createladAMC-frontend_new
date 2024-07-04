import React, { useEffect, useState } from 'react';
import { MdDelete } from "react-icons/md";
import SuperAdminSide from '../SuperAdminSide/SuperAdminSide';
import MobileNav from '../../../components/Mobile/MobileNav';
import SuperAdminNavbar from '../SuperAdminNav/SuperAdminNav';
import { CiEdit } from "react-icons/ci";
import Modal from '../../../components/Modal';
import ConfirmationDialog from '../../../components/ConfirmationDialog';
import Urlprotected from '../../../components/Urlprotected';

const SuperAdminUserTable = () => {
    const BaseUrl = process.env.REACT_APP_Base_Url;
    const token = JSON.parse(localStorage.getItem("token")) || "";
    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [Editusers, setEditUsers] = useState({});
    const [modalOpen, setModalOpen] = useState(false);
    const [EditmodalOpen, setEditModalOpen] = useState(false);
    const [showDialog, setShowDialog] = useState(false);
    const [Deleteid, setDeleteId] = useState();
    const [formData, setFormData] = useState({
        email: '',
        name: '',
        password: '',
        role: '',
        rate: 0
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prevFormData => {
            return { ...prevFormData, [name]: value };
        });
    };

    const handleEditChange = (e) => {
        const { name, value } = e.target;
        setEditUsers(prevFormData => {
            return { ...prevFormData, [name]: value };
        });
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        setModalOpen(false); // Close the modal on form submission

        const url = `${BaseUrl}/api/user/addmentor`;
        fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(formData)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                if (data.user) {
                    setUsers(prev => [...prev, data.user]);
                    setFilteredUsers(prev => [...prev, data.user]); // Add to filtered users as well
                } else {
                    throw new Error('No user data in response');
                }
            })
            .catch(error => {
                console.error('Error adding a new mentor:', error);
            });
    };

    const handleEditSubmit = (e) => {
        e.preventDefault();
        setEditModalOpen(false); // Close the modal on form submission

        const url = `${BaseUrl}/api/user/edituser`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(Editusers)
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(data => {
                const updatedData = users.map(user => user._id === data.user._id ? data.user : user);
                setUsers(updatedData);
                setFilteredUsers(updatedData);
            })
            .catch(error => {
                console.error('Error updating mentor:', error);
            });
    };

    const handleDelete = () => {
        const url = `${BaseUrl}/api/user/deleteuser`;
        fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify({ "_id": Deleteid })
        })
            .then(response => response.json())
            .then((res) => {
                const updatedData = users.filter(user => user._id !== Deleteid);
                setUsers(updatedData);
                setFilteredUsers(updatedData);
                setShowDialog(false);
            })
            .catch((error) => {
                console.error('Error:', error);
                setShowDialog(false);
            });
    };

    const handleOpenModal = () => {
        setModalOpen(true);
    };

    const handleCloseModal = () => {
        setModalOpen(false);
    };

    const handleEditOpenModal = (data) => {
        setEditUsers(data);
        setEditModalOpen(true);
    };

    const handleEditCloseModal = () => {
        setEditUsers({});
        setEditModalOpen(false);
    };

    const handleDialogClose = () => {
        setShowDialog(false);
    };

    const handleDeleteClick = (id) => {
        setDeleteId(id);
        setShowDialog(true);
    };

    const GetUserdata = () => {
        const url = `${BaseUrl}/api/user/alluserforadmin`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
            .then(response => response.json())
            .then(data => {
                if (data) {
                    setUsers(data);
                    setFilteredUsers(data);
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    const handleSearch = (e) => {
        const query = e.target.value;
        setSearchQuery(query);
    
        if (query) {
            const filtered = users.filter(user => 
                (user.name && user.name.toLowerCase().includes(query.toLowerCase())) ||
                (user.email && user.email.toLowerCase().includes(query.toLowerCase())) ||
                (user.contactNumber && user.contactNumber.toLowerCase().includes(query.toLowerCase()))
            );
            setFilteredUsers(filtered);
        } else {
            setFilteredUsers(users);
        }
    };
    

    useEffect(() => {
        GetUserdata();
    }, []);

    return (
        <Urlprotected path="Admin">
            <div className='flex flex-col md:flex-row h-screen md:h-full bg-gray-100'>
                <div className="max-sm:hidden"><SuperAdminSide liname={"Super Admin Table"} /></div>
                <div className='w-full md:w-[calc(100% - 250px)] mx-4 md:mx-0 md:ml-4'>
                    <div className="sm:hidden ml-4"><MobileNav /></div>
                    <div className='max-sm:hidden'><SuperAdminNavbar Navtext={"Users"} /></div>

                    <div className='max-sm:hidden flex flex-col md:flex-row items-center justify-between mt-4 md:mt-8'>
                        <div className="md:ml-4">
                            <p className='text-lg font-bold'>Manage Users</p>
                            <p className='text-gray-600'>Administer and oversee user accounts and privileges within the platform.</p>
                        </div>
                        <div className='flex gap-4 mt-4 md:mt-0'>
                            <button onClick={handleOpenModal} className="text-white bg-blue-500 h-10 md:h-[40px] w-24 md:w-[150px] flex justify-center items-center rounded-lg">Add User</button>
                        </div>
                    </div>

                    <div className="sm:hidden flex flex-col gap-2 mt-4 md:mt-8">
                        <p className='text-lg font-bold ml-4'>Manage Users</p>
                        <div className='flex gap-4 ml-4'>
                            <button className="text-white bg-blue-500 h-10 w-24 flex justify-center items-center rounded-lg">Add User</button>
                        </div>
                    </div>
                    <div className="sm:hidden ml-4">
                        <p>Administer and oversee user accounts and privileges within the platform.</p>
                    </div>

                    <div className='mt-4 md:mt-8'>
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={handleSearch}
                            placeholder="Search users by name or email or contact"
                            className="shadow border rounded w-[350px] py-2 px-3 text-gray-700 leading-tight"
                        />
                    </div>

                    <div className='shadow-sm ring-2 ring-gray-300 ring-opacity-50 overflow-x-auto mt-4 md:mt-8'>
                        <table className="w-full md:max-w-[calc(100% - 20px)] bg-white border border-gray-300">
                            <thead>
                                <tr>
                                    <th className="py-2 px-4 text-nowrap bg-blue-500 text-white border-b">Sl No.</th>
                                    <th className="py-2 px-4 text-nowrap bg-blue-500 text-white border-b">Name</th>
                                    <th className="py-2 px-4 text-nowrap bg-blue-500 text-white border-b">Role</th>
                                    <th className="py-2 px-4 text-nowrap bg-blue-500 text-white border-b">Email</th>
                                    <th className="py-2 px-4 text-nowrap bg-blue-500 text-white border-b">Contact Number</th>
                                    <th className="py-2 px-4 text-nowrap bg-blue-500 text-white border-b">Account Created At</th>
                                    <th className="py-2 px-4 text-nowrap bg-blue-500 text-white border-b">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {filteredUsers && filteredUsers.map((user, index) => (
                                    <tr key={user._id}>
                                        <td className="py-2 px-4 border-none ">{index + 1}</td>
                                        <td className="py-2 px-4 border-none ">{user.name}</td>
                                        <td className="py-2 px-4 border-none ">{user.role === "Client" ? "Mentee" : user.role}</td>
                                        <td className="py-2 px-4 border-none ">{user.email}</td>
                                        <td className="py-2 px-4 border-none ">{user.contactNumber}</td>
                                        <td className="py-2 px-4 border-none ">{new Date(user.createdAt).toLocaleString()}</td>
                                        <td className="py-2 px-4 border-none flex gap-[30px]">
                                            <CiEdit onClick={() => handleEditOpenModal(user)} className='cursor-pointer' />
                                            <MdDelete onClick={() => handleDeleteClick(user._id)} className='text-red-500 cursor-pointer' />
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                <ConfirmationDialog
                    show={showDialog}
                    onClose={handleDialogClose}
                    onConfirm={handleDelete}
                    message="Are you sure you want to delete this user?"
                />

                <Modal isOpen={modalOpen} closeModal={handleCloseModal}>
                    <form onSubmit={handleSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input type="email" name="email" value={formData.email} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input type="text" name="name" value={formData.name} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="password" className="block text-gray-700 text-sm font-bold mb-2">Password:</label>
                            <input type="password" name="password" value={formData.password} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 mb-3 leading-tight" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role:</label>
                            <select type="text" name="role" value={formData.role} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight">
                                <option value="Admin">Admin</option>
                                <option value="Mentor">Mentor</option>
                                <option value="Client">Mentee</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="rate" className="block text-gray-700 text-sm font-bold mb-2">Rate:</label>
                            <input type="number" name="rate" value={formData.rate} onChange={handleChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                        </div>

                        <div className="flex items-center justify-between">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Add Mentor</button>
                        </div>
                    </form>
                </Modal>

                <Modal isOpen={EditmodalOpen} closeModal={handleEditCloseModal}>
                    <form onSubmit={handleEditSubmit} className="bg-white p-6 rounded-lg shadow-lg">
                        <div className="mb-4">
                            <label htmlFor="email" className="block text-gray-700 text-sm font-bold mb-2">Email:</label>
                            <input type="email" name="email" value={Editusers.email || ''} onChange={handleEditChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="name" className="block text-gray-700 text-sm font-bold mb-2">Name:</label>
                            <input type="text" name="name" value={Editusers.name || ''} onChange={handleEditChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                        </div>

                        <div className="mb-4">
                            <label htmlFor="role" className="block text-gray-700 text-sm font-bold mb-2">Role: {Editusers.role && Editusers.role === "Client" ? "Mentee" : Editusers.role}</label>
                            <select
                                name="role"
                                value={Editusers.role || ''}
                                onChange={handleEditChange}
                                required
                                className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight"
                            >
                                <option value="" disabled>
                                    Select a role
                                </option>
                                <option value="Admin">Admin</option>
                                <option value="Mentor">Mentor</option>
                                <option value="Client">Mentee</option>
                            </select>
                        </div>

                        <div className="mb-6">
                            <label htmlFor="rate" className="block text-gray-700 text-sm font-bold mb-2">Rate:</label>
                            <input type="number" name="rate" value={Editusers.rate || ''} onChange={handleEditChange} required className="shadow border rounded w-full py-2 px-3 text-gray-700 leading-tight" />
                        </div>

                        <div className="flex items-center justify-between">
                            <button type="submit" className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline">Edit Mentor</button>
                        </div>
                    </form>
                </Modal>
            </div>
        </Urlprotected>
    );
};

export default SuperAdminUserTable;
