import React, { useState } from 'react';
import './superAdminAccount.css';
import Icon1 from '../../../assets/Icon (1).png';
import Icon2 from '../../../assets/Icon (2).png';
import Icon3 from '../../../assets/Icon (3).png';
import Icon4 from '../../../assets/Icon (4).png';
import Icon5 from '../../../assets/Icon (5).png';
import Icon6 from '../../../assets/Icon (6).png';
import Icon7 from '../../../assets/Icon (7).png';
import Icon8 from '../../../assets/Icon.png';
import { Link } from 'react-router-dom';
import SuperAdminSide from '../SuperAdminSide/SuperAdminSide';
import SuperAdminNavbar from '../SuperAdminNav/SuperAdminNav';
import Modal from "../../../components/Modal.jsx";
import Urlprotected from '../../../components/Urlprotected.jsx';

const gridItems = [
    { icon: Icon8, heading: 'Profile', description: 'personal details and how we can reach you', link: "/adminProfile" },
    { icon: Icon8, heading: 'Personal info', description: 'Provide personal details and how we can reach you', link: "/adminPersonalInfo" },
    { icon: Icon1, heading: 'Login & security', description: 'Update your password and secure your account', link: "/adminLoginSecruity" },
    // { icon: Icon2, heading: 'Payments & payouts', description: 'Review payments, payouts, coupons, and gift cards', link: "/adminMyWithdrawls" },
    { icon: Icon3, heading: 'Notifications', description: 'Choose notification preferences and how you want to be contacted', link: "/superAdminNoticeBoard" },
    // { icon: Icon5, heading: 'Privacy & sharing', description: 'Manage your personal data, connected services, and data sharing settings', link: "" },
    { icon: Icon7, heading: 'Delete Account', description: 'Add a work email for business trip benefits', link: "/DeleteAccount" }
];

const SuperAdminAccount = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => setIsModalOpen(true);
    const closeModal = () => setIsModalOpen(false);

    return (
        <Urlprotected path="Admin">
        <div className='flex gap-[30px] bg-gray-100 h-[100vh] overflow-hidden'>
            <div className="max-sm:hidden ">
                <SuperAdminSide liname={"My Account"} />
            </div>
            <div className='myAccount_body mr-[12px] '>
                <SuperAdminNavbar Navtext={"My Account"} />
                <p className='font-bold mt-[10px]'>My Account</p>
                <div className='myAccount_main  h-[75vh] p-[8px] my-[20px] grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-6 overflow-x-auto'>
                    {gridItems.map((item, index) => (
                        <div key={index} className='p-4 border-2 border-slate-300 h-[200px]'>
                            {item.heading === 'Delete Account' ? (
                                <div onClick={openModal} className='cursor-pointer'>
                                    <img src={item.icon} alt={item.heading} className='mt-[15px] text-sm' />
                                    <p className='my_account_main_heading mt-[15px] text-sm text-red-600'>{item.heading}</p>
                                    <p className='mt-[20px] text-sm text-gray-600'>{item.description}</p>
                                </div>
                            ) : (
                                <Link to={item.link}>
                                    <img src={item.icon} alt={item.heading} className='mt-[15px] text-sm' />
                                    <p className='my_account_main_heading mt-[15px] text-sm'>{item.heading}</p>
                                    <p className='mt-[20px] text-sm text-gray-600'>{item.description}</p>
                                </Link>
                            )}
                        </div>
                    ))}
                </div>
            </div>

            <Modal isOpen={isModalOpen} closeModal={closeModal}>
                <div className="w-96">
                    <h2 className="text-2xl font-bold mb-4">Delete Account</h2>
                    <p className="text-gray-700 mb-6">
                        Are you sure you want to delete your account? This action cannot be undone.
                    </p>
                    <div className="flex gap-2 items-center">
                        <button
                            className="bg-gray-300 cursor-pointer w-fit text-gray-800 px-4 py-2 rounded hover:bg-gray-400 transition duration-300"
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className="bg-red-500 cursor-pointer w-fit text-white px-4 py-2 rounded hover:bg-red-600 transition duration-300"
                            onClick={() => {
                                // Handle account deletion logic here
                                closeModal();
                            }}
                        >
                            Delete
                        </button>
                    </div>
                </div>
            </Modal>

        </div>
        </Urlprotected>
    );
}

export default SuperAdminAccount;
