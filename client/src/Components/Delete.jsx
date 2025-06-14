import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { TrashIcon, ExclamationTriangleIcon } from '@heroicons/react/24/outline';
import HoldButton from './UI/HoldButton';
import { closeDeleteModal, selectDeleteModal } from '../features/UI';

export default function Delete({ onDelete }) {
  const dispatch = useDispatch();
  const deleteModal = useSelector(selectDeleteModal);
  const { isOpen, selectedUser: rowData } = deleteModal;

  const handleClose = () => {
    dispatch(closeDeleteModal());
  };

  const handleConfirmDelete = () => {
    // Close the modal and trigger the undo toast
    dispatch(closeDeleteModal());
    onDelete();
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
          {/* Animated Warning Icon */}
          <motion.div 
            className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-red-100 rounded-xl mb-3 sm:mb-4"
            initial={{ scale: 0, rotate: -180 }}
            animate={{ scale: 1, rotate: 0 }}
            transition={{ 
              duration: 0.6, 
              ease: "easeOut",
              delay: 0.2
            }}
          >
            <motion.div
              animate={{ 
                scale: [1, 1.1, 1],
                rotate: [0, -5, 5, 0]
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <ExclamationTriangleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-red-600" />
            </motion.div>
          </motion.div>

          {/* Title */}
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6">
            Delete User
          </Dialog.Title>

          {/* Description */}
          <div className="mb-4 sm:mb-6">
            <p className="text-gray-600 mb-2 sm:mb-3 text-sm text-center">
              Are you sure you want to delete this user? This action cannot be undone.
            </p>
            
            {/* User Details */}
            {rowData && (
              <motion.div 
                className="bg-gray-50 rounded-lg p-3 text-left"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ delay: 0.5, duration: 0.3 }}
              >
                <div className="space-y-1.5 text-xs sm:text-sm">
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Name:</span>
                    <span className="text-gray-900 break-all">{rowData.name}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Age:</span>
                    <span className="text-gray-900">{rowData.age}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Email:</span>
                    <span className="text-gray-900 hover:underline break-all">
                      <a href={`mailto:${rowData.email}`}>{rowData.email}</a>
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Role:</span>
                    <span className="text-gray-900">{rowData.role}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Status:</span>
                    <span className={`${rowData.is_active ? 'text-green-600' : 'text-red-600'}`}>
                      {rowData.is_active ? 'Active ✅' : 'Inactive ❌'}
                    </span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Created At:</span>
                    <span className="text-gray-900 text-xs sm:text-sm">{new Date(rowData.created_at).toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col sm:flex-row sm:justify-between gap-1 sm:gap-0">
                    <span className="font-medium text-gray-700">Updated At:</span>
                    <span className="text-gray-900 text-xs sm:text-sm">{rowData.updated_at ? new Date(rowData.updated_at).toLocaleString() : "Not Yet"}</span>
                  </div>
                </div>
              </motion.div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end space-y-2 sm:space-y-0 sm:space-x-4">
            <button
              onClick={handleClose}
              className="flex-1 sm:flex-none px-4 py-2 text-gray-700 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium order-2 sm:order-1 mt-1"
            >
              Cancel
            </button>
            
            {/* Hold to Delete Button */}
            <HoldButton
              onConfirm={handleConfirmDelete}
              icon={TrashIcon}
              className="w-full sm:w-45 px-5 py-2 rounded-lg order-1 sm:order-2"
              baseColor="bg-red-600"
              hoverColor="hover:bg-red-700"
              progressBarColor="bg-red-800"
              completedText="Preparing deletion..."
              defaultText="Hold to Delete"
              holdDuration={2500}
            />
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}