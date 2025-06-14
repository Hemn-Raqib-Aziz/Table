import { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import Select from 'react-select';
import countryList from 'react-select-country-list';
import {
  validateName,
  validateEmail,
  validateAge,
  validateCountry,
  validateRole
} from '../Validation/Validation';
import { addValidationErrors, clearAddErrors } from '../features/Data';
import { closeInsertModal, selectInsertModal } from '../features/UI';
import Error from './UI/Error';

export default function Insert({ onInsert }) {
  const dispatch = useDispatch();
  const insertModal = useSelector(selectInsertModal);
  const serverValidationErrors = useSelector(addValidationErrors);
  const { isOpen } = insertModal;
  
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    age: '',
    country: null,
    role: '',
    is_active: true
  });

  const [clientErrors, setClientErrors] = useState({});

  // Clear server errors when component mounts or closes
  useEffect(() => {
    if (isOpen) {
      dispatch(clearAddErrors());
    }
  }, [isOpen, dispatch]);

  // Combine client and server errors
  const errors = { ...clientErrors, ...serverValidationErrors };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    
    // Clear the specific field error when user starts typing
    if (clientErrors[name]) {
      setClientErrors(prev => ({ ...prev, [name]: '' }));
    }
    if (serverValidationErrors?.[name]) {
      dispatch(clearAddErrors());
    }
  };

  const handleCountryChange = (value) => {
    setFormData(prev => ({ ...prev, country: value }));
    
    // Clear country errors
    if (clientErrors.country) {
      setClientErrors(prev => ({ ...prev, country: '' }));
    }
    if (serverValidationErrors?.country) {
      dispatch(clearAddErrors());
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

  const handleInsertClick = async () => {
    // Clear previous server errors
    dispatch(clearAddErrors());
    
    // Run client-side validation first
    if (!validateClientSide()) return;

    const userData = {
      ...formData,
      country: formData.country.label,
      name: formData.name.trim(),
      email: formData.email.trim(),
      role: formData.role.trim()
    };

    try {
      await onInsert(userData);
      
      // Only reset form if insert was successful
      setFormData({
        name: '',
        email: '',
        age: '',
        country: null,
        role: '',
        is_active: true
      });
      setClientErrors({});
    } catch (error) {
      // Error handling is done in Redux slice
      console.error('Insert failed:', error);
    }
  };

  const handleClose = () => {
    setFormData({
      name: '',
      email: '',
      age: '',
      country: null,
      role: '',
      is_active: true
    });
    setClientErrors({});
    dispatch(clearAddErrors());
    dispatch(closeInsertModal());
  };

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
            Add New User
          </Dialog.Title>

          <div className="space-y-4">
            {[
              { label: 'Name', name: 'name', type: 'text', placeholder: 'Enter full name' },
              { label: 'Age', name: 'age', type: 'number', placeholder: 'Enter user age' },
              { label: 'Email', name: 'email', type: 'email', placeholder: 'Enter email address' },
              { label: 'Role', name: 'role', type: 'text', placeholder: 'user / moderator / admin' }
            ].map(({ label, name, type, placeholder }) => (
              <div key={name}>
                <label htmlFor={name} className="block mb-1 text-sm font-medium text-gray-700">{label}</label>
                <input
                  id={name}
                  name={name}
                  type={type}
                  placeholder={placeholder}
                  value={formData[name]}
                  onChange={handleChange}
                  className={`w-full rounded-lg border px-4 py-2 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 ${
                    errors[name] ? 'border-red-300 focus:ring-red-500' : 'border-gray-300'
                  }`}
                  required
                />
                <Error errors={errors} name={name} />
              </div>
            ))}

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

            <div className="flex items-center mt-2">
              <input
                id="is_active"
                name="is_active"
                type="checkbox"
                checked={formData.is_active}
                onChange={handleChange}
                className="h-4 w-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
              />
              <label htmlFor="is_active" className="ml-2 text-sm text-gray-700">Active User</label>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4 mt-5">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              onClick={handleInsertClick}
              className="w-full sm:w-auto px-5 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-500 shadow-md transition order-1 sm:order-2"
            >
              Insert
            </button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}