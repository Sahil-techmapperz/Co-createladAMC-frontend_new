import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import { FaStar, FaStarHalfAlt, FaCoins } from "react-icons/fa";
import { IoLocation } from "react-icons/io5";
import { IoMdContact } from "react-icons/io";
import ClientNavbar from '../ClientNavbar/ClientNavbar';
import ClientSidebar from '../ClientSidebar/ClientSidebar';
import './clientDashboard.css';
import Urlprotected from '../../../components/Urlprotected';

const Baseurl = process.env.REACT_APP_Base_Url;

const Allmentors = () => {
    const token = JSON.parse(localStorage.getItem("token")) || "";
    const [mentees, setMentees] = useState([]);

    const getMentees = async () => {
        try {
            const res = await axios.get(`${Baseurl}/api/user/mentors/rating/all`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            if (Array.isArray(res.data)) {

                const menteesWithAvgRating = res.data;

                menteesWithAvgRating.sort((a, b) => b.averageRating - a.averageRating);
                setMentees(menteesWithAvgRating);
            } else {
                console.error('Data fetched is not an array:', res.data);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    };


   

    useEffect(() => {
        getMentees();
    }, []);

    return (
        <Urlprotected path="Client">
            <div className='flex gap-[30px]'>
                <div className="max-sm:hidden">
                    <ClientSidebar liname={""} />
                </div>
                <div className='w-[100%] max-sm:ml-[0px]  h-[100vh] overflow-y-hidden'>
                    <ClientNavbar Navtext={"Dashboard"} />
                    <div className='w-[100%] h-[90vh] overflow-y-auto'>
                        <div className='max-md:m-[15px]'>
                            <div className='flex justify-between mt-[6px] pt-[20px] pr-[20px] pb-[2px] pl-[0px]'>
                                <h1 className='text-xl font-bold'>All Mentors</h1>
                            </div>
                            <div className='pt-[10px] pr-[10px] pb-[10px] topMentor grid grid-cols-1 md:grid-cols-4 gap-2 '>
                                {mentees && mentees.map((mentee, index) => (
                                    <div
                                        key={index}
                                        className="mt-3 max-w-sm rounded overflow-hidden shadow-lg bg-white mb-4"
                                        style={{ maxHeight: '350px' }}
                                    >
                                        <img
                                            className="w-full"
                                            src={mentee.mentor.profilePictureUrl || ''}
                                            alt=""
                                            style={{ height: '150px', objectFit: 'cover' }}
                                        />
                                        <div className="px-4 py-2">
                                            <div className="font-bold text-xl mb-1">{mentee.mentor.name}</div>
                                            <p className="text-gray-700 text-base mb-1">
                                                {mentee.mentor.skills.length === 0 ? "No skills listed" : mentee.mentor.skills.join(", ")}
                                            </p>
                                            <div className="flex justify-between pt-2 pb-1">
                                                <div className="flex items-center mb-1">
                                                    <span className="flex text-yellow-400">
                                                        {[...Array(Math.floor(mentee.avgRating))].map((_, i) => (
                                                            <FaStar key={i} />
                                                        ))}
                                                        {mentee.avgRating % 1 >= 0.5 && <FaStarHalfAlt />}
                                                    </span>
                                                    <span className="ml-2 text-gray-600">
                                                        {mentee.mentor.ratings.length} Rating{mentee.mentor.ratings.length !== 1 ? 's' : ''}
                                                    </span>
                                                </div>
                                                <div className="flex gap-2 items-center">
                                                    <FaCoins />
                                                    <span className="text-blue-500">{mentee.mentor.rate}</span>
                                                </div>
                                            </div>
                                            <div className='flex justify-between pt-2 pb-1'>
                                                <div className="flex justify-center items-center gap-2 pt-2 pb-1">
                                                    <IoLocation />
                                                    <span className="ml-2 text-gray-600">
                                                        {mentee.mentor.location?.country || 'Unknown'}
                                                    </span>
                                                </div>
                                                <div className="flex justify-center items-center gap-2 pt-2 pb-1">
                                                    <IoMdContact />
                                                    <span className="text-gray-600">{mentee.sessionCount || 0} Mentees</span>
                                                </div>
                                            </div>
                                            <Link to={`/clientIntroSession/${mentee.mentor._id}`}>
                                                <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
                                                    Know more
                                                </button>
                                            </Link>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                       
                    </div>
                </div>
            </div>
        </Urlprotected>
    );
};

export default Allmentors;
