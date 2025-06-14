import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import { PencilIcon } from '@heroicons/react/24/outline';
import {
  validateName,
  validateEmail,
  validateAge,
  validateCountry,
  validateRole
} from '../Validation/Validation';
import { updValidationErrors, clearUpdateErrors } from '../features/Data';
import { closeUpdateModal, selectUpdateModal } from '../features/UI';
import Error from './UI/Error';
import HoldButton from './UI/HoldButton';

export default function Update({ onUpdate }) {
  const dispatch = useDispatch();
  const serverValidationErrors = useSelector(updValidationErrors);
  const updateModal = useSelector(selectUpdateModal);
  const { isOpen, selectedUser: rowData } = updateModal;
  
  // Store original data to track changes
  const [originalData, setOriginalData] = useState({});
  const [formData, setFormData] = useState({});
  const [clientErrors, setClientErrors] = useState({});

  // Initialize form data when modal opens
  useEffect(() => {
    if (isOpen && rowData) {
      // Convert country string to object format for react-select
      const countryObject = rowData.country && typeof rowData.country === 'string' 
        ? { label: rowData.country, value: rowData.country }
        : rowData.country;

      // Store original data
      const original = {
        name: rowData.name || '',
        email: rowData.email || '',
        age: rowData.age?.toString() || '',
        country: countryObject,
        role: rowData.role || '',
        is_active: rowData.is_active || false
      };
      
      setOriginalData(original);
      
      // Set form data with local state
      setFormData({
        ...rowData,
        age: rowData.age?.toString() || '',
        country: countryObject
      });
      
      // Clear errors
      dispatch(clearUpdateErrors());
      setClientErrors({});
    }
  }, [isOpen, rowData, dispatch]);

  // Combine client and server errors
  const errors = { ...clientErrors, ...serverValidationErrors };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const newValue = type === 'checkbox' ? checked : value;
    
    setFormData(prev => ({
      ...prev,
      [name]: newValue
    }));
    
    // Clear the specific field error when user starts typing
    if (clientErrors[name]) {
      setClientErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverValidationErrors?.[name]) {
      dispatch(clearUpdateErrors());
    }
  };

  const handleCountryChange = (value) => {
    setFormData(prev => ({ ...prev, country: value }));
    
    // Clear country errors
    if (clientErrors.country) {
      setClientErrors(prev => ({ ...prev, country: '' }));
    }
    if (serverValidationErrors?.country) {
      dispatch(clearUpdateErrors());
    }
  };

  const validateClientSide = () => {
    const newErrors = {
      name: validateName(formData.name),
      email: validateEmail(formData.email),
      age: validateAge(formData.age),
      country: validateCountry(formData.country),
      role: validateRole(formData.role)
    };
    setClientErrors(newErrors);
    return Object.values(newErrors).every(err => !err);
  };

  const getChangedFields = () => {
    const changes = {};
    
    // Check each field for changes
    if (formData.name !== originalData.name) {
      changes.name = formData.name.trim();
    }
    
    if (formData.email !== originalData.email) {
      changes.email = formData.email.trim();
    }
    
    if (formData.age !== originalData.age) {
      changes.age = parseInt(formData.age);
    }
    
    // Compare country values properly
    const currentCountry = formData.country?.label || formData.country;
    const originalCountry = originalData.country?.label || originalData.country;
    if (currentCountry !== originalCountry) {
      changes.country = formData.country?.label || '';
    }
    
    if (formData.role !== originalData.role) {
      changes.role = formData.role.trim();
    }
    
    if (formData.is_active !== originalData.is_active) {
      changes.is_active = formData.is_active;
    }
    
    return changes;
  };

  const handleConfirmUpdate = async () => {
    // Clear previous server errors
    dispatch(clearUpdateErrors());
    
    // Run client-side validation first
    if (!validateClientSide()) return;

    const changedFields = getChangedFields();
    
    // If no fields changed, just close modal
    if (Object.keys(changedFields).length === 0) {
      handleClose();
      return;
    }

    // Include ID for the update
    const updateData = {
      id: formData.id,
      ...changedFields
    };

    // Store original data for undo functionality
    const originalUserData = {
      id: formData.id,
      name: originalData.name,
      email: originalData.email,
      age: parseInt(originalData.age),
      country: originalData.country?.label || originalData.country,
      role: originalData.role,
      is_active: originalData.is_active
    };

    try {
      await onUpdate(updateData, originalUserData);
    } catch (error) {
      // Error handling is done in Redux slice
      console.error('Update failed:', error);
    }
  };

  const handleClose = () => {
    setClientErrors({});
    dispatch(clearUpdateErrors());
    dispatch(closeUpdateModal());
  };

  // Check if there are any changes to determine if we should show hold button
  const hasChanges = () => {
    const changes = getChangedFields();
    return Object.keys(changes).length > 0;
  };

  // Add safety check to prevent rendering when formData is not ready
  if (!formData || Object.keys(formData).length === 0) {
    return null;
  }

  return (
    <Dialog open={isOpen} onClose={handleClose} className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6">
      <div className="fixed inset-0 bg-white/70 backdrop-blur-sm" aria-hidden="true" />
      <motion.div
        initial={{ opacity: 0, scale: 0.85 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.85 }}
        transition={{ duration: 0.25 }}
        className="relative bg-white rounded-3xl shadow-xl w-full max-w-xs sm:max-w-md md:max-w-lg z-50 max-h-[90vh] overflow-y-auto"
      >
        <div className="p-4 sm:p-6 md:p-8">
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Update Record
          </Dialog.Title>

          <div className="space-y-4">
            {/* Name Field */}
            <div>
              <label htmlFor="name" className="block mb-1 text-sm font-medium text-gray-700">Name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter full name"
                value={formData.name || ''}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.name ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              <Error errors={errors} name="name" />
            </div>

            {/* Age Field */}
            <div>
              <label htmlFor="age" className="block mb-1 text-sm font-medium text-gray-700">Age</label>
              <input
                id="age"
                name="age"
                type="number"
                placeholder="Enter user age"
                value={formData.age || ''}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.age ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              <Error errors={errors} name="age" />
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block mb-1 text-sm font-medium text-gray-700">Email</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="Enter email address"
                value={formData.email || ''}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.email ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              <Error errors={errors} name="email" />
            </div>

            {/* Country Field */}
            <div>
              <label htmlFor="country" className="block mb-1 text-sm font-medium text-gray-700">Country</label>
              <Select
                id="country"
                name="country"
                options={countryList().getData()}
                value={formData.country}
                onChange={handleCountryChange}
                className={`text-sm ${errors.country ? 'react-select-error' : ''}`}
                styles={{
                  control: (base) => ({
                    ...base,
                    borderColor: errors.country ? '#fca5a5' : base.borderColor,
                    '&:hover': {
                      borderColor: errors.country ? '#fca5a5' : base.borderColor,
                    }
                  })
                }}
              />
              <Error errors={errors} name="country" />
            </div>

            {/* Role Field */}
            <div>
              <label htmlFor="role" className="block mb-1 text-sm font-medium text-gray-700">Role</label>
              <input
                id="role"
                name="role"
                type="text"
                placeholder="user / moderator / admin"
                value={formData.role || ''}
                onChange={handleChange}
                className={`w-full rounded-lg border px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                  errors.role ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                }`}
              />
              <Error errors={errors} name="role" />
            </div>

            {/* Active Field */}
            <div className="flex items-center mt-2">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active || false}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">Active User</label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-5">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium order-2 sm:order-1 mt-1"
            >
              Cancel
            </button>
            
            {/* Conditional rendering: Hold button if changes exist, regular button if no changes */}
            {hasChanges() ? (
              <HoldButton
                onConfirm={handleConfirmUpdate}
                icon={PencilIcon}
                className="w-full sm:w-45 px-5 py-2 rounded-lg order-1 sm:order-2"
                baseColor="bg-indigo-600"
                hoverColor="hover:bg-indigo-500"
                progressBarColor="bg-indigo-800"
                completedText="Updating..."
                defaultText="Hold to Update"
                holdDuration={2000} // Shorter duration for updates
              />
            ) : (
              <button
                onClick={handleClose}
                className="w-full sm:w-auto px-5 py-2 rounded-lg bg-gray-400 text-white cursor-not-allowed order-1 sm:order-2"
                disabled
              >
                No Changes
              </button>
            )}
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}