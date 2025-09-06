import { configureStore } from '@reduxjs/toolkit'
import authReducer from './features/auth/authSlice'
import postsReducer from './features/posts/postsSlice'
import commentsReducer from './features/comments/commentsSlice'
import votesReducer from './features/votes/votesSlice'

export const store = configureStore({
  reducer: {
    auth: authReducer,
    posts: postsReducer,
    comments: commentsReducer,
    votes: votesReducer,
  },
})
