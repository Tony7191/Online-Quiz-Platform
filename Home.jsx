import { Link } from 'react-router-dom'
export default function Home(){
  return (
    <div className="bg">
      <div className="center">
        <div className="card hero">
          <div className="badge">✨ React + Express Auth</div>
          <h1>Quiz Platform</h1>
          <p className="muted">Strict login: strong passwords, rate limit, lockout after failed attempts.</p>
          <div className="row">
            <Link className="btn primary" to="/login">Login</Link>
            <Link className="btn accent" to="/signup">Create Account</Link>
          </div>
          <p className="small muted">Password rule: 8+ chars with Upper, Lower, Number, Symbol.</p>
        </div>
      </div>
    </div>
  )
}
