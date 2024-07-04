import React, { useState } from 'react';
import axios from 'axios';
import { FaStar } from 'react-icons/fa';
import Modal from '../../../components/Modal';

const ReviewModal = ({ mentorId, token, isOpen, closeModal }) => {
    const [rating, setRating] = useState(1);
    const [review, setReview] = useState('');
    const [submitSuccess, setSubmitSuccess] = useState(false);
    const [error, setError] = useState('');

    const handleReviewSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post(`${process.env.REACT_APP_Base_Url}/api/user/mentors/${mentorId}/rate`, {
                rating,
                review,
            }, {
                headers: {
                    "Authorization": `Bearer ${token}`,
                },
            });
            setSubmitSuccess(true);
            setReview('');
            setRating(1);
        } catch (error) {
            const errorMessage = error.response
                ? (error.response.data.error || error.response.data.message)
                : 'Network error or server not responding';  // Default message for when error.response does not exist
            console.error('Error submitting review:', errorMessage);
            setError(errorMessage); // Set this error message to state or display it directly
            setSubmitSuccess(false);
        }
    };


    return (
        <Modal isOpen={isOpen} closeModal={closeModal}>
            <form onSubmit={handleReviewSubmit} className="p-4">
                <h3 className="text-lg font-semibold mb-4">Submit Your Review</h3>
                <div className="mb-3">
                    <label htmlFor="rating" className="form-label">Rating:</label>
                    <select
                        id="rating"
                        value={rating}
                        onChange={(e) => setRating(e.target.value)}
                        className="form-control"
                        required
                    >
                        {[1, 2, 3, 4, 5].map(option => (
                            <option key={option} value={option}>{option} {FaStar}</option>
                        ))}
                    </select>
                </div>

                <div className="mb-3">
                    <label htmlFor="review" className="form-label">Review:</label>
                    <textarea
                        id="review"
                        value={review}
                        onChange={(e) => setReview(e.target.value)}
                        className="form-control"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded">
                    Submit Review
                </button>
                {submitSuccess && <p className="text-green-500">Review submitted successfully!</p>}
                {error && <p className="text-red-500">{error}</p>}
            </form>
        </Modal>
    );
};

export default ReviewModal;
