export const API = 'http://localhost:4000'

export async function post(url, body){
  const res = await fetch(url, {
    method:'POST',
    credentials:'include',
    headers:{'Content-Type':'application/json'},
    body: JSON.stringify(body)
  })
  const data = await res.json().catch(()=> ({}))
  if(!res.ok) throw new Error(data.error || 'Request failed')
  return data
}

export async function getSession(){
  const res = await fetch(API + '/api/session', { credentials:'include' })
  return res.json().catch(()=> ({ loggedIn:false }))
}
