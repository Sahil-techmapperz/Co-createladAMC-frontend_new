import React, { useEffect, useState } from 'react'
import axios from 'axios';
const BaseUrl = process.env.REACT_APP_Base_Url;
import { useParams } from 'react-router-dom';

import { PiBookOpen } from "react-icons/pi";
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";






const TopmentorService = () => {
    const [currentCategory, setCurrentCategory] = useState('all Sessions');


    const [sessions, setSessions] = useState([]);
    const [mentors, setmentors] = useState([]);
    const [sessionsWithDetails, setSessionsWithDetails] = useState([]);
    const [isRescheduleModalOpen, setIsRescheduleModalOpen] = useState(false);
    const [sessionToReschedule, setSessionToReschedule] = useState(null);
    const [lastWeekSessions, setlastWeekSessions] = useState([]);
    const [previousWeekRange, setpreviousWeekRange] = useState("");
    const [nextSession, setnextSession] = useState();
    const user = JSON.parse(localStorage.getItem("user")) || {};
    const token = JSON.parse(localStorage.getItem("token")) || "";
    const [mentorDetails, setMentorDetails] = useState(null);
    const { mentorId } = useParams();





    // Function to format date to "27 March 2020, at 12:30 PM"
    // const formatDate = (dateString) => {
    //     const date = new Date(dateString);

    //     const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
    //     const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
    //     const year = new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(date);
    //     const time = new Intl.DateTimeFormat('en-GB', {
    //         hour: 'numeric',
    //         minute: 'numeric',
    //         hour12: true,
    //     }).format(date);

    //     return `${day} ${month} ${year}, at ${time}`;
    // };


    // const formatDate = (dateTimeString) => {
    //     const options = { weekday: 'long', day: '2-digit', month: 'short' };
    //     const dateObj = new Date(dateTimeString);
    //     const formattedDate = new Intl.DateTimeFormat('en-US', options).format(dateObj);
    //     return formattedDate;
    // };









    // Function to format date to "27 March 2020, at 12:30 PM"
    const formatDate = (dateString) => {
        const date = new Date(dateString);

        const day = new Intl.DateTimeFormat('en-GB', { day: 'numeric' }).format(date);
        const month = new Intl.DateTimeFormat('en-GB', { month: 'long' }).format(date);
        const year = new Intl.DateTimeFormat('en-GB', { year: 'numeric' }).format(date);
        const time = new Intl.DateTimeFormat('en-GB', {
            hour: 'numeric',
            minute: 'numeric',
            hour12: true,
        }).format(date);

        return `${day} ${month} ${year}, at ${time}`;
    };





    const formatTime = (isoDateTime) => {
        // Create a Date object from the ISO datetime string
        const date = new Date(isoDateTime);

        // Extract hours and minutes from the Date object
        let hours = date.getHours();
        const minutes = date.getMinutes();

        // Determine AM or PM suffix based on the hour
        const amPm = hours >= 12 ? 'PM' : 'AM';

        // Convert hours to 12-hour format
        hours = hours % 12 || 12; // Convert 0 to 12 for 12-hour format

        // Pad single-digit minutes with leading zeros
        const formattedMinutes = minutes.toString().padStart(2, '0');

        // Construct the formatted time string in 12-hour format
        const formattedTime = `${hours}:${formattedMinutes} ${amPm}`;

        return formattedTime;
    };



    const openRescheduleModal = (session) => {
        setSessionToReschedule(session); // Set the session to be rescheduled
        setIsRescheduleModalOpen(true); // Open the modal
    };

    const closeRescheduleModal = () => {
        setIsRescheduleModalOpen(false); // Close the modal
    };

    const handleReschedule = (rescheduledData) => {
        // console.log('Reschedule data:', rescheduledData);

        // Define the URL with the session ID
        const url = `${BaseUrl}/api/session/rescheduled/${rescheduledData.sessionId}`;

        // Make the fetch call to reschedule the session
        fetch(url, {
            method: 'PATCH', // Use 'PATCH' to update data
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Ensure proper token authorization
            },
            body: JSON.stringify(rescheduledData), // Convert the data to JSON for the request body
        })
            .then((response) => {
                if (!response.ok) {
                    throw new Error('Failed to reschedule session');
                }
                return response.json(); // Parse the JSON response
            })
            .then((res) => {
                const response = categorizeSessions(res.data);
                setSessions(response);
            })
            .catch((error) => {
                console.error('Error rescheduling session:', error); // Add error handling
            });

        // Implement additional logic if needed, such as updating the UI
    };


    // Function to handle category change
    const handleCategoryChange = (category) => {
        setCurrentCategory(category);
    };



    const handleDelete = (session) => {
        const isConfirmed = window.confirm('Are you sure you want to delete this session?');

        if (isConfirmed) { // Only proceed if the user confirms
            // Define the URL with the session ID for deleting
            const url = `${BaseUrl}/api/session/cancel/sessionby_client/${session.session_id}`;

            fetch(url, {
                method: 'PATCH', // Use 'DELETE' to remove the session
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`, // Authorization token
                },
            })
                .then((response) => {
                    if (!response.ok) {
                        throw new Error('Failed to delete session');
                    }
                    return response.json(); // Parse the JSON response
                })
                .then((res) => {
                    // Update the sessions state to remove the deleted session
                    //   setSessions((prevSessions) =>
                    //     prevSessions.filter((s) => s.session_id !== session.session_id)
                    //   );
                    console.log('Session deleted successfully:', res);
                })
                .catch((error) => {
                    console.error('Error deleting session:', error); // Error handling
                });
        }
    };



    const convertSession = (session) => {
        const {
            _id,
            title,
            startTime,
            endTime,
            mentor,
        } = session;



        const start = new Date(startTime);
        const end = new Date(endTime);

        const classTime = `${start.getHours().toString().padStart(2, '0')}:${start.getMinutes().toString().padStart(2, '0')} - ${end.getHours().toString().padStart(2, '0')}:${end.getMinutes().toString().padStart(2, '0')}`;

        const classDay = start.toLocaleDateString('en-GB', {
            weekday: 'long', // e.g., "Wednesday"
            day: 'numeric', // e.g., "25"
            month: 'short', // e.g., "Oct"
        });

        const now = new Date();
        const timeDiff = Math.abs(start - now); // Time difference in milliseconds
        const hours = Math.floor(timeDiff / (1000 * 60 * 60));
        const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
        const scheduledTime = `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

        return {

            title,
            session_id: _id,
            details: {
                classTime,
                classDay,
                scheduledTime,
            },
            mentor: {
                id: mentor._id,
                name: mentor.name,
                profileImage: mentor.profilePictureUrl,
            },
        };
    };

    const categorizeSessions = (Allsessions) => {
        const categories = {
            'all Sessions': [],
            scheduled: [],

            completed: [],
            cancelled: [],
        };

        Allsessions.forEach((session) => {
            const convertedSession = convertSession(session);


            // Add to 'all Sessions'
            categories['all Sessions'].push(convertedSession);

            console.log(session);

            // Categorize based on status
            switch (session.status) {
                case 'upcoming':
                    categories.scheduled.push(convertedSession);
                    break;

                case 'completed':
                    categories.completed.push(convertedSession);
                    break;
                case 'Canceled':
                    categories.cancelled.push(convertedSession);
                    break;
            }
        });

        return categories;
    };


    const GetSession = async () => {


        let url = `${BaseUrl}/api/session/booked_byClient`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            const response = categorizeSessions(res.allsessions);
            setSessions(response);
            console.log(response)
        });



      

    };


    const getMentorDetails = async () => {
        // const url=`${Baseurl}/api/session/all/bymentor`;
        let url = `${BaseUrl}/api/user/all`;
        try {

            const res = await axios.get(url, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });

            // console.log(res.data);

            setmentors(res.data);
            // if (res.status === 200) {

            //     // Set mentor details retrieved from API response
            //     console.log(res.data);
            //     // setMentorDetails(res.data); // Assuming the mentor object is nested under 'mentor' key
            // } else {
            //     console.error('Failed to fetch mentor details');
            // }
        }
        catch (error) {
            console.error('Error fetching mentor details:', error);
        }
    };


    const addDetailsToObjectArray = (sessionArray, mentorArray) => {
        return sessionArray.map(session => {
            const matchingMentors = mentorArray.filter(mentor => mentor._id === session.mentor);
            return {
                ...session,
                details: matchingMentors.length > 0 ? matchingMentors : null
            };
        });
    };






    const GetnextSession = () => {

        let url = `${BaseUrl}/api/session/nextSession/client`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            // const response= categorizeSessions(res.data);
            setnextSession(res.sessionData);
            // console.log(res)     
        });

    };


    const GetlastweekSessions = () => {

        let url = `${BaseUrl}/api/session/previousWeek/byclient`;
        fetch(url, {
            method: "GET",
            headers: {
                "Content-Type": "application/json",
                "Authorization": `Bearer ${token}`
            }
        }).then(response => response.json()).then(res => {
            // const response= categorizeSessions(res.data);
            setlastWeekSessions(res.sessions);
            setpreviousWeekRange(res.previousWeekRange);
            console.log(res)
        });

    };






    useEffect(() => {
        GetSession();



        GetnextSession();
        GetlastweekSessions();

    }, []);



    return (
      



            <div className='w-full  mr-[12px] '>



            

                {nextSession ? (
                    <div className='messageChartVideo'>
                        <div className='messageChartVideo1'>
                            <img src={Video1} />
                            <p>Next Session: {nextSession.startDate} at {nextSession.startTimeFormatted} with {nextSession.Client.name}</p>
                        </div>
                        <div class='messageChartVideo2'>
                            <p>Time Left: {nextSession.timeLeft}</p>
                            <a target='_blank' href={nextSession.sessionLink}>
                                <div className='messageChartVideo3'>
                                    <div className='bookOpen'>
                                        <PiBookOpen />
                                    </div>
                                    <p>Enter Session</p>
                                </div>
                            </a>
                        </div>
                    </div>
                ) : (
                    <div className='noSessionAvailable flex items-center justify-center w-full h-24 rounded-md my-2 bg-black text-white'>
                        <p>No upcoming sessions available</p>
                    </div>
                )}


                {/* Video and upcoming session info omitted for brevity */}

                <div className='flex  shadow-md md:h-[80VH] overflow-y-auto    max-md:flex-col gap-6 my-3'>
                    <div className='md:w-[50vw] w-full shadow-md md:h-[80VH] overflow-y-auto p-4 rounded-md bg-gray-50'>
                        {/* Buttons and add new session link omitted for brevity */}

                        <div className='flex my-4 overflow-x-auto'>
                            <div className='flex space-x-4 min-w-max'>
                                {/* Dynamically generate category buttons */}
                                {sessions && Object.keys(sessions).map((category, index) => (
                                    <button
                                        key={index}
                                        className={`w-[120px] h-10 bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-md shadow-md ${currentCategory === category ? 'active' : 'hover:from-blue-600 hover:to-blue-700'
                                            } focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out`}
                                        onClick={() => handleCategoryChange(category)}
                                    >
                                        {category.charAt(0).toUpperCase() + category.slice(1)} {/* Capitalize the first letter */}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className='flex flex-col gap-4 w-[100%] overflow-hidden'>

                            {sessions[currentCategory] && sessions[currentCategory].map((session) => (
                                <div className='rounded-md flex max-md:flex-col justify-around bg-white shadow p-4'>
                                    <div>
                                        <p className='font-bold'>{session && session.title}</p>
                                        <ul className='list-disc pl-5'>
                                            {/* <li>Class Time: - <b>{formatTime(session.endTime)}</b></li>
                                        <li>Class Day: <b>{session && session.classDay}</b></li> */}

                                            <li>Class Time: <b>{session.details.classTime}</b></li>
                                            <li>Class Day: <b>{session.details.classDay}</b></li>
                                            {/* <li>Scheduled Time: <b>{session && session.cscheduledTime}</b></li> */}
                                        </ul>
                                    </div>

                                    <div>
                                        <p className='font-bold'>Mentor</p>
                                        <div className='flex items-center gap-2 mt-[10px]'>
                                            <img className='w-10 h-10 rounded-full' src={session && session.mentor && session.mentor.profileImage} alt='Member Profile' />
                                            <p>{session && session.mentor && session.mentor.name}</p>
                                        </div>
                                    </div>

                                    {currentCategory != 'completed' && currentCategory != 'cancelled' && (
                                        <div className='flex gap-4 mt-2 justify-center items-center'>
                                            <div
                                                className='flex gap-1 justify-center items-center cursor-pointer text-red-600'
                                                onClick={() => handleDelete(session)}
                                            >
                                                <MdDelete />
                                                <p className='font-bold'>Cancel</p>
                                            </div>

                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>


                    {/* Last week's sessions mapping */}
                    <div className='md:w-[30vw] w-full shadow-md md:h-[64vh] overflow-y-auto p-2 rounded-md'>
                        <div className='lastWeekSection1'>
                            <p>Last Week Sessions</p>
                            <div>
                                <p>{previousWeekRange && previousWeekRange}</p>
                            </div>
                        </div>
                        <div>
                            {Array.isArray(lastWeekSessions) && lastWeekSessions.length > 0 ? (
                                lastWeekSessions.map((session, index) => (
                                    <div key={index} className="lastWeekNews mt-[10px]">
                                        <div className="classNews">
                                            {/* <div className='classEdit border-2 border-red-600'><RiArrowDropDownLine /></div> */}
                                            <div>
                                                <p><strong>{session.title}</strong></p>
                                                <p>{formatDate(session.startTime)}</p> {/* Using a date formatting function */}
                                            </div>
                                        </div>
                                        <div>
                                            <p>Earnings</p>
                                            <div className="text-green-500">
                                                {session.mentor.rate || "N/A"} {/* Ensure there's a value or fallback */}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p>No last week sessions found</p> // Display a message if no sessions are found
                            )}
                        </div>
                    </div>

                </div>
            </div>
     
    )
}

export default TopmentorService;