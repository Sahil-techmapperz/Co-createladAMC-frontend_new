import React, { useState, useEffect } from 'react';
import SuperAdminSide from '../SuparAdmin/SuperAdminSide/SuperAdminSide';
import SuperAdminNavbar from '../SuparAdmin/SuperAdminNav/SuperAdminNav';
import { Link } from 'react-router-dom';
import Modal from '../../components/Modal';
import Urlprotected from '../../components/Urlprotected';




const AdminProfile = () => {
    const BaseUrl = process.env.REACT_APP_Base_Url;
    const token = JSON.parse(localStorage.getItem("token")) || "";
    const [filesData, setFilesData] = useState({
        introductionVideoUrl: null,
        profilePicture: null,
        idProofUrl: null,
    });
    const [showEditIcon, setShowEditIcon] = useState(false);
    const [userData, setUserData] = useState({});
    const [showModal, setShowModal] = useState({
        editProfilePic: false,
    });
    const [loading, setLoading] = useState(false);

    const GetUserdata = () => {
        const url = `${BaseUrl}/api/user/userdata`;
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
                    setUserData(prevState => ({ ...prevState, ...data }));
                }
            })
            .catch(error => {
                console.error('Error fetching user data:', error);
            });
    };

    const handleFileChange = (e) => {
        setFilesData({ ...filesData, profilePicture: e.target.files[0] });
    };

    const uploadProfileImage = async () => {
        if (!filesData.profilePicture) {
            console.error("No profile picture file selected");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('profilePicture', filesData.profilePicture);

        const url = `${BaseUrl}/api/user/profilePicture`;
        try {
            const response = await fetch(url, {
                method: "POST",
                headers: {
                    "Authorization": `Bearer ${token}`
                },
                body: formData
            });
            const data = await response.json();
            if (response.ok) {
                setUserData(prev => ({ ...prev, profilePictureUrl: data.url }));
                closeModal("editProfilePic");
                GetUserdata();
            } else {
                throw new Error(data.error || 'Failed to upload profile picture');
            }
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const closeModal = (modalName) => {
        setShowModal({ ...showModal, [modalName]: false });
    };

    useEffect(() => {
        GetUserdata();
    }, []);

    const placeholderImage = 'https://via.placeholder.com/150';

    return (
        <Urlprotected path="Admin">
        <div className='flex gap-[30px] bg-gray-100 h-[100vh] overflow-hidden'>
            <div className="max-sm:hidden">
                <SuperAdminSide liname={"My Profile"} />
            </div>
            <div className='myAccount_body mr-[12px] overflow-x-hidden overflow-y-scroll w-full'>
                <SuperAdminNavbar Navtext={"My Profile"} />
                <div className='m-[20px] text-[18px] font-[600]'>
                    <Link to={"/"}>Dashboard</Link> &gt; <Link to={'/superAdminAccount'}>My Account</Link> &gt; <u>Profile</u>
                </div>

                <div className='p-5 bg-white shadow-lg rounded-lg'>
                    <div className='flex gap-5 justify-center items-center'>
                        <div className="relative w-40 h-40" onMouseEnter={() => setShowEditIcon(true)} onMouseLeave={() => setShowEditIcon(false)}>
                            <img src={userData.profilePictureUrl || placeholderImage} alt="Profile" className='w-full h-full rounded-full' />
                            {showEditIcon && (
                                <div className="absolute inset-0 bg-black bg-opacity-50 flex justify-center items-center rounded-full">
                                    <button
                                        className="text-white cursor-pointer text-3xl"
                                        onClick={() => setShowModal({ ...showModal, editProfilePic: true })}
                                    >
                                        ✏️
                                    </button>
                                </div>
                            )}
                        </div>
                        <div className='flex-1'>
                            <h3 className='text-xl font-semibold'>Name: {userData.name || "Not available"}</h3>
                            <p className='text-gray-700'>Email: {userData.email || "Not available"}</p>
                            <p className='text-gray-700'>Professional details: {userData.professionalDetails || "Not available"}</p>
                            <p className='text-gray-700'>Bio: {userData.bio || "Not available"}</p>
                            <p className='text-gray-700'>Languages: {userData.languages?.length > 0 ? userData.languages.join(", ") : "Not available"}</p>
                            <p className='text-gray-700'>Expertise: {userData.expertise?.length > 0 ? userData.expertise.join(", ") : "Not available"}</p>
                            <p className='text-gray-700'>Contact: {userData.contactNumber || "Not available"}</p>
                            <p className='text-gray-700'>Website: <a href={userData.website || "#"} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer">{userData.website || "Not available"}</a></p>
                            <div className='text-gray-700'>Social Media:
                                <a href={userData.socialMediaLinks?.linkedin || "#"} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer"> LinkedIn</a> |
                                <a href={userData.socialMediaLinks?.twitter || "#"} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer"> Twitter</a> |
                                <a href={userData.socialMediaLinks?.facebook || "#"} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer"> Facebook</a>
                            </div>
                        </div>
                    </div>
                </div>

                {showModal.editProfilePic && (
                    <Modal isOpen={showModal.editProfilePic} closeModal={() => closeModal('editProfilePic')} className="bg-white p-6 rounded-lg shadow-lg mx-auto my-12 max-w-md">
                        <form onSubmit={(e) => { e.preventDefault(); uploadProfileImage(); }}>
                            <h2 className="text-lg font-semibold text-center">Edit Profile Picture</h2>
                            <input
                                className="form-input px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 w/full"
                                type="file"
                                name="profilePicture"
                                onChange={handleFileChange}
                                accept="image/*"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer w/full transition duration-150 ease-in-out"
                            >
                                {loading ? "Uploading..." : "Upload"}
                            </button>
                        </form>
                        {loading && <p className="text-center mt-4 text-gray-700">Uploading...</p>}
                    </Modal>
                )}
            </div>
        </div>
        </Urlprotected>
    )
}

export default AdminProfile;
