import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Async thunks
export const fetchComments = createAsyncThunk(
  'comments/fetchComments',
  async (postId, { rejectWithValue }) => {
    try {
      const response = await api.get(`/comments/${postId}`)
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch comments')
    }
  }
)

export const createComment = createAsyncThunk(
  'comments/createComment',
  async ({ postId, content }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/comments/${postId}`, { content })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to create comment')
    }
  }
)

export const updateComment = createAsyncThunk(
  'comments/updateComment',
  async ({ commentId, content }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/comments/comment/${commentId}`, { content })
      return response.data
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to update comment')
    }
  }
)

export const deleteComment = createAsyncThunk(
  'comments/deleteComment',
  async (commentId, { rejectWithValue }) => {
    try {
      await api.delete(`/comments/comment/${commentId}`)
      return commentId
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to delete comment')
    }
  }
)

const initialState = {
  comments: [],
  isLoading: false,
  error: null,
}

const commentsSlice = createSlice({
  name: 'comments',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearComments: (state) => {
      state.comments = []
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch comments
      .addCase(fetchComments.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(fetchComments.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments = action.payload.data || action.payload
        state.error = null
      })
      .addCase(fetchComments.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Create comment
      .addCase(createComment.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(createComment.fulfilled, (state, action) => {
        state.isLoading = false
        state.comments.unshift(action.payload.data)
        state.error = null
      })
      .addCase(createComment.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Update comment
      .addCase(updateComment.fulfilled, (state, action) => {
        const index = state.comments.findIndex(comment => comment._id === action.payload.data._id)
        if (index !== -1) {
          state.comments[index] = action.payload.data
        }
      })
      // Delete comment
      .addCase(deleteComment.fulfilled, (state, action) => {
        state.comments = state.comments.filter(comment => comment._id !== action.payload)
      })
  },
})

export const { clearError, clearComments } = commentsSlice.actions
export default commentsSlice.reducer
