import React from 'react'
import Sidebar from '../../../components/Sidebar'
import MobileNav from '../../../components/Mobile/MobileNav'
import ClientNavbar from '../ClientNavbar/ClientNavbar'
import BasicImage from '../MentorAssets/basicbutton.png'
import { FaPlus } from "react-icons/fa6";
import { TiTick } from "react-icons/ti";
import ClientSidebar from '../ClientSidebar/ClientSidebar'
import Urlprotected from '../../../components/Urlprotected'


const ClientMyWallet = () => {
    const Functions=["1 User Per Account","Them Customizetion","Ecomerce Thems","Wordpress Thems","Email Announcment"];
    return (
        <Urlprotected path="Client">
            <div className='flex'>
                <div className="max-sm:hidden ">
                    <ClientSidebar liname={"clientMyWallet"} />
                </div>

                <div className='w-[80%] h-[100vh] md:overflow-y-hidden ml-[30px] max-sm:ml-[0px] max-sm:w-[100%]'>
                    {/* <div className="sm:hidden  ml-[10px]">  <MobileNav /> </div> */}
                    <div className=''>  <ClientNavbar Navtext={"My Wallet"} /></div>

                    <div className='flex justify-between py-[10px] pr-[20px] pl-[0px] max-sm:mt-[0px] max-sm:pl-[20px]'>
                        <h1 className='text-lg font-medium'>My Wallet</h1>
                    </div>

                    <div className='flex gap-5 items-center'>
                        {/* Card UI adjusted for top-left placement and responsive height */}
                        <div className='w-full ml-2 p-4 max-w-xs rounded-lg shadow-lg bg-white' >
                            <div className='flex justify-center'>
                                <img src={BasicImage} alt="Basic Plan" className='h-32' /> {/* Adjusted for responsive design */}
                            </div>
                            <div className='text-center'>
                                <p className='text-xl font-bold'>Team</p>
                                <p className='text-4xl font-bold'>350 CCL = $15</p>
                                <p>/month</p>
                                {Functions.map((_, index) => (
                                    <div key={index} className='flex justify-center items-center mt-2'>
                                        <TiTick />
                                        <p className='ml-2'>{Functions[index]}</p>
                                    </div>
                                ))}
                            </div>
                            <div className='flex justify-center mt-4'>
                                <button className='rounded-lg bg-sky-500 text-white font-bold py-2 px-4 w-fit'>My Current Plan</button>
                            </div>
                        </div>

                        {/* Hidden on smaller screens, shown on larger screens */}
                        <div className='hidden sm:flex cursor-pointer justify-center items-center'>
                            <div className='bg-sky-500 rounded-lg flex flex-col items-center justify-center p-4 h-48 w-48'>
                                <div className='bg-white p-2 rounded-full text-sky-500'>
                                    <FaPlus />
                                </div>
                                <p className='mt-4 text-white font-bold'>Add More</p>
                            </div>
                        </div>

                        {/* Floating action button for smaller screens */}
                        <div className='sm:hidden cursor-pointer fixed bottom-4 right-4 bg-sky-500 text-white rounded-full p-3'>
                            <FaPlus />
                        </div>
                    </div>
                </div>


            </div>
        </Urlprotected>
    )
}

export default ClientMyWallet
