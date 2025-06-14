import { createSlice } from "@reduxjs/toolkit";

const uiSlice = createSlice({
    name: "ui",
    initialState: {
        // Modal states
        modals: {
            update: {
                isOpen: false,
                selectedUser: null
            },
            delete: {
                isOpen: false,
                selectedUser: null
            },
            note: {
                isOpen: false,
                selectedUser: null
            },
            insert: {
                isOpen: false
            }
        },
        
        // Undo toast states
        undoToasts: {
            delete: {
                isOpen: false,
                pendingUser: null,
                timeoutId: null
            },
            update: {
                isOpen: false,
                pendingData: null,
                originalData: null,
                timeoutId: null
            }
        }
    },

    reducers: {
        // Modal actions
        openUpdateModal: (state, action) => {
            state.modals.update.isOpen = true;
            state.modals.update.selectedUser = action.payload;
        },
        
        closeUpdateModal: (state) => {
            state.modals.update.isOpen = false;
            state.modals.update.selectedUser = null;
        },
        
        openDeleteModal: (state, action) => {
            state.modals.delete.isOpen = true;
            state.modals.delete.selectedUser = action.payload;
        },
        
        closeDeleteModal: (state) => {
            state.modals.delete.isOpen = false;
            state.modals.delete.selectedUser = null;
        },
        openNoteModal: (state, action) => {
            state.modals.note.isOpen = true;
            state.modals.note.selectedUser = action.payload;
        },
        closeNoteModal: (state) => {
            state.modals.note.isOpen = false;
            state.modals.note.selectedUser = null;
        },
        
        
        openInsertModal: (state) => {
            state.modals.insert.isOpen = true;
        },
        
        closeInsertModal: (state) => {
            state.modals.insert.isOpen = false;
        },
        
        // Delete undo toast actions
        showDeleteUndoToast: (state, action) => {
            state.undoToasts.delete.isOpen = true;
            state.undoToasts.delete.pendingUser = action.payload.user;
            state.undoToasts.delete.timeoutId = action.payload.timeoutId;
        },
        
        hideDeleteUndoToast: (state) => {
            state.undoToasts.delete.isOpen = false;
            state.undoToasts.delete.pendingUser = null;
            state.undoToasts.delete.timeoutId = null;
        },
        
        setDeleteTimeoutId: (state, action) => {
            state.undoToasts.delete.timeoutId = action.payload;
        },
        
        // Update undo toast actions
        showUpdateUndoToast: (state, action) => {
            state.undoToasts.update.isOpen = true;
            state.undoToasts.update.pendingData = action.payload.pendingData;
            state.undoToasts.update.originalData = action.payload.originalData;
            state.undoToasts.update.timeoutId = action.payload.timeoutId;
        },
        
        hideUpdateUndoToast: (state) => {
            state.undoToasts.update.isOpen = false;
            state.undoToasts.update.pendingData = null;
            state.undoToasts.update.originalData = null;
            state.undoToasts.update.timeoutId = null;
        },
        
        setUpdateTimeoutId: (state, action) => {
            state.undoToasts.update.timeoutId = action.payload;
        },
        
        // Clear all UI states (useful for cleanup)
        resetUIState: (state) => {
            state.modals.update.isOpen = false;
            state.modals.update.selectedUser = null;
            state.modals.delete.isOpen = false;
            state.modals.delete.selectedUser = null;
            state.modals.note.isOpen = false;
            state.modals.note.selectedUser = null;
            state.modals.insert.isOpen = false;
            state.undoToasts.delete.isOpen = false;
            state.undoToasts.delete.pendingUser = null;
            state.undoToasts.delete.timeoutId = null;
            state.undoToasts.update.isOpen = false;
            state.undoToasts.update.pendingData = null;
            state.undoToasts.update.originalData = null;
            state.undoToasts.update.timeoutId = null;
        }
    }
});

// Export actions
export const {
    // Modal actions
    openUpdateModal,
    closeUpdateModal,
    openDeleteModal,
    closeDeleteModal,
    openNoteModal,
    closeNoteModal,
    openInsertModal,
    closeInsertModal,
    
    // Delete undo toast actions
    showDeleteUndoToast,
    hideDeleteUndoToast,
    setDeleteTimeoutId,
    
    // Update undo toast actions
    showUpdateUndoToast,
    hideUpdateUndoToast,
    setUpdateTimeoutId,
    
    // Reset action
    resetUIState
} = uiSlice.actions;

// Selectors
export const selectUpdateModal = (state) => state.ui.modals.update;
export const selectDeleteModal = (state) => state.ui.modals.delete;
export const selectNoteModal = (state) => state.ui.modals.note;
export const selectInsertModal = (state) => state.ui.modals.insert;
export const selectDeleteUndoToast = (state) => state.ui.undoToasts.delete;
export const selectUpdateUndoToast = (state) => state.ui.undoToasts.update;

export default uiSlice.reducer;