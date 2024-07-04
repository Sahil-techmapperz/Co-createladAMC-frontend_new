import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Baseurl = process.env.REACT_APP_Base_Url;

const Menteesessiondetails = ({ bookingData }) => {
    const [sessionDetails, setSessionDetails] = useState(null);
    const [loading, setLoading] = useState(true);

    const getSessionDetails = async () => {
        try {
            const response = await axios.get(`${Baseurl}/api/sessions/${bookingData.sessionId}`);
            setSessionDetails(response.data);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching session details:', error);
            setLoading(false);
            // Handle error (e.g., show an error message to the user)
        }
    };

    useEffect(() => {
        if (bookingData && bookingData.sessionId) {
            getSessionDetails();
        }
    }, [bookingData]);

    return (
        <div>
            {loading ? (
                <p>Loading session details...</p>
            ) : (
                <>
                    <p>Booking Details:</p>
                    <pre>{JSON.stringify(bookingData, null, 2)}</pre>
                    {sessionDetails && (
                        <>
                            <p>Session Details:</p>
                            <pre>{JSON.stringify(sessionDetails, null, 2)}</pre>
                        </>
                    )}
                </>
            )}
        </div>
    );
};

export default Menteesessiondetails;
