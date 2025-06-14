import { useSelector, useDispatch } from 'react-redux';
import { Dialog } from '@headlessui/react';
import { motion } from 'framer-motion';
import { InformationCircleIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { closeNoteModal, selectNoteModal } from '../features/UI';

export default function NoteModal() {
  const dispatch = useDispatch();
  const noteModal = useSelector(selectNoteModal);
  const { isOpen } = noteModal;

  const handleClose = () => {
    dispatch(closeNoteModal());
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
          {/* Animated Info Icon */}
          <motion.div 
            className="flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 mx-auto bg-blue-100 rounded-xl mb-3 sm:mb-4"
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
              }}
              transition={{ 
                duration: 2,
                repeat: Infinity,
                ease: "easeInOut"
              }}
            >
              <InformationCircleIcon className="w-6 h-6 sm:w-7 sm:h-7 text-blue-600" />
            </motion.div>
          </motion.div>

          {/* Close Button */}
          <button
            onClick={handleClose}
            className="absolute top-4 right-4 p-1 rounded-full hover:bg-gray-100 transition-colors"
          >
            <XMarkIcon className="h-5 w-5 text-gray-500" />
          </button>

          {/* Title */}
          <Dialog.Title className="text-lg sm:text-xl font-semibold text-gray-900 mb-4 sm:mb-6 text-center">
            Table Features Guide
          </Dialog.Title>

          {/* Content */}
          <motion.div 
            className="space-y-4 sm:space-y-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.3 }}
          >
            {/* Grouping Section */}
            <div className="bg-blue-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-blue-900 mb-3 flex items-center gap-2">
                📊 Grouping Features
              </h3>
              <div className="space-y-2 text-sm text-blue-800">
                <p><strong>Group by Country:</strong> Organizes users by their country of origin</p>
                <p><strong>Group by Role:</strong> Groups users based on their assigned role</p>
                <p><strong>Group by Status:</strong> Separates active and inactive users</p>
                <p><strong>Clear Grouping:</strong> Returns to the ungrouped view</p>
              </div>
            </div>

            {/* Sorting Section */}
            <div className="bg-green-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-green-900 mb-3 flex items-center gap-2">
                🔄 Sorting Features
              </h3>
              <div className="space-y-2 text-sm text-green-800">
                <p><strong>Column Headers:</strong> Click on sortable column headers to sort data</p>
                <p><strong>Sort Direction:</strong> Click again to toggle between ascending/descending</p>
                <p><strong>Sortable Columns:</strong> ID, Name, Age, Email, Created At, Updated At</p>
                <p><strong>Visual Indicators:</strong> Arrows show current sort column and direction</p>
              </div>
            </div>

            {/* Actions Section */}
            <div className="bg-purple-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-purple-900 mb-3 flex items-center gap-2">
                ⚡ Table Actions
              </h3>
              <div className="space-y-2 text-sm text-purple-800">
                <p><strong>Update:</strong> Modify user information with undo option</p>
                <p><strong>Delete:</strong> Remove users with 5-second undo window</p>
                <p><strong>Add New:</strong> Create new user entries</p>
                <p><strong>Undo Actions:</strong> Cancel recent updates or deletions</p>
              </div>
            </div>

            {/* Tips Section */}
            <div className="bg-amber-50 rounded-lg p-4">
              <h3 className="text-md font-semibold text-amber-900 mb-3 flex items-center gap-2">
                💡 Pro Tips
              </h3>
              <div className="space-y-2 text-sm text-amber-800">
                <p>• Combine grouping and sorting for better data organization</p>
                <p>• Use the undo feature within 5 seconds to cancel actions</p>
                <p>• Email addresses are clickable for quick contact</p>
                <p>• Table is fully responsive across all devices</p>
              </div>
            </div>
          </motion.div>

          {/* Close Button */}
          <div className="flex justify-center mt-6">
            <button
              onClick={handleClose}
              className="px-6 py-2 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors font-medium text-gray-700"
            >
              Got it!
            </button>
          </div>
        </div>
      </motion.div>
    </Dialog>
  );
}