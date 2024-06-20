import "./SignUpPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import {auth} from "../firebase.js"
import {createUserWithEmailAndPassword} from "firebase/auth";
import SignUpChecker from "./SignUpChecker.ts";

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
    const signUpChecker = new SignUpChecker();

    function validateEmail() {
        const status = signUpChecker.checkEmail(emailInput.current);
        return showEmailMessage(status);
    }

    function validatePassword() {
        const status = signUpChecker.checkPassword(passwordInput.current);
        return showPasswordMessage(status);
    }

    function validateInput() {
        let success = validateEmail();

        if (!success) {
            return success;
        }

        return validatePassword();
    }

    async function signUpPage() {
        if (!validateInput()) {
            return;
        }

        // Send sign-up data to the server
        await createUserWithEmailAndPassword(auth, emailInput.current.value, passwordInput.current.value)
            .then(() => {
                // Check if there is a target page after signing up
                if ("target" in location.state) {
                    navigate(location.state.target);
                } else {
                    navigate("/");
                }
            })
            .catch((error) => {
                if (error.message.toLowerCase().indexOf("email") >= 0) {
                    showEmailMessage(false, error.message);
                } else {
                    showPasswordMessage(false, error.message);
                }
            });
    }

    function showEmailMessage(status) {
        setEmailStatusMessage(status.message);
        setEmailStatusDisplay("inline-flex");

        if (!status.success) {
            setEmailStatusIcon("error");
            setEmailStatusIconClass("error-icon");
            setEmailStatusMessageClass("error-message");
        } else {
            setEmailStatusIcon("check_circle");
            setEmailStatusIconClass("valid-icon");
            setEmailStatusMessageClass("valid-message");
        }

        return status.success;
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
                    <div className="status-container" style={{display: `${getEmailStatusDisplay}`}}>
                        <span className={`material-symbols-outlined ${getEmailStatusIconClass}`}>
                            {getEmailStatusIcon}
                        </span>
                        <span className={`${getEmailStatusMessageClass}`}>
                            {getEmailStatusMessage}
                        </span>
                    </div>
                </div>
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
                    <button className="action-button sign-up-button"
                            onClick={() => {
                                signUpPage();
                            }}>
                        Sign up
                    </button>
                    <button className="action-button sign-in-button"
                            onClick={() => navigate("/sign-in")}>
                        Sign in
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
