import React, { useState } from 'react';
import { FaBell } from "react-icons/fa";
import { IoMdSettings } from "react-icons/io";
import { IoLogOutOutline } from "react-icons/io5";
import { RiMenu2Line } from "react-icons/ri";
import { FaFilter } from "react-icons/fa";
import { BiMenuAltLeft } from "react-icons/bi";
import Logo from "../../../assets/Logo1.png"; // Ensure this path is correct

const ClientNavbar = ({ Navtext }) => {
    const [showNotifications, setShowNotifications] = useState(false);
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    // Toggle for notifications panel
    const toggleNotifications = () => {
        setShowNotifications(!showNotifications);
    };

    // Toggle for mobile menu
    const toggleMenu = () => {
        setIsMenuOpen(!isMenuOpen);
    };

    const handleLogout = () => {
        localStorage.removeItem('user');
        localStorage.removeItem('token');
        window.location.href = '/login';
    };


    return (
        <nav className='w-[98%] flex justify-between items-center bg-white py-4 px-6 shadow-md z-10 '>

            <div className='flex gap-5'>

                <div className='flex items-center gap-5'>
                    <RiMenu2Line className='md:hidden text-blue-500 text-2xl cursor-pointer' onClick={toggleMenu} />
                    <img src={Logo} alt='logo' className='w-40 h-auto md:hidden' />
                    <h1 className='hidden md:block font-bold text-xl'>{Navtext}</h1>
                    <input
                        type="text"
                        placeholder='Search Here'
                        className='hidden md:block border-2 border-gray-300 py-1 px-2 rounded-md focus:outline-none focus:border-blue-500'
                    />
                </div>

                <div className='flex gap-5'>
                    <div className='flex items-center justify-center gap-[5px]'>
                        <div className='text-blue-500'><FaFilter /></div>
                        <p className='flex items-center justify-center max-sm:hidden'>Advanced Search</p>
                    </div>
                    <div className='flex items-center justify-center gap-[5px] max-sm:hidden '>
                        <div className='text-blue-500 '>< BiMenuAltLeft className=' text-2xl' /></div>
                        <div className='flex gap-[5px]'>
                            <p>Sorting-</p>
                            <select>
                                <option value="option1">Top Mentor</option>
                                <option value="option2">Mentor 1</option>
                                <option value="option3">Mentor 2</option>
                                {/* <!-- Add more options as needed --> */}
                            </select>
                        </div>
                    </div>
                </div>
            </div>

            <div className='flex items-center gap-4'>
                <IoMdSettings className='hidden md:block text-blue-500 text-2xl cursor-pointer' />

                <div className='relative'>
                    <div onClick={toggleNotifications} className='cursor-pointer'>
                        <FaBell className='text-blue-500 text-2xl' />
                        <div className='absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full px-1.5 py-0.5'>
                            3
                        </div>
                    </div>
                    {showNotifications && (
                        <div className='absolute z-20 top-full mt-2 right-0 bg-white shadow-lg rounded-lg w-48 py-2'>
                            <p className='text-gray-700 text-sm px-4'>Your notifications go here.</p>
                        </div>
                    )}
                </div>

                <IoLogOutOutline className='text-red-500 text-2xl cursor-pointer' onClick={handleLogout}/>
            </div>

            {isMenuOpen && (
                <div className='md:hidden absolute  top-0 left-0 w-[50%] bg-white shadow-md py-2'>
                    {/* Mobile Menu Items */}
                    <button onClick={toggleMenu}>Close</button>
                    <p className='text-blue-500 px-6 py-2 text-sm cursor-pointer'>Home</p>
                    <p className='text-blue-500 px-6 py-2 text-sm cursor-pointer'>About</p>
                    {/* Add more navigation items as needed */}
                </div>
            )}
        </nav>
    );
}

export default ClientNavbar;