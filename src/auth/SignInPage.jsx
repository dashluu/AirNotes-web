import "./SignInPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useRef, useState} from "react";
import {auth, paths} from "../backend.js"
import {signInWithEmailAndPassword} from "firebase/auth";
import Status from "../status/Status.jsx";
import StatusController from "../StatusController.js";

function SignInPage() {
    const navigate = useNavigate();
    const location = useLocation();
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

    async function signIn(email, password) {
        emailStatusController.displayProgress();
        passwordStatusController.displayProgress();

        // Send sign-in data to the server
        await signInWithEmailAndPassword(auth, email, password)
            .then(() => {
                emailStatusController.hideStatus();
                passwordStatusController.hideStatus();

                // Check if there is a target page after signing up
                if (location.state && "target" in location.state) {
                    navigate(location.state.target);
                } else {
                    navigate(paths.home);
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
        <div className="sign-in-page">
            <NavBar/>
            <div className="sign-in-form">
                <div className="form-title">Sign In</div>
                <div className="input-container">
                    <input type="email" placeholder="Email" className="auth-input email-input" required
                           ref={emailInput}/>
                    <Status display={getEmailStatusDisplay}
                            iconClass={getEmailStatusIconClass}
                            messageClass={getEmailStatusMessageClass}
                            icon={getEmailStatusIcon}
                            message={getEmailStatusMessage}/>
                </div>
                <div className="input-container">
                    <input type="password" placeholder="Password" className="auth-input password-input"
                           required minLength="6" maxLength="4096" ref={passwordInput}/>
                    <Status display={getPasswordStatusDisplay}
                            iconClass={getPasswordStatusIconClass}
                            messageClass={getPasswordStatusMessageClass}
                            icon={getPasswordStatusIcon}
                            message={getPasswordStatusMessage}/>
                </div>
                <div className="action-container">
                    <button className="action-button sign-in-button"
                            onClick={() => {
                                signIn(emailInput.current.value, passwordInput.current.value);
                            }}>
                        Sign in
                    </button>
                    <button className="action-button sign-up-button"
                            onClick={() => {
                                navigate(paths.signUp);
                            }}>
                        Sign up
                    </button>
                    <button className="action-button forgot-password-button"
                            onClick={() => {
                                navigate(paths.forgotPassword);
                            }}>
                        Forgot password?
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
