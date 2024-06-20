import {useEffect, useRef} from "react";
import {Link, useNavigate} from "react-router-dom";
import "./NavBar.scss";
import {signOut} from "firebase/auth";
import {auth, paths} from "../backend.js";

// Navigation bar component
const NavBar = () => {
    const navigate = useNavigate();
    const navbar = useRef(null);

    async function signOutApp() {
        await signOut(auth).then(() => {
            navigate(paths.signIn);
        });
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
                    <Link to="/settings" className="nav-link">
                        <div className="nav-div">
                            <span className="material-symbols-outlined">settings</span>
                        </div>
                    </Link>
                    <div className="nav-link"
                         onClick={() => {
                             signOutApp();
                         }}>
                        <div className="nav-div">
                            <span className="material-symbols-outlined">logout</span>
                        </div>
                    </div>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
