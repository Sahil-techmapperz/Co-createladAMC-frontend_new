import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {BiMenu } from "react-icons/bi"; // Import BiMenu for the toggle button
import Logo from "../assets/Logo1.png";
import Profile from "../assets/web.png";
import walletImg from "../assets/text-box.png";
import { BiSupport } from "react-icons/bi";
import { AiOutlineMessage } from "react-icons/ai";
import { IoMdContact } from "react-icons/io";
import { FaRegCalendarDays } from "react-icons/fa6";
import { IoMdClipboard } from "react-icons/io";
import { FaBoxTissue } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { SiSessionize } from "react-icons/si";

const Sidebar = ({ liname }) => {
    const [showWalletDropdown, setShowWalletDropdown] = useState(false);
    const [isSidebarOpen, setIsSidebarOpen] = useState(false); // State to manage sidebar visibility on mobile
    const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || {});
    const BaseUrl = process.env.REACT_APP_Base_Url;
    const token = JSON.parse(localStorage.getItem("token")) || "";

    const toggleWalletDropdown = () => {
        setShowWalletDropdown(!showWalletDropdown);
    };

    const toggleSidebar = () => { // Function to toggle sidebar visibility
        setIsSidebarOpen(!isSidebarOpen);
    };

    const liactivestyle = {
        backgroundColor: "#0078C5",
        border: "1px solid"
    };

    const Getuserdata = () => {
        if (!BaseUrl || !token) {
            console.error("BaseUrl or token is missing");
            return;
        }

        fetch(`${BaseUrl}/api/user/usersbyID`, {
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            }
        })
        .then((res) => {
            if (!res.ok) {
                throw new Error('Network response was not ok ' + res.statusText);
            }
            return res.json();
        })
        .then((data) => {
            // console.log(data);
            localStorage.setItem('user', JSON.stringify(data[0]));
            setUser(data[0]);
        })
        .catch((error) => {
            console.error("Error fetching user data:", error);
        });
    };

    useEffect(() => {
        Getuserdata();
    }, []);



    return (
        <>
            {/* Mobile view menu button */}
            <div className="text-white fixed top-0 right-0 p-4 z-50 lg:hidden">
                <BiMenu className="w-6 h-6" onClick={toggleSidebar} />
            </div>

            {/* Sidebar */}
            <div className={`min-h-screen overflow-y-auto ${isSidebarOpen ? 'w-[13rem]' : 'w-0'} lg:w-[13rem] text-white flex flex-col justify-between transition-width duration-300`}>

                {/* Sidebar content */}
                <div className={`${isSidebarOpen ? 'block' : 'hidden'} lg:block`}>
                    <div>
                        <Link to={"/"}>
                            <img className='md:min-h-[10vh] w-full mx-auto object-contain' src={Logo} alt="Website Logo" />
                        </Link>
                    </div>

                    <div className='min-h-[90vh] rounded-[8px] relative' style={{ background: 'linear-gradient(176.83deg, #52E7CF 0.29%, #0096F6 3.41%, #1DB3E8 57.31%, #52E7CF 85.81%)' }}>
                        {/* Profile and dropdown */}
                        <div className='flex justify-center items-center  gap-4 py-2'>
                            <Link to={"/PersonalInfo"}>
                                {user && <img className='w-10 h-10  rounded-full object-cover' src={user.profilePictureUrl ? user.profilePictureUrl : Profile} alt="Profile" />}
                            </Link>
                            <div>
                                <p className=''>{user && user.name && user.name}</p>
                            </div>
                        </div>

                        <hr className="bg-[#FFFFFF] mb-3"></hr>

                        {/* Navigation */}
                        <ul className='flex flex-col gap-2'>
                            <li style={liname == "Dashboard" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/' className='flex items-center gap-2'>
                                    <MdDashboard/>
                                    <span className='w-[max-content]'>Dashboard</span>
                                </Link>
                            </li>
                            <li style={liname == "Session" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/session' className='flex items-center gap-2'>
                                    < SiSessionize/>
                                    <span className='w-[max-content]'>Session</span>
                                </Link>
                            </li>
                            <li style={liname == "Session Calender" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/calender' className='flex items-center gap-2'>
                                    <FaRegCalendarDays />
                                    <span className='w-[max-content]'>Session Calender</span>
                                </Link>
                            </li>
                            <li style={liname == "Notice Board" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/NoticeBoard' className='flex items-center gap-2'>
                                    <IoMdClipboard />
                                    <span className='w-[max-content]'>Notice Board</span>
                                </Link>
                            </li>
                            <li style={liname == "Messages" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/chatMessage' className='flex items-center gap-2'>
                                    <AiOutlineMessage />
                                    <span className='w-[max-content]'>Messages</span>
                                </Link>
                            </li>
                            <li style={liname == "IssueReport" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/mentorissuereport' className='flex items-center gap-2'>
                                    <FaBoxTissue/>
                                    <span className='w-[max-content]'>Issue Report</span>
                                </Link>
                            </li>
                            <li style={liname == "My Account" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/Myaccounts' className='flex items-center gap-2'>
                                    <IoMdContact />
                                    <span className='w-[max-content]'>My Account</span>
                                </Link>
                            </li>
                            <li style={liname == "My Withdrawal" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to={"/mywithdrawls"} className='flex items-center gap-2'>
                                    <img className='w-5 h-5' src={walletImg} alt="My Wallet" />
                                    <span className='w-[max-content]'> Withdrawals</span>
                                </Link>
                            </li>
                        </ul>

                        {/* Help & Support */}
                        <div className='absolute bottom-3 pl-4 py-4 text-[#0078C5] font-[600]'>
                            <Link to="/" className='flex items-center gap-2'>
                                <BiSupport />
                                <span className='w-[max-content]'>Help & Support</span>
                            </Link>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}

export default Sidebar;
