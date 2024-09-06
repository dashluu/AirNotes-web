import {useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import StatusController from "../ui_elements/StatusController.js";
import {updateEmail, onAuthStateChanged, signOut} from "firebase/auth";
import {auth, paths, signUpChecker} from "../backend.js";
import NavBar from "../navbar/NavBar.jsx";
import Status from "../status/Status.jsx";
import AuthButton from "./AuthButton.jsx";

function EmailResetPage() {
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
            if (!user) {
                navigate(paths.signIn);
            }

            setUser(user);
        });

        return () => {
            unsubUser();
        };
    }, []);

    function validateEmail() {
        const status = signUpChecker.checkEmail(emailInput.current);
        return emailStatusController.displayResult(status.success, status.message);
    }

    function resetEmailOnEnter(e) {
        if (e.key === "Enter") {
            resetEmail();
        }
    }

    function resetEmail() {
        if (!getUser) {
            navigate(paths.signIn);
        }

        if (!validateEmail()) {
            return;
        }

        emailStatusController.displayProgress();

        // Reset email
        updateEmail(getUser, emailInput.current.value).then(() => {
            emailStatusController.hideStatus();

            // Sign out and go back to sign in page
            signOut(auth).then(() => {
                navigate(paths.signIn);
            }).catch(() => {
                navigate(paths.error);
            });
        }).catch((error) => {
            emailStatusController.displayFailure(error.message);
        });
    }

    return (
        <div className="email-reset-page">
            <NavBar/>
            <div className="auth-form">
                <div className="auth-title">Email Reset</div>
                <div className="auth-input-container">
                    <input type="email" placeholder="Email" className="text-input" required ref={emailInput}
                           onChange={(e) => validateEmail(e.target)}
                           onKeyDown={(e) => resetEmailOnEnter(e)}/>
                    <Status display={getEmailStatusDisplay}
                            iconClass={getEmailStatusIconClass}
                            messageClass={getEmailStatusMessageClass}
                            icon={getEmailStatusIcon}
                            message={getEmailStatusMessage}/>
                </div>
                <div className="auth-action-container">
                    <AuthButton icon="mail" text="Reset email" className="auth-primary-button"
                                click={() => resetEmail()}/>
                </div>
            </div>
        </div>
    );
}

export default EmailResetPage;