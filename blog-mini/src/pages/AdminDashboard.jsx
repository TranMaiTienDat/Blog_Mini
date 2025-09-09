import { useEffect, useState } from 'react'

const AdminDashboard = () => {
  const [data, setData] = useState(null)
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('http://localhost:3001/api/admin/analytics', {
          headers: {
            Authorization: `Bearer ${localStorage.getItem('token') || ''}`
          }
        })
        const json = await res.json()
        if (!res.ok || !json.success) throw new Error(json.message || 'Failed to load analytics')
        setData(json.data)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  if (loading) return <div className="loading">Loading analytics...</div>
  if (error) return <div className="error">{error}</div>

  return (
    <div className="admin-dashboard">
      <h1>Analytics Dashboard</h1>
      <div className="metrics" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: 16 }}>
        <div className="card"><h3>Posts</h3><p>{data.postCount}</p></div>
        <div className="card"><h3>Users</h3><p>{data.userCount}</p></div>
        <div className="card"><h3>Likes</h3><p>{data.likes}</p></div>
        <div className="card"><h3>Dislikes</h3><p>{data.dislikes}</p></div>
        <div className="card"><h3>Avg Score</h3><p>{data.avgScore}</p></div>
      </div>
      <h2 style={{ marginTop: 24 }}>Top Tags</h2>
      {(!data.topTags || data.topTags.length === 0) ? (
        <p>No tags yet</p>
      ) : (
        <ul>
          {data.topTags.map(t => (
            <li key={t.tag}>{t.tag} — {t.count}</li>
          ))}
        </ul>
      )}
    </div>
  )
}

export default AdminDashboard