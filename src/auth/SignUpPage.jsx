import './SignUpPage.scss'
import NavBar from "../navbar/NavBar.jsx";
import {useNavigate} from "react-router-dom";
import {useEffect, useRef} from "react";
import {auth} from "../firebase.js"
import {createUserWithEmailAndPassword} from "firebase/auth";
import SignUpChecker from "./SignUpChecker.ts";

const signUpChecker = new SignUpChecker();
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

function validateEmail(emailInput, emailValidityContainer, emailValidityIcon, emailValidityMessage) {
    const result = signUpChecker.checkEmail(emailInput);
    return showMessage(result, emailValidityContainer, emailValidityIcon, emailValidityMessage);
}

function validatePassword(passwordInput, passwordValidityContainer, passwordValidityIcon, passwordValidityMessage) {
    const result = signUpChecker.checkPassword(passwordInput);
    return showMessage(result, passwordValidityContainer, passwordValidityIcon, passwordValidityMessage);
}

function validateInput(emailInput, passwordInput,
                       emailValidityContainer, passwordValidityContainer,
                       emailValidityIcon, passwordValidityIcon,
                       emailValidityMessage, passwordValidityMessage) {
    let result;

    if ((result = validateEmail(emailInput, emailValidityContainer, emailValidityIcon, emailValidityMessage))) {
        return result;
    }

    return validatePassword(passwordInput, passwordValidityContainer, passwordValidityIcon, passwordValidityMessage);
}

async function signUpPage(e, navigate, emailInput, passwordInput,
                          emailValidityContainer, passwordValidityContainer,
                          emailValidityIcon, passwordValidityIcon,
                          emailValidityMessage, passwordValidityMessage) {
    e.preventDefault();

    if (!validateInput(emailInput, passwordInput,
        emailValidityContainer, passwordValidityContainer,
        emailValidityIcon, passwordValidityIcon,
        emailValidityMessage, passwordValidityMessage)) {
        return;
    }

    // Send sign-up data to the server
    createUserWithEmailAndPassword(auth, emailInput.value, passwordInput.value)
        .then(() => {
            navigate("/");
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

function navigateToSignIn(e, navigate) {
    e.preventDefault();
    navigate("/sign-in");
}

function SignUpPage() {
    const pageBackground = useRef(null);
    const emailInput = useRef(null);
    const emailValidityContainer = useRef(null);
    const emailValidityMessage = useRef(null);
    const emailValidityIcon = useRef(null);
    const passwordInput = useRef(null);
    const passwordValidityContainer = useRef(null);
    const passwordValidityMessage = useRef(null);
    const passwordValidityIcon = useRef(null);
    const navigate = useNavigate();

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
        <div className="sign-up-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <form className="sign-up-form">
                <div className="form-title">Sign Up</div>
                <div className="input-container">
                    <input type="email" placeholder="Email" className="auth-input email-input" required
                           ref={emailInput}
                           onChange={
                               (e) => validateEmail(
                                   e.target, emailValidityContainer.current,
                                   emailValidityIcon.current, emailValidityMessage.current)
                           }/>
                    <div className="validity-container" ref={emailValidityContainer}>
                        <span ref={emailValidityIcon} className={`material-symbols-outlined ${errorIconClass}`}></span>
                        <span ref={emailValidityMessage} className={`${errorMessageClass}`}></span>
                    </div>
                </div>
                <div className="input-container">
                    <input type="password" placeholder="Password" className="auth-input password-input"
                           required
                           minLength="6" maxLength="4096" ref={passwordInput}
                           onChange={
                               (e) => validatePassword(
                                   e.target, passwordValidityContainer.current,
                                   passwordValidityIcon.current, passwordValidityMessage.current)
                           }/>
                    <div className="validity-container" ref={passwordValidityContainer}>
                        <span ref={passwordValidityIcon}
                              className={`material-symbols-outlined ${errorIconClass}`}></span>
                        <span ref={passwordValidityMessage} className={`${errorMessageClass}`}></span>
                    </div>
                </div>
                <div className="action-container">
                    <button className="action-button sign-up-button"
                            onClick={(e) => {
                                signUpPage(e, navigate, emailInput.current, passwordInput.current,
                                    emailValidityContainer.current, passwordValidityContainer.current,
                                    emailValidityIcon.current, passwordValidityIcon.current,
                                    emailValidityMessage.current, passwordValidityMessage.current);
                            }}>
                        Sign up
                    </button>
                    <button className="action-button sign-in-button"
                            onClick={(e) => {
                                navigateToSignIn(e, navigate);
                            }}>
                        Log in
                    </button>
                </div>
            </form>
        </div>
    )
}

export default SignUpPage
