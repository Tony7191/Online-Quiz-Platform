import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { API, getSession } from '../utils/api.js'

export default function Dashboard(){
  const nav = useNavigate()
  const [user, setUser] = useState(null)
  const [toast, setToast] = useState({})

  useEffect(()=>{
    (async ()=>{
      const s = await getSession()
      if(!s.loggedIn) return nav('/login')
      setUser(s.user)
    })()
  }, [nav])

  async function logout(){
    await fetch(API + '/api/logout', { method:'POST', credentials:'include' })
    setToast({ type:'ok', title:'Logged out', message:'See you next time!' })
    setTimeout(()=> nav('/login'), 400)
  }

  return (
    <div className="bg2">
      <div className="nav">
        <div className="brand">Quiz Platform</div>
        <div className="navRight">
          <span className="pill">{user?.username || '...'}</span>
          <button className="btn small" onClick={logout}>Logout</button>
        </div>
      </div>

      <div className="wrap">
        <div className="card">
          <h2>Welcome, {user?.fullname || ''} 🎉</h2>
          <p className="muted">You are logged in using a secure server session.</p>
          <div className="row">
            <a className="btn accent" href="#">Start Quiz</a>
            <a className="btn" href="#">My Results</a>
          </div>
          <p className="small muted">Hook buttons to your quiz pages.</p>
        </div>
      </div>

      <Toast {...toast} onClose={()=>setToast({})} />
    </div>
  )
}
