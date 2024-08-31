import "./AuthCommon.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useRef, useState} from "react";
import {signUpChecker} from "../backend.js";
import Status from "../status/Status.jsx";

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

    function resetPassword() {

    }

    return (
        <div className="password-reset-page">
            <NavBar/>
            <div className="auth-form">
                <div className="auth-title">Password Reset</div>
                <div className="auth-input-container">
                    <input type="password" placeholder="Password" className="text-input"
                           required
                           minLength="6" maxLength="4096" ref={passwordInput}
                           onChange={
                               (e) => validatePassword(e.target)
                           }/>
                    <Status display={getPasswordStatusDisplay}
                            iconClass={getPasswordStatusIconClass}
                            messageClass={getPasswordStatusMessageClass}
                            icon={getPasswordStatusIcon}
                            message={getPasswordStatusMessage}/>
                </div>
                <div className="auth-action-container">
                    <button className="auth-action-button auth-primary-button"
                            onClick={() => {
                            }}>
                        Reset password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default PasswordResetPage;