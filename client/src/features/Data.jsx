import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from 'axios'

const BASE_URL = `http://localhost:3000/users`;

export const fetchUsers = createAsyncThunk("data/fetchUsers", async (params = {}) => {
    const { sortBy, sortDirection, groupBy } = params;
    
    let url = BASE_URL;
    const queryParams = new URLSearchParams();
    
    // Add sorting parameters
    if (sortBy) {
        queryParams.append('sortBy', sortBy);
    }
    if (sortDirection) {
        queryParams.append('sortDirection', sortDirection);
    }
    // Add grouping parameter
    if (groupBy) {
        queryParams.append('groupBy', groupBy);
    }
    
    if (queryParams.toString()) {
        url += `?${queryParams.toString()}`;
    }
    
    const response = await axios.get(url);
    return response.data;
});

export const addUser = createAsyncThunk('data/addUser', async (newUser, { rejectWithValue }) => {
    try {
        const response = await axios.post(BASE_URL, newUser);
        return response.data.user; // Return the user object from server response
    } catch (error) {
        // Handle validation errors from server
        if (error.response?.status === 400 && error.response?.data?.errors) {
            return rejectWithValue({
                type: 'validation',
                errors: error.response.data.errors,
                message: error.response.data.message
            });
        }
        
        // Handle other errors (like email already exists)
        if (error.response?.status === 409) {
            return rejectWithValue({
                type: 'conflict',
                errors: error.response.data.errors,
                message: error.response.data.message
            });
        }
        
        // Handle network or other errors
        return rejectWithValue({
            type: 'network',
            message: error.response?.data?.message || error.message || 'Network error occurred'
        });
    }
});

export const deleteUser = createAsyncThunk("data/deleteUser", async (id, { rejectWithValue }) => {
    try {
        const response = await axios.delete(`${BASE_URL}/${id}`);
        return {
            id: id,
            message: response.data.message,
            deletedUser: response.data.deletedUser
        };
    } catch (error) {
        if (error.response?.status === 404) {
            return rejectWithValue({
                type: 'not_found',
                message: error.response.data.message || 'User not found'
            });
        }
        
        if (error.response?.status === 409) {
            return rejectWithValue({
                type: 'conflict',
                message: error.response.data.message || 'Cannot delete user due to existing references'
            });
        }
        
        return rejectWithValue({
            type: 'network',
            message: error.response?.data?.message || error.message || 'Network error occurred'
        });
    }
});

export const updateUser = createAsyncThunk("data/updateUser", async (updatedUser, { rejectWithValue }) => {
    try {
        const response = await axios.put(`${BASE_URL}/${updatedUser.id}`, updatedUser);
        // Extract the user data from the server response
        return response.data.user; // Return the user object, not the entire response
    } catch (error) {
        if (error.response?.status === 400 && error.response?.data?.errors) {
            return rejectWithValue({
                type: 'validation',
                errors: error.response.data.errors,
                message: error.response.data.message
            });
        }
        
        return rejectWithValue({
            type: 'network',
            message: error.response?.data?.message || error.message || 'Network error occurred'
        });
    }
});

