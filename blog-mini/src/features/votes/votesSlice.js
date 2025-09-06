import { createSlice, createAsyncThunk } from '@reduxjs/toolkit'
import api from '../../api/axios'

// Async thunks
export const voteOnTarget = createAsyncThunk(
  'votes/voteOnTarget',
  async ({ targetType, targetId, voteType }, { rejectWithValue }) => {
    try {
      const response = await api.post(`/votes/${targetType}/${targetId}/${voteType}`)
      return {
        ...response.data,
        targetId,
        targetType
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to vote')
    }
  }
)

export const getUserVote = createAsyncThunk(
  'votes/getUserVote',
  async ({ targetType, targetId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/votes/${targetType}/${targetId}/user-vote`)
      return {
        ...response.data,
        targetId,
        targetType
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get user vote')
    }
  }
)

export const getVoteCounts = createAsyncThunk(
  'votes/getVoteCounts',
  async ({ targetType, targetId }, { rejectWithValue }) => {
    try {
      const response = await api.get(`/votes/${targetType}/${targetId}/counts`)
      return {
        ...response.data,
        targetId,
        targetType
      }
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Failed to get vote counts')
    }
  }
)

const initialState = {
  // Store vote counts for each target: { targetId: { upvotes, downvotes } }
  voteCounts: {},
  // Store user votes for each target: { targetId: 'upvote' | 'downvote' | null }
  userVotes: {},
  isLoading: false,
  error: null,
}

const votesSlice = createSlice({
  name: 'votes',
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null
    },
    clearVotes: (state) => {
      state.voteCounts = {}
      state.userVotes = {}
    },
  },
  extraReducers: (builder) => {
    builder
      // Vote on target
      .addCase(voteOnTarget.pending, (state) => {
        state.isLoading = true
        state.error = null
      })
      .addCase(voteOnTarget.fulfilled, (state, action) => {
        state.isLoading = false
        const { targetId, upvotes, downvotes, voteType, voteRemoved } = action.payload
        
        // Update vote counts
        state.voteCounts[targetId] = { upvotes, downvotes }
        
        // Update user vote
        state.userVotes[targetId] = voteRemoved ? null : voteType
        
        state.error = null
      })
      .addCase(voteOnTarget.rejected, (state, action) => {
        state.isLoading = false
        state.error = action.payload
      })
      // Get user vote
      .addCase(getUserVote.fulfilled, (state, action) => {
        const { targetId, userVote } = action.payload
        state.userVotes[targetId] = userVote
      })
      // Get vote counts
      .addCase(getVoteCounts.fulfilled, (state, action) => {
        const { targetId, upvotes, downvotes } = action.payload
        state.voteCounts[targetId] = { upvotes, downvotes }
      })
  },
})

export const { clearError, clearVotes } = votesSlice.actions
export default votesSlice.reducer
