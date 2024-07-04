import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import SuperAdminSide from '../SuparAdmin/SuperAdminSide/SuperAdminSide';
import SuperAdminNavbar from '../SuparAdmin/SuperAdminNav/SuperAdminNav';
import Modal from '../../components/Modal.jsx';
import PersonalEdit from '../../components/PersonalEdit.jsx';
import Port1 from './../../assets/svg.png';
import Port2 from './../../assets/svg (1).png';
import Port3 from './../../assets/svg (2).png';
import Urlprotected from '../../components/Urlprotected.jsx';

const AdminPersonalInfo = () => {
    const token = JSON.parse(localStorage.getItem("token")) || "";
    const BaseUrl = process.env.REACT_APP_Base_Url;
    const [formData, setFormData] = useState({});
    const [updateFormData, setUpdateFormData] = useState({});
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        setUpdateFormData({ ...formData });
        setModalOpen(true);
    };
    const closeModal = () => setModalOpen(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setUpdateFormData(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        const url = `${BaseUrl}/api/user/updateuser`;
        fetch(url, {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            },
            body: JSON.stringify(updateFormData)
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
                getUser();
            })
            .catch(error => {
                console.error('Error:', error);
            });

        closeModal();
    };

    const getUser = () => {
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
                name: user.name || "Not available",
                email: user.email || "Not available",
                role: user.role || "Not available",
                phone: user.contactNumber || "Not available",
                website: user.website || "Not available",
                linkedin: user.socialMediaLinks?.linkedin || "Not available",
                twitter: user.socialMediaLinks?.twitter || "Not available",
                facebook: user.socialMediaLinks?.facebook || "Not available",
                languages: user.languages?.join(", ") || "Not available",
                skills: user.skills?.join(", ") || "Not available",
                bio: user.bio || "Not available",
                professionalDetails: user.professionalDetails || "Not available",
            };
            setFormData(userdata);
        });
    };

    useEffect(() => {
        getUser();
    }, []);

    return (
        <Urlprotected path="Admin">
        <div className='flex gap-2'>
            <div className="hidden sm:block">
                <SuperAdminSide liname={"Personal Info"} />
            </div>
            <div className='flex flex-col w-full h-[100vh] overflow-y-auto py-[15px]'>
                <SuperAdminNavbar Navtext={"Personal Info"} />
                <div className='m-[20px] text-[18px] font-[600]'>
                    <Link to={"/"}>Dashboard</Link> &gt; <Link to={'/superAdminAccount'}>My Account</Link> &gt; Personal Info
                </div>
                <div className='p-4'>
                    <Modal className="w-[500px] h-[80vh] overflow-y-auto" isOpen={isModalOpen} closeModal={closeModal}>
                        <form onSubmit={handleSubmit}>
                            <div className='grid grid-cols-2 gap-2 mt-4 '>
                                {Object.keys(formData).map(key => (
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
                                <PersonalEdit
                                    key={key}
                                    Openmodal={openModal}
                                    title={key}
                                    content={formData[key]}
                                    actionText={formData[key] !== "Not available" ? "Edit" : "Add"}
                                />
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

export default AdminPersonalInfo;
