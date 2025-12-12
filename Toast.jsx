export default function Toast({ type, title, message, onClose }){
  if(!title && !message) return null
  return (
    <div className={'toast ' + (type||'')}>
      <div className="toastDot" />
      <div className="toastBody">
        <div className="toastTitle">{title}</div>
        <div className="toastMsg">{message}</div>
      </div>
      <button className="toastClose" onClick={onClose}>✕</button>
    </div>
  )
}
