function Status({icon, message}) {
    return (
        <div className='status-container'>
            <span className="material-symbols-outlined status-icon">{icon}</span>
            <span className="status-message">{message}</span>
        </div>
    )
}

export default Status;