import "./SignUpPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import {auth, signUpChecker, paths} from "../backend.js"
import {createUserWithEmailAndPassword} from "firebase/auth";
import Status from "../status/Status.jsx";
import StatusController from "../StatusController.js";

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

    async function signUp() {
        if (!validateInput()) {
            return;
        }

        emailStatusController.displayProgress();
        passwordStatusController.displayProgress();

        // Send sign-up data to the server
        await createUserWithEmailAndPassword(auth, emailInput.current.value, passwordInput.current.value)
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
                    emailStatusController.displayResult(false, error.message);
                } else {
                    passwordStatusController.displayResult(false, error.message);
                }
            });
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
