import "./Settings.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useRef, useState} from "react";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth} from "../firebase.js";
import {useNavigate} from "react-router-dom";

function Settings() {
    const navigate = useNavigate();
    const pageBackground = useRef(null);
    const [getEmail, setEmail] = useState("");

    async function loadCredential() {
        await onAuthStateChanged(auth, (user) => {
            setEmail(user.email);
        });
    }

    useEffect(() => {
        if (pageBackground.current) {
            if (window.scrollY < pageBackground.current.offsetTop) {
                pageBackground.current.classList.remove("page-background-sticky");
            } else {
                pageBackground.current.classList.add("page-background-sticky");
            }
        }

        loadCredential();
    });

    async function signOutApp() {
        await signOut(auth).then(() => {
            navigate("/sign-in");
        });
    }

    return (
        <div className="settings-page">
            <NavBar/>
            <div className="page-background" ref={pageBackground}></div>
            <div className="settings-container">
                <div className="field-container">
                    <div className="field-left">
                        <div className="field-label">Email</div>
                        <div className="field-content">{getEmail}</div>
                    </div>
                    <div className="field-right">
                        <button className="settings-button field-button">Change email</button>
                    </div>
                </div>
                <div className="field-container">
                    <div className="field-left">
                        <div className="field-label">Password</div>
                        <div className="field-content">Set the password for your account</div>
                    </div>
                    <div className="field-right">
                        <button className="settings-button field-button">Change password</button>
                    </div>
                </div>
                <div className="field-container">
                    <div className="field-left"></div>
                    <div className="field-right">
                        <button className="settings-button sign-out-button"
                                onClick={() => {
                                    signOutApp();
                                }}>
                            Sign out
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

export default Settings;