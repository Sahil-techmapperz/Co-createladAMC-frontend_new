import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { BiChevronDown, BiMenu } from "react-icons/bi"; // Import BiMenu for the toggle button
import Logo from "../../../assets/Logo1.png";
import Profile from "../../../assets/web.png";
import dashboardImg from "../../../assets/dashboard.png";
import openBook from "../../../assets/open-book 1 (1).png";
import planning from "../../../assets/planning 1.png";
import messageImg from "../../../assets/chat 1 (1).png";
import contact from "../../../assets/account-circle.png";
import walletImg from "../../../assets/text-box.png";
import { BiSupport } from "react-icons/bi";
import { IoMdClipboard } from "react-icons/io";
import { FaBoxTissue } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { SiSessionize } from "react-icons/si";
import { FaRegCalendarDays } from "react-icons/fa6";
const ClientSidebar = ({ liname }) => {
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
                        <Link to={"/clientDashboard"}>
                            <img className='md:min-h-[10vh] w-full mx-auto object-contain' src={Logo} alt="Website Logo" />
                        </Link>
                    </div>

                    <div className='min-h-[90vh] rounded-[8px] relative' style={{ background: 'linear-gradient(176.83deg, #52E7CF 0.29%, #0096F6 3.41%, #1DB3E8 57.31%, #52E7CF 85.81%)' }}>
                        {/* Profile and dropdown */}
                        <div className='flex justify-center items-center  gap-2 py-2'>
                            <Link to={"/clientPersonalInfo"}>
                                {user && <img className='w-10 h-10  rounded-full object-cover' src={user.profilePictureUrl ? user.profilePictureUrl : Profile} alt="Profile" />}
                            </Link>
                            <div>
                                <p className=''>{user && user.name && user.name}</p>
                            </div>
                        </div>

                        {/* Navigation */}
                        <ul className='flex flex-col gap-2'>
                            <li style={liname == "clientDashboard" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/clientDashboard' className='flex items-center gap-2'>
                                   <MdDashboard/>
                                    <span className='w-[max-content]'>Dashboard</span>
                                </Link>
                            </li>
                            <li style={liname == "clientIntroSession" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/menteeAllSession' className='flex items-center gap-2'>
                                    <SiSessionize/>
                                    <span className='w-[max-content]'>Session</span>
                                </Link>
                            </li>
                            <li style={liname == "clientSnCalender" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/clientSnCalender' className='flex items-center gap-2'>
                                    <FaRegCalendarDays/>
                                    <span className='w-[max-content]'>Session Calender</span>
                                </Link>
                            </li>

                            <li style={liname == "Notice Board" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/clientNotice' className='flex items-center gap-2'>
                                    {/* <img className='w-5 h-5' src={NoticeImage} alt="Notice Board" /> */}
                                    <IoMdClipboard />
                                    <span className='w-[max-content]'>Notice Board</span>
                                </Link>
                            </li>

                            <li style={liname == "chatMessage" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/clientchatMessage' className='flex items-center gap-2'>
                                    <img className='w-5 h-5' src={messageImg} alt="Messages" />
                                    <span className='w-[max-content]'>Messages</span>
                                </Link>
                            </li>
                            <li style={liname == "IssueReport" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/clientissuereport' className='flex items-center gap-2'>
                                    <FaBoxTissue/>
                                    <span className='w-[max-content]'>Issue Report</span>
                                </Link>
                            </li>

                            <li style={liname == "clientMyAccount" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/clientMyAccount' className='flex items-center gap-2'>
                                    <img className='w-5 h-5' src={contact} alt="My Account" />
                                    <span className='w-[max-content]'>My Account</span>
                                </Link>
                            </li>
                            <li style={liname == "clientMyWallet" ? liactivestyle : {}} className='px-4 py-2 hover:bg-[#0078C5] hover:border-[1px]'>
                                <Link to='/clientMyWallet' className='flex items-center gap-2'>
                                    <img className='w-5 h-5' src={contact} alt="My Account" />
                                    <span className='w-[max-content]'>My Wallet</span>
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

export default ClientSidebar;
