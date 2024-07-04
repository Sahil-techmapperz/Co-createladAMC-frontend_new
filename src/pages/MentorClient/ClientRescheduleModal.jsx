import React, { useEffect, useState } from 'react';
import Modal from 'react-modal';
import DatePicker from 'react-datepicker'; // For date selection
import 'react-datepicker/dist/react-datepicker.css';

const ClientRescheduleModal = ({ isOpen, onClose, onReschedule, session }) => {
  const [newStartTime, setNewStartTime] = useState(); // Default to the current time
  const [durationHours, setDurationHours] = useState(1); // Default session duration in hours

  const handleReschedule = () => {
    // Ensure newStartTime is a valid Date object
    if (!(newStartTime instanceof Date) || isNaN(newStartTime.getTime())) {
      console.error('Invalid newStartTime');
      return; // Exit if invalid
    }
  
    // Create a formatted date-time string without milliseconds and without trailing 'Z'
    const year = newStartTime.getFullYear();
    const month = (newStartTime.getMonth() + 1).toString().padStart(2, '0'); // Month is zero-based
    const day = newStartTime.getDate().toString().padStart(2, '0');
    const hours = newStartTime.getHours().toString().padStart(2, '0');
    const minutes = newStartTime.getMinutes().toString().padStart(2, '0');
  
    // Build the desired format "YYYY-MM-DDTHH:MM"
    const formattedStartTime = `${year}-${month}-${day}T${hours}:${minutes}`;
  
    const rescheduledData = {
      sessionId: session?.session_id || '', // Ensure session ID is valid
      StartTime: formattedStartTime, // New formatted start time
      hours: durationHours, // Session duration
    };
  
    // Check if sessionId is valid
    if (!rescheduledData.sessionId) {
      console.error('Missing sessionId');
      return; // Exit early if sessionId is invalid
    }
  
    // Pass the data to the parent component
    onReschedule(rescheduledData);
  
    // Close the modal
    onClose();
  };
  

  const handaleclose=()=>{
    onClose();
  };


  useEffect(()=>{
    setNewStartTime(new Date());
    console.log(session,"rescheduling");
  },[]);

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onClose}
      contentLabel="Reschedule Session"
      style={{
        content: {
          top: '50%',
          left: '50%',
          right: 'auto',
          bottom: 'auto',
          marginRight: '-50%',
          transform: 'translate(-50%, -50%)',
          width: '400px', // Set a default width
          padding: '20px', // Default padding
        },
      }}
    >

      <h1 className='font-bold underline'>Reschedule the session with {session?.title}</h1>

      {/* Date picker for selecting new start time */}
      <div className="mb-4">
        <label>Select a new start time:</label>
        <DatePicker
          selected={newStartTime}
          onChange={(date) => setNewStartTime(date)}
          showTimeSelect
          dateFormat="Pp" // Displays both date and time
          placeholderText='Select a new start time'
        />
      </div>

      {/* Input for selecting duration in hours */}
      <div className="mb-4">
        <label>Duration (hours):</label>
        <input
          type="number"
          min="1"
          value={durationHours}
          onChange={(e) => setDurationHours(parseInt(e.target.value))}
        />
      </div>

      {/* Buttons for rescheduling or cancelling */}
      <div className="flex justify-end gap-4">
        <button onClick={handleReschedule} className="btn btn-primary w-fit">
          Reschedule
        </button>
        <button onClick={handaleclose} className="btn btn-secondary w-fit">
          Cancel
        </button>
      </div>
    </Modal>
  );
};

export default ClientRescheduleModal;
