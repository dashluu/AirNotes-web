import "./Status.scss";

function Status({display, iconClass, messageClass, icon, message}) {
    return (
        <div className="status-container" style={{display: display}}>
            <span className={`material-symbols-outlined ${iconClass}`}>{icon}</span>
            <span className={`${messageClass}`}>{message}</span>
        </div>
    );
}

export default Status;