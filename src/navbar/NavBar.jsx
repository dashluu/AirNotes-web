import {useEffect, useRef, useState} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./NavBar.scss";
import {onAuthStateChanged, signOut} from "firebase/auth";
import {auth, paths} from "../backend.js";
import NavButton from "./NavButton.jsx";

// Navigation bar component
const NavBar = () => {
    const navigate = useNavigate();
    const navbar = useRef(null);
    const [getUsername, setUsername] = useState("");
    const [getUsernameDisplay, setUsernameDisplay] = useState("none");
    const [getTheme, setTheme] = useState("Light");
    const [getThemeIcon, setThemeIcon] = useState("light_mode");
    const [getLogoutDisplay, setLogoutDisplay] = useState("none");

    useEffect(() => {
        if (navbar.current) {
            if (window.scrollY < navbar.current.offsetTop) {
                navbar.current.classList.remove("navbar-sticky");
            } else {
                navbar.current.classList.add("navbar-sticky");
            }
        }
    });

    useEffect(() => {
        const unsubUser = onAuthStateChanged(auth, (user) => {
            if (user) {
                const domain = user.email.split("@")[0];
                setUsername(domain);
                setUsernameDisplay("flex");
                setLogoutDisplay("flex");
            }
        });

        return () => {
            unsubUser();
        };
    }, []);

    function changeTheme() {
        if (getTheme === "Light") {
            setThemeIcon("dark_mode");
            setTheme("Dark");
        } else {
            setThemeIcon("light_mode");
            setTheme("Light");
        }
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
        <nav className="navbar" ref={navbar}>
            <div className="nav-title-container">
                <Link to="/" className="title-nav-link">AirNotes</Link>
            </div>
            <div className="nav-button-container">
                <NavButton icon={getThemeIcon} text={getTheme} click={() => changeTheme()}/>
                <NavButton icon="account_circle" style={{display: getUsernameDisplay}} text={getUsername}
                           click={() => navigate(paths.settings)}/>
                <NavButton icon="logout" text="Log out" style={{display: getLogoutDisplay}}
                           click={() => {
                               signOutApp();
                           }}/>
            </div>
        </nav>
    );
}

export default NavBar;
