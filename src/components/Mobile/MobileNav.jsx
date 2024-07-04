import React, { useState } from 'react'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { IoIosMenu } from "react-icons/io";
import { FaBell } from "react-icons/fa6";
import { AiFillMessage } from "react-icons/ai";
import { FaFilter } from "react-icons/fa";
import Logo from '../../assets/Logo1.png'
import "../../CSS/mobileNav.css"
import NavSidebar from './NavbarSide';

const MobileNav = () => {
    const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => setIsOpen(!isOpen);
    return (
        <>
            <div className='mobileNavMain'>
                <div className='flex pt-2 items-center justify-between'>
                    <button  className='text-4xl iconmenu w-[10px]' 
                    onClick={toggleSidebar}
                    style={{ cursor: "pointer", fontSize: "24px" }}
                    > < IoIosMenu /></button>
                    <NavSidebar isOpen={isOpen} toggleSidebar={toggleSidebar} />
                    <img src={Logo} />
                    <div className='text-4xl  iconmenu max-sm:text-2xl'><FaBell /></div>
                    <div className='text-4xl iconmenu max-sm:text-2xl'><AiFillMessage /></div>
                </div>
                <div className='flex gap-[20px] mt-[5px] justify-center items-center rounded-lg shadow-lg p-[10px] max-sm:w-[330px]'>
                    <div className='' >
                        <input type="text" className="search-container w-[250px] h-[40px] " placeholder="Search..." />
                        {/* <button class="search-button">Search</button> */}
                    </div>
                    <div className='text-4xl iconmenu max-sm:text-2xl'><FaFilter /></div>
                </div>
            </div>



            <div>



            </div>
        </>
    )
}

export default MobileNav