import "./SignInPage.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useLocation, useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import {auth} from "../firebase.js"
import {signInWithEmailAndPassword} from "firebase/auth";

const validIconClass = "valid-icon";
const validMessageClass = "valid-message";
const errorIconClass = "error-icon";
const errorMessageClass = "error-message";

function showMessage(result, validityContainer, validityIcon, validityMessage) {
    validityMessage.innerHTML = `${result[1]}`;
    validityContainer.style.display = "inline-flex";

    if (!result[0]) {
        validityIcon.innerHTML = "error";
        validityIcon.classList.add(errorIconClass);
        validityIcon.classList.remove(validIconClass);
        validityMessage.classList.add(errorMessageClass);
        validityMessage.classList.remove(validMessageClass);
    } else {
        validityIcon.innerHTML = "check_circle";
        validityIcon.classList.add(validIconClass);
        validityIcon.classList.remove(errorIconClass);
        validityMessage.classList.add(validMessageClass);
        validityMessage.classList.remove(errorMessageClass);
    }

    return result[0];
}

async function signInPage(navigate, location,
                          emailInput, passwordInput,
                          emailValidityContainer, passwordValidityContainer,
                          emailValidityIcon, passwordValidityIcon,
                          emailValidityMessage, passwordValidityMessage) {
    // Send sign-in data to the server
    signInWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then(() => {
            // Check if there is a target page after signing up
            if ("target" in location.state) {
                navigate(location.state.target);
            } else {
                navigate("/");
            }
        })
        .catch((error) => {
            const errorMessage = error.message;
            const result = [false, errorMessage];

            if (errorMessage.toLowerCase().indexOf("email") >= 0) {
                showMessage(result, emailValidityContainer, emailValidityIcon, emailValidityMessage);
            } else {
                showMessage(result, passwordValidityContainer, passwordValidityIcon, passwordValidityMessage);
            }
        });
}

function SignInPage() {
    const navigate = useNavigate();
    const location = useLocation();
    const pageBackground = useRef(null);
    const emailInput = useRef(null);
    const emailValidityContainer = useRef(null);
    const emailValidityMessage = useRef(null);
    const emailValidityIcon = useRef(null);
    const passwordInput = useRef(null);
    const passwordValidityContainer = useRef(null);
    const passwordValidityMessage = useRef(null);
    const passwordValidityIcon = useRef(null);

    useEffect(() => {
        if (pageBackground.current) {
            if (window.scrollY < pageBackground.current.offsetTop) {
                pageBackground.current.classList.remove("page-background-sticky");
            } else {
                pageBackground.current.classList.add("page-background-sticky");
            }
        }
    });

    return (
        <div className="sign-in-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <div className="sign-in-form">
                <div className="form-title">Sign In</div>
                <div className="input-container">
                    <input type="email" placeholder="Email" className="auth-input email-input" required
                           ref={emailInput}/>
                    <div className="validity-container" ref={emailValidityContainer}>
                        <span ref={emailValidityIcon} className={`material-symbols-outlined ${errorIconClass}`}></span>
                        <span ref={emailValidityMessage} className={`${errorMessageClass}`}></span>
                    </div>
                </div>
                <div className="input-container">
                    <input type="password" placeholder="Password" className="auth-input password-input"
                           required
                           minLength="6" maxLength="4096" ref={passwordInput}/>
                    <div className="validity-container" ref={passwordValidityContainer}>
                        <span ref={passwordValidityIcon}
                              className={`material-symbols-outlined ${errorIconClass}`}></span>
                        <span ref={passwordValidityMessage} className={`${errorMessageClass}`}></span>
                    </div>
                </div>
                <div className="action-container">
                    <button className="action-button sign-in-button"
                            onClick={() =>
                                signInPage(navigate, location,
                                    emailInput.current, passwordInput.current,
                                    emailValidityContainer.current, passwordValidityContainer.current,
                                    emailValidityIcon.current, passwordValidityIcon.current,
                                    emailValidityMessage.current, passwordValidityMessage.current)
                            }>
                        Sign in
                    </button>
                    <button className="action-button sign-up-button"
                            onClick={() =>
                                navigate("/sign-up")
                            }>
                        Sign up
                    </button>
                </div>
            </div>
        </div>
    );
}

export default SignInPage;
