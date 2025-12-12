import { useMemo, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import Toast from '../components/Toast.jsx'
import { API, post } from '../utils/api.js'

function checks(p){
  return {
    len: (p||'').length >= 8,
    upper: /[A-Z]/.test(p||''),
    lower: /[a-z]/.test(p||''),
    num: /[0-9]/.test(p||''),
    sym: /[^A-Za-z0-9]/.test(p||''),
  }
}
function score(p){
  const c = checks(p)
  return Object.values(c).filter(Boolean).length
}

export default function Signup(){
  const nav = useNavigate()
  const [fullname, setFullname] = useState('')
  const [username, setUsername] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [toast, setToast] = useState({})

  const c = useMemo(()=>checks(password), [password])
  const pct = (score(password)/5*100).toFixed(0)

  async function onSubmit(e){
    e.preventDefault()
    setToast({})
    if(password !== confirm) return setToast({ type:'err', title:'Fix password', message:'Passwords do not match.' })
    if(score(password) < 5) return setToast({ type:'err', title:'Weak password', message:'Use Upper, Lower, Number, Symbol and 8+ chars.' })
    try{
      await post(API + '/api/signup', { fullname, username, email, password, confirm })
      setToast({ type:'ok', title:'Account created', message:'Redirecting to dashboard...' })
      setTimeout(()=> nav('/dashboard'), 600)
    }catch(err){
      setToast({ type:'err', title:'Signup failed', message: err.message })
    }
  }

  return (
    <div className="bg">
      <div className="center">
        <form className="card" onSubmit={onSubmit}>
          <h2>Create account</h2>
          <p className="muted">Strong password required.</p>

          <label>Full name</label>
          <input value={fullname} onChange={e=>setFullname(e.target.value)} required minLength={3} maxLength={100} />

          <label>Username</label>
          <input value={username} onChange={e=>setUsername(e.target.value)} required minLength={3} maxLength={30} placeholder="letters, numbers, _" />

          <label>Email</label>
          <input type="email" value={email} onChange={e=>setEmail(e.target.value)} required />

          <label>Password</label>
          <input type="password" value={password} onChange={e=>setPassword(e.target.value)} required minLength={8} placeholder="Upper+lower+num+symbol" />

          <div className="pwbar"><div style={{ width: pct + '%' }} /></div>
          <div className="hints">
            <span className={c.len?'good':''}>{c.len?'✓':'•'} 8+ characters</span>
            <span className={c.upper?'good':''}>{c.upper?'✓':'•'} Uppercase (A-Z)</span>
            <span className={c.lower?'good':''}>{c.lower?'✓':'•'} Lowercase (a-z)</span>
            <span className={c.num?'good':''}>{c.num?'✓':'•'} Number (0-9)</span>
            <span className={c.sym?'good':''}>{c.sym?'✓':'•'} Symbol (!@#)</span>
          </div>

          <label>Confirm password</label>
          <input type="password" value={confirm} onChange={e=>setConfirm(e.target.value)} required minLength={8} />

          <button className="btn primary" type="submit">Sign Up</button>

          <div className="row">
            <Link className="btn ghost" to="/login">I already have an account</Link>
            <Link className="btn" to="/">Home</Link>
          </div>

          <p className="small muted">Already have an account? <Link to="/login">Login</Link></p>
        </form>
      </div>
      <Toast {...toast} onClose={()=>setToast({})} />
    </div>
  )
}
