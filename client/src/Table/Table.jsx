import { useEffect, useRef } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { 
  fetchUsers, 
  deleteUser, 
  updateUser, 
  addUser, 
  selectAllUsers, 
  fetStatus, 
  fetError,
  addStatus,
  addError,
  addValidationErrors,
  clearAddErrors,
  updStatus,
  updError,
  updValidationErrors,
  clearUpdateErrors,
  delStatus,
  delError,
  clearDeleteErrors,
  setSortBy,
  setSortDirection,
  setGroupBy,
  clearGroupBy,
  selectSortBy,
  selectSortDirection,
  selectGroupBy
} from '../features/Data';

// Import UI slice actions and selectors
import {
  openUpdateModal,
  closeUpdateModal,
  openDeleteModal,
  closeDeleteModal,
  openInsertModal,
  closeInsertModal,
  showDeleteUndoToast,
  hideDeleteUndoToast,
   openNoteModal,
  closeNoteModal,
  setDeleteTimeoutId,
  showUpdateUndoToast,
  hideUpdateUndoToast,
  setUpdateTimeoutId,
  selectUpdateModal,
  selectDeleteModal,
  selectInsertModal,
  selectNoteModal,
  selectDeleteUndoToast,
  selectUpdateUndoToast
} from '../features/UI'; // Adjust path as needed

import { AnimatePresence } from 'framer-motion';
import Insert from '../Components/Insert';
import Update from '../Components/Update';
import Delete from '../Components/Delete';
import toast from '../Components/UI/Toast';
import UndoToast from '../Components/UI/UndoToast';
import NoteModal from '../Components/NoteModal';
import { CheckIcon, XMarkIcon, ChevronUpIcon, ChevronDownIcon, InformationCircleIcon } from '@heroicons/react/24/outline';

