import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { API, post } from '../utils/api.js'

export default function Login(){
  const nav = useNavigate()
  const [login_id, setLoginId] = useState('')
  const [password, setPassword] = useState('')
  const [toast, setToast] = useState({})

  async function onSubmit(e){
    e.preventDefault()
    setToast({})
    try{
      await post(API + '/api/login', { login_id, password })
      setToast({ type:'ok', title:'Welcome back', message:'Login successful. Redirecting...' })
      setTimeout(()=> nav('/dashboard'), 600)
    }catch(err){
      setToast({ type:'err', title:'Login failed', message: err.message })
    }
  }

  return (
    <div className="bg">
      <div className="center">
        <form className="card" onSubmit={onSubmit}>
          <h2>Login</h2>
          <p className="muted">Use username or email. Wrong attempts can lock the account.</p>

          <label>Username or Email</label>
          <input value={login_id} onChange={e=>setLoginId(e.target.value)} required placeholder="username or email" />

          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required placeholder="your password" />

          <button className="btn primary" type="submit">Login</button>

          <div className="row">
            <Link className="btn ghost" to="/signup">Create account</Link>
            <Link className="btn" to="/">Home</Link>
          </div>

          <p className="small muted">No account? <Link to="/signup">Sign up</Link></p>
        </form>
      </div>
      <Toast {...toast} onClose={()=>setToast({})} />
    </div>
  )
}
