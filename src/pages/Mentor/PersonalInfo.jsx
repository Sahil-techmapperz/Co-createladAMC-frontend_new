import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Sidebar from '../../components/Sidebar.jsx';
import Navbar from '../../components/Navbar.jsx';
import Modal from '../../components/Modal.jsx';
import PersonalEdit from '../../components/PersonalEdit.jsx';
import Port1 from './../../assets/svg.png';
import Port2 from './../../assets/svg (1).png';
import Port3 from './../../assets/svg (2).png';
import Urlprotected from '../../components/Urlprotected.jsx';

const PersonalInfo = () => {
    const token = JSON.parse(localStorage.getItem("token")) || "";
    const BaseUrl = process.env.REACT_APP_Base_Url;
    
    const [formData, setFormData] = useState({});
    const [updateFormData, setUpdateFormData] = useState({
        name: "",
        email: "",
        role: "",
        phone: "",
        website: "",
        linkedin: "",
        twitter: "",
        facebook: "",
        location: {
            timeZone: "",
            country: "",
            state: "",
            city: ""
        },
        languages: "",
        skills: "",
        bio: "",
        professionalDetails: "",
    });
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setUpdateFormData({ ...formData });
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setUpdateFormData(prevState => ({
                ...prevState,
                [parent]: {
                    ...prevState[parent],
                    [child]: value
                }
            }));
        } else {
            setUpdateFormData(prevState => ({
                ...prevState,
                [name]: value
            }));
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        let updateData= { ...updateFormData,contactNumber:updateFormData.phone}

        const url = `${BaseUrl}/api/user/updateuser`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateData)
        })
        .then(response => {
            if (!response.ok) {
                throw new Error('Network response was not ok ' + response.statusText);
            }
            return response.json();
        })
        .then(data => {
            console.log('Success:', data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            fetchUserData();
        })
        .catch(error => {
            console.error('Error:', error);
        });

        closeModal();
    };

    const fetchUserData = () => {
        const url = `${BaseUrl}/api/user/userdata`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        })
        .then(response => response.json())
        .then(user => {
            const userdata = {
                name: user.name || "",
                email: user.email || "",
                role: user.role || "",
                phone: user.contactNumber || "",
                website: user.website || "",
                linkedin: user.socialMediaLinks?.linkedin || "",
                twitter: user.socialMediaLinks?.twitter || "",
                facebook: user.socialMediaLinks?.facebook || "",
                location: user.location || { timeZone: "", country: "", state: "", city: "" },
                languages: user.languages || "",
                skills: user.skills || "",
                bio: user.bio || "",
                professionalDetails: user.professionalDetails || "",
            };
            setFormData(userdata);
        });
    };

    useEffect(() => {
        fetchUserData();
    }, []);

    return (
        <Urlprotected path="Mentor">
        <div className='flex gap-2'>
            <div className="hidden sm:block">
                <Sidebar liname={"Personal Info"} />
            </div>
            <div className='flex flex-col w-full h-[100vh] overflow-y-auto py-[15px]'>
                <Navbar Navtext={"Personal Info"} />
                <div className='m-[20px] text-[18px] font-[600]'>
                    <Link to={"/"}>Dashboard</Link> &gt; <Link to={'/Myaccounts'}>My Account</Link> &gt; Personal Info
                </div>
                <div className='p-4'>
                    <Modal className="w-[500px] h-[80vh] overflow-y-auto" isOpen={isModalOpen} closeModal={closeModal}>
                        <form onSubmit={handleSubmit}>
                            <div className='grid grid-cols-2 gap-2 mt-4'>
                                {Object.keys(formData).filter(key => key !== "location").map(key => (
                                    <React.Fragment key={key}>
                                        {key === "professionalDetails" || key === "bio" ? (
                                            <textarea
                                                name={key}
                                                value={updateFormData[key] || ''}
                                                onChange={handleChange}
                                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                                className="col-span-2 m-2 border py-1 px-2 rounded min-h-[100px]"
                                            />
                                        ) : (
                                            <input
                                                readOnly={key === "role"}
                                                type="text"
                                                name={key}
                                                value={updateFormData[key] || ''}
                                                onChange={handleChange}
                                                placeholder={key.charAt(0).toUpperCase() + key.slice(1)}
                                                className={`${key === "skills" ? "col-span-2" : ""} m-2 border py-1 px-2 rounded`}
                                            />
                                        )}
                                    </React.Fragment>
                                ))}
                            </div>
                            <button type="submit" className='bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded'>
                                Save Changes
                            </button>
                        </form>
                    </Modal>

                    <div className='flex flex-wrap gap-5'>
                        <div className='flex-1 min-w-[320px]'>
                            {Object.keys(formData).map(key => (
                                key === "location" ? (
                                    <PersonalEdit
                                        key={key}
                                        Openmodal={openModal}
                                        title={key}
                                        content={`${formData.location.city}, ${formData.location.state}, ${formData.location.country} (${formData.location.timeZone})`}
                                        actionText={"Edit"}
                                    />
                                ) : (
                                    <PersonalEdit
                                        key={key}
                                        Openmodal={openModal}
                                        title={key}
                                        content={formData[key] || `Add ${key}`}
                                        actionText={formData[key] ? "Edit" : "Add"}
                                    />
                                )
                            ))}
                        </div>
                        <div className='md:w-1/3 w-full bg-gray-100 p-4 rounded-lg'>
                            <div className='my-4'>
                                <img src={Port1} alt="Info Security" />
                                <p className='text-lg font-bold my-2'>Why isn’t my info shown here?</p>
                                <p>We’re hiding some account details to protect your identity.</p>
                            </div>
                            <div className='my-4'>
                                <img src={Port2} alt="Editable Details" />
                                <p className='text-lg font-bold my-2'>Which details can be edited?</p>
                                <p>Details used to verify your identity can’t be changed. Contact info and some personal details can be edited, but we may ask you to verify your identity the next time you book or create a listing.</p>
                            </div>
                            <div className='my-4'>
                                <img src={Port3} alt="Shared Info" />
                                <p className='text-lg font-bold my-2'>What info is shared with others?</p>
                                <p>Only releases contact information for Hosts and guests after a reservation is confirmed.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
        </Urlprotected>
    );
}

export default PersonalInfo;