const UsersTable = () => {
  const dispatch = useDispatch();
  
  // Data selectors
  const users = useSelector(selectAllUsers);
  const fetchStatus = useSelector(fetStatus);
  const fetchError = useSelector(fetError);
  const insertStatus = useSelector(addStatus);
  const insertError = useSelector(addError);
  const insertValidationErrors = useSelector(addValidationErrors);
  const updateStatus = useSelector(updStatus);
  const updateError = useSelector(updError);
  const updateValidationErrors = useSelector(updValidationErrors);
  const deleteStatus = useSelector(delStatus);
  const deleteError = useSelector(delError);
  
  // Sorting and grouping selectors
  const sortBy = useSelector(selectSortBy);
  const sortDirection = useSelector(selectSortDirection);
  const groupBy = useSelector(selectGroupBy);
  
  // UI selectors
  const updateModal = useSelector(selectUpdateModal);
  const deleteModal = useSelector(selectDeleteModal);
  const insertModal = useSelector(selectInsertModal);
  const noteModal = useSelector(selectNoteModal);
  const deleteUndoToast = useSelector(selectDeleteUndoToast);
  const updateUndoToast = useSelector(selectUpdateUndoToast);
  
  // Refs for timeout management
  const deleteTimeoutRef = useRef(null);
  const updateTimeoutRef = useRef(null);

  useEffect(() => {
    if (fetchStatus === 'idle') {
      dispatch(fetchUsers({ sortBy, sortDirection, groupBy }));
    }
  }, [dispatch, fetchStatus]);

  // Refetch when sorting or grouping changes
  useEffect(() => {
    if (fetchStatus !== 'idle') {
      dispatch(fetchUsers({ sortBy, sortDirection, groupBy }));
    }
  }, [dispatch, sortBy, sortDirection, groupBy]);

  // Handle insert success/error feedback
  useEffect(() => {
    if (insertStatus === 'succeeded') {
      toast.success('User added successfully!');
      dispatch(closeInsertModal());
      dispatch(clearAddErrors());
    } else if (insertStatus === 'failed') {
      if (insertValidationErrors) {
        console.log('Validation errors:', insertValidationErrors);
      } else {
        toast.error(`Failed to add user: ${insertError}`);
      }
    }
  }, [insertStatus, insertError, insertValidationErrors, dispatch]);

  // Handle update success/error feedback
  useEffect(() => {
    if (updateStatus === 'succeeded') {
      toast.success('User updated successfully!');
      dispatch(hideUpdateUndoToast());
      dispatch(clearUpdateErrors());
    } else if (updateStatus === 'failed') {
      if (updateValidationErrors) {
        console.log('Update validation errors:', updateValidationErrors);
      } else {
        toast.error(`Failed to update user: ${updateError}`);
        dispatch(hideUpdateUndoToast());
      }
    }
  }, [updateStatus, updateError, updateValidationErrors, dispatch]);

  // Handle delete success/error feedback
  useEffect(() => {
    if (deleteStatus === 'succeeded') {
      toast.success('User deleted successfully!');
      dispatch(hideDeleteUndoToast());
      dispatch(clearDeleteErrors());
    } else if (deleteStatus === 'failed') {
      toast.error(`Failed to delete user: ${deleteError}`);
      dispatch(hideDeleteUndoToast());
    }
  }, [deleteStatus, deleteError, dispatch]);

  const handleOpenUpdate = (row) => {
    dispatch(openUpdateModal({ ...row }));
  };

  const handleOpenDelete = (row) => {
    dispatch(openDeleteModal(row));
  };

  const handleDeleteWithUndo = async (userData) => {
    dispatch(showDeleteUndoToast({ 
      user: userData, 
      timeoutId: null 
    }));
    
    deleteTimeoutRef.current = setTimeout(async () => {
      try {
        await dispatch(deleteUser(userData.id)).unwrap();
      } catch (error) {
        console.error('Delete failed:', error);
      }
    }, 5000);
    
    // Store timeout ID in Redux
    dispatch(setDeleteTimeoutId(deleteTimeoutRef.current));
  };

  const handleUpdateWithUndo = async (updateData, originalData) => {
    dispatch(showUpdateUndoToast({ 
      pendingData: updateData,
      originalData: originalData,
      timeoutId: null 
    }));
    
    updateTimeoutRef.current = setTimeout(async () => {
      try {
        await dispatch(updateUser(updateData)).unwrap();
      } catch (error) {
        console.error('Update failed:', error);
      }
    }, 5000);
    
    // Store timeout ID in Redux
    dispatch(setUpdateTimeoutId(updateTimeoutRef.current));
  };

  const handleUndoDelete = () => {
    if (deleteTimeoutRef.current) {
      clearTimeout(deleteTimeoutRef.current);
      deleteTimeoutRef.current = null;
    }
    
    dispatch(hideDeleteUndoToast());
    toast.success('Deletion cancelled successfully!');
  };

  const handleUndoUpdate = () => {
    if (updateTimeoutRef.current) {
      clearTimeout(updateTimeoutRef.current);
      updateTimeoutRef.current = null;
    }
    
    dispatch(hideUpdateUndoToast());
    toast.success('Update cancelled successfully!');
  };

  const handleCloseDeleteUndoToast = () => {
    dispatch(hideDeleteUndoToast());
  };

  const handleCloseUpdateUndoToast = () => {
    dispatch(hideUpdateUndoToast());
  };

  const handleDelete = async () => {
    handleDeleteWithUndo(deleteModal.selectedUser);
  };

  const handleUpdate = async (updateData, originalData) => {
    try {
      // Close the update modal first
      dispatch(closeUpdateModal());
      
      // Instead of updating immediately, trigger the undo flow
      handleUpdateWithUndo(updateData, originalData);
    } catch (error) {
      console.error('Update failed:', error);
    }
  };

  const handleInsert = async (newRow) => {
    try {
      await dispatch(addUser(newRow)).unwrap();
    } catch (error) {
      console.error('Insert failed:', error);
    }
  };

  // Handle column sorting
  const handleSort = (column) => {
    const sortableColumns = ['id', 'name', 'age', 'email', 'created_at', 'updated_at'];
    
    if (!sortableColumns.includes(column)) return;

    if (sortBy === column) {
      // Toggle direction if same column
      const newDirection = sortDirection === 'asc' ? 'desc' : 'asc';
      dispatch(setSortDirection(newDirection));
    } else {
      // New column, start with asc
      dispatch(setSortBy(column));
      dispatch(setSortDirection('asc'));
    }
  };

  // Handle grouping
  const handleGroup = (column) => {
    const groupableColumns = ['country', 'role', 'is_active'];
    
    if (!groupableColumns.includes(column)) return;

    if (groupBy === column) {
      // Clear grouping if same column
      dispatch(clearGroupBy());
    } else {
      // Set new grouping
      dispatch(setGroupBy(column));
    }
  };

  // Get sort icon for column headers
  const getSortIcon = (column) => {
    if (sortBy !== column) return null;
    
    return sortDirection === 'asc' ? 
      <ChevronUpIcon className="h-4 w-4 inline ml-1" /> : 
      <ChevronDownIcon className="h-4 w-4 inline ml-1" />;
  };

  // Group users if groupBy is set
  const getGroupedUsers = () => {
    if (!groupBy) return { ungrouped: users };
    
    return users.reduce((groups, user) => {
      let key = user[groupBy];
      
      // Handle is_active grouping
      if (groupBy === 'is_active') {
        key = user[groupBy] ? 'Active' : 'Inactive';
      }
      
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(user);
      return groups;
    }, {});
  };

  // Cleanup timeouts on component unmount
  useEffect(() => {
    return () => {
      if (deleteTimeoutRef.current) {
        clearTimeout(deleteTimeoutRef.current);
      }
      if (updateTimeoutRef.current) {
        clearTimeout(updateTimeoutRef.current);
      }
    };
  }, []);

  // Get user name for undo toasts
  const getUpdatedUserName = () => {
    if (updateUndoToast.pendingData && updateUndoToast.originalData) {
      return updateUndoToast.pendingData.name || updateUndoToast.originalData.name;
    }
    return '';
  };

  const groupedUsers = getGroupedUsers();

  return (
    <div className="min-h-screen bg-gray-50 p-6 flex items-center justify-center">
      <div className="w-full max-w-9xl overflow-auto">
        <div className="mb-6">
  {/* Users Table Header */}
  <div className="flex items-center gap-3 mb-4">
    <h1 className="text-3xl font-semibold text-gray-900">Users Table</h1>
    <button
      onClick={() => dispatch(openNoteModal())}
      className="p-2 rounded-lg bg-blue-100 hover:bg-blue-200 text-blue-600 transition"
      title="View grouping and sorting information"
    >
      <InformationCircleIcon className="h-5 w-5" />
    </button>
  </div>
  
  {/* Controls */}
  <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-4">
    {/* Grouping Controls */}
    <div className="w-full lg:w-auto">
      <div className="grid grid-cols-2 sm:grid-cols-4 lg:flex gap-2">
        <button
          onClick={() => handleGroup('country')}
          className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            groupBy === 'country' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Group by Country
        </button>
        <button
          onClick={() => handleGroup('role')}
          className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            groupBy === 'role' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Group by Role
        </button>
        <button
          onClick={() => handleGroup('is_active')}
          className={`px-3 py-2 rounded-md text-xs sm:text-sm font-medium transition whitespace-nowrap ${
            groupBy === 'is_active' 
              ? 'bg-blue-600 text-white' 
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
        >
          Group by Status
        </button>
        {groupBy && (
          <button
            onClick={() => dispatch(clearGroupBy())}
            className="px-3 py-2 rounded-md text-xs sm:text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition whitespace-nowrap col-span-2 sm:col-span-1"
          >
            Clear Grouping
          </button>
        )}
      </div>
    </div>
    
    {/* Add New Button */}
    <div className="w-full lg:w-auto">
      <button
        onClick={() => dispatch(openInsertModal())}
        disabled={insertStatus === 'loading'}
        className="w-full lg:w-auto bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-300 px-5 py-3 rounded-lg text-white text-sm shadow-md transition"
      >
        {insertStatus === 'loading' ? 'Adding...' : 'Add New'}
      </button>
    </div>
  </div>
</div>

        <div className="rounded-xl overflow-hidden shadow-md border border-gray-200 bg-white max-w-full min-h-[200px]">
          {fetchStatus === 'loading' && (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-600">Loading users...</p>
            </div>
          )}
          
          {fetchStatus === 'failed' && (
            <div className="flex items-center justify-center h-48">
              <p className="text-red-600">Error: {fetchError}</p>
            </div>
          )}
          
          {fetchStatus === 'succeeded' && users.length === 0 && (
            <div className="flex items-center justify-center h-48">
              <p className="text-gray-600">No users found.</p>
            </div>
          )}

          {fetchStatus === 'succeeded' && users.length > 0 && (
            <div className="overflow-auto max-h-96">
              {Object.entries(groupedUsers).map(([groupKey, groupUsers]) => (
                <div key={groupKey}>
                  {/* Group Header (only show if grouping is active) */}
                  {groupBy && (
                    <div className="bg-gray-100 border-b border-gray-300 px-4 py-2">
                      <h3 className="text-lg font-semibold text-gray-800">
                        {groupKey} ({groupUsers.length} users)
                      </h3>
                    </div>
                  )}
                  
                  <table className="min-w-full table-auto text-center" style={{ minWidth: '1200px' }}>
                    <thead className="bg-gray-100 text-gray-700 sticky top-0">
                      <tr>
                        <th 
                          className="p-4 min-w-[80px] cursor-pointer hover:bg-gray-200 transition"
                          onClick={() => handleSort('id')}
                        >
                          ID {getSortIcon('id')}
                        </th>
                        <th 
                          className="p-4 min-w-[150px] cursor-pointer hover:bg-gray-200 transition"
                          onClick={() => handleSort('name')}
                        >
                          Name {getSortIcon('name')}
                        </th>
                        <th 
                          className="p-4 min-w-[150px] cursor-pointer hover:bg-gray-200 transition"
                          onClick={() => handleSort('age')}
                        >
                          Age {getSortIcon('age')}
                        </th>
                        <th 
                          className="p-4 min-w-[200px] cursor-pointer hover:bg-gray-200 transition"
                          onClick={() => handleSort('email')}
                        >
                          Email {getSortIcon('email')}
                        </th>
                        <th className="p-4 min-w-[120px]">Country</th>
                        <th className="p-4 min-w-[100px]">Role</th>
                        <th className="p-4 min-w-[80px]">Active</th>
                        <th 
                          className="p-4 min-w-[80px] cursor-pointer hover:bg-gray-200 transition"
                          onClick={() => handleSort('created_at')}
                        >
                          Created At {getSortIcon('created_at')}
                        </th>
                        <th 
                          className="p-4 min-w-[80px] cursor-pointer hover:bg-gray-200 transition"
                          onClick={() => handleSort('updated_at')}
                        >
                          Updated At {getSortIcon('updated_at')}
                        </th>
                        <th className="p-4 min-w-[150px]">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {groupUsers.map((row) => (
                        <tr
                          key={row.id}
                          className="border-t border-gray-200 hover:bg-gray-50 transition"
                        >
                          <td className="p-4 text-gray-900">{row.id}</td>
                          <td className="p-4 text-gray-900">{row.name}</td>
                          <td className="p-4 text-gray-900">{row.age}</td>
                          <td className="p-4 text-gray-900 hover:underline"><a href={`mailto:${row.email}`}>{row.email}</a></td>
                          <td className="p-4 text-gray-900">{row.country}</td>
                          <td className="p-4 text-gray-900">{row.role}</td>
                          <td className="p-4 text-gray-900">{row.is_active ? <CheckIcon className="h-6 w-6 text-black" /> : <XMarkIcon className="h-6 w-6 text-black" />}</td>
                          <td className="p-4 text-gray-900">{new Date(row.created_at).toLocaleString()}</td>
                          <td className="p-4 text-gray-900">{row.updated_at ? new Date(row.updated_at).toLocaleString() : 'not yet'}</td>
                          <td className="p-4">
                            <div className="flex space-x-4">
                              <button
                                onClick={() => handleOpenUpdate(row)}
                                disabled={updateStatus === 'loading'}
                                className="text-indigo-600 hover:text-indigo-500 font-medium disabled:text-indigo-300"
                              >
                                {updateStatus === 'loading' ? 'Updating...' : 'Update'}
                              </button> 
                               <button
                                onClick={() => handleOpenDelete(row)}
                                disabled={deleteStatus === 'loading'}
                                className="text-red-600 hover:text-red-500 font-medium disabled:text-red-300"
                              >
                                {deleteStatus === 'loading' ? 'Deleting...' : 'Delete'}
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              ))}
            </div>
          )}
        </div>

        <AnimatePresence>
          <Update onUpdate={handleUpdate} />
        </AnimatePresence>

        <AnimatePresence>
          <Delete onDelete={handleDelete} />
        </AnimatePresence>

        <AnimatePresence>
          <Insert onInsert={handleInsert} />
        </AnimatePresence>

         <AnimatePresence>
          <NoteModal />
        </AnimatePresence>

        {/* Delete Undo Toast */}
        <UndoToast
          isOpen={deleteUndoToast.isOpen}
          onUndo={handleUndoDelete}
          onClose={handleCloseDeleteUndoToast}
          userName={deleteUndoToast.pendingUser?.name}
          duration={5000}
          type="delete"
        />

        {/* Update Undo Toast */}
        <UndoToast
          isOpen={updateUndoToast.isOpen}
          onUndo={handleUndoUpdate}
          onClose={handleCloseUpdateUndoToast}
          userName={getUpdatedUserName()}
          duration={5000}
          type="update"
        />
      </div>
    </div>
  );
}

export default UsersTable;