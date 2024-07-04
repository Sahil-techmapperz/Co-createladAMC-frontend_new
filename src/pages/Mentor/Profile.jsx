import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar';
import Navbar from '../../components/Navbar';
import Modal from '../../components/Modal';
import TimezoneSelect from 'react-timezone-select';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { Country, State, City } from 'country-state-city';
import Urlprotected from '../../components/Urlprotected';

const Profile = () => {
    const BaseUrl = process.env.REACT_APP_Base_Url;
    const token = JSON.parse(localStorage.getItem("token")) || "";

    const [userData, setUserData] = useState();

    const [showModal, setShowModal] = useState({
        editProfilePic: false,
        editVideo: false,
        editIdProof: false,
        editLocation: false
    });

    const [filesData, setFilesData] = useState({
        profilePicture: null,
        introductionVideo: null,
        idProof: null
    });

    const [loading, setLoading] = useState(false);

    const [locations, setLocations] = useState({
        countries: countryList().getData(),
        states: [],
        cities: []
    });

    const fetchUserData = async () => {
        const url = `${BaseUrl}/api/user/userdata`;
        try {
            const response = await fetch(url, {
                method: "GET",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                }
            });
            const data = await response.json();
            if (response.ok) {
                setUserData(prev => ({ ...prev, ...data }));
                updateLocationData(data.location.country, data.location.state);
            } else {
                throw new Error(data.error || 'Error fetching user data');
            }
        } catch (error) {
            console.error('Error:', error.message);
        }
    };

    const updateLocationData = (country, state) => {
        if (country) {
            const countryISO = Country.getAllCountries().find(c => c.name === country)?.isoCode;
            if (countryISO) {
                const states = State.getStatesOfCountry(countryISO);
                setLocations(prev => ({
                    ...prev,
                    states: states.map(s => ({ label: s.name, value: s.isoCode })),
                    cities: []
                }));

                if (state) {
                    const stateISO = states.find(s => s.name === state)?.isoCode;
                    if (stateISO) {
                        const cities = City.getCitiesOfState(countryISO, stateISO);
                        setLocations(prev => ({
                            ...prev,
                            cities: cities.map(c => ({ label: c.name, value: c.name }))
                        }));
                    }
                }
            }
        }
    };

    const handleSelectChange = (value, field) => {
        setUserData(prev => ({
            ...prev,
            location: {
                ...prev.location,
                [field]: value.label
            }
        }));

        if (field === 'country') {
            updateLocationData(value.label, null);
        } else if (field === 'state') {
            updateLocationData(userData.location.country, value.label);
        }
    };

    const handleFileChange = (e) => {
        const { name, files } = e.target;
        setFilesData(prev => ({ ...prev, [name]: files[0] }));
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
                fetchUserData();
            } else {
                throw new Error(data.error || 'Failed to upload profile picture');
            }
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const uploadIntroductionVideo = async () => {
        if (!filesData.introductionVideo) {
            console.error("No introduction video file selected");
            return;
        }

        setLoading(true);

        const formData = new FormData();
        formData.append('video', filesData.introductionVideo);

        const url = `${BaseUrl}/api/user/introductionVideo`;
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
                setUserData(prev => ({ ...prev, introductionVideoUrl: data.url }));
                closeModal("editVideo");
                fetchUserData();
            } else {
                throw new Error(data.error || 'Failed to upload introduction video');
            }
        } catch (error) {
            console.error('Error:', error.message);
        } finally {
            setLoading(false);
        }
    };

    const handleFileSubmit = (fileType) => {
        if (fileType === 'profilePicture') {
            uploadProfileImage();
        } else if (fileType === 'introductionVideo') {
            uploadIntroductionVideo();
        }
    };

    const handleLocationSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        closeModal('editLocation');
        const { timeZone, country, state, city } = userData.location;
        const url = `${BaseUrl}/api/user/${userData._id}/location`;

        const locationData = {
            timeZone,
            country,
            state,
            city
        };

        try {
            const response = await fetch(url, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify(locationData)
            });
            const data = await response.json();
            if (response.ok) {
                setUserData(prev => ({ ...prev, location: data.location }));
                fetchUserData();
            } else {
                throw new Error(data.error || 'Failed to update location');
            }
        } catch (error) {
            console.error('Error updating location:', error);
        } finally {
            setLoading(false);
        }
    };

    const openModal = (modalType) => setShowModal(prev => ({ ...prev, [modalType]: true }));
    const closeModal = (modalType) => setShowModal(prev => ({ ...prev, [modalType]: false }));

    useEffect(() => {
        fetchUserData();
    }, [BaseUrl, token]);

    return (
        <Urlprotected path="Mentor">
            <div className='flex gap-[30px] bg-gray-100 h-[100vh] overflow-hidden'>
                <div className="max-sm:hidden">
                    <Sidebar liname={"My Account"} />
                </div>
                <div className='myAccount_body mr-[12px] overflow-x-hidden overflow-y-scroll w-full'>
                    <Navbar Navtext={"My Account"} />
                    <div className='m-[20px] text-[18px] font-[600]'>
                        <Link to={"/"}>Dashboard</Link> &gt; <Link to={'/Myaccounts'}>My Account</Link> &gt; <u>Profile</u>
                    </div>

                    <div className='p-5 bg-white shadow-lg rounded-lg'>
                        <div className='flex gap-5 justify-center items-center'>
                            <div className="relative w-40 h-40">
                                <img src={userData && userData.profilePictureUrl || 'https://via.placeholder.com/150'} alt="Profile" className='w-full h-full rounded-full' />
                                <div className="absolute bottom-0 right-0 mb-2 mr-2 bg-black bg-opacity-50 flex justify-center items-center rounded-full p-1">
                                    <button
                                        className="text-white cursor-pointer text-3xl"
                                        onClick={() => openModal('editProfilePic')}
                                    >
                                        ✏️
                                    </button>
                                </div>
                            </div>
                            <div className='flex-1'>
                                <h3 className='text-xl font-semibold'>Name: {userData && userData.name || "Not available"}</h3>
                                <p className='text-gray-700'>Email: {userData && userData.email || "Not available"}</p>
                                <p className='text-gray-700'>Professional details: {userData && userData.professionalDetails || "Not available"}</p>
                                <p className='text-gray-700'>Bio: {userData && userData.bio || "Not available"}</p>
                                <p className='text-gray-700'>
                                    Location: {`${userData && userData.location && userData.location.city || "Not available"}, ${userData && userData.location && userData.location.state || "Not available"}, ${userData && userData.location && userData.location.country || "Not available"} (${userData && userData.location && userData.location.timeZone || "Not available"})`}
                                </p>

                                <p className='text-gray-700'>Languages: {userData && userData.languages && userData.languages.join(", ") || "Not available"}</p>
                                <p className='text-gray-700'>Expertise: {userData && userData.expertise && userData.expertise.join(", ") || "Not available"}</p>
                                <p className='text-gray-700'>Contact: {userData && userData.contactNumber || "Not available"}</p>
                                <p className='text-gray-700'>Website: <a href={userData && userData.website} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer">{userData && userData.website || "Not available"}</a></p>
                                <div className='text-gray-700'>Social Media:
                                    <a href={userData && userData.socialMediaLinks && userData.socialMediaLinks.linkedin} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer"> LinkedIn</a> |
                                    <a href={userData && userData.socialMediaLinks && userData.socialMediaLinks.twitter} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer"> Twitter</a> |
                                    <a href={userData && userData.socialMediaLinks && userData.socialMediaLinks.facebook} className='text-blue-500 hover:text-blue-600' target="_blank" rel="noopener noreferrer"> Facebook</a>
                                </div>
                                <button onClick={() => openModal('editLocation')} className="w-fit mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition duration-150 ease-in-out">
                                    {userData && userData.location && userData.location.timeZone ? "Edit Location" : "Add Location"}
                                </button>
                            </div>
                        </div>
                    </div>

                    <div className='grid grid-cols-1 gap-4'>
                        <div className='p-5 my-6 bg-white shadow-lg rounded-lg'>
                            <h1 className='text-xl font-bold text-gray-900 mb-4'>Introduction Video</h1>
                            <div>
                                {userData && userData.introductionvideoUrl ? (
                                    <video className='w-[400px] max-w-xl h-[200px] rounded-lg' controls>
                                        <source src={userData && userData.introductionvideoUrl} type="video/mp4" />
                                        Your browser does not support the video tag.
                                    </video>
                                ) : (
                                    <div className='flex justify-center items-center w-full h-60 bg-gray-200 rounded-lg'>
                                        <img src='https://via.placeholder.com/400x240' alt="Video Placeholder" className='max-w-full h-auto' />
                                    </div>
                                )}
                                <button onClick={() => openModal('editVideo')} className="w-fit mt-4 px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded transition duration-150 ease-in-out">
                                    {userData && userData.introductionvideoUrl ? "Update" : "Add"} Video
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                {showModal.editProfilePic && (
                    <Modal isOpen={showModal.editProfilePic} closeModal={() => closeModal('editProfilePic')} className="bg-white p-6 rounded-lg shadow-lg mx-auto my-12 max-w-md">
                        <form onSubmit={(e) => { e.preventDefault(); handleFileSubmit('profilePicture'); }}>
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

                {showModal.editVideo && (
                    <Modal isOpen={showModal.editVideo} closeModal={() => closeModal('editVideo')} className="bg-white p-6 rounded-lg shadow-lg mx-auto my-12 max-w-md">
                        <form onSubmit={(e) => { e.preventDefault(); handleFileSubmit('introductionVideo'); }}>
                            <h2 className="text-lg font-semibold text-center">Edit Introduction Video</h2>
                            <input
                                className="form-input px-4 py-2 border rounded-lg text-gray-700 focus:outline-none focus:border-blue-500 w/full"
                                type="file"
                                name="introductionVideo"
                                onChange={handleFileChange}
                                accept="video/*"
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

                {showModal.editLocation && (
                    <Modal isOpen={showModal.editLocation} closeModal={() => closeModal('editLocation')} className="bg-white p-6 rounded-lg shadow-lg mx-auto my-12 max-w-md">
                        <form onSubmit={handleLocationSubmit}>
                            <h2 className="text-lg font-semibold text-center">Edit Location</h2>
                            <TimezoneSelect
                                value={userData && userData.location && userData.location.timeZone || ''}
                                onChange={(selectedTimezone) => setUserData(prev => ({ ...prev, location: { ...prev.location, timeZone: selectedTimezone.value } }))}
                            />
                            <Select
                                options={locations.countries}
                                value={locations.countries.find(c => c.label === userData && userData.location && userData.location.country)}
                                onChange={(value) => handleSelectChange(value, 'country')}
                                placeholder="Select Country"
                                className="my-2"
                            />
                            <Select
                                options={locations.states}
                                value={locations.states.find(s => s.label === userData && userData.location && userData.location.state)}
                                onChange={(value) => handleSelectChange(value, 'state')}
                                placeholder="Select State"
                                className="my-2"
                            />
                            <Select
                                options={locations.cities}
                                value={locations.cities.find(c => c.label === userData && userData.location && userData.location.city)}
                                onChange={(value) => handleSelectChange(value, 'city')}
                                placeholder="Select City"
                                className="my-2"
                            />
                            <button
                                type="submit"
                                className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded cursor-pointer w/full transition duration-150 ease-in-out"
                            >
                                {loading ? "Updating..." : "Save"}
                            </button>
                        </form>
                        {loading && <p className="text-center mt-4 text-gray-700">Updating...</p>}
                    </Modal>
                )}
            </div>
        </Urlprotected>
    );
};

export default Profile;
