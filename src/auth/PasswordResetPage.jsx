import "./AuthCommon.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useRef, useState} from "react";
import {auth, paths, signUpChecker} from "../backend.js";
import {onAuthStateChanged, confirmPasswordReset, signOut} from "firebase/auth";
import Status from "../status/Status.jsx";
import AuthButton from "./AuthButton.jsx";
import StatusController from "../ui_elements/StatusController.js";
import {useNavigate, useSearchParams} from "react-router-dom";

function PasswordResetPage() {
    const navigate = useNavigate();
    const [getSearchParams, setSearchParams] = useSearchParams();
    const [getCode, setCode] = useState(null);
    const passwordInput = useRef(null);
    const [getUser, setUser] = useState(null);
    const [getPasswordStatusDisplay, setPasswordStatusDisplay] = useState("none");
    const [getPasswordStatusIcon, setPasswordStatusIcon] = useState("");
    const [getPasswordStatusMessage, setPasswordStatusMessage] = useState("");
    const [getPasswordStatusIconClass, setPasswordStatusIconClass] = useState("");
    const [getPasswordStatusMessageClass, setPasswordStatusMessageClass] = useState("");
    const passwordStatusController = new StatusController(
        setPasswordStatusDisplay, setPasswordStatusIconClass, setPasswordStatusMessageClass, setPasswordStatusIcon, setPasswordStatusMessage
    );

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (!user) {
                navigate(paths.signIn);
            }

            const mode = getSearchParams.get("mode");
            const code = getSearchParams.get("oobCode");

            // Check for action and code
            if (!mode || !code) {
                navigate(paths.error);
            }

            setUser(user);
            setCode(code);
        });

        return () => {
            unsubUser();
        };
    }, []);

    function validatePassword() {
        const status = signUpChecker.checkPassword(passwordInput.current);
        return passwordStatusController.displayResult(status.success, status.message);
    }

    function resetPassword() {
        if (!getUser) {
            navigate(paths.signIn);
        }

        if (!validatePassword()) {
            return;
        }

        passwordStatusController.displayProgress();

        // Reset password
        confirmPasswordReset(auth, getCode, passwordInput.current.value).then(() => {
            passwordStatusController.hideStatus();

            // Sign out and go back to sign in page
            signOut(auth).then(() => {
                navigate(paths.signIn);
            }).catch(() => {
                navigate(paths.error);
            });
        }).catch((error) => {
            passwordStatusController.displayFailure(error.message);
        });
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
                    <AuthButton icon="key" text="Reset password" className="auth-primary-button" click={() => {
                        resetPassword();
                    }}/>
                </div>
            </div>
        </div>
    );
}

export default PasswordResetPage;