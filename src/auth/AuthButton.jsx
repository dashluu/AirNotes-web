import "./AuthButton.scss";

function AuthButton({icon, text, className, click}) {
    return (
        <button className={`auth-action-button ${className}`}
                onClick={click}>
            <span className="material-symbols-outlined">{icon}</span>
            <span>{text}</span>
        </button>
    )
}

export default AuthButton;