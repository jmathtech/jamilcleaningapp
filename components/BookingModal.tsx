// components/BookingModal.tsx (Example Structure)
import React, { useState, useEffect } from 'react';
import  { Booking, STATUS_OPTIONS } from '../pages/admin/dashboard'; // Adjust path if needed

interface BookingModalProps {
    isOpen: boolean;
    onClose: () => void;
    bookingData: Partial<Booking> | null; // Partial allows for new bookings with missing fields initially
    isNew: boolean;
    onSave: (booking: Partial<Booking>) => Promise<void>; // Function to handle saving (create or update)
    isLoading: boolean; // Loading state for save operation
    error: string | null; // Error message during save
}

const BookingModal: React.FC<BookingModalProps> = ({
    isOpen,
    onClose,
    bookingData: initialBookingData,
    isNew,
    onSave,
    isLoading,
    error
}) => {
    const [formData, setFormData] = useState<Partial<Booking>>({});

    useEffect(() => {
        // Reset form data when modal opens or bookingData changes
        setFormData(initialBookingData || {});
    }, [initialBookingData, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        // Handle boolean conversion for checkbox if needed (e.g., has_pets)
        const isCheckbox = type === 'checkbox';
        
        const checked = isCheckbox ? e.target.checked : undefined;

        setFormData(prev => ({
            ...prev,
            [name]: isCheckbox ? checked : value,
        }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        // Add basic validation if needed here
        onSave(formData);
        // Keep modal open on error, close on success (handled by parent)
    };

    // --- Basic Date/Time Formatting for Input ---
    // Input type="date" expects "YYYY-MM-DD"
    const formatDateForInput = (dateString: string | undefined): string => {
        if (!dateString) return '';
        try {
            // Assuming dateString is already YYYY-MM-DD or can be parsed
            const date = new Date(dateString + 'T00:00:00Z'); // Treat as UTC to avoid timezone shifts
             if (isNaN(date.getTime())) return '';
            return date.toISOString().split('T')[0];
        } catch (e) {
            console.error("Error formatting date for input:", dateString, e);
            return '';
        }
    };

    // Input type="time" expects "HH:MM" (24-hour)
    const formatTimeForInput = (timeString: string | undefined): string => {
        if (!timeString) return '';
        // Assuming timeString is already HH:MM or HH:MM:SS
        return timeString.substring(0, 5);
    };
    // --- End Formatting ---


    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex justify-center items-center p-4">
            <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-lg max-h-[90vh] overflow-y-auto">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-2xl font-semibold text-gray-700">{isNew ? 'Schedule New Booking' : 'Booking Details'}</h2>
                    <button onClick={onClose} className="text-gray-500 hover:text-gray-700 text-2xl">&times;</button>
                </div>

                <form onSubmit={handleSubmit}>
                    {/* Display Booking ID if editing */}
                    {!isNew && formData.booking_id && (
                        <div className="mb-3">
                            <label className="block text-sm font-medium text-gray-600">Booking ID</label>
                            <p className="text-gray-800">{formData.booking_id}</p>
                        </div>
                    )}

                    {/* --- Form Fields --- */}
                    {/* Example: Customer Name (split for new, combined display for existing) */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                             <label htmlFor="customer_first_name" className="block text-sm font-medium text-gray-600">First Name</label>
                             <input
                                type="text"
                                id="customer_first_name"
                                name="customer_first_name"
                                value={formData.customer_first_name || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required={isNew} // Required only for new bookings
                                readOnly={!isNew} // Readonly if editing existing (or make editable)
                            />
                        </div>
                         <div>
                             <label htmlFor="customer_last_name" className="block text-sm font-medium text-gray-600">Last Name</label>
                             <input
                                type="text"
                                id="customer_last_name"
                                name="customer_last_name"
                                value={formData.customer_last_name || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required={isNew}
                                readOnly={!isNew}
                            />
                        </div>
                    </div>

                    {/* Add other fields similarly: email, phone, address, service_type, hours, notes, has_pets */}
                    {/* Example: Service Type */}
                    <div className="mb-3">
                         <label htmlFor="service_type" className="block text-sm font-medium text-gray-600">Service Type</label>
                         <input // Or use a <select> if you have predefined services
                            type="text"
                            id="service_type"
                            name="service_type"
                            value={formData.service_type || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Date and Time */}
                     <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-3">
                        <div>
                             <label htmlFor="date" className="block text-sm font-medium text-gray-600">Date</label>
                             <input
                                type="date"
                                id="date"
                                name="date"
                                value={formatDateForInput(formData.date)} // Use formatter
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                         <div>
                             <label htmlFor="time" className="block text-sm font-medium text-gray-600">Time</label>
                             <input
                                type="time"
                                id="time"
                                name="time"
                                value={formatTimeForInput(formData.time)} // Use formatter
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                                required
                            />
                        </div>
                    </div>

                     {/* Hours */}
                     <div className="mb-3">
                         <label htmlFor="hours" className="block text-sm font-medium text-gray-600">Duration (Hours)</label>
                         <input
                            type="number" // Use number type
                            id="hours"
                            name="hours"
                            value={formData.hours || ''}
                            onChange={handleChange}
                            min="0.5" // Example minimum
                            step="0.5" // Example step
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                            required
                        />
                    </div>

                    {/* Status (Only if editing or if you want to set initial status for new) */}
                    {!isNew && (
                         <div className="mb-3">
                             <label htmlFor="status" className="block text-sm font-medium text-gray-600">Status</label>
                             <select
                                id="status"
                                name="status"
                                value={formData.status || ''}
                                onChange={handleChange}
                                className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm bg-white"
                            >
                                {STATUS_OPTIONS.map(option => (
                                    <option key={option} value={option}>{option}</option>
                                ))}
                            </select>
                        </div>
                    )}
                     {/* Add fields for email, phone, address, notes, has_pets here... */}
                     {/* Example: Notes */}
                     <div className="mb-4">
                         <label htmlFor="notes" className="block text-sm font-medium text-gray-600">Notes</label>
                         <textarea
                            id="notes"
                            name="notes"
                            rows={3}
                            value={formData.notes || ''}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>


                    {/* --- End Form Fields --- */}

                    {error && <p className="text-red-600 text-sm mb-3">{error}</p>}

                    <div className="flex justify-end space-x-3">
                        <button
                            type="button"
                            onClick={onClose}
                            className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 disabled:opacity-50"
                            disabled={isLoading}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 disabled:opacity-50 flex items-center"
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className="spinner-modal mr-2"></div> {/* Add simple spinner CSS */}
                                    Saving...
                                </>
                            ) : (isNew ? 'Create Booking' : 'Save Changes')}
                        </button>
                    </div>
                </form>
            </div>
            {/* Add basic spinner CSS globally or here */}
            <style jsx global>{`
              .spinner-modal {
                border: 2px solid rgba(255, 255, 255, 0.3);
                border-top: 2px solid white;
                border-radius: 50%;
                width: 16px;
                height: 16px;
                animation: spin 1s linear infinite;
              }
              @keyframes spin {
                0% { transform: rotate(0deg); }
                100% { transform: rotate(360deg); }
              }
            `}</style>
        </div>
    );
};

export default BookingModal;
