import React, { useState } from 'react'
import '../../components/Sidebar.jsx';
import Icon1 from './../../assets/Icon (1).png';
import Icon2 from './../../assets/Icon (2).png';
import Icon3 from './../../assets/Icon (3).png';
import Icon6 from './../../assets/Icon (6).png';
import Icon7 from './../../assets/Icon (7).png';
import Icon8 from './../../assets/Icon.png';
import Sidebar from '../../components/Sidebar.jsx';
import MobileNav from '../../components/Mobile/MobileNav.jsx';
import Navbar from '../../components/Navbar.jsx';
import { Link } from 'react-router-dom';
import Modal from './../../components/Modal.jsx';
import Urlprotected from '../../components/Urlprotected.jsx';

const gridItems = [
    { icon: Icon8, heading: 'Profile', description: 'Profile details and edit your profile', link: "/profile" },
    { icon: Icon8, heading: 'Personal info', description: 'Provide personal details and how we can reach you', link: "/PersonalInfo" },
    { icon: Icon1, heading: 'Login & security', description: 'Update your password and secure your account', link: "/LoginSecurity" },
    { icon: Icon2, heading: 'Payments & payouts', description: 'Review payments, payouts, coupons, and gift cards', link: "/mywithdrawls" },
    { icon: Icon3, heading: 'Notifications', description: 'Choose notification preferences and how you want to be contacted', link: "/NoticeBoard" },
    { icon: Icon6, heading: 'Payment methods', description: 'Update your payment methods data', link: "/payment_methods" },
    { icon: Icon7, heading: 'Delete Account', description: 'Delete your account', link: "/DeleteAccount" }
];

const GridItem = ({ item, openModal }) => (
    <div className='p-4 h-[200px] shadow-lg rounded-md'>
        {item.heading === "Delete Account" ? (
            <div onClick={openModal} style={{ cursor: "pointer" }}>
                <img src={item.icon} alt={item.heading} className='mt-[15px] text-sm' />
                <p className='my_account_main_heading mt-[15px] text-sm text-red-600'>
                    {item.heading}
                </p>
                <p className='mt-[20px] text-sm text-gray-600'>{item.description}</p>
            </div>
        ) : (
            <Link to={item.link} style={{ cursor: "pointer" }}>
                <img src={item.icon} alt={item.heading} className='mt-[15px] text-sm' />
                <p className='my_account_main_heading mt-[15px] text-sm'>
                    {item.heading}
                </p>
                <p className='mt-[20px] text-sm text-gray-600'>{item.description}</p>
            </Link>
        )}
    </div>
);

const MyAccount = () => {
    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => setModalOpen(true);
    const closeModal = () => setModalOpen(false);

    return (
        <Urlprotected path="Mentor">
        <div className='flex gap-[30px] bg-gray-100 h-[100vh] overflow-hidden'>
            <div className="max-sm:hidden">
                <Sidebar liname={"My Account"} />
            </div>
            <div className='myAccount_body mr-[12px]'>
                <Navbar Navtext={"My Account"} />
                <div className='myAccount_main h-[85vh] p-[8px] my-[20px] grid grid-cols-1 gap-16 md:grid-cols-3 md:gap-6 overflow-x-auto'>
                    {gridItems.map((item, index) => (
                        <GridItem key={index} item={item} openModal={openModal} />
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

export default MyAccount;
