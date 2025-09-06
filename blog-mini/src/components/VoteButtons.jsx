import { useEffect } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { voteOnTarget, getUserVote, getVoteCounts } from '../features/votes/votesSlice'

const VoteButtons = ({ targetType, targetId, showCounts = true }) => {
  const dispatch = useDispatch()
  const { voteCounts, userVotes, isLoading } = useSelector((state) => state.votes)
  const { isAuthenticated } = useSelector((state) => state.auth)

  const targetVotes = voteCounts[targetId] || { upvotes: 0, downvotes: 0 }
  const userVote = userVotes[targetId]

  useEffect(() => {
    // Fetch vote counts
    dispatch(getVoteCounts({ targetType, targetId }))
    
    // Fetch user vote if authenticated
    if (isAuthenticated) {
      dispatch(getUserVote({ targetType, targetId }))
    }
  }, [dispatch, targetType, targetId, isAuthenticated])

  const handleVote = async (voteType) => {
    if (!isAuthenticated) {
      alert('Please login to vote!')
      return
    }

    try {
      await dispatch(voteOnTarget({ targetType, targetId, voteType })).unwrap()
    } catch (error) {
      alert('Failed to vote: ' + error)
    }
  }

  const getNetScore = () => {
    return targetVotes.upvotes - targetVotes.downvotes
  }

  return (
    <div className="vote-buttons">
      <button
        className={`vote-btn upvote-btn ${userVote === 'upvote' ? 'active' : ''}`}
        onClick={() => handleVote('upvote')}
        disabled={isLoading}
        title="Upvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 4l8 8h-6v8h-4v-8H4l8-8z"/>
        </svg>
        {showCounts && <span className="vote-count">{targetVotes.upvotes}</span>}
      </button>
      
      {showCounts && (
        <div className="net-score">
          {getNetScore()}
        </div>
      )}
      
      <button
        className={`vote-btn downvote-btn ${userVote === 'downvote' ? 'active' : ''}`}
        onClick={() => handleVote('downvote')}
        disabled={isLoading}
        title="Downvote"
      >
        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
          <path d="M12 20l-8-8h6V4h4v8h6l-8 8z"/>
        </svg>
        {showCounts && <span className="vote-count">{targetVotes.downvotes}</span>}
      </button>
    </div>
  )
}

export default VoteButtons
