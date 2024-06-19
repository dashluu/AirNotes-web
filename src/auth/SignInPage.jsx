import "./SignInPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef, useState} from "react";
import {auth} from "../firebase.js"
import {signInWithEmailAndPassword} from "firebase/auth";

function SignInPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const pageBackground = useRef(null);
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

    useEffect(() => {
        if (pageBackground.current) {
            if (window.scrollY < pageBackground.current.offsetTop) {
                pageBackground.current.classList.remove("page-background-sticky");
            } else {
                pageBackground.current.classList.add("page-background-sticky");
            }
        }
    });

    async function signInPage(email, password) {
        // Send sign-in data to the server
        await signInWithEmailAndPassword(auth, email, password)
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

    function showEmailMessage(success, message) {
        setEmailStatusMessage(message);
        setEmailStatusDisplay("inline-flex");

        if (!success) {
            setEmailStatusIcon("error");
            setEmailStatusIconClass("error-icon");
            setEmailStatusMessageClass("error-message");
        } else {
            setEmailStatusIcon("check_circle");
            setEmailStatusIconClass("valid-icon");
            setEmailStatusMessageClass("valid-message");
        }
    }

    function showPasswordMessage(success, message) {
        setPasswordStatusMessage(message);
        setPasswordStatusDisplay("inline-flex");

        if (!success) {
            setPasswordStatusIcon("error");
            setPasswordStatusIconClass("error-icon");
            setPasswordStatusMessageClass("error-message");
        } else {
            setPasswordStatusIcon("check_circle");
            setPasswordStatusIconClass("valid-icon");
            setPasswordStatusMessageClass("valid-message");
        }
    }

    return (
        <div className="sign-in-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <div className="sign-in-form">
                <div className="form-title">Sign In</div>
                <div className="input-container">
                    <input type="email" placeholder="Email" className="auth-input email-input" required
                           ref={emailInput}/>
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
                           required minLength="6" maxLength="4096" ref={passwordInput}/>
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
                    <button className="action-button sign-in-button"
                            onClick={() => {
                                signInPage(emailInput.current.value, passwordInput.current.value);
                            }}>
                        Sign in
                    </button>
                    <button className="action-button sign-up-button"
                            onClick={() =>
                                navigate("/sign-up")
                            }>
                        Sign up
                    </button>
                    <button className="action-button forgot-password-button"
                            onClick={() =>
                                navigate("/forgot-password")
                            }>
                        Forgot password
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
