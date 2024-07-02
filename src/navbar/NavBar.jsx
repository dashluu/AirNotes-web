import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./NavBar.scss";
import {signOut} from "firebase/auth";
import {auth, paths} from "../backend.js";

// Navigation bar component
const NavBar = () => {
    const navigate = useNavigate();
    const navbar = useRef(null);
    const [getTheme, setTheme] = useState("light_mode");

    async function signOutApp() {
        try {
            await signOut(auth);
            navigate(paths.signIn);
        } catch (error) {
            navigate(paths.error);
        }
    }

    useEffect(() => {
        if (navbar.current) {
            if (window.scrollY < navbar.current.offsetTop) {
                navbar.current.classList.remove("navbar-sticky");
            } else {
                navbar.current.classList.add("navbar-sticky");
            }
        }
    });

    return (
        <nav className="navbar" ref={navbar}>
            <ul>
                <li>
                    <Link to="/" className="title-nav-link">AirNotes</Link>
                </li>
                <li>
                    <div className="nav-link"
                         onClick={() => {
                             if (getTheme === "light_mode") {
                                 document.documentElement.className = "dark-theme";
                                 setTheme("dark_mode");
                             } else {
                                 document.documentElement.className = "light-theme";
                                 setTheme("light_mode");
                             }
                         }}>
                        <div className="nav-div" title="Change Theme">
                            <span className="material-symbols-outlined">{getTheme}</span>
                        </div>
                    </div>
                    <Link to="/settings" className="nav-link">
                        <div className="nav-div" title="Settings">
                            <span className="material-symbols-outlined">settings</span>
                        </div>
                    </Link>
                    <div className="nav-link"
                         onClick={() => {
                             signOutApp();
                         }}>
                        <div className="nav-div" title="Sign Out">
                            <span className="material-symbols-outlined">logout</span>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
