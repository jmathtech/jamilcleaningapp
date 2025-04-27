'use client';

import React, { useState, useEffect, useMemo } from 'react';
import { DateSelectArg } from '@fullcalendar/core';

// Assuming Booking and Customer types are defined elsewhere or define them here
// If not defined elsewhere, uncomment and adjust these interfaces:

interface Customer {
  customer_id: number;
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  address: string;
}


interface Booking {
  booking_id: string;
  updated_at?: string; // Optional as it might not be needed for create/edit form directly
  customer_id: number | null; // Allow null for new bookings before customer selection
  customer_first_name?: string; // Useful for display, but customer_id is key
  customer_last_name?: string;
  customer_email?: string;
  customer_phone?: string;
  customer_address?: string;
  hours: string; // Keep as string to match input type, convert on save if needed
  notes?: string | null;
  service_type: string;
  has_pets: boolean;
  date: string; // YYYY-MM-DD format
  time: string; // HH:MM format (24-hour)
  status: string;
  total_price?: string; // Calculated, likely display-only in modal
}

// Define Customer type if not imported
interface Customer {
    customer_id: number;
    first_name: string;
    last_name: string;
    email: string;
    // Add other relevant customer fields if needed
}


interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  eventData: Booking | DateSelectArg | null; // Can be existing booking or new selection info
  onSave: (bookingData: Booking) => Promise<void>; // Function to handle saving (create/update)
  onDelete: (bookingId: string) => Promise<void>; // Function to handle deletion
  customers: Customer[]; // Pass the list of customers for dropdown
  serviceTypes?: string[]; // Optional: Pass service types if dynamic
  statusOptions?: string[]; // Optional: Pass status options if dynamic
}

// Default values if not passed via props
const DEFAULT_SERVICE_TYPES = [
    "Standard / Allergy Cleaning",
    "Organizer",
    "Rental Cleaning",
    "Deep Cleaning",
    "Move Out Cleaning",
];

const DEFAULT_STATUS_OPTIONS = ['pending', 'confirmed', 'in progress', 'completed', 'cancelled']; // Add 'cancelled'

const SERVICE_RATES: Record<string, number> = {
    "Standard / Allergy Cleaning": 30,
    "Organizer": 30,
    "Rental Cleaning": 40,
    "Deep Cleaning": 50,
    "Move Out Cleaning": 50,
};


