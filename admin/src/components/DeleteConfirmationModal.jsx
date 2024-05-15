import React from 'react';

const DeleteConfirmationModal = ({ isOpen, onCancel, onConfirm }) => {
    return (
        <div className={`fixed inset-0 flex items-center justify-center z-50 ${isOpen ? '' : 'hidden'}`}>
            <div className="modal-overlay fixed inset-0 bg-black opacity-50"></div>

            <div className="modal-container bg-white w-1/3 p-6 rounded shadow-lg z-50">
                <div className="modal-header mb-4">
                    <h3 className="text-xl font-bold">Confirm Deletion</h3>
                    <button className="modal-close" onClick={onCancel}>
                    </button>
                </div>

                <div className="modal-body mb-4">
                    Are you sure you want to delete this ground?
                </div>

                <div className="modal-footer text-right">
                    <button
                        className="bg-red-600 hover:bg-red-800 text-white py-2 px-4 rounded-full"
                        onClick={onConfirm}
                    >
                        Delete
                    </button>
                    <button
                        className="bg-green-700 hover:bg-green-900 text-white py-2 px-4 rounded-full"
                        onClick={onCancel}
                    >
                        Cancel
                    </button>
                </div>
            </div>
        </div>
    );
}

export default DeleteConfirmationModal;
