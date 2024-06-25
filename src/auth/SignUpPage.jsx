import "./SignUpPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import {auth, signUpChecker, paths} from "../backend.js"
import {createUserWithEmailAndPassword} from "firebase/auth";
import Status from "../status/Status.jsx";

function SignUpPage() {
    const navigate = useNavigate();
    const emailInput = useRef(null);
    const passwordInput = useRef(null);
    const [getEmailStatusDisplay, setEmailStatusDisplay] = useState("none");
    const [getEmailStatusIcon, setEmailStatusIcon] = useState("");
    const [getEmailStatusMessage, setEmailStatusMessage] = useState("");
    const [getEmailStatusIconClass, setEmailStatusIconClass] = useState("");
    const [getEmailStatusMessageClass, setEmailStatusMessageClass] = useState("");
    const [getPasswordStatusDisplay, setPasswordStatusDisplay] = useState("none");
    const [getPasswordStatusIcon, setPasswordStatusIcon] = useState("");
    const [getPasswordStatusMessage, setPasswordStatusMessage] = useState("");
    const [getPasswordStatusIconClass, setPasswordStatusIconClass] = useState("");
    const [getPasswordStatusMessageClass, setPasswordStatusMessageClass] = useState("");

    function validateEmail() {
        const status = signUpChecker.checkEmail(emailInput.current);
        return displayEmailResult(status.success, status.message);
    }

    function validatePassword() {
        const status = signUpChecker.checkPassword(passwordInput.current);
        return displayPasswordResult(status.success, status.message);
    }

    function validateInput() {
        let success = validateEmail();

        if (!success) {
            return success;
        }

        return validatePassword();
    }

    async function signUp() {
        if (!validateInput()) {
            return;
        }

        displayEmailProgress();
        displayPasswordProgress();

        // Send sign-up data to the server
        await createUserWithEmailAndPassword(auth, emailInput.current.value, passwordInput.current.value)
            .then(() => {
                hideEmailStatus();
                hidePasswordStatus();

                // Check if there is a target page after signing up
                if ("target" in location.state) {
                    navigate(location.state.target);
                } else {
                    navigate("/");
                }
            })
            .catch((error) => {
                if (error.message.toLowerCase().indexOf("email") >= 0) {
                    displayEmailResult(false, error.message);
                } else {
                    displayPasswordResult(false, error.message);
                }
            });
    }

    function displayEmailStatus(statusIconClass, statusMessageClass, statusIcon, statusMessage) {
        setEmailStatusMessage(statusMessage);
        setEmailStatusDisplay("inline-flex");
        setEmailStatusIcon(statusIcon);
        setEmailStatusIconClass(statusIconClass);
        setEmailStatusMessageClass(statusMessageClass);
    }

    function hideEmailStatus() {
        setEmailStatusDisplay("none");
        displayEmailStatus("", "", "", "");
    }

    function displayEmailProgress() {
        displayEmailStatus("pending-icon", "pending-message", "progress_activity", "Processing...");
    }

    function displayEmailFailure(message) {
        displayEmailStatus("error-icon", "error-message", "error", message);
    }

    function displayEmailSuccess(message) {
        displayEmailStatus("valid-icon", "valid-message", "check_circle", message);
    }

    function displayEmailResult(success, message) {
        if (success) {
            displayEmailSuccess(message);
        } else {
            displayEmailFailure(message);
        }

        return success;
    }

    function displayPasswordStatus(statusIconClass, statusMessageClass, statusIcon, statusMessage) {
        setPasswordStatusMessage(statusMessage);
        setPasswordStatusDisplay("inline-flex");
        setPasswordStatusIcon(statusIcon);
        setPasswordStatusIconClass(statusIconClass);
        setPasswordStatusMessageClass(statusMessageClass);
    }

    function hidePasswordStatus() {
        setPasswordStatusDisplay("none");
        displayPasswordStatus("", "", "", "");
    }

    function displayPasswordProgress() {
        displayPasswordStatus("pending-icon", "pending-message", "progress_activity", "Processing...");
    }

    function displayPasswordFailure(message) {
        displayPasswordStatus("error-icon", "error-message", "error", message);
    }

    function displayPasswordSuccess(message) {
        displayPasswordStatus("valid-icon", "valid-message", "check_circle", message);
    }

    function displayPasswordResult(success, message) {
        if (success) {
            displayPasswordSuccess(message);
        } else {
            displayPasswordFailure(message);
        }

        return success;
    }

    return (
        <div className="sign-up-page">
            <NavBar/>
            <div className="sign-up-form">
                <div className="form-title">Sign Up</div>
                <div className="input-container">
                    <input type="email" placeholder="Email" className="auth-input email-input" required
                           ref={emailInput}
                           onChange={
                               (e) => validateEmail(e.target)
                           }/>
                    <Status display={getEmailStatusDisplay}
                            iconClass={getEmailStatusIconClass}
                            messageClass={getEmailStatusMessageClass}
                            icon={getEmailStatusIcon}
                            message={getEmailStatusMessage}/>
                </div>
                <div className="input-container">
                    <input type="password" placeholder="Password" className="auth-input password-input"
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
                <div className="action-container">
                    <button className="action-button sign-up-button"
                            onClick={() => {
                                signUp();
                            }}>
                        Sign up
                    </button>
                    <button className="action-button sign-in-button"
                            onClick={() => {
                                navigate(paths.signIn);
                            }}>
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