const BookingModal: React.FC<BookingModalProps> = ({
  isOpen,
  onClose,
  eventData,
  onSave,
  onDelete,
  customers,
  serviceTypes = DEFAULT_SERVICE_TYPES,
  statusOptions = DEFAULT_STATUS_OPTIONS,
}) => {
  const [formData, setFormData] = useState<Booking>({
    booking_id: '',
    customer_id: null,
    service_type: serviceTypes[0],
    hours: '3',
    notes: '',
    date: '',
    time: '10:00',
    has_pets: false,
    status: 'pending',
    // Fields below are often derived or display-only in modal context
    customer_first_name: '',
    customer_last_name: '',
    customer_email: '',
    customer_phone: '',
    customer_address: '',
    total_price: '0',
  });

  const [isSaving, setIsSaving] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const isEditMode = useMemo(() => !!(eventData && 'booking_id' in eventData), [eventData]);

  // Effect to initialize form data when modal opens or eventData changes
  useEffect(() => {
    if (isOpen && eventData) {
      setError(null); // Clear errors when modal opens/data changes
      if ('booking_id' in eventData) {
        // Editing existing booking
        const booking = eventData as Booking;
        setFormData({
          ...booking,
          // Ensure hours is a string for the input field
          hours: String(booking.hours || '3'),
          // Ensure customer_id is number or null
          customer_id: booking.customer_id ? Number(booking.customer_id) : null,
        });
      } else if ('startStr' in eventData) {
        // Creating new booking from date selection
        const selectInfo = eventData as DateSelectArg;
        const startDate = new Date(selectInfo.startStr);
        const startTime = selectInfo.allDay ? '10:00' : startDate.toTimeString().substring(0, 5); // HH:MM

        setFormData({
          booking_id: '', // No ID for new booking
          customer_id: customers.length > 0 ? customers[0].customer_id : null, // Default to first customer or null
          service_type: serviceTypes[0],
          hours: '3',
          notes: '',
          date: selectInfo.startStr.substring(0, 10), // YYYY-MM-DD
          time: startTime,
          has_pets: false,
          status: 'pending',
          // Reset derived fields
          customer_first_name: '',
          customer_last_name: '',
          customer_email: '',
          customer_phone: '',
          customer_address: '',
          total_price: '0',
        });
      }
    } else if (!isOpen) {
        // Reset form when modal is closed
        setFormData({
            booking_id: '', customer_id: null, service_type: serviceTypes[0], hours: '3', notes: '',
            date: '', time: '10:00', has_pets: false, status: 'pending', customer_first_name: '',
            customer_last_name: '', customer_email: '', customer_phone: '', customer_address: '', total_price: '0',
        });
        setError(null);
    }
  }, [isOpen, eventData, customers, serviceTypes]); // Rerun when modal opens or data changes

  // Calculate total price whenever service type or hours change
  const calculatedTotalPrice = useMemo(() => {
    const rate = SERVICE_RATES[formData.service_type] || 0;
    const numHours = parseInt(formData.hours, 10) || 0;
    return (rate * numHours).toFixed(2);
  }, [formData.service_type, formData.hours]);

  // Update total_price in formData whenever it's recalculated
  useEffect(() => {
    setFormData(prev => ({ ...prev, total_price: calculatedTotalPrice }));
  }, [calculatedTotalPrice]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value, type } = e.target;

    if (type === 'checkbox') {
      setFormData(prev => ({ ...prev, [name]: (e.target as HTMLInputElement).checked }));
    } else if (name === 'customer_id') {
        const selectedCustomerId = value ? parseInt(value, 10) : null;
        const selectedCustomer = customers.find(c => c.customer_id === selectedCustomerId);
        setFormData(prev => ({
            ...prev,
            customer_id: selectedCustomerId,
            // Optionally pre-fill other customer details if needed for display
            customer_first_name: selectedCustomer?.first_name || '',
            customer_last_name: selectedCustomer?.last_name || '',
            customer_email: selectedCustomer?.email || '',
        }));
    }
     else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    setError(null); // Clear previous errors
    if (!formData.customer_id) {
        setError("Please select a customer.");
        return;
    }
    if (!formData.date || !formData.time) {
        setError("Please select a valid date and time.");
        return;
    }
     if (parseInt(formData.hours, 10) <= 0) {
        setError("Hours must be greater than zero.");
        return;
    }

    setIsSaving(true);
    try {
      // Ensure total_price is included when saving
      const dataToSave = { ...formData, total_price: calculatedTotalPrice };
      await onSave(dataToSave);
      // Parent component (AdminDashboard) should handle closing and refetching
    } catch (err) {
      console.error("Save failed:", err);
      setError(err instanceof Error ? err.message : "Failed to save booking.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!formData.booking_id) return; // Should not happen if button is shown correctly

    setError(null);
    setIsDeleting(true);
    try {
      await onDelete(formData.booking_id);
      // Parent component (AdminDashboard) should handle closing and refetching
    } catch (err) {
      console.error("Delete failed:", err);
      setError(err instanceof Error ? err.message : "Failed to delete booking.");
    } finally {
      setIsDeleting(false);
    }
  };

  if (!isOpen) {
    return null;
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Modal Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold text-gray-700">
            {isEditMode ? `Edit Booking #${formData.booking_id}` : 'Create New Booking'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-800 text-2xl"
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>

        {/* Modal Body (Form) */}
        <form onSubmit={(e) => { e.preventDefault(); handleSave(); }} className="p-6 space-y-4">
          {error && <p className="text-red-600 bg-red-100 p-2 rounded text-sm">{error}</p>}

          {/* Customer Selection */}
          <div>
            <label htmlFor="customer_id" className="block text-sm font-medium text-gray-700">Customer *</label>
            <select
              id="customer_id"
              name="customer_id"
              value={formData.customer_id ?? ''}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              <option value="" disabled>-- Select a Customer --</option>
              {customers.map(customer => (
                <option key={customer.customer_id} value={customer.customer_id}>
                  {customer.first_name} {customer.last_name} ({customer.email})
                </option>
              ))}
            </select>
          </div>

          {/* Service Type */}
          <div>
            <label htmlFor="service_type" className="block text-sm font-medium text-gray-700">Service Type *</label>
            <select
              id="service_type"
              name="service_type"
              value={formData.service_type}
              onChange={handleChange}
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            >
              {serviceTypes.map(type => (
                <option key={type} value={type}>{type} (${SERVICE_RATES[type]}/hr)</option>
              ))}
            </select>
          </div>

          {/* Date & Time */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label htmlFor="date" className="block text-sm font-medium text-gray-700">Date *</label>
              <input
                type="date"
                id="date"
                name="date"
                value={formData.date}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
            <div>
              <label htmlFor="time" className="block text-sm font-medium text-gray-700">Time *</label>
              <input
                type="time"
                id="time"
                name="time"
                value={formData.time}
                onChange={handleChange}
                required
                className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              />
            </div>
          </div>

          {/* Hours */}
          <div>
            <label htmlFor="hours" className="block text-sm font-medium text-gray-700">Hours *</label>
            <input
              type="number"
              id="hours"
              name="hours"
              value={formData.hours}
              onChange={handleChange}
              min="1" // Minimum 1 hour
              required
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
            />
          </div>

           {/* Status (Only if editing) */}
           {isEditMode && (
             <div>
                <label htmlFor="status" className="block text-sm font-medium text-gray-700">Status *</label>
                <select
                    id="status"
                    name="status"
                    value={formData.status}
                    onChange={handleChange}
                    required
                    className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                >
                    {statusOptions.map(status => (
                    <option key={status} value={status}>{status.charAt(0).toUpperCase() + status.slice(1)}</option>
                    ))}
                </select>
             </div>
           )}


          {/* Has Pets */}
          <div className="flex items-center">
            <input
              id="has_pets"
              name="has_pets"
              type="checkbox"
              checked={formData.has_pets}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
            />
            <label htmlFor="has_pets" className="ml-2 block text-sm text-gray-900">
              Customer has pets
            </label>
          </div>

          {/* Notes */}
          <div>
            <label htmlFor="notes" className="block text-sm font-medium text-gray-700">Notes</label>
            <textarea
              id="notes"
              name="notes"
              value={formData.notes ?? ''}
              onChange={handleChange}
              rows={3}
              className="mt-1 block w-full p-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
              placeholder="Any specific instructions or details..."
            />
          </div>

           {/* Display Calculated Total Price */}
           <div className="pt-2">
             <p className="text-lg font-semibold text-gray-800">
                Estimated Total: ${calculatedTotalPrice}
             </p>
           </div>

          {/* Modal Footer (Actions) */}
          <div className="flex justify-end items-center pt-4 border-t mt-6 space-x-3">
            <button
              type="button"
              onClick={onClose}
              disabled={isSaving || isDeleting}
              className="px-4 py-2 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 disabled:opacity-50"
            >
              Cancel
            </button>

            {/* Show Delete button only in Edit mode */}
            {isEditMode && (
              <button
                type="button"
                onClick={handleDelete}
                disabled={isSaving || isDeleting}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting ? 'Deleting...' : 'Delete Booking'}
              </button>
            )}

            <button
              type="submit" // Changed to submit to trigger form onSubmit
              disabled={isSaving || isDeleting}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isSaving ? 'Saving...' : (isEditMode ? 'Save Changes' : 'Create Booking')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BookingModal;