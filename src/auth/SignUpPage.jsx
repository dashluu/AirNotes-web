import "./AuthCommon.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import {auth, signUpChecker, paths} from "../backend.js"
import {createUserWithEmailAndPassword} from "firebase/auth";
import Status from "../status/Status.jsx";
import StatusController from "../ui_elements/StatusController.js";
import AuthButton from "./AuthButton.jsx";

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
    const emailStatusController = new StatusController(
        setEmailStatusDisplay, setEmailStatusIconClass, setEmailStatusMessageClass, setEmailStatusIcon, setEmailStatusMessage
    );
    const passwordStatusController = new StatusController(
        setPasswordStatusDisplay, setPasswordStatusIconClass, setPasswordStatusMessageClass, setPasswordStatusIcon, setPasswordStatusMessage
    );

    function validateEmail() {
        const status = signUpChecker.checkEmail(emailInput.current);
        return emailStatusController.displayResult(status.success, status.message);
    }

    function validatePassword() {
        const status = signUpChecker.checkPassword(passwordInput.current);
        return passwordStatusController.displayResult(status.success, status.message);
    }

    function validateInput() {
        let success = validateEmail();

        if (!success) {
            return success;
        }

        return validatePassword();
    }

    function signUpOnEnter(e) {
        if (e.key === "Enter") {
            signUp();
        }
    }

    function signUp() {
        if (!validateInput()) {
            return;
        }

        emailStatusController.displayProgress();
        passwordStatusController.displayProgress();

        // Send sign-up data to the server
        createUserWithEmailAndPassword(auth, emailInput.current.value, passwordInput.current.value)
            .then(() => {
                emailStatusController.hideStatus();
                passwordStatusController.hideStatus();

                // Check if there is a target page after signing up
                if ("target" in location.state) {
                    navigate(location.state.target);
                } else {
                    navigate("/");
                }
            })
            .catch((error) => {
                if (error.message.toLowerCase().indexOf("email") >= 0) {
                    emailStatusController.displayFailure(error.message);
                    passwordStatusController.displayFailure("Email error");
                } else if (error.message.toLowerCase().indexOf("password") >= 0) {
                    emailStatusController.displayFailure("Password error");
                    passwordStatusController.displayFailure(error.message);
                } else {
                    emailStatusController.displayFailure(error.message);
                    passwordStatusController.displayFailure(error.message);
                }
            });
    }

    return (
        <div className="sign-up-page">
            <NavBar/>
            <div className="auth-form">
                <div className="auth-title">Sign Up</div>
                <div className="auth-input-container">
                    <input type="email" placeholder="Email" className="text-input" required ref={emailInput}
                           onChange={(e) => validateEmail(e.target)}
                           onKeyDown={(e) => signUpOnEnter(e)}/>
                    <Status display={getEmailStatusDisplay}
                            iconClass={getEmailStatusIconClass}
                            messageClass={getEmailStatusMessageClass}
                            icon={getEmailStatusIcon}
                            message={getEmailStatusMessage}/>
                </div>
                <div className="auth-input-container">
                    <input type="password" placeholder="Password" className="text-input" required
                           minLength="6" maxLength="4096" ref={passwordInput}
                           onChange={(e) => validatePassword(e.target)}
                           onKeyDown={(e) => signUpOnEnter(e)}/>
                    <Status display={getPasswordStatusDisplay}
                            iconClass={getPasswordStatusIconClass}
                            messageClass={getPasswordStatusMessageClass}
                            icon={getPasswordStatusIcon}
                            message={getPasswordStatusMessage}/>
                </div>
                <div className="auth-action-container">
                    <AuthButton icon="person_add" text="Sign up" className="auth-primary-button"
                                click={() => signUp()}/>
                    <AuthButton icon="login" text="Sign in" className="auth-secondary-button"
                                click={() => navigate(paths.signIn)}/>
                </div>
            </div>
        </div>
    );
}

export default SignUpPage;
