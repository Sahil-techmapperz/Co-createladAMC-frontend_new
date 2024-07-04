import React from 'react';

const ConfirmationDialog = ({ show, onClose, onConfirm, message }) => {
    if (!show) {
        return null;
    }

    return (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
            <div className="bg-white p-4 rounded shadow-lg">
                <p>{message}</p>
                <div className="mt-4 flex gap-2">
                    <button
                        onClick={onConfirm}
                        className="bg-red-500 text-white py-2 px-4 rounded mr-2 w-fit"
                    >
                        Confirm
                    </button>
                    <button
                        onClick={onClose}
                        className="bg-gray-300 py-2 px-4 rounded w-fit"
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
};

export default ConfirmationDialog;
