import NavBar from "../navbar/NavBar.jsx";
import {useRef, useState} from "react";
import {signUpChecker} from "../backend.js";

function PasswordResetPage() {
    const passwordInput = useRef(null);
    const [getPasswordStatusDisplay, setPasswordStatusDisplay] = useState("none");
    const [getPasswordStatusIcon, setPasswordStatusIcon] = useState("");
    const [getPasswordStatusMessage, setPasswordStatusMessage] = useState("");
    const [getPasswordStatusIconClass, setPasswordStatusIconClass] = useState("");
    const [getPasswordStatusMessageClass, setPasswordStatusMessageClass] = useState("");

    function validatePassword() {
        const status = signUpChecker.checkPassword(passwordInput.current);
        return showPasswordMessage(status);
    }

    function showPasswordMessage(status) {
        setPasswordStatusMessage(status.message);
        setPasswordStatusDisplay("inline-flex");

        if (!status.success) {
            setPasswordStatusIcon("error");
            setPasswordStatusIconClass("error-icon");
            setPasswordStatusMessageClass("error-message");
        } else {
            setPasswordStatusIcon("check_circle");
            setPasswordStatusIconClass("valid-icon");
            setPasswordStatusMessageClass("valid-message");
        }

        return status.success;
    }

    return (
        <div className="password-reset-page">
            <NavBar/>
            <div className="password-reset-form">
                <div className="form-title">Sign Up</div>
                <div className="input-container">
                    <input type="password" placeholder="Password" className="auth-input password-input"
                           required
                           minLength="6" maxLength="4096" ref={passwordInput}
                           onChange={
                               (e) => validatePassword(e.target)
                           }/>
                    <div className="status-container" style={{display: `${getPasswordStatusDisplay}`}}>
                        <span className={`material-symbols-outlined ${getPasswordStatusIconClass}`}>
                            {getPasswordStatusIcon}
                        </span>
                        <span className={`${getPasswordStatusMessageClass}`}>
                            {getPasswordStatusMessage}
                        </span>
                    </div>
                </div>
                <div className="action-container">
                    <button className="action-button password-reset-button"
                            onClick={() => {
                            }}>
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PasswordResetPage;