import "./Settings.scss";
import NavBar from "../navbar/NavBar.jsx";
import {useEffect, useState} from "react";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, paths} from "../backend.js";
import {useNavigate} from "react-router-dom";

function Settings() {
    const navigate = useNavigate();
    const [getUser, setUser] = useState(null);

    // Fetch data once
    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                setUser(user);
            } else {
                navigate(paths.signIn);
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    function resetPassword() {
        navigate("/auth-reset-email", {state: "resetPassword"});
    }

    async function signOutApp() {
        try {
            await signOut(auth);
            navigate(paths.signIn);
        } catch (error) {
            navigate(paths.error);
        }
    }

    return (
        <div className="settings-page">
            <NavBar/>
            <div className="settings-container">
                <div className="settings-title">Settings</div>
                <div className="field-container">
                    <div className="field-left">
                        <div className="field-label">Email</div>
                        <div className="field-content">{getUser ? getUser.email : ""}</div>
                    </div>
                    <div className="field-right">
                        <button className="settings-button field-button">Reset email</button>
                    </div>
                </div>
                <div className="field-container">
                    <div className="field-left">
                        <div className="field-label">Password</div>
                        <div className="field-content">Set the password for your account</div>
                    </div>
                    <div className="field-right">
                        <button className="settings-button field-button" onClick={() => resetPassword()}>
                            Reset password
                        </button>
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