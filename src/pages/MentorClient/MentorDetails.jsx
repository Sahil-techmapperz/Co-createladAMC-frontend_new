// Import necessary React libraries and hooks
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import Urlprotected from '../../components/Urlprotected';

const Baseurl = process.env.REACT_APP_Base_Url;
// Component function
const MentorDetails = () => {
    // Retrieve user data and token from local storage
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const token = JSON.parse(localStorage.getItem("token")) || "";

    // State to hold mentor details and mentorId from URL params
    const [mentorDetails, setMentorDetails] = useState(null);
    const { mentorId } = useParams();

    // Function to fetch mentor details from backend
    const getMentorDetails = async () => {
        const token = JSON.parse(localStorage.getItem("token")) || "";
        console.log(token);
        try {
            if (mentorId) {
                const res = await axios.get(`${Baseurl}/api/user/mentors/${mentorId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                

                if (res.status === 200) {

                    // Set mentor details retrieved from API response
                    setMentorDetails(res.data); // Assuming the mentor object is nested under 'mentor' key
                } else {
                    console.error('Failed to fetch mentor details');
                }
            }
        } catch (error) {
            console.error('Error fetching mentor details:', error);
        }
    };

    // useEffect hook to fetch mentor details on component mount
    useEffect(() => {
        getMentorDetails(); // Call function to fetch mentor details
    }, []); // Run only once on component mount

    // Render mentor details if available, otherwise display loading message
    return (
        <Urlprotected path="Client">
        <div className="bg-gray-100 min-h-screen py-6">
            <div className="w-[900px] mx-auto bg-white shadow-md p-6 rounded-lg">
                {mentorDetails ? (
                    <div>
                        <h2 className="text-2xl text-center font-bold mb-4">Mentor Details</h2>
                        <div className="flex items-center mb-4">
                            {/* Display mentor profile picture */}
                            <img src={mentorDetails.profilePictureUrl} alt={mentorDetails.name} className="w-[300px] h-[300px] rounded-full mr-4" />
                            {/* Display mentor information */}
                            <div className='grid grid-cols-2 gap-[20px]'>
                                {/* Display various mentor details */}
                                <p><strong>Name:</strong> {mentorDetails.name}</p>
                                <p><strong>Email:</strong> {mentorDetails.email}</p>
                                <p><strong>Unique User ID:</strong> {mentorDetails.uniqueUserId}</p>
                                <p><strong>Wallet Balance:</strong> {mentorDetails.walletBalance}</p>
                                <p><strong>Skills:</strong> {mentorDetails.skills.join(', ')}</p>
                                <p><strong>Session Count:</strong> {mentorDetails.sessionCount}</p>
                                <p><strong>Rate:</strong> ${mentorDetails.rate} / hour</p>
                                <p><strong>Languages:</strong> {mentorDetails.languages.join(', ')}</p>
                                <div>
                                    {/* Display ratings with reviews */}
                                   
                                    {mentorDetails.ratings.map((rating, index) => (
                                        <div key={index}>
                                            {/* Display individual rating and review */}
                                            <p><strong>Rating:</strong> {rating.rating}</p>
                                            <p><strong>Review:</strong> {rating.review}</p>
                                            <p><strong>Reviewed By:</strong> {rating.reviewedBy}</p>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p className="text-lg text-gray-600">Loading Mentor Details...</p>
                )}
            </div>
        </div>
        </Urlprotected>
    );
};

// Export MentorDetails component
export default MentorDetails;
