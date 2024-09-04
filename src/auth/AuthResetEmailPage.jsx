import {useEffect, useRef, useState} from "react";
import StatusController from "../ui_elements/StatusController.js";
import {onAuthStateChanged, sendPasswordResetEmail} from "firebase/auth";
import {auth, paths, statusMessages} from "../backend.js";
import NavBar from "../navbar/NavBar.jsx";
import Status from "../status/Status.jsx";
import AuthButton from "./AuthButton.jsx";
import {useLocation, useNavigate} from "react-router-dom";

function AuthResetEmailPage() {
    const location = useLocation();
    const navigate = useNavigate();
    const emailInput = useRef(null);
    const [getUser, setUser] = useState(null);
    const [getEmailStatusDisplay, setEmailStatusDisplay] = useState("none");
    const [getEmailStatusIcon, setEmailStatusIcon] = useState("");
    const [getEmailStatusMessage, setEmailStatusMessage] = useState("");
    const [getEmailStatusIconClass, setEmailStatusIconClass] = useState("");
    const [getEmailStatusMessageClass, setEmailStatusMessageClass] = useState("");
    const emailStatusController = new StatusController(
        setEmailStatusDisplay, setEmailStatusIconClass, setEmailStatusMessageClass, setEmailStatusIcon, setEmailStatusMessage
    );

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    function sendAuthResetEmail() {
        if (!getUser) {
            navigate(paths.signIn);
        }

        emailStatusController.displayProgress();

        // Send reset email
        if (location.state === "resetPassword") {
            sendPasswordResetEmail(auth, emailInput.current.value).then(() => {
                emailStatusController.displaySuccess(statusMessages.emailSent);
            }).catch((error) => {
                emailStatusController.displayFailure(error.message);
            });
        }
    }

    return (
        <div className="auth-reset-email-page">
            <NavBar/>
            <div className="auth-form">
                <div className="auth-title">Email Confirmation</div>
                <div className="auth-input-container">
                    <input type="email" placeholder="Email" className="text-input" required ref={emailInput}/>
                    <Status display={getEmailStatusDisplay}
                            iconClass={getEmailStatusIconClass}
                            messageClass={getEmailStatusMessageClass}
                            icon={getEmailStatusIcon}
                            message={getEmailStatusMessage}/>
                </div>
                <div className="auth-action-container">
                    <AuthButton icon="mail" text="Send reset email" className="auth-primary-button" click={() => {
                        sendAuthResetEmail();
                    }}/>
                </div>
            </div>
        </div>
    );
}

export default AuthResetEmailPage;