import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useParams } from 'react-router-dom';
import moment from 'moment-timezone';
import { FaStar, FaStarHalfAlt, FaEye, FaEyeSlash } from 'react-icons/fa';
import ClientNavbar from '../ClientNavbar/ClientNavbar';
import SessionImg from '../../../assets/GroupSession.png';
import ClientSidebar from '../ClientSidebar/ClientSidebar';
import Modal from '../../../components/Modal';
import Urlprotected from '../../../components/Urlprotected';
import ReviewModal from './ReviewModal';
const Baseurl = process.env.REACT_APP_Base_Url;

const ClientIntroSession = () => {
    const { mentorId } = useParams();
    const token = JSON.parse(localStorage.getItem("token")) || "";

    const [mentorDetails, setMentorDetails] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [class_name, setclass_name] = useState(false);
    const [availability, setAvailability] = useState([]);
    const [userTimeZone, setUserTimeZone] = useState('');
    const [selectedDate, setSelectedDate] = useState(null);
    const [errorresponse, seterrorresponse] = useState(false);
    const [ratings, setratings] = useState([]);
    const [showReviews, setShowReviews] = useState(false); // State to toggle reviews
    const [isReviewModalOpen, setIsReviewModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        description: "",
        title: "",
        dateTime: "",
        duration: 0.5,
        rating: "", // Added for rating input
        review: "" // Added for review text
    });

    const [isModalOpen, setModalOpen] = useState(false);

    const openModal = () => {
        if (!userTimeZone) {
            alert('You need to set your time zone first.');
            return;
        }
        fetchAvailability();
        setModalOpen(true);
    };

    const closeModal = () => setModalOpen(false);

    const getMentorDetails = async () => {
        try {
            if (mentorId) {
                const response = await axios.get(`${Baseurl}/api/user/mentors/${mentorId}`, {
                    headers: {
                        "Authorization": `Bearer ${token}`,
                    },
                });
                setMentorDetails(response.data);
                setLoading(false);
            }
        } catch (error) {
            console.error('Error fetching mentor details:', error);
            setError('Error fetching mentor details');
            setLoading(false);
        }
    };

    const fetchAvailability = async () => {
        try {
            const response = await axios.get(`${Baseurl}/api/user/getAvailabilityByMentor/${mentorId}`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            setUserTimeZone(response.data.timeZone || "");
            setAvailability(response.data.availability);
        } catch (error) {
            console.error('Error fetching availability:', error);
        }
    };

    const fetchrating = async () => {
        try {
            const response = await axios.get(`${Baseurl}/api/user/mentors/${mentorId}/ratings`, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            setratings(response.data);
        } catch (error) {
            console.error('Error fetching ratings:', error);
        }
    };

    const toggleReviews = () => {
        fetchrating();
        setShowReviews(!showReviews);
    };

    useEffect(() => {
        getMentorDetails();
        fetchAvailability();
    }, [mentorId]);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!formData.title || !formData.description || !formData.dateTime || !formData.duration) {
            alert("Please fill in all fields.");
            return;
        }

        const bookingData = {
            mentorId,
            title: formData.title,
            description: formData.description,
            startTime: formData.dateTime,
            hours: formData.duration
        };

        try {
            const response = await axios.post(`${Baseurl}/api/session/booking`, bookingData, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            alert(`Success: ${response.data.message}`);
            closeModal();
        } catch (error) {
            console.error('Error booking session:', error.response?.data.message || error.message);
            alert(`Error: ${error.response?.data.message || error.message}`);
        }
    };

    const handleReviewButton = () => {
        setIsReviewModalOpen(true);
    };

    const convertDateToReadableFormat = (isoDateString) => {
        const dateObj = moment.tz(isoDateString, userTimeZone);
        return dateObj.format('MMMM Do YYYY, h:mm a');
    };

    const calculateDuration = (start, end) => {
        const startDate = moment.tz(start, userTimeZone);
        const endDate = moment.tz(end, userTimeZone);
        const duration = moment.duration(endDate.diff(startDate));
        const hours = Math.floor(duration.asHours());
        const minutes = duration.minutes();

        if (hours > 0) {
            return `${hours}h`;
        } else if (minutes > 0) {
            return `${minutes}m`;
        }
        return '0m';
    };

    const handleDateClick = (time) => {
        const duration = calculateDuration(time.start, time.end).replace('h', ' hours').replace('m', ' minutes');
        setFormData({
            ...formData,
            dateTime: time.start,
            duration: duration.includes('hours') ? parseInt(duration) : 0.5
        });
        setSelectedDate(time.start);
    };

    return (
        <Urlprotected path="Client">
            <div className="flex gap-8 h-full overflow-hidden">
                <div className="hidden sm:block">
                    <ClientSidebar />
                </div>
                <div className="w-full relative sm:ml-0 sm:w-full">
                    <ClientNavbar Navtext="Session" className="w-11/12" />
                    <div className="mt-4 p-4 overflow-x-auto h-[85dvh]">
                        <h1 className="text-2xl font-bold">Introduction Sessions</h1>
                        <div className="overflow-y-auto pb-4">
                            {mentorDetails && (
                                <>
                                    {mentorDetails && mentorDetails.introductionvideoUrl ? (
                                        <video className="mt-4 h-[50dvh] w-full max-sm:w-72 max-sm:h-60" controls>
                                            <source src={mentorDetails.introductionvideoUrl} type="video/mp4" />
                                            Your browser does not support the video tag.
                                        </video>
                                    ) : (
                                        <img className="mt-4 h-[50dvh] w-full max-sm:w-72 max-sm:h-60" src={SessionImg} alt="Session" />
                                    )}
                                    <div className="flex gap-4 mt-4">
                                        <p className="text-lg">Session Taken by {mentorDetails.name}</p>
                                    </div>
                                    <div className="flex mt-2">
                                        <p className="text-gray-600 text-lg font-bold">Description: {mentorDetails.description || 'No description provided'}</p>
                                    </div>
                                    <div className="flex justify-between mt-2 w-full">
                                        <div className="flex items-center mb-1">
                                            <span className="flex text-yellow-400">
                                                {[...Array(Math.floor(mentorDetails.avgRating))].map((_, i) => (
                                                    <FaStar key={i} />
                                                ))}
                                                {mentorDetails.avgRating % 1 >= 0.5 && <FaStarHalfAlt />}
                                            </span>
                                            <span className="ml-2 text-gray-600">
                                                {mentorDetails.ratings.length} Rating{mentorDetails.ratings.length !== 1 ? 's' : ''}
                                            </span>
                                            <button onClick={toggleReviews} className='bg-blue-500 p-2 ml-2 rounded-md text-white flex items-center w-fit'>
                                                {showReviews ? <FaEyeSlash /> : <FaEye />} <span className='ml-2'>{showReviews ? 'Hide' : 'Show'} Reviews</span>
                                            </button>
                                        </div>
                                        <div className='flex'>
                                            <button className='bg-blue-700 p-2 rounded-md text-white w-fit' onClick={openModal}>Book a Session</button>
                                            <button className='bg-green-500 p-2 ml-4 rounded-md text-white w-fit' onClick={handleReviewButton}>Write a Review</button>
                                        </div>
                                    </div>

                                  {showReviews &&
                                        <div className="reviews mt-4">
                                            {ratings.map(rating => (
                                                <div key={rating._id} className="review flex gap-2">
                                                    <div className="reviewer-info">
                                                        <img src={rating.reviewerProfilePictureUrl} alt={rating.reviewerName} className="reviewer-image w-[60px] h-[60px] rounded-[50%]" />
                                                        <span className="reviewer-name">{rating.reviewerName}</span>
                                                    </div>
                                                    <div className='flex flex-col justify-center'>
                                                        <div className="rating flex gap-2">{Array(rating.rating).fill(<FaStar />)}</div>
                                                        <p className="review-text">{rating.review}</p>
                                                    </div>
                                                </div>
                                            ))}

                                           
                                        </div>
                                    }

                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <Modal className="" isOpen={isModalOpen} closeModal={closeModal}>
                <div className="flex justify-between">
                    {availability.length > 0 && (
                        <div className="w-1/2 p-4">
                            <form onSubmit={handleSubmit} className="needs-validation" noValidate style={{ maxWidth: '500px', width: '100%', margin: 'auto' }}>
                                <div className="mb-3">
                                    <label htmlFor="title" className="form-label">Sessions Title: *</label>
                                    <input
                                        type="text"
                                        className="form-control"
                                        id="title"
                                        value={formData.title || ''}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        required
                                    />
                                    <div className="invalid-feedback">
                                        Please enter a title.
                                    </div>
                                </div>

                                <div className="mb-3">
                                    <label htmlFor="description" className="form-label">Write something: *</label>
                                    <textarea
                                        className="form-control"
                                        id="description"
                                        value={formData.description || ''}
                                        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                        required
                                    ></textarea>
                                    <div className="invalid-feedback">
                                        Please enter a description.
                                    </div>
                                </div>

                                <button type="submit" className="bg-blue-700 text-white rounded-md w-fit p-2">
                                    Submit
                                </button>
                            </form>
                        </div>
                    )}

                    <div className={`p-4 max-h-[250px] overflow-y-auto bg-gray-100 rounded-lg ${availability.length === 0 ? 'w-[90%]' : 'w-1/2'}`}>
                        <h3 className="text-lg font-semibold mb-4">Available Time Slots</h3>
                        {availability.length > 0 ? (
                            <div className="space-y-2">
                                {availability.map((time, index) => (
                                    <div
                                        key={index}
                                        className={`p-2 rounded-md cursor-pointer ${selectedDate === time.start ? 'bg-green-700 text-white' : 'bg-green-500 text-white'}`}
                                        onClick={() => handleDateClick(time)}
                                    >
                                        {convertDateToReadableFormat(time.start)} ({calculateDuration(time.start, time.end)})
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm font-medium text-gray-700">No availability set.</p>
                        )}
                    </div>

                </div>
            </Modal>

            <ReviewModal
                mentorId={mentorId}
                token={token}
                isOpen={isReviewModalOpen}
                closeModal={() => setIsReviewModalOpen(false)}
            />

            {submitSuccess && (
                <div className={class_name}>
                    <p>{errorresponse}</p>
                </div>
            )}
        </Urlprotected>
    );
};

export default ClientIntroSession;
