import React, { useState, useEffect } from 'react';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';

import ClientNavbar from '../ClientNavbar/ClientNavbar';
import ClientSidebar from '../ClientSidebar/ClientSidebar';
import Urlprotected from '../../../components/Urlprotected';

const ClientSnCalender = () => {
    const [events, setEvents] = useState([]);
    const [modalIsOpen, setModalIsOpen] = useState(false);
    const [selectedEvent, setSelectedEvent] = useState(null);
    const token = JSON.parse(localStorage.getItem('token')) || '';




    const getSession = async () => {
        try {
            const url = `${process.env.REACT_APP_Base_Url}/api/session/all/byclient`;
            const response = await fetch(url, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Failed to fetch sessions');
            }

            const res = await response.json();


            if (res && res.data && Array.isArray(res.data)) {
                const formattedEvents = res.data.map(event => ({
                    id: event._id,
                    title: event.title,
                    start: event.startTime,
                    end: event.endTime,
                    extendedProps: {
                        description: event.description,
                        sessionLink: event.sessionLink,
                        status: event.status
                    }
                }));
                setEvents(formattedEvents);
            } else {
                console.error('Invalid data format in response:');
            }
        } catch (error) {
            console.error('Error fetching sessions:', error);
            // Handle error (e.g., show error message)
        }
    };

    useEffect(() => {
        getSession();
    }, []);

    const handleEventClick = (eventInfo) => {
        setSelectedEvent(eventInfo.event);
        setModalIsOpen(true);
    };

    const closeModal = () => {
        setModalIsOpen(false);
        setSelectedEvent(null);
    };

    const convertDateToReadableFormat = (isoDateString) => {
        const dateObj = new Date(isoDateString);
        const hours = dateObj.getHours();
        const minutes = dateObj.getMinutes().toString().padStart(2, '0');
        const period = hours >= 12 ? 'PM' : 'AM';
        const formattedHours = hours % 12 === 0 ? 12 : hours % 12;
        return `${formattedHours}:${minutes} ${period}`;
    };

    const eventContent = (eventInfo) => {
        const statusColors = {
            "Reschedule": "bg-yellow-300",
            "upcoming": "bg-blue-300",
            "completed": "bg-green-300",
            "Canceled": "bg-red-300"
        };
        const statusClass = statusColors[eventInfo.event.extendedProps.status] || "bg-gray-300";
        const truncatedTitle = eventInfo.event.title.length > 15 ? `${eventInfo.event.title.slice(0, 15)}...` : eventInfo.event.title;
        return (
            <div className={`p-2 w-[100%] rounded-lg cursor-pointer ${statusClass}`}>
                <strong className="text-sm">{truncatedTitle}</strong>
                <p>{convertDateToReadableFormat(eventInfo.event.start.toISOString())}</p>
            </div>
        );
    };

    return (
        <Urlprotected path="Client">
        <div className="Calender flex gap-[30px] flex-col md:flex-row">
            <div className="hidden md:block">
                <ClientSidebar liname={"clientSnCalender"} />
            </div>
            <div className="flex-1 mr-[15px]">
                <ClientNavbar Navtext="Calendar" />
                <h2 className="text-xl text-center font-bold mt-[10px] text-gray-900">SCHEDULE</h2>
                <div className="p-4 h-[80vh] overflow-y-auto">
                    <FullCalendar
                        plugins={[dayGridPlugin]}
                        initialView="dayGridMonth"
                        firstDay={1}
                        headerToolbar={{
                            left: 'prev,next',
                            center: 'title',
                            right: 'dayGridMonth,dayGridWeek,dayGridDay'
                        }}
                        events={events}
                        eventClick={handleEventClick}
                        eventContent={eventContent}
                    />

                    {modalIsOpen && selectedEvent && (
                        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
                            <div className="bg-white p-6 rounded-lg shadow-lg relative z-60">
                                <h2 className="text-xl font-bold mb-4">{selectedEvent.title}</h2>
                                <p className="mb-2">Description: {selectedEvent.extendedProps.description}</p>
                                <p className="mb-2">Status: {selectedEvent.extendedProps.status}</p>
                                <p className="mb-2">Start Time: {convertDateToReadableFormat(selectedEvent.start.toISOString())}</p>
                                <p className="mb-2">End Time: {convertDateToReadableFormat(selectedEvent.end?.toISOString()) || "N/A"}</p>
                                <div className='flex gap-2 items-center'>
                                    {selectedEvent.extendedProps.sessionLink && (
                                        <a href={selectedEvent.extendedProps.sessionLink} className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-700 transition">Join The Meet</a>
                                    )}
                                    <button className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700 transition w-fit" onClick={closeModal}>Close</button>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
        </Urlprotected>
    );
};

export default ClientSnCalender;