const dataSlice = createSlice({
    name: "data",
    initialState: {
        items: [],
        fetchStatus: "idle",
        addStatus: 'idle',
        updateStatus: 'idle',
        deleteStatus: 'idle',
        fetchError: null,
        addError: null,
        addValidationErrors: null, // New field for validation errors
        updateError: null,
        updateValidationErrors: null, // New field for validation errors
        deleteError: null,
        // Sorting and grouping state
        sortBy: null,
        sortDirection: 'asc',
        groupBy: null
    },

    reducers: {
        clearAddErrors: (state) => {
            state.addError = null;
            state.addValidationErrors = null;
        },
        clearUpdateErrors: (state) => {
            state.updateError = null;
            state.updateValidationErrors = null;
        },
        clearDeleteErrors: (state) => {
            state.deleteError = null;
        },
        // Sorting actions
        setSortBy: (state, action) => {
            state.sortBy = action.payload;
            state.fetchStatus = 'idle'; // Reset fetch status to trigger refetch
        },
        setSortDirection: (state, action) => {
            state.sortDirection = action.payload;
            state.fetchStatus = 'idle'; // Reset fetch status to trigger refetch
        },
        clearSort: (state) => {
            state.sortBy = null;
            state.sortDirection = 'asc';
            state.fetchStatus = 'idle'; // Reset fetch status to trigger refetch
        },
        // Grouping actions
        setGroupBy: (state, action) => {
            state.groupBy = action.payload;
            state.fetchStatus = 'idle'; // Reset fetch status to trigger refetch
        },
        clearGroupBy: (state) => {
            state.groupBy = null;
            state.fetchStatus = 'idle'; // Reset fetch status to trigger refetch
        }
    },

    extraReducers: (builder) => {
        builder
        // for fetching data
        .addCase(fetchUsers.pending, (state) => {
            state.fetchStatus = "loading";
        })
        .addCase(fetchUsers.fulfilled, (state, action) => {
            state.fetchStatus = "succeeded";
            state.items = action.payload;
        })
        .addCase(fetchUsers.rejected, (state, action) => {
            state.fetchStatus = "failed";
            state.fetchError = action.error.message;
        })

        // for adding data
        .addCase(addUser.pending, (state) => {
            state.addStatus = 'loading';
            state.addError = null;
            state.addValidationErrors = null;
        })
        .addCase(addUser.fulfilled, (state, action) => {
            state.addStatus = 'succeeded';
            state.items.push(action.payload);
            state.addError = null;
            state.addValidationErrors = null;
        })
        .addCase(addUser.rejected, (state, action) => {
            state.addStatus = 'failed';
            
            if (action.payload?.type === 'validation' || action.payload?.type === 'conflict') {
                state.addValidationErrors = action.payload.errors;
                state.addError = action.payload.message;
            } else {
                state.addError = action.payload?.message || action.error.message;
                state.addValidationErrors = null;
            }
        })

        // Delete handlers
        .addCase(deleteUser.pending, (state) => {
            state.deleteStatus = "loading";
            state.deleteError = null;
        })
        .addCase(deleteUser.fulfilled, (state, action) => {
            state.deleteStatus = "succeeded";
            state.items = state.items.filter((item) => item.id !== action.payload.id);
            state.deleteError = null;
        })
        .addCase(deleteUser.rejected, (state, action) => {
            state.deleteStatus = "failed";
            state.deleteError = action.payload?.message || action.error.message;
        })

        // Update handlers
        .addCase(updateUser.pending, (state) => {
            state.updateStatus = "loading";
            state.updateError = null;
            state.updateValidationErrors = null;
        })
        .addCase(updateUser.fulfilled, (state, action) => {
            state.updateStatus = "succeeded";
            const index = state.items.findIndex((item) => item.id === action.payload.id);
            if (index !== -1) {
                state.items[index] = action.payload;
            }
            state.updateError = null;
            state.updateValidationErrors = null;
        })
        .addCase(updateUser.rejected, (state, action) => {
            state.updateStatus = "failed";
            
            if (action.payload?.type === 'validation') {
                state.updateValidationErrors = action.payload.errors;
                state.updateError = action.payload.message;
            } else {
                state.updateError = action.payload?.message || action.error.message;
                state.updateValidationErrors = null;
            }
        });
    }
});

export const { 
    clearAddErrors, 
    clearUpdateErrors, 
    clearDeleteErrors,
    setSortBy,
    setSortDirection,
    clearSort,
    setGroupBy,
    clearGroupBy
} = dataSlice.actions;

// Data selectors
export const selectAllUsers = ((state) => state.data.items);

export const fetStatus = ((state) => state.data.fetchStatus);
export const fetError = ((state) => state.data.fetchError);

export const addStatus = ((state) => state.data.addStatus);
export const addError = ((state) => state.data.addError);
export const addValidationErrors = ((state) => state.data.addValidationErrors);

export const delStatus = ((state) => state.data.deleteStatus);
export const delError = ((state) => state.data.deleteError);

export const updStatus = ((state) => state.data.updateStatus);
export const updError = ((state) => state.data.updateError);
export const updValidationErrors = ((state) => state.data.updateValidationErrors);

// Sorting and grouping selectors
export const selectSortBy = ((state) => state.data.sortBy);
export const selectSortDirection = ((state) => state.data.sortDirection);
export const selectGroupBy = ((state) => state.data.groupBy);

export default dataSlice.reducer;