import {useEffect, useRef} from "react";
import {Link} from "react-router-dom";
import "./NavBar.scss";

// Navigation bar component
const NavBar = () => {
    const navbar = useRef(null);

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
                    <Link to="/new" className="nav-link">
                        <div className="nav-div">
                            <span className="material-symbols-outlined">edit_square</span>
                        </div>
                    </Link>
                    <Link to="/settings" className="nav-link">
                        <div className="nav-div">
                            <span className="material-symbols-outlined">settings</span>
                        </div>
                    </Link>
                </li>
            </ul>
        </nav>
    );
}

export default NavBar;
